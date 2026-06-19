#!/usr/bin/env node
/*
 * Computes the next version for a PR and updates package.json, plugin.xml,
 * and CHANGELOG.md inside PR_DIR accordingly.
 *
 * This script is always executed from the default-branch clone (never from
 * PR-controlled code). It reads PR metadata via environment variables (no
 * shell interpolation) and writes outputs to the file pointed to by
 * $GITHUB_OUTPUT.
 *
 * Required env vars:
 *   PR_TITLE        PR title
 *   PR_BODY         PR body (may be empty)
 *   PR_NUMBER       PR number
 *   COMMIT_FOOTERS  Concatenated commit messages from the PR
 *   MAIN_DIR        Path to the default-branch clone (read-only baseline)
 *   PR_DIR          Path to the PR head clone (files are rewritten here)
 *
 * Optional:
 *   GITHUB_OUTPUT   Path to GH Actions step outputs file; falls back to stdout
 *
 * Outputs (written to $GITHUB_OUTPUT or stdout):
 *   bump=major|minor|patch|none
 *   version=X.Y.Z   (omitted when bump=none)
 *   changed=true|false
 */

const fs = require('node:fs');
const path = require('node:path');

const PR_TITLE = process.env.PR_TITLE || '';
const PR_BODY = process.env.PR_BODY || '';
const PR_NUMBER = process.env.PR_NUMBER || '';
const COMMIT_FOOTERS = process.env.COMMIT_FOOTERS || '';
const MAIN_DIR = process.env.MAIN_DIR;
const PR_DIR = process.env.PR_DIR;
const OUTPUT_PATH = process.env.GITHUB_OUTPUT;

if (!MAIN_DIR || !PR_DIR) {
  console.error('MAIN_DIR and PR_DIR env vars are required');
  process.exit(1);
}

function writeOutput(key, value) {
  const line = `${key}=${value}\n`;
  if (OUTPUT_PATH) {
    fs.appendFileSync(OUTPUT_PATH, line);
  } else {
    process.stdout.write(`OUTPUT ${line}`);
  }
}

const TITLE_RE = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;
const BREAKING_RE = /^BREAKING CHANGE:/m;

function parseTitle(title) {
  const m = title.match(TITLE_RE);
  if (!m) return null;
  return {
    type: m[1],
    scope: m[2] || null,
    breaking: Boolean(m[3]),
    description: m[4],
  };
}

function hasBreakingChange(parsed) {
  if (parsed.breaking) return true;
  if (BREAKING_RE.test(PR_BODY)) return true;
  if (BREAKING_RE.test(COMMIT_FOOTERS)) return true;
  return false;
}

function computeBump(parsed) {
  if (hasBreakingChange(parsed)) return 'major';
  if (parsed.type === 'feat') return 'minor';
  if (parsed.type === 'fix' || parsed.type === 'chore' || parsed.type === 'refactor') return 'patch';
  return 'none';
}

function bumpVersion(version, bump) {
  const [major, minor, patch] = version.split('.').map(Number);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`;
  return version;
}

function subsectionFor(bump, type) {
  if (bump === 'major') return '### BREAKING CHANGES';
  if (type === 'feat') return '### Features';
  if (type === 'fix') return '### Fixes';
  return '### Chores';
}

// Detects whether the CHANGELOG uses "## [X.Y.Z]" (bracketed) or "## X.Y.Z" (plain).
function detectChangelogFormat(content) {
  const m = content.match(/^##\s+(\[?\d+\.\d+\.\d+\]?)/m);
  if (m && m[1].startsWith('[')) return 'bracketed';
  return 'plain';
}

// Handles: "## X.Y.Z", "## [X.Y.Z]", and "## [X.Y.Z] - YYYY-MM-DD"
function latestChangelogVersion(content) {
  const m = content.match(/^##\s+\[?(\d+\.\d+\.\d+)\]?(?:\s+-\s+\S+)?\s*$/m);
  return m ? m[1] : null;
}

function readFileOrEmpty(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function readMainPackageVersion() {
  const p = path.join(MAIN_DIR, 'package.json');
  try {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    return json.version || null;
  } catch {
    return null;
  }
}

function buildChangelogEntry(version, bump, parsed, format) {
  const sub = subsectionFor(bump, parsed.type);
  const prRef = PR_NUMBER ? ` (#${PR_NUMBER})` : '';
  const versionTag = format === 'bracketed' ? `[${version}]` : version;
  return `## ${versionTag}\n\n${sub}\n\n- ${PR_TITLE}${prRef}\n\n`;
}

function rebuildChangelog(mainChangelog, newEntry) {
  if (!newEntry) return mainChangelog;
  const firstSection = mainChangelog.match(/^##\s+/m);
  if (firstSection) {
    const idx = mainChangelog.indexOf(firstSection[0]);
    return mainChangelog.slice(0, idx) + newEntry + mainChangelog.slice(idx);
  }
  const header = mainChangelog.trim().length > 0
    ? mainChangelog.trimEnd() + '\n\n'
    : '# Changelog\n\n';
  return header + newEntry;
}

function rewritePackageVersion(raw, version) {
  const re = /("version"\s*:\s*")(\d+\.\d+\.\d+)(")/;
  if (!re.test(raw)) {
    throw new Error('Could not locate "version" field in package.json');
  }
  return raw.replace(re, `$1${version}$3`);
}

function rewritePluginXmlVersion(raw, version) {
  // Match the version attribute on the opening <plugin> tag only.
  // [^>]*? ensures we don't cross past the closing > of that tag.
  const re = /(<plugin\b[^>]*?\bversion=")(\d+\.\d+\.\d+)(")/;
  if (!re.test(raw)) {
    throw new Error('Could not locate version attribute on <plugin> element in plugin.xml');
  }
  return raw.replace(re, `$1${version}$3`);
}

async function main() {
  const parsed = parseTitle(PR_TITLE);
  if (!parsed) {
    console.error(`PR title does not match conventional commits format: "${PR_TITLE}"`);
    process.exit(1);
  }

  const bump = computeBump(parsed);
  const mainChangelogPath = path.join(MAIN_DIR, 'CHANGELOG.md');
  const mainChangelog = readFileOrEmpty(mainChangelogPath);
  const format = detectChangelogFormat(mainChangelog);
  const lastLogged = latestChangelogVersion(mainChangelog);
  const mainPkgVersion = readMainPackageVersion();
  const baseline = lastLogged || mainPkgVersion;

  let targetVersion;
  let newChangelog;

  if (bump === 'none') {
    targetVersion = baseline;
    newChangelog = mainChangelog;
    console.log(`PR type "${parsed.type}" does not trigger a release.`);
  } else if (!lastLogged) {
    targetVersion = '1.0.0';
    newChangelog = rebuildChangelog(
      mainChangelog,
      buildChangelogEntry(targetVersion, bump, parsed, format),
    );
    console.log('First release detected — defaulting to 1.0.0.');
  } else {
    targetVersion = bumpVersion(baseline, bump);
    newChangelog = rebuildChangelog(
      mainChangelog,
      buildChangelogEntry(targetVersion, bump, parsed, format),
    );
  }

  console.log(`Baseline version: ${baseline || '<none>'}`);
  console.log(`Bump: ${bump}`);
  console.log(`Target version: ${targetVersion || '<unchanged>'}`);
  console.log(`CHANGELOG format: ${format}`);

  if (!targetVersion) {
    console.log('No baseline version available and no release triggered — nothing to do.');
    writeOutput('bump', 'none');
    writeOutput('changed', 'false');
    return;
  }

  const pkgPath = path.join(PR_DIR, 'package.json');
  const xmlPath = path.join(PR_DIR, 'plugin.xml');
  const changelogPath = path.join(PR_DIR, 'CHANGELOG.md');

  const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
  const xmlRaw = fs.readFileSync(xmlPath, 'utf8');
  const currentChangelog = readFileOrEmpty(changelogPath);

  const newPkgRaw = rewritePackageVersion(pkgRaw, targetVersion);
  const newXmlRaw = rewritePluginXmlVersion(xmlRaw, targetVersion);

  const changed =
    newPkgRaw !== pkgRaw ||
    newXmlRaw !== xmlRaw ||
    newChangelog !== currentChangelog;

  if (!changed) {
    console.log('No changes needed — files already at target state.');
    writeOutput('bump', bump);
    if (bump !== 'none') writeOutput('version', targetVersion);
    writeOutput('changed', 'false');
    return;
  }

  fs.writeFileSync(pkgPath, newPkgRaw);
  fs.writeFileSync(xmlPath, newXmlRaw);
  fs.writeFileSync(changelogPath, newChangelog);

  console.log(`Updated package.json, plugin.xml, CHANGELOG.md to ${targetVersion}`);
  writeOutput('bump', bump);
  if (bump !== 'none') writeOutput('version', targetVersion);
  writeOutput('changed', 'true');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The changes documented here do not include those from the original repository.

## [4.1.0]

## 02-05-2025

- Unified cordova plugins for Android and iOS, removing the dependencies on `cordova-plugin-fingerprint-aio` and `cordova-plugin-touchid`
- [Android] Fix `AndroidManifest.xml` changes in `plugin.xml` to be compatible with Capacitor.

## [4.0.0]

## 05-12-2024
- [Android] Breaking Change - Return error information in callback

## 04-12-2024
- [Android] Fix issue where multiple wrong biometric attempts would cause the plugin to return lockout automatically in future prompts.

## [3.1.7]

## 21-02-2024
- [Android] Fix bug on Android 9 when no biometric was configured. (https://outsystemsrd.atlassian.net/browse/RMET-3176)

## [3.1.6]

## 07-06-2023
- [Android] Removed workaround fix implemented for Android <= 9. (https://outsystemsrd.atlassian.net/browse/RMET-2636)

## [3.1.5]

## 28-06-2022
- Fixed bug for message description in iOS (https://outsystemsrd.atlassian.net/browse/RMET-1683).

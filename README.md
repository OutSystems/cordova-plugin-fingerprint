# OutSystems Finger Print cordova plugin

  Cordova Plugin to leverage the local authentication framework to allow in-app user authentication using Touch ID.


## Supported Platforms

  - iOS
  - Android

## Dependencies 

  - cordova-plugin-android-fingerprint-auth
  - cordova-plugin-touchid

## Installation
  - Run the following command:

 ```shell
      cordova plugin add https://bitbucket.org/uxmobile/fingerprint-cordova-plugin.git
  ```
#Setup for Android
  Add preference to mobile-config.js
  
```
  App.setPreference('android-targetSdkVersion', '23');
  ```

  set compile version and build tools in build.gradle
  
```
  compileSdkVersion 23
  buildToolsVersion "23.0.2"
  ```

## Usage

  You **do not** need to reference any JavaScript, the Cordova plugin architecture will add a touchid object to your root automatically when you build.

  Ensure you use the plugin after your deviceready event has been fired.

### Authenticate

  Pass the following arguments to the `authenticate()` function, to prompt the user to authenticate via TouchID:

  1. Success callback (called on successful authentication)
  2. Failure callback (called on error or if authentication fails)
  3. Object with configuration*

  ```
  touchid.authenticate(successCallback, failureCallback, object);
  ```

#### Config Object for
  | Param | Type | Default | Description |
  | --- | --- | --- | --- |
  | clientId | String | undefined | (REQUIRED) Used as the alias for your key in the Android Key Store. |
  | clientSecret | String | undefined | (REQUIRED) Used to encrypt the token returned upon successful fingerprint authentication. |
  | disableBackup | boolean | false | Set to true to remove the "USE BACKUP" button |
  | maxAttempts | number | 5 | The device max is 5 attempts.  Set this parameter if you want to allow fewer than 5 attempts.  |
  | locale | String | "en_US" | Change the language displayed on the authentication dialog.<br/><ul><li>English: "en_US"</li><li>Spanish: "es"</li><li>Russian: "ru"</li><li>French: "fr"</li><li>Chinese (Simplified): <ul><li>"zh_CN"</li><li>"zh_SG"</li></ul></li><li>Chinese (Traditional): <ul><li>"zh"</li><li>"zh_HK"</li><li>"zh_TW"</li><li>"zh_MO"</li></ul></li><li>Norwegian: "no"</li></ul> |
  | userAuthRequired | boolean | true | Require the user to authenticate with a fingerprint to authorize every use of the key.  New fingerprint enrollment will invalidate key and require backup authenticate to re-enable the fingerprint authentication dialog. |
  | dialogTitle | String | undefined | Set the title of the fingerprint authentication dialog. |
  | dialogMessage | String | undefined | (REQUIRED) Set the message of the fingerprint authentication dialog. |
  | dialogHint | String | undefined | Set the hint displayed by the fingerprint icon on the fingerprint authentication dialog. |


*NOTE: The dialogMessage you present to the user should provide a clear reason for why you are requesting they authenticate themselves, and what action you will be taking based on that authentication.

### Check support

  Although the `authenticate()` function will return an error if the user is unable to authenticate via Touch ID, you may wish to check support without prompting the user to authenticate. This can be done by passing following arguments to the `checkSupport()` function:

  1. Success callback (called if authentication is possible)
  2. Not supported callback (called if policy can not be evaluated, with error message)

  ```
  touchid.checkSupport(successCallback, notSupportedCallback);
  ```

## Platforms

  iOS 8+
  Android 23+

#### Contributors
  - Domingos Gomes, <domingos.gomes@outsystems.com>
#### Document author
  - Domingos Gomes, <domingos.gomes@outsystems.com>

### Copyright OutSystems, 2016

---

  LICENSE
  =======


  [The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
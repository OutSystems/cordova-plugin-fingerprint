/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

var FingerPrint = function () {};

// Biometric types
FingerPrint.prototype.BIOMETRIC_TYPE_FINGERPRINT = 1;
FingerPrint.prototype.BIOMETRIC_TYPE_COMMON = 2;
FingerPrint.prototype.BIOMETRIC_TYPE_NONE = 3;

// method to check is the touch id option is available in the device
FingerPrint.prototype.isAvailable = function (successCallback, errorCallback) {
  // success callback function for android 

  function isAvailableSuccess(result) {

    switch (result) {
      case "biometric":
          successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_COMMON);
          break;
      case "finger":
          successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_FINGERPRINT);
          break;
      default:
          successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_NONE);
          break;
    }
  }

  function isAvailableError(error) {
    errorCallback(-1);
  }
  // if the device is android call the Fingerprint plugin
  if(cordova.platformId === "android")Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
  // if the device is ios call the touchid plugin 
  if(cordova.platformId === "ios")touchid.checkSupport(successCallback, errorCallback);
};

// method to authenticate with touch id 
FingerPrint.prototype.authenticate = function (successCallback, errorCallback,object) {
    // success callback function for android 
    var successCbFingerPrintAuth = function(result) {successCallback(null);};
    // error callback function for android 
    var errorCbFingerPrintAuth = function(error) {
			var message = "authenticationFailed"
			errorCallback(message);
    };
    // if the device is android call the FingerprintAuth plugin
    if(cordova.platformId === "android"){Fingerprint.show(object, successCbFingerPrintAuth, errorCbFingerPrintAuth);}
    // if the device is ios call the touchid plugin 
    if(cordova.platformId === "ios")touchid.authenticate(successCallback, errorCallback, object.description);
};

FingerPrint.prototype.checkBiometry = function(successCallback, errorCallback) {
  
    function isAvailableSuccess(result) {
        switch (result) {
          case "biometric":
              successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_COMMON);
              break;
          case "finger":
              successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_FINGERPRINT);
              break;
          default:
              successCallback(FingerPrint.prototype.BIOMETRIC_TYPE_NONE);
              break;
        }
    }

    function isAvailableError(error) {
      errorCallback(-1);
    }

    // if the device is android call the Fingerprint plugin
    if(cordova.platformId === "android"){Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);}
    // if the device is ios call the touchid plugin 
    if(cordova.platformId === "ios")touchid.checkBiometry(successCallback, errorCallback);
}

module.exports = new FingerPrint();

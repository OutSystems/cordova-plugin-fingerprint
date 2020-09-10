/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

var FingerPrint = function () {};
// method to check is the touch id option is available in the device
FingerPrint.prototype.isAvailable = function (successCallback, errorCallback) {
  // success callback function for android 

  function isAvailableSuccess(result) {
    var biometricType = 3;
    if (result === "biometric") {
      biometricType = 2;
      successCallback(biometricType);
    }
    else if (result === "finger") {
      biometricType = 1;
      successCallback(biometricType);
    }
    else {
      successCallback(biometricType);
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
			errorCallback(error);
    };
    // if the device is android call the FingerprintAuth plugin
    if(cordova.platformId === "android"){Fingerprint.show(object, successCbFingerPrintAuth, errorCbFingerPrintAuth);}
    // if the device is ios call the touchid plugin 
    if(cordova.platformId === "ios")touchid.authenticate(successCallback, errorCallback, object.dialogMessage);
};

FingerPrint.prototype.checkBiometry = function(successCallback, errorCallback) {
  
    function isAvailableSuccess(result) {
      var biometricType = 3;      
      if (result === "biometric") {
        biometricType = 2;
        successCallback(biometricType);
      }
      else if (result === "finger") {
        biometricType = 1;
        successCallback(biometricType);
      }
      else {
        successCallback(biometricType);
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

/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

function getPlatformId() {
  if (typeof(Capacitor) !== "undefined") {
      return Capacitor.getPlatform();
  }
  return cordova.platformId;
}

var FingerPrint = function () {};

// Biometric types
FingerPrint.prototype.BIOMETRIC_TYPE_FINGERPRINT = 1;
FingerPrint.prototype.BIOMETRIC_TYPE_COMMON = 2;
FingerPrint.prototype.BIOMETRIC_TYPE_NONE = 3;

// method to check is the touch id option is available in the device
FingerPrint.prototype.isAvailable = function (successCallback, errorCallback, object) {
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
    errorCallback(error);
  }

  if(getPlatformId() === "android") {
    cordova.exec(isAvailableSuccess, isAvailableError, "Fingerprint", "isAvailable", [object]);
  }
  else if(getPlatformId() === "ios") {
    cordova.exec(successCallback, errorCallback, "TouchID", "checkSupport", []);
  }
};

// method to authenticate with touch id 
FingerPrint.prototype.authenticate = function (successCallback, errorCallback, object) {
    // success callback function for android 
    var successCbFingerPrintAuth = function(result) {successCallback(null);};
    // error callback function for android 
    var errorCbFingerPrintAuth = function(error) {
			var message = "authenticationFailed"
			errorCallback(message);
    };
    if(getPlatformId() === "android") {
      cordova.exec(successCbFingerPrintAuth, errorCbFingerPrintAuth, "Fingerprint", "authenticate", [object]);
    }
    else if(getPlatformId() === "ios") {
      if (!object.description) {
        object.description = "Please authenticate via TouchID to proceed";
      }
      cordova.exec(successCallback, errorCallback, "TouchID", "authenticate", [object.description]);
    }
};

FingerPrint.prototype.checkBiometry = function(successCallback, errorCallback, object) {
  
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
      errorCallback(error);
    }

    if(getPlatformId() === "android") {
      cordova.exec(isAvailableSuccess, isAvailableError, "Fingerprint", "isAvailable", [object]);
    }
    else if(getPlatformId() === "ios") {
      cordova.exec(successCallback, errorCallback, "TouchID", "checkBiometry");
    }
}

module.exports = new FingerPrint();

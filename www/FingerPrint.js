/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

var FingerPrint = function () {};
// method to check is the touch id option is available in the device
FingerPrint.prototype.isAvailable = function (successCallback, errorCallback) {
  // success callback function for android 
  var successCbFingerPrintAuth = function(result) {successCallback(null);};

  // error callback function for android 
  var errorCbFingerPrintAuth = function(error) {
    var message;
    if(!error.isAvailable){
      // if not support touch id
      if(!error.isHardwareDetected){
        message = "This device didn't support Touch ID";
      }
      // if not have any finger print enrolled in the device
      else if(!error.hasEnrolledFingerprints){
        message = "No fingers are enrolled with Touch ID";
      }
    }
    errorCallback(message);
  };
  // if the device is android call th FingerprintAuth plugin
  if(cordova.platformId === "android")FingerprintAuth.isAvailable(successCbFingerPrintAuth, errorCbFingerPrintAuth);
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
    // if the device is android call th FingerprintAuth plugin
    if(cordova.platformId === "android"){FingerprintAuth.show(object, successCbFingerPrintAuth, errorCbFingerPrintAuth);}
    // if the device is ios call the touchid plugin 
    if(cordova.platformId === "ios")touchid.authenticate(successCallback, errorCallback, object.dialogMessage);
};

module.exports = new FingerPrint();

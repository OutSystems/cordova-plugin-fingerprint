/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

var FingerPrint = function () {};

FingerPrint.prototype.isAvailable = function (successCallback, errorCallback) {
var successCbFingerPrintAuth = function(result) {

  successCallback(null);
};
var errorCbFingerPrintAuth = function(error) {
	var message;
  if(!error.isAvailable){
    if(!error.isHardwareDetected){
    message = "This device didn't support Touch ID";
    }
		else if(!error.hasEnrolledFingerprints){
    message = "No fingers are enrolled with Touch ID";
    }
  }
	errorCallback(message);
};
if(cordova.platformId === "android")FingerprintAuth.isAvailable(successCbFingerPrintAuth, errorCbFingerPrintAuth);
if(cordova.platformId === "ios")touchid.checkSupport(successCallback, errorCallback);
};

FingerPrint.prototype.authenticate = function (successCallback, errorCallback,object) {

    var successCbFingerPrintAuth = function(result) {
      successCallback(null);
    };
    var errorCbFingerPrintAuth = function(error) {
			var message = "authenticationFailed"
			errorCallback(error);
    };

      var args = JSON.parse(object);
    if(cordova.platformId === "android"){
      FingerprintAuth.show(args, successCbFingerPrintAuth, errorCbFingerPrintAuth);
    }
    if(cordova.platformId === "ios")touchid.authenticate(successCallback, errorCallback, args.dialogMessage);
};

module.exports = new FingerPrint();

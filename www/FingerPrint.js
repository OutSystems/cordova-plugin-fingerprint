/**
	OutSystems - Mobility Experts
	Domingos Gomes - 04/10/2016
*/

var FingerPrint = function () {
var platform = cordova.platformId;
}

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
if(platform === "android")FingerprintAuth.isAvailable(successCbFingerPrintAuth, errorCbFingerPrintAuth);
if(platform === "ios")touchid.checkSupport(successCallback, errorCallback);
};

FingerPrint.prototype.auth = function (successCallback, errorCallback,message,appName,clientSecret) {

    var successCbFingerPrintAuth = function(result) {
      successCallback(null);
    };
    var errorCbFingerPrintAuth = function(error) {
			var message = "authenticationFailed"
			errorCallback(message);
    };
    if(platform === "android"){
      var args = '{clientID:"' + appName + '", clientSecret:"'+clientSecret+'",dialogMessage:"'+ message +'"}';
      FingerprintAuth.show(args, successCbFingerPrintAuth, errorCbFingerPrintAuth);
    }
    if(platform === "ios")touchid.authenticate(successCallback, errorCallback, message);
};

module.exports = new FingerPrint();
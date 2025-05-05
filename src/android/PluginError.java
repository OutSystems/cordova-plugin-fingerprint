package de.niklasmerz.cordova.biometric;

public enum PluginError {

    BIOMETRIC_UNKNOWN_ERROR(-100, "An unknown error occurred."),
    BIOMETRIC_AUTHENTICATION_FAILED(-102, "Authentication failed."),
    BIOMETRIC_HARDWARE_NOT_SUPPORTED(-104, "Biometrics is not supported on this hardware."),
    BIOMETRIC_NOT_ENROLLED(-106, "Biometrics is not configured."),
    BIOMETRIC_DISMISSED(-108, "Biometric prompt was dismissed by user."),
    BIOMETRIC_PIN_OR_PATTERN_DISMISSED(-109, "Device credentials prompt was dismissed by user."),
    BIOMETRIC_SCREEN_GUARD_UNSECURED(-110,
            "Go to 'Settings -> Security -> Screenlock' to set up a lock screen."),
    BIOMETRIC_LOCKED_OUT(-111, "Too many failed attempts. Try again later."),
    BIOMETRIC_LOCKED_OUT_PERMANENT(-112, "Too many failed attempts. You need to use your device credentials to unlock."),
    BIOMETRIC_NO_SECRET_FOUND(-113, "No secret found. Unable to decrypt using biometrics."),
    BIOMETRIC_ARGS_PARSING_FAILED(-115, "Invalid arguments were sent."),

    BIOMETRIC_SECURITY_VULNERABILITY(-116,
            "A security vulnerability has been discovered with one or more hardware sensors. The affected sensor(s) are unavailable until a security update has addressed the issue."),
    ;

    private int value;
    private String message;

    PluginError(int value) {
        this.value = value;
        this.message = this.name();
    }

    PluginError(int value, String message) {
        this.value = value;
        this.message = message;
    }

    public int getValue() {
        return value;
    }

    public String getMessage() {
        return message;
    }
}

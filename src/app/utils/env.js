"use strict";
exports.__esModule = true;
/**
 * Get the environment variable.
 * @param key The env variable key.
 * @param defaultValue The default value.
 * @returns The env variable value.
 */
var env = function (key, defaultValue) {
    if (defaultValue === void 0) { defaultValue = ''; }
    var value = process.env[key];
    if (value === undefined) {
        return defaultValue;
    }
    return value;
};
exports["default"] = env;

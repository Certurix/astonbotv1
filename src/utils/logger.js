const colors = require('colors')
const fs = require('fs')

/**
 * Saves a log message to a log file.
 * @param {string} message - The log message to be saved.
 */
function saveLog(type, message) {
    const date = new Date();
    fs.appendFile(`./src/data/logs/${date.toISOString().split('T')[0]}.log`, `${date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} - ${type} - ${message}\n`, (err) => {
        if (err) {
            console.error(colors.red.inverse(` ERROR `) + colors.red(` ${err.message}\n`));
        }
    });
}

/**
 * Logs an error message to the console.
 *
 * @param {string} message - The error message to be logged.
 */
exports.Error = async function (message) {
    console.error(colors.red.inverse(` ERROR `) + colors.red(` ${message}\n`));
    saveLog("ERROR", message);
}

/**
 * Logs a warning message to the console.
 *
 * @param {string} message - The message to be logged.
 */
exports.Warn = async function (message) {
    console.log(colors.yellow.inverse(` WARNING `) + colors.yellow(` ${message}\n`));
    saveLog("WARN",message);
}

/**
 * Log an informational message.
 *
 * @param {string} message - The message to be logged.
 */
exports.Info = async function (message) {
    console.log(colors.blue.inverse(` INFO `) + colors.blue(` ${message}\n`));
    saveLog("INFO",message);
}

/**
 * Logs a success message to the console.
 *
 * @param {string} message - The message to be logged.
 */
exports.Success = async function (message) {
    console.log(colors.green.inverse(` SUCCESS `) + colors.green(` ${message}\n`));
    saveLog("SUCCESS",message);
}

/**
 * Logs a fatal error message and optionally exits the process.
 *
 * @param {string} message - The error message to log.
 * @param {boolean} shouldExit - Whether to exit the process after logging the error.
 */
exports.Fatal = async function (message, shouldExit) {
    console.error(colors.red.inverse(` FATAL `) + colors.red(` ${message}\n`));
    saveLog(message);
    if (shouldExit) {
        process.exit(1);
    }
}
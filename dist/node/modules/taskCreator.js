const queueReference = require("./queueHandler");
/**@module TaskShortcuts
 * @requires {@link module:QueueHandler}
 */
/**@typedef {BackupObject}
 * @prop {number} scannedTo
 * @prop {number[]} primeList
 */
/**
 * @returns {Promise.<boolean>}
 * @param {number} target - The target number
 */
function scanToTargetNumber(target) {
    return queueReference.addTask({
        directive: "scanToNumber", amount: target,
    });
}

/**
 * @description Scans until finding the `n`th prime number, then returning it.
 * @returns {Promise.<number>} - The `n`th prime number from start
 * @param {number} n -  Specifies the `n` in "`n`th prime number from the start"
 */
function findPrime(n) {
    return queueReference.addTask({
        directive: "scanToNumber", amount: n,
    });
}

/**
 * @returns {Promise.<number[]>}
 * @param {number} amount - Specifies how many primes should be scanned.
 */
function findPrimes(amount) {
    return queueReference.addTask({
        directive: "findPrimes", amount
    });
}

/**
 * @returns {Promise.<number>}
 * @param {number} amount - Specifies how many numbers should be scanned.
 */
function scanNumbers(amount) {
    return queueReference.addTask({
        directive: "scanNumbers", amount
    });
}
/**
 * @returns {Promise<boolean>}
 * @param {BackupObject} backup 
 */
function importBackup (backup){
    if (typeof backup === "string"){ backup = JSON.parse(backup);}
    queueReference.addTask({
        directive:"backup",
        ...backup
    });
}

module.exports = exports = {
    scanToTargetNumber, scanNumbers, findPrimes, findPrime,importBackup
};
const queueReference = require("./queueHandler");

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
 * @param {number} amount 
 */
function scanNumbers(amount) {
    return queueReference.addTask({
        directive: "scanNumbers", amount
    });
}

module.exports = exports = {
    scanToTargetNumber, scanNumbers, findPrimes, findPrime
};
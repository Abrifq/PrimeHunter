/**
 * @requires module:TaskShortcuts
 * @requires module:AsyncArrayUtils
 * @requires module:PrimeNumberScanner
 * @requires module:QueueHandler
 */
/**
 * @typedef {Object} TaskTemplate
 * @prop {string} directive
 * @prop {number} amount
 */

let lolGlobal;
async function PrimeHunter() {
    const { findPrime, scanToTargetNumber, findPrimes, scanNumbers } = require("./modules/taskCreator"),
        {mapConstructor} = require("./modules/asyncArrayUtils"),
        { addTask: rawTaskSender } = require("./modules/queueHandler"),
        {outputs} = await require("./modules/scanner");

    if (typeof lolGlobal === "undefined") {
        const newSingleton = {
            results:outputs,
            /**@param {Array<TaskTemplate|TaskTemplate[]>} queue */
            async bulkSearch(...queue) {
                queue = queue.flat();
                /**
                 * @param {string} directive 
                 * @param {number|Object} value
                 */
                async function taskSelector(directive, value) {
                    switch (directive) {
                        case "scanToNumber":
                            return scanToTargetNumber(value);
                        case "scanNumbers":
                            return scanNumbers(value);
                        case "findPrime":
                            return findPrime(value);
                        case "findPrimes":
                            return findPrimes(value);
                        case "backup":
                            return rawTaskSender({ directive, value });
                        default: 
                        return "Wrong directive.";
                    }
                }
                return mapConstructor(queue)
                .map(({directive,amount:value})=>taskSelector(directive,value))
                .then(chain=>chain.array)
                .then(Promise.all);
            }
        };
        lolGlobal = newSingleton;
    }
    return lolGlobal;
}

module.exports = exports = PrimeHunter;
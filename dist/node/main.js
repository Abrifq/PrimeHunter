/**
 * @requires module:TaskShortcuts
 * @requires module:AsyncArrayUtils
 * @requires module:PrimeNumberScanner
 */
/**
 * @typedef {Object} TaskTemplate
 * @prop {string} directive
 * @prop {number} amount
 */

let lolGlobal;
async function PrimeHunter() {
    const tasksReference= require("./modules/taskCreator"),
        {mapConstructor} = require("./modules/asyncArrayUtils"),
        {outputs} = await require("./modules/scanner");

    if (typeof lolGlobal === "undefined") {
        const newSingleton = {
            ...tasksReference,
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
                            return tasksReference.scanToTargetNumber(value);
                        case "scanNumbers":
                            return tasksReference.scanNumbers(value);
                        case "findPrime":
                            return tasksReference.findPrime(value);
                        case "findPrimes":
                            return tasksReference.findPrimes(value);
                        case "backup":
                            return tasksReference.importBackup(value);
                        default: 
                        return "Wrong directive.";
                    }
                }
                return mapConstructor(queue)
                .map(({directive,amount:value})=>taskSelector(directive,value))
                .then(chain=>chain.array)
                .then(Promise.all);
            },
            getBackup(){
                const resultsReference = this.results;
                return JSON.stringify(
                    {
                        scannedTo:resultsReference.scannedTo,
                        primeList: Array.from (resultsReference.primes)
                    }
                );
            }
        };
        lolGlobal = newSingleton;
    }
    return lolGlobal;
}

module.exports = exports = PrimeHunter;
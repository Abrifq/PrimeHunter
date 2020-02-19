/**@module PrimeNumberScanner
 * @requires module:ControlledPromise
 * @requires module:AsyncArrayUtils
 */
const controlledPromiseConstructor = require("./controlledPromise");
const { every: asyncEvery } = require("./asyncArrayUtils");
/**@typedef {Object} taskTemplate
 * @prop {string} directive
 * @prop {number} amount - also known as target.
 */
/**@typedef {Object} Task
 * @extends {taskTemplate}
 * @prop {Object} controlledPromise
 * @prop {function} controlledPromise.resolve
 * @prop {function} controlledPromise.reject
 * @prop {Promise} controlledPromise.promise
 */
/**@generator
 * @returns {Generator}
 * @yields {Promise<Boolean|number|number[]>}
 */

const PrimeScannerGenerator = async function* () {
    let index = 2, task = {
        directive: "scanNumbers",
        amount: 1,
        controlledPromise: new controlledPromiseConstructor()
    },primeScanningStart,scanResultArray;

    const primes = [],
        asyncEvery = require("./asyncArrayUtils").every;
    const primeFinder = num => index % num !== 0,
        finishTask = (resolveValue, controlledPromise) => {
            controlledPromise.resolve(resolveValue);
            this.outputs.primes = [...primes];
            this.outputs.scannedTo = index;
            return controlledPromise.promise;

        };

    /**@param {Array} setLike
     * @param {Array} ...array
     * @returns {Promise<void>} */
    const bulkInputToSet = async (setLike, ...array) => {
        array= array.flat();
        for (let i = 0; i < array.length; i++) {
            if (setLike.has(array[i])) { continue }
            setLike.push(array[i]);
        }
    };

    const checkTask = async task => {
        const defaultTask = {
            directive: "scanNumbers",
            amount: 1,
            controlledPromise: new controlledPromiseConstructor()
        };
        if (typeof task !== "object") {
            console.warn("Invalid task: not object");
            return defaultTask;
        }

        //I'll laugh if this gets optimized by any way in V8
        const doesHaveControlledPromise =
            "controlledPromise" in task && typeof task.controlledPromise === "object" &&
            "resolve" in task.controlledPromise && typeof task.controlledPromise.resolve === "function" &&
            "reject" in task.controlledPromise && typeof task.controlledPromise.reject === "function" &&
            "promise" in task.controlledPromise && typeof task.controlledPromise.promise === "object";
        console.assert(doesHaveControlledPromise, "Invalid task: Invalid ControlledPromise");
        const isBackupTask = doesHaveControlledPromise &&
            "primeList" in task && typeof task.primeList === "object" &&
            "scannedTo" in task && typeof task.scannedTo === "number";
        if (isBackupTask) {
            index = task.scannedTo;
            bulkInputToSet(primes, task.primeList);
        }

        const isValidTask = doesHaveControlledPromise &&
            "directive" in task && typeof task.directive === "string" &&
            "amount" in task && typeof task.amount === "number";
        if (isValidTask) {
            console.info("Valid task!");
            if (task.directive === "findPrimes"){ primeScanningStart = primes.length;scanResultArray=[];}
            return task;
        }

        console.warn("Invalid task");
        return defaultTask;
    };


    while (true) {
        if (task.directive === "backup") {
            task = await checkTask(yield finishTask(true, task.promise));
        }
        if (await asyncEvery(primes, primeFinder)) {
            primes.push(index);
            if (task.directive === "findPrimes") {
                task.amount--;
                scanResultArray.push(index);
            }

        }
        if (task.directive === "scanNumbers") {
            task.amount--;
        }

        if (task.amount === 0) {
            let returnValue = task.directive === "findPrimes"?[...scanResultArray]:true;
            task = await checkTask(yield finishTask(returnValue, task.controlledPromise));
        } else if (task.directive === "scanToNumber" && task.amount <= index) {
            task = await checkTask(yield finishTask(true, task.controlledPromise));
        } else if (task.directive === "findPrime" && primes.length >= task.amount) {
            task = await checkTask(yield finishTask(primes[task.amount], task.controlledPromise));
        }

        ++index;

    }
};

/**
 * @typedef {Object} PrimeHunter
 * @prop {Object} outputs
 * @prop {number[]} outputs.primes
 * @prop {number} outputs.scannedTo
 * @prop {function} scanTask
 */

const PrimeHunter = {
 /**@type {PrimeHunter} */
const PrimeHunterController = {
    outputs: {
        primes: [],
        scannedTo: 0
    }
};
const generator = PrimeScannerGenerator.apply(PrimeHunter);
PrimeHunter.scanTask = task => generator.next(task);
exports.default = null;
exports = module.exports = PrimeHunter.scanTask().then(() => PrimeHunter); //first scan
/**@alias PrimeHunter.scanTask
 * @kind function
 * @async
 * @param {Task} task
 * @returns {Promise<number[]|number|boolean>}
 */

/**@type {Promise<PrimeHunter>} */

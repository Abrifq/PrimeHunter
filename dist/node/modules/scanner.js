const PrimeScannerGenerator =
    /**@generator
     * @returns {Generator}
     */
    async function* () {
        let index = 2,
            task = {
                directive: "scanNNumbers",
                amount: 1,
                controlledPromise: new(require("./controlledPromise"))()
            };
        const primes = [],
            asyncEvery = require("./asyncArrayUtils").every,
            primeFinder = async (num) => index % num !== 0, finishTask = (resolveValue, controlledPromise) => {
                controlledPromise.resolve(true);
                this.outputs.primes = [...primes];
                this.outputs.scannedTo = index;
                return controlledPromise.promise;
            }, checkTask = task => {
                const defaultTask = {
                    directive: "scanNNumbers",
                    amount: 1,
                    controlledPromise: new(require("./controlledPromise"))()
                };
                if (typeof task !== "object") {
                    return defaultTask;
                }
                //I'll laugh if this gets optimized by any way in V8
                const isValidTask =
                    "directive" in task && typeof task.directive === "string" &&
                    "amount" in task && typeof task.amount === "number" &&
                    "controlledPromise" in task && typeof task.controlledPromise === "object" &&
                    "resolve" in task.controlledPromise && typeof task.controlledPromise.resolve === "function" &&
                    "reject" in task.controlledPromise && typeof task.controlledPromise.reject === "function" &&
                    "promise" in task.controlledPromise && typeof task.controlledPromise.promise === "object";
                if (isValidTask) {
                    return task;
                }
                return defaultTask;
            };
        while (true) {
            if (await asyncEvery(primes, primeFinder)) {
                primes.push(index);
                if (task.directive === "findNPrimes") {
                    task.amount--;
                } else if (task.directive === "findPrimeN" && primes.length >= task.amount) {
                    task = checkTask(yield finishTask(primes[task.amount], task.controlledPromise));
                }
            }
            if (task.directive === "scanNNumbers") {
                task.amount--;
            }

            if (task.amount === 0) {
                task = checkTask(yield finishTask(true, task.controlledPromise));
            } else if (task.directive === "scanToNumberN" && task.amount <= index) {
                task = checkTask(yield finishTask(true, task.controlledPromise));
            }
            index++;
        }
    };

const PrimeHunter = {
    scanner: PrimeScannerGenerator(),
    outputs: {
        primes: [],
        scannedTo: 0
    }
};
exports = PrimeHunter;
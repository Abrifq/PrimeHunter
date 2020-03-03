import controlledPromiseConstructor from "./controlledPromise.mjs";
import { every as asyncEvery } from "./../../asyncArrayUtils/asyncArrayUtils.mjs";
const PrimeScannerGenerator = async function* () {

    let index = 2, task = {
        directive: "scanNumbers",
        amount: 1,
        controlledPromise: new controlledPromiseConstructor()
    }, primeScanningStart, scanResultArray;

    const primes = [],
        primeFinder = num => index % num !== 0,
        finishTask = (resolveValue, controlledPromise) => {
            controlledPromise.resolve(resolveValue);
            this.outputs.primes = [...primes];
            this.outputs.scannedTo = index;
            return controlledPromise.promise;

        };

    const bulkInputToSet = async (setLike, ...array) => {
        array = array.flat();
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

        //I'll still laugh if this gets optimized by any way in V8
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
            if (task.directive === "findPrimes") {
                primeScanningStart = primes.length; scanResultArray = [];
            }
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
                --task.amount;
                scanResultArray.push(index);
            }

        }
        if (task.directive === "scanNumbers") {
            --task.amount;
        }

        if (task.amount === 0) {
            let returnValue = task.directive === "findPrimes" ? [...scanResultArray] : true;
            task = await checkTask(yield finishTask(returnValue, task.controlledPromise));
        } else if (task.directive === "scanToNumber" && task.amount <= index) {
            task = await checkTask(yield finishTask(true, task.controlledPromise));
        } else if (task.directive === "findPrime" && primes.length >= task.amount) {
            task = await checkTask(yield finishTask(primes[task.amount], task.controlledPromise));
        }

        ++index;

    }
};
const PrimeHunterController = {
    outputs: {
        primes: [],
        scannedTo: 0
    }
};
const generator = PrimeScannerGenerator.apply(PrimeHunterController);
PrimeHunterController.scanTask = (task) => {
    return generator.next(task);
};
export default PrimeHunterController.scanTask().then(() => PrimeHunterController);    
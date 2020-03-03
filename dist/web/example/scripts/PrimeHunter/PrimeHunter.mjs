let globalSingletonReference;
import {default as tasksReference} from "./modules/taskCreator.mjs";
import {mapConstructor} from "./../asyncArrayUtils/asyncArrayUtils.mjs";
import {default as scannerPromiseReference} from "./modules/scanner.mjs";
async function PrimeHunter() {
    const { outputs } = await scannerPromiseReference;

    if (typeof globalSingletonReference === "undefined") {
        const newSingleton = {
            ...tasksReference,
            results: outputs,
            async bulkSearch(...queue) {
                queue = queue.flat();
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
                    .map(({ directive, amount: value }) => taskSelector(directive, value))
                    .then(chain => chain.array)
                    .then(Promise.all);
            },
            getBackup() {
                const resultsReference = this.results;
                return JSON.stringify(
                    {
                        scannedTo: resultsReference.scannedTo,
                        primeList: Array.from(resultsReference.primes)
                    }
                );
            }
        };
        globalSingletonReference = newSingleton;
    }
    return globalSingletonReference;
}
export default PrimeHunter;
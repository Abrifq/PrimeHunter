exports = {
    some: async function asyncSome(array, asyncFunction) {
        let doesSomeResolveToTrue = false;
        for (let i = 0; i < array.length; i++) {
            doesSomeResolveToTrue = !!(await asyncFunction(array[i], i, array));
            if (doesSomeResolveToTrue) {
                break;
            }
        }
        return doesSomeResolveToTrue;
    },
    every: async function asyncEvery(array, asyncFunction) {
        let didAnyFail = false;
        for (let i = 0; i < array.length; i++) {
            didAnyFail = !(await asyncFunction(array[i], i, array));
            if (didAnyFail) {
                break;
            }
        }
        return !didAnyFail;
    },
    forEach: async function asyncForEach(array, asyncFunction) {
        const copiedArray = [...array];
        let promiseChain = Promise.resolve();
        for (let i = 0; i < copiedArray.length; i++) {
            await promiseChain; //added await here instead of end of the loop to prevent side-effects. May increase time spent on chain.
            const currentPromise = asyncFunction(copiedArray[i], i, copiedArray);
            promiseChain = promiseChain.then(currentPromise);
        }
        return;
    },
    reduce: async function asyncReduce(array, asyncFunction, initialValue) {
        for (let i = 0; i < array.length; i++) {
            if (typeof initialValue === "undefined") {
                initialValue = array[i];
                continue;
            }
            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
        return initialValue;
    },
    reduceRight: async function asyncReduceRight(array, asyncFunction, initialValue) {
        for (let i = array.length - 1; i !== -1; i--) {
            if (typeof initialValue === "undefined") {
                initialValue = array[i];
                continue;
            }
            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
    }
};
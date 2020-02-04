    /**@callback asyncArrayLoopedBoolChecker
     * @param {*} item
     * @param {number} index
     * @param {*[]} array
     * @returns {Promise<boolean>}
     */
    /**@callback asyncArrayReducer
     * @param {*} initialValue
     * @param {*} item
     * @param {number} index
     * @param {*[]} array
     * @returns {Promise<*>}
     */
    /**@callback asyncArrayVoidLoop
     * @param {*} item
     * @param {number} index
     * @param {*[]} array
     * @returns {Promise<void>}
     */
exports = {
    /**
     * @returns {Promise<boolean>}
     * @param {Array|Set} array 
     * @param {asyncArrayLoopedBoolChecker} asyncFunction - Passed arguments are same as in the Array.prototype.some
     */
    some: async function asyncSome(array, asyncFunction) {
        if (array instanceof Set) {
            array = [...array];
        }
        let doesSomeResolveToTrue = false;
        for (let i = 0; i < array.length; i++) {
            doesSomeResolveToTrue = !!(await asyncFunction(array[i], i, array));
            if (doesSomeResolveToTrue) {
                break;
            }
        }
        return doesSomeResolveToTrue;
    },
    /**
     * @returns {Promise<boolean>}
     * @param {Array|Set} array 
     * @param {asyncArrayLoopedBoolChecker} asyncFunction - Passed arguments are same as in the Array.prototype.every
     */
    every: async function asyncEvery(array, asyncFunction) {
        if (array instanceof Set) {
            array = [...array];
        }
        let didAnyFail = false;
        for (let i = 0; i < array.length; i++) {
            didAnyFail = !(await asyncFunction(array[i], i, array));
            if (didAnyFail) {
                break;
            }
        }
        return !didAnyFail;
    },
    /**
     * @returns {Promise<void>}
     * @param {Array|Set} array 
     * @param {VoidFunction} asyncFunction - Passed arguments are same as in Array.prototype.forEach
     */
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
    /**
     * @returns {*}
     * @param {Array|Set} array 
     * @param {asyncArrayReducer} asyncFunction 
     * @param {*=} initialValue 
     */
    reduce: async function asyncReduce(array, asyncFunction, initialValue) {
        if (array instanceof Set) {
            array = [...array];
        }
        for (let i = 0; i < array.length; i++) {
            if (typeof initialValue === "undefined") {
                initialValue = array[i];
                continue;
            }
            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
        return initialValue;
    },
    /**
     * @returns {*}
     * @param {Array|Set} array 
     * @param {asyncArrayReducer} asyncFunction 
     * @param {*=} initialValue 
     */
    reduceRight: async function asyncReduceRight(array, asyncFunction, initialValue) {
        if (array instanceof Set) {
            array = [...array];
        }
        for (let i = array.length - 1; i !== -1; i--) {
            if (typeof initialValue === "undefined") {
                initialValue = array[i];
                continue;
            }

            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
    }
};
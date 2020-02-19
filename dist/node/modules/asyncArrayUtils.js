/**
   * @module AsyncArrayUtils
   * @description A mock creation of some of the Array.prototype functions in async.
   * @type {Object}
   * @exports asyncArrayUtils
   * @property {function} some - Returns `true` if any of the promises resolve to `true`.\nWill resolve to `false` instantly if the array is empty.
   * @property {function} every - Returns `false` if any of the promises resolve to `false`.\nWill resolve to `true` instantly if the array is empty.
   * @property {function} reduce 
   * @property {function} reduceRight
   * @property {function} forEach
   */
/**@callback asyncArrayBoolCheckerForLoops
* @param {*} item
* @param {number=} index
* @param {Array=} array
* @async
* @returns {Promise<boolean>}
*/
/**@callback asyncArrayReducer
 * @param {*} initialValue
 * @param {*} item
 * @param {number=} index
 * @param {Array=} array
 * @async
 * @returns {Promise<*>}
 */
/**@callback asyncArrayVoidLoop
 * @param {*} item
 * @param {number=} index
 * @param {Array=} array
 * @async
 * @returns {Promise<void>}
 */
/**@callback asyncArrayMapCallback
 * @param {*} value
 * @param {number=} index
 * @param {Array=} array
 * @async
 * @returns {Promise}
 */

module.exports = {
    /**@async
     * @returns {Promise<boolean>}
     * @param {Array|Set} array 
     * @param {asyncArrayBoolCheckerForLoops} asyncFunction - Passed arguments are same as in the Array.prototype.some
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
    /**@async
     * @returns {Promise<boolean>}
     * @param {Array|Set} array 
     * @param {asyncArrayBoolCheckerForLoops} asyncFunction - Passed arguments are same as in the Array.prototype.every
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
    /**@async,
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
    /**@async
     * @returns {Promise}
     * @param {Array|Set} array 
     * @param {asyncArrayReducer} asyncFunction 
     * @param {*=} initialValue 
     */
    reduce: async function asyncReduce(array, asyncFunction, initialValue) {
        if (array instanceof Set) {
            array = [...array];
        }
        let i = 0;
        if (typeof initialValue === "undefined") {
            initialValue = array[i];
            i++;
        }
        for (; i < array.length; i++) {

            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
        return initialValue;
    },
    /**@async
     * @returns {Promise}
     * @param {Array|Set} array 
     * @param {asyncArrayReducer} asyncFunction 
     * @param {*=} initialValue 
     */
    reduceRight: async function asyncReduceRight(array, asyncFunction, initialValue) {
        if (array instanceof Set) {
            array = [...array];
        }
        let i = array.length - 1;
        if (typeof initialValue === "undefined") {
            initialValue = array[i];
            i--;
        }
        for (; i !== -1; i--) {


            initialValue = await asyncFunction(initialValue, array[i], i, array);
        }
    },
    /**
     * @returns {asyncMapChained}
     * @param {Array} array 
     */
    mapConstructor: function asyncArrayMapConstructor(array){
        /**
         * @typedef {Object} asyncMapChained
         * @property {Array} array - The result after the last `map()`
         * @property {function} map
         */
        const self = {
            array,
            /**
             * @param {asyncArrayMapCallback} asyncFunction
             * @async
             * @returns {asyncMapChained}
             */
            map: async function(asyncFunction){
                for ( let i = 0;i<array.length;i++ ){
                 array[i] =   await asyncFunction(array[i],i,array);
                }
                return self;
            }
        };
        return self;
    }
};
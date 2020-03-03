export const some = async function asyncSome(array, asyncFunction) {
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
};
export const mapConstructor = function asyncArrayMapConstructor(array) {
    const self = {
        array,
        map: async function (asyncFunction) {
            for (let i = 0; i < array.length; i++) {
                array[i] = await asyncFunction(array[i], i, array);
            }
            return self;
        }
    };
    return self;
};
export const reduceRight = async function asyncReduceRight(array, asyncFunction, initialValue) {
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
};
export const reduce = async function asyncReduce(array, asyncFunction, initialValue) {
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
};
export const forEach = async function asyncForEach(array, asyncFunction) {
    const copiedArray = [...array];
    let promiseChain = Promise.resolve();
    for (let i = 0; i < copiedArray.length; i++) {
        await promiseChain; //added await here instead of end of the loop to prevent side-effects. May increase time spent on chain.
        const currentPromise = asyncFunction(copiedArray[i], i, copiedArray);
        promiseChain = promiseChain.then(currentPromise);
    }
    return;
};
export const every = async function asyncEvery(array, asyncFunction) {
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
};

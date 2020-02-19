/**@module ControlledPromise 
 * @exports controlledPromiseConstructor
*/

/**@typedef {Object} controlledPromise
 * @property {function} resolve
 * @property {function} reject
 * @prop {Promise} promise
*/

/**
 * @constructor
 * @constructs controlledPromise
 * @function controlledPromiseConstructor
 * @returns {controlledPromise}
 */
function controlledPromiseConstructor () {
    this.promise = new Promise((resolve,reject)=>{
        this.resolve= resolve;
        this.reject=reject;
    });
}
module.exports = controlledPromiseConstructor;
/**@typedef {Object} ControlledPromise
 * @property {function} resolve
 * @property {function} reject
 * @prop {Promise} promise
*/
/**
 * @constructor
 * @constructs ControlledPromise
 */
function controlledPromise () {
    this.promise = new Promise((resolve,reject)=>{
        this.resolve= resolve;
        this.reject=reject;
    });
}
module.exports = controlledPromise;
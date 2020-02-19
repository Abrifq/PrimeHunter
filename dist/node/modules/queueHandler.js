const scannerReference = require("./scanner");
/**@module QueueHandler
 * @requires {@link module:PrimeNumberScanner}
 */
/**@typedef {Object} taskTemplate
 * @prop {string} directive
 * @prop {number} amount - also known as target.
 */
/**@constructor
 */
function QueueConstructor() {
    const privateQueue = [];
    let isLoopUnlocked = true;
    async function tickQueue() {
        const scanner = await scannerReference;
        isLoopUnlocked = false;
        while (privateQueue.length) {
            await scanner.scanTask(privateQueue[0]);
            privateQueue.shift();
        }
        isLoopUnlocked = true;
        return;
    }
    /**@name getLength
     * @kind function
     * @returns {number}
     */
    this.getLength = () => privateQueue.length;

    /**@name addTask
     * @kind function
    * @param {Object} taskTemplate
    * @param {string} taskTemplate.directive 
    * @param {number} taskTemplate.amount
    */
    this.addTask =
        ({ directive, amount }) => {
            let task = {
                directive,
                amount,
                controlledPromise: new (require("./controlledPromise"))()
            };
            privateQueue.push(task);
            if (isLoopUnlocked) { tickQueue(); }
            return task.controlledPromise.promise;
        };
}


module.exports = new QueueConstructor();

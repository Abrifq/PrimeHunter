
/**@constructor
 */
function QueueConstructor() {
    const privateQueue = [];
    let isLoopUnlocked = true;
    async function tickQueue() {
        isLoopUnlocked = false;
        while (privateQueue.length) {
            await /* replace with: PrimeHunter(task), placeholder:*/Promise.resolve();
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

/**@typedef PrimeHunter-Task
 * @property {string} taskDescriptor
 * @property {number} amount
 * @prop {ControlledPromise} control
 */
module.exports = new QueueConstructor();

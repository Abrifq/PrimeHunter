/**@typedef {Object} Queue
 * @property {Function<Promise>} addTask
 * @property {Function<number>} getLength
 */
/**@constructor
 * @constructs Queue
 */
function QueueConstructor(){
    const privateQueue = [];
    let isLoopUnlocked = true;
    async function tickQueue(){
        isLoopUnlocked = false;
        while(privateQueue.length) {
            await /* replace with: PrimeHunter(task), placeholder:*/Promise.resolve();
            privateQueue.shift();
        }
        isLoopUnlocked = true;
        return;
    }
    this.getLength = ()=>privateQueue.length;
    this.addTask = taskTemplate=>{
        let task = {
            descriptor:taskTemplate.descriptor,
            amount: taskTemplate.amount,
            controlledPromise: new (require("./controlledPromise"))()
        };
        privateQueue.push(task);
        if (isLoopUnlocked) {tickQueue();}
        return task.controlledPromise.promise;
    };
}

/**@typedef PrimeHunter-Task
 * @property {string} taskDescriptor
 * @property {number} amount
 * @prop {ControlledPromise} control
 */
module.exports = new QueueConstructor();

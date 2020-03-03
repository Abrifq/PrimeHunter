import {default as scannerReference} from "./scanner.mjs";

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
    this.getLength = () => privateQueue.length;

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

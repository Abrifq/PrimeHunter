import {default as queueReference} from "./queueHandler.mjs";
function scanToTargetNumber(target) {
    return queueReference.addTask({
        directive: "scanToNumber", amount: target,
    });
}
function findPrime(n) {
    return queueReference.addTask({
        directive: "scanToNumber", amount: n,
    });
}
function findPrimes(amount) {
    return queueReference.addTask({
        directive: "findPrimes", amount
    });
}
function scanNumbers(amount) {
    return queueReference.addTask({
        directive: "scanNumbers", amount
    });
}
function importBackup (backup){
    if (typeof backup === "string"){ backup = JSON.parse(backup);}
    queueReference.addTask({
        directive:"backup",
        ...backup
    });
}

export {
    scanToTargetNumber, scanNumbers, findPrimes, findPrime,importBackup
};
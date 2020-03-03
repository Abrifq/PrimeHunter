//jshint -W040
export default function controlledPromiseConstructor () {
    this.promise = new Promise((resolve,reject)=>{
        this.resolve= resolve;
        this.reject=reject;
    });
}
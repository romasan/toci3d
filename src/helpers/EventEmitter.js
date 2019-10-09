export default class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, callback) {

        if (!this.events[event]) {
            this.events[event] = [];
        }

        typeof callback === 'function' && this.events[event].push(callback);

        return this;
    }
    emit(event, ...a) {

        for (const callback of this.events[event] || []) {
            callback(...a);
        }

        return this;
    }
    // static get global() {
    //     if (!this._global) {
    //         this._global = new EventEmitter();
    //     }
    //     return this._global;
    // }
}
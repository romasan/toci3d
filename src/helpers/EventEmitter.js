export default class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, callback) {

        if (!this.events[event]) {
            this.events[event] = [];
        }

        typeof callback === 'function' && this.events[event].push(callback);
    }
    emit(event, ...a) {

        for (const callback of this.events[event] || []) {
            callback(...a);
        }
    }
}
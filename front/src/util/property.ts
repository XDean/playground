export interface Listener<T> {
    (p: Property<T>, o: T, n: T): void
}

export class Property<T> {
    private _value: T;
    private listeners: Listener<T>[] = [];

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        const oldValue = this._value;
        this._value = value;
        this.listeners.forEach(l => {
            l(this, oldValue, value);
        })
    }

    constructor(defaultValue: T) {
        this._value = defaultValue
    }

    addListener(l: Listener<T>) {
        this.listeners.push(l);
    }

    removeListener(l: Listener<T>) {
        const index = this.listeners.indexOf(l);
        if (index != -1) {
            this.listeners.splice(index, 1);
        }
    }
}
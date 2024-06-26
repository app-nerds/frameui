/**
 * Function to connect binding configs to DOM elements with the "data-bind"
 * attribute.
 * @param {object} Object which contains target data binding variables.
 * @param {string} CSS selector determines which elements to apply to. Defaults to "data-bind"
 */
export function applyBindings(container: any, options?: {
    selector: string;
}): void;
/**
 * Class to create an observable variable that notifies listeners on change.
 * @class Binding
 */
export class Binding {
    constructor(name: string, value: any);
    _name: string;
    _listeners: any[];
    _value: any;
    notify(): void;
    subscribe(listener: () => void): void;
    subscriberCount(): number;
    clear(newValue?: any): void;
    get name(): string;
    set value(newValue: any);
    get value(): any;
}
/**
 * Class to create an observable computed binding.
 * @class Computed
 * @extends Binding
 */
export class Computed extends Binding {
    constructor(value: any, deps?: array<Binding>);
}

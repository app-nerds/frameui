/**
 * Function to connect binding configs to DOM elements with the "data-bind"
 * attribute.
 * @param {object} container
 */
export function applyBindings(container: object): void;
/**
 * Class to create an observable variable that notifies listeners on change.
 * @class Binding
 */
export class Binding {
    constructor(value: any, selectedIndex?: number);
    _listeners: any[];
    _value: any;
    _selectedIndex: number;
    notify(): void;
    subscribe(listener: any): void;
    clear(newValue?: string, newSelectedIndex?: number): void;
    set value(newValue: any);
    get value(): any;
    set selectedIndex(newIndex: number);
    get selectedIndex(): number;
}
/**
 * Class to create an observable computed binding.
 * @class Computed
 * @extends Binding
 */
export class Computed extends Binding {
    constructor(value: any, deps: array<Binding>);
}

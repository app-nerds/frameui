/**
 * Class to create an observable variable that notifies listeners on change.
 * @class Binding
 */
export class Binding {
  constructor(value) {
    this._listeners = [];
    this._value = value;
  }

  notify() {
    this._listeners.forEach((listener) => listener(this._value));
  }

  subscribe(listener) {
    this._listeners.push(listener);
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (newValue !== this._value) {
      this._value = newValue;
      this.notify();
    }
  }
}

/**
 * Class to create an observable computed binding.
 * @class Computed
 * @extends Binding
 */
export class Computed extends Binding {
  constructor(value, /** @type {array<Binding>} */ deps) {
    super(value());

    const listener = () => {
      this._value = value();
      this.notify();
    };

    deps.forEach((dep) => dep.subscribe(listener));
  }

  get value() {
    return this._value;
  }

  set value(_) {
    throw "cannot set value on computed property";
  }
}

/**
 * Function to connect binding configs to DOM elements with the "data-bind"
 * attribute.
 * @param {object} container
 */
export function applyBindings(container) {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const observer = container[el.getAttribute("data-bind")];
    bindValue(el, observer);
  });
}

function bindValue(input, observable) {
  input.value = observable.value;
  observable.subscribe(() => (input.value = observable.value));
  input.addEventListener("keyup", () => {
    observable.value = input.value;
  });
}

import { debounce } from "./debounce";

/**
 * Class to create an observable variable that notifies listeners on change.
 * @class Binding
 */
export class Binding {
  // constructor(name, value, selectedIndex = 0) {
  constructor(
    /**
     * A name to identify this binding.
     * @type {string}
     */
    name,
    /**
     * Initial value for this binding. This can be anything.
     * @type {any}
     */
    value,
  ) {
    this._name = name;
    this._listeners = [];
    this._value = value;
  }

  notify() {
    this._listeners.forEach((listener) => listener(this._name, this._value));
  }

  subscribe(
    /**
     * Function called when this binding changes.
     * @type {() => void}
     */
    listener,
  ) {
    this._listeners.push(listener);
  }

  subscriberCount() {
    return this._listeners.length;
  }

  // clear(newValue = "", newSelectedIndex = 0) {
  clear(
    /**
     * New value to set. optional.
     * @type {any} [""]
     */
    newValue = "",
  ) {
    this._value = newValue;
    this.notify();
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  set value(
    /**
     * New value to set
     * @type {any}
     */
    newValue,
  ) {
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
  constructor(value, /** @type {array<Binding>} */ deps = []) {
    super("computed", value());

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
 * @param {object} Object which contains target data binding variables.
 * @param {string} CSS selector determines which elements to apply to. Defaults to "data-bind"
 */
export function applyBindings(container, options = { selector: "data-bind" }) {
  options = {
    selector: "data-bind",
    ...options,
  };

  document.querySelectorAll(`[${options.selector}]`).forEach((el) => {
    const observer = container[el.getAttribute(options.selector)];

    if (el.nodeName === "INPUT") {
      bindInput(el, observer);
      return;
    }

    if (el.nodeName === "SELECT") {
      bindSelect(el, observer);
      return;
    }

    bindNode(el, observer);
  });

  /*
   * Add a method to the container to set state and notify all.
   */
  // container.setState = (newState = {}) => {
  //   for (const key in container) {
  //     if (key in newState) {
  //       container[key].value = newState[key];
  //     }
  //   }
  // };
  //
  // container.notifyAll = () => {
  //   for (const key in container) {
  //     if ("notify" in container[key]) {
  //       console.log(`${container[key].name} has notify.`);
  //       container[key].notify();
  //     }
  //   }
  // };
}

function bindInput(input, observable) {
  input.value = observable.value;

  if (observable.subscriberCount() === 0) {
    observable.subscribe(() => (input.value = observable.value));
  }

  input.addEventListener("keyup", () => {
    observable.value = input.value;
  });
}

function bindSelect(input, observable) {
  input.selectedIndex = observable.value;

  if (observable.subscriberCount() === 0) {
    observable.subscribe(() => {
      console.log(
        `observable for ${observable.name} changed to '${observable.value}'`,
      );
      input.selectedIndex = observable.value;
    });
  }

  input.addEventListener("change", (e) => {
    observable.value = e.target.selectedIndex;
  });
}

function bindNode(node, observable) {
  node.innerText = observable.value;
  observable.subscribe(() => (node.innerText = observable.value));
}

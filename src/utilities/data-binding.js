/**
 * Class to create an observable variable that notifies listeners on change.
 * @class Binding
 */
export class Binding {
  constructor(value, selectedIndex = 0) {
    this._listeners = [];
    this._value = value;
    this._selectedIndex = selectedIndex;
  }

  notify() {
    this._listeners.forEach((listener) =>
      listener(this._value, this._selectedIndex),
    );
  }

  subscribe(listener) {
    this._listeners.push(listener);
  }

  clear(newValue = "", newSelectedIndex = 0) {
    this._value = newValue;
    this._selectedIndex = newSelectedIndex;
    this.notify();
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

  get selectedIndex() {
    return this._selectedIndex;
  }

  set selectedIndex(newIndex) {
    if (newIndex !== this._selectedIndex) {
      this._selectedIndex = newIndex;
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
}

function bindInput(input, observable) {
  input.value = observable.value;
  observable.subscribe(() => (input.value = observable.value));
  input.addEventListener("keyup", () => {
    observable.value = input.value;
  });
}

function bindSelect(input, observable) {
  input.selectedIndex = observable.selectedIndex;
  observable.subscribe(() => () => {
    input.selectedIndex = observable.selectedIndex;
  });
  input.addEventListener("change", () => {
    observable.selectedIndex = input.selectedIndex;
    observable.value = input.options[input.selectedIndex].value;
  });
}

function bindNode(node, observable) {
  node.innerText = observable.value;
  observable.subscribe(() => (node.innerText = observable.value));
}

export default class MultiSelect extends HTMLElement {
  constructor() {
    super();

    this._formSelector = this.getAttribute("form-selector");
    this._fieldName = this.getAttribute("field-name");
    this._outerWidth = this.getAttribute("outer-width") || "50%";
    this._outerStyle = this.getAttribute("outer-style") || "";
    this._popupWidth = this.getAttribute("popup-width") || "49%";

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      .multi-select-outer {
        display: flex;
        align-items: center;
        min-width: 5rem;
        width: ${this._outerWidth};
      }

      .multi-select {
        width: 100%;
        height: 2.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem 0 0 0.25rem;
        display: flex;
        flex-wrap: nowrap;
        overflow: auto;
        gap: 0.5rem;
      }

      button.trigger-down {
        border: 1px solid black;
        background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 16 16'%3e%3cg fill='%23fff'%3e%3cpath d='m4.464 6.05-.707.707L8 11l4.243-4.243-.707-.707L8 9.586z'/%3e%3c/g%3e%3c/svg%3e");
        background-color: black;
        width: 2.5rem;
        height: 2.5rem;
        margin-left: auto;
        border-radius: 0 0.25rem 0.25rem 0;
      }

      .multi-select-container {
        border: 1px solid #ccc;
	      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        background-color: white;
        position: absolute;
        z-index: 99;
        width: ${this._popupWidth};
        padding-top: 0.8rem;
      }

      .multi-select-container a {
        margin: 0.8rem;
      }

      .multi-select-container-hidden {
        display: none !important;
      }

      .tag {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
        background-color: #f5f5f5;
        color: #333;
        padding: 0.5rem;
        border-radius: 0.25rem;
        flex: 0 0 auto;
      }

      .tag-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        background-color: currentColor;
        -webkit-mask: no-repeat center / 100%;
        mask: no-repeat center / 100%;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
      }

      .tag-icon-close {
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'/%3E%3C/svg%3E");
      }
    `);

    this._root = this.attachShadow({ mode: "open" });

    const markup = `
    <div class="multi-select-outer" style="${this._outerStyle}">
      <div class="multi-select"></div>
      <button class="trigger trigger-down"></button>
    </div>
    <div class="multi-select-container multi-select-container-hidden">
    <a href="javascript:void">Select all</a>
      <slot name="items"></slot>
    </div>
    `;

    this._root.adoptedStyleSheets = [sheet];
    this._root.innerHTML = markup;
  }

  connectedCallback() {
    const triggerEl = this._root.querySelector(".trigger");
    const multiSelectContainerEl = this._root.querySelector(
      ".multi-select-container",
    );

    triggerEl.addEventListener("click", this._togglePopup.bind(this));

    this._root
      .querySelector(".multi-select-container a")
      .addEventListener("click", this._toggleSelectAll.bind(this));

    /*
     * Close the dropdown if we click outside of the whole element
     */
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        multiSelectContainerEl.classList.add("multi-select-container-hidden");
      }
    });

    /*
     * If individual items are checked/unchecked, change the
     * selector anchor text between Select All and Clear All
     */
    const checkboxEls = this._getAllCheckboxEls();

    checkboxEls.forEach((el) => {
      el.addEventListener("click", this._onItemClick.bind(this));

      if (el.getAttribute("checked")) {
        el.checked = true;
      }
    });

    this._updateFormField();
    this._updateSelectorAnchor();
    this._updateSelectedList();
  }

  clear() {
    const checkboxEls = this._getAllCheckboxEls();

    checkboxEls.forEach((el) => (el.checked = false));
    this._setSelectorToSelectAll();
    this._updateFormField();
    this._updateSelectedList();
  }

  _togglePopup() {
    this._root
      .querySelector(".multi-select-container")
      .classList.toggle("multi-select-container-hidden");
  }

  _toggleSelectAll() {
    const selectorText = this._getSelectorText();
    const checkboxEls = this._getAllCheckboxEls();

    if (selectorText === "Select all") {
      checkboxEls.forEach((el) => (el.checked = true));
    } else {
      checkboxEls.forEach((el) => (el.checked = false));
    }

    this._updateFormField();
    this._updateSelectorAnchor();
    this._updateSelectedList();
  }

  _getAllCheckboxEls() {
    const slotEl = this._root.querySelector("slot[name=items]");
    const assignedEls = slotEl.assignedElements();
    const ulEl = assignedEls[0];
    const checkboxEls = ulEl.querySelectorAll("li label input");

    return checkboxEls;
  }

  _getCheckboxElByValue(value) {
    const slotEl = this._root.querySelector("slot[name=items]");
    const assignedEls = slotEl.assignedElements();
    const ulEl = assignedEls[0];
    const checkboxEl = ulEl.querySelector(`li label input[value="${value}"]`);
    return checkboxEl;
  }

  _setSelectorToSelectAll() {
    const anchorEl = this._root.querySelector(".multi-select-container a");
    anchorEl.innerText = "Select all";
  }

  _setSelectorToClearAll() {
    const anchorEl = this._root.querySelector(".multi-select-container a");
    anchorEl.innerText = "Clear all";
  }

  _getSelectorText() {
    const anchorEl = this._root.querySelector(".multi-select-container a");
    return anchorEl.innerText;
  }

  _onItemClick() {
    this._updateFormField();
    this._updateSelectedList();
    this._updateSelectorAnchor();
  }

  _updateFormField() {
    const formEl = document.querySelector(this._formSelector);
    const checkboxEls = this._getAllCheckboxEls();
    const checkedItems = Array.prototype.filter.call(
      checkboxEls,
      (el) => el.checked,
    );

    /*
     * Remove existing hidden fields
     */
    document
      .querySelectorAll(
        `input[type=hidden].multi-select-selected-${this._fieldName}`,
      )
      .forEach((el) => {
        el.remove();
      });

    /*
     * Create new hidden input fields for each selected item
     */
    checkedItems.forEach((el) => {
      const newHiddenEl = Object.assign(document.createElement("input"), {
        type: "hidden",
        name: this._fieldName,
        value: el.value,
        className: `multi-select-selected-${this._fieldName}`,
      });

      formEl.appendChild(newHiddenEl);
    });
  }

  _updateSelectedList() {
    const checkboxEls = this._getAllCheckboxEls();
    const checkedItems = Array.prototype.filter.call(
      checkboxEls,
      (el) => el.checked,
    );

    /*
     * Remove existing tags
     */
    this._root
      .querySelectorAll(`div.multi-select > div.tag`)
      .forEach((el) => el.remove());

    /*
     * Create tag nodes
     */
    checkedItems.forEach((el) => {
      const newTag = this._createTag(el.parentNode.innerText.trim(), el.value);
      this._root.querySelector(`div.multi-select`).appendChild(newTag);
    });
  }

  _updateSelectorAnchor() {
    const checkboxEls = this._getAllCheckboxEls();
    const checkedItems = Array.prototype.filter.call(
      checkboxEls,
      (el) => el.checked,
    );

    if (checkedItems.length === 0) {
      this._setSelectorToSelectAll();
    } else {
      this._setSelectorToClearAll();
    }
  }

  _createTag(text, value) {
    console.log(`creatig tag named "${text}" with a value of ${value}`);
    const tagEl = Object.assign(document.createElement("div"), {
      className: "tag",
      textContent: text,
    });

    tagEl.dataset.value = value;

    const removeEl = Object.assign(document.createElement("i"), {
      className: "tag-icon tag-icon-close",
    });

    removeEl.addEventListener("click", (e) => {
      e.stopPropagation();
      this._removeTag(value);
    });

    tagEl.appendChild(removeEl);

    return tagEl;
  }

  _removeTag(value) {
    this._root
      .querySelector(`div.multi-select div[data-value="${value}"]`)
      .remove();

    const el = this._getCheckboxElByValue(value);

    el.checked = false;
    this._updateFormField();
    this._updateSelectorAnchor();
  }
}

if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect);
}

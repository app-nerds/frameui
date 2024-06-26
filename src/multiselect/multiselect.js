export default class MultiSelect extends HTMLElement {
  constructor() {
    super();

    const markup = `
    <div class="multi-select">
      <div class="trigger"></div>
      <div class="container hidden">
        <ul>
          <li data-id="1">First</li>
          <li data-id="2">Second</li>
          <li data-id="3">Third</li>
        </ul>
      <div>
    </div>
    `;

    this.innerHTML = markup;
  }

  connectedCallback() { }
}

if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect);
}

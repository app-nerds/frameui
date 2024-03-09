/**
 * TagCloud is a web component that displays a list of tags.
 *
 * Styling is provided by autocomplete.css. It relies on variables:
 *   - --tagcloud-background-color
 *   - --tagcloud-text-color
 *
 * Usage example:
 *    <tag-cloud id="tagCloud"></tag-cloud>
 *
 *    <script>
 *       const tagCloud = document.getElementById("tagCloud");
 *
 *       tagCloud.addTags([
 *          { id: 1, label: "JavaScript", data: { id: 1, name: "JavaScript" } },
 *       ]);
 *
 *       tagCloud.addEventListener("tag-click", (e) => {
 *          console.log(e.detail.label);
 *          console.log(e.detail.data);
 *       };
 *
 *       tagCloud.addEventListener("tag-remove", (e) => {
 *          console.log(`Removed tag: ${e.detail.label}, ${e.detail.data}`);
 *       });
 *
 *       tagCloud.addEventListener("tag-add", (e) => {
 *          console.log(`Added tag: ${e.detail.label}, ${e.detail.data}`);
 *       });
 *
 *    </script>
 *
 * @class TagCloud
 * @extends HTMLElement
 */
export class TagCloud extends HTMLElement {
	constructor() {
		super();

      this._tags = [];

      this._container = document.createElement("div");
      this._container.classList.add("tag-cloud-container");
	}

	connectedCallback() {
      this._render();
      this.appendChild(this._container);
   }

   addTags(tags) {
      // Only add unique tags
      tags.forEach((tag) => {
         if (!this._tags.find((t) => t.id === tag.id)) {
            this._tags.push(tag);
         }
      });

      this._render();
   }

   _render() {
      this._container.innerHTML = "";

      this._tags.forEach((tag) => {
         this._container.appendChild(this._renderTag(tag));
      });
   }

   _renderTag(tag) {
      const tagEl = document.createElement("div");
      tagEl.classList.add("tag-cloud-tag");
      tagEl.textContent = tag.label;
      tagEl.addEventListener("click", () => {
         this.dispatchEvent(new CustomEvent("tag-click", {
            detail: tag,
         }));
      });

      const removeEl = document.createElement("i");
      removeEl.classList.add("tag-cloud-icon");
      removeEl.classList.add("tag-cloud-icon-close");
      removeEl.addEventListener("click", (e) => {
         e.stopPropagation();
         this._removeTag(tag);
      });
      tagEl.appendChild(removeEl);

      return tagEl;
   }

   _removeTag(tag) {
      this._tags = this._tags.filter((t) => t.id !== tag.id);
      this._render();
      this.dispatchEvent(new CustomEvent("tag-remove", {
         detail: tag,
      }));
   }
}

if (!customElements.get("tag-cloud")) {
	customElements.define("tag-cloud", TagCloud);
}


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
    _tags: any[];
    _container: HTMLDivElement;
    connectedCallback(): void;
    addTags(tags: any): void;
    _render(): void;
    _renderTag(tag: any): HTMLDivElement;
    _removeTag(tag: any): void;
}

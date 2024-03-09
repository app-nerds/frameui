/**
 * AutoComplete is a Web Component that provides a list of suggestions based on user input.
 *
 * Styling is provided by autocomplete.css. It relies on variables:
 *   - --autocomplete-background-color
 *   - --autocomplete-border-color
 *   - --autocomplete-border-radius
 *   - --autocomplete-item-hover-background-color
 *   - --autocomplete-item-hover-color
 *   - --autocomplete-max-width
 *   - --autocomplete-max-height
 *
 * Attributes:
 *   - id: The id of the element
 *   - name: The name of the element
 *   - placeholder: The placeholder text for the input field
 *   - label: The label for the input field
 *   - multiple: Whether or not the input should accept multiple values. true or false
 *   - submission-style: How the values should be submitted. Options are "delimited",
 *       "json", "multiple". Only applicable with "multiple" is true
 *   - "delimited" will submit the values as a comma-separated list in a hidden field
 *       named by "name"
 *   - "json" will submit the values as a JSON array in a hidden field named by "name"
 *   - "multiple" will submit the values as multiple hidden fields named by "name<N>".
 *       Each hidden field's name will be suffixed with an incrementing number.
 *   - delimiter: The delimiter to use when submission-style is "delimited". Only
 *       applicable with "multiple" is true and the submission style is set to "delimited"
 *   - debouce: The number of milliseconds to wait before calling the options function
 *       when the user types in the input field
 *
 * Usage example:
 *    <auto-complete id="autoComplete" name="country" placeholder="Search for a country" label="Country" multiple="true" submission-style="delimited" delimiter=","></auto-complete>
 *
 *    <script>
 *       const autoComplete = document.getElementById("autoComplete");
 *
 *       autoComplete.addEventListener("select", (e) => {
 *          console.log(e.detail);
 *       });
 *
 *       autoComplete.options = [
 *          { value: "US", label: "United States", data: { id: 1, name: "United States", code: "US" } },
 *       ];
 *
 *       // OR
 *
 *       autoComplete.options = async (searchTerm) => {
 *          const response = await fetch(`https://restcountries.eu/rest/v2/name/${searchTerm}`);
 *          const data = await response.json();
 *
 *          return data.map((country) => {
 *             return {
 *                value: country.code,
 *                label: country.name,
 *                data: country,
 *             };
 *          };
 *       };
 *
 *    </script>
 *
 * @class AutoComplete
 * @extends HTMLElement
 */
export class AutoComplete extends HTMLElement {
    _options: any[];
    _isVisible: boolean;
    _placeholder: string;
    _label: string;
    _name: string;
    _multiple: boolean;
    _submissionStyle: string;
    _delimiter: string;
    _debounce: number;
    _textFieldID: string;
    _textField: HTMLInputElement;
    _hiddenFields: any[];
    _optionsContainer: HTMLUListElement;
    _tagCloud: TagCloud;
    _foundOptions: any[];
    _highlightOption: number;
    connectedCallback(): void;
    set onChange(fn: any);
    get onChange(): any;
    _onChange: any;
    set options(value: any[]);
    get options(): any[];
    /**
     * _appendValue is used when multiple is true. Here are the scenarios:
     *    - submission-style == "delimited": A single hidden field represents a
     *      delimited list of selections.
     *    - submission-style == "json": The selections are converted to a JSON array
     *    - submission-style == "multiple": Multiple hidden inputs are maintained
     */
    _appendValue(data: any): void;
    /**
     * Create the components for the AutoComplete. This creates the label, text field, hidden field, and options container.
     */
    _createComponents(): void;
    /**
     * Hide the options container
     */
    _hide(): void;
    _highlightNextOption(): void;
    _highlightPreviousOption(): void;
    /**
     * Called when the user navigates using up and down arrow keypresses.
     * This function will essentially highlight the next or previous option
     * allowing the user to press Enter to select.
     */
    _onNavigation(e: any): void;
    /**
     * Event handler for when a user clicks to remove a selection (tag). This will
     * adjust the hidden field(s) to remove the selected item.
     */
    _onRemoveSelection(e: any): void;
    /**
    * When an option is selected, we want to set the value of the text field and hidden field(s).
    * If this control is set to multiple, the style and delimiters will dictate how hidden fields
    * are populated and created.
    */
    _onSelectOption(data: any): void;
    /**
     * When the text field input event is triggered, we want to search the options and display them in the options container.
     * @param {Event} e
     */
    _onTextFieldInput(e: Event): Promise<void>;
    _removeBlankEntries(values: any): any;
    /**
     * Render the options in the options container.
     */
    _renderOptions(): void;
    /**
     * Search the options based on the search term. If the options are a function, call the function and pass the search term.
     * If the options are an array, filter the array based on the search term. The result MUST be in the format of
     *    { "value": "value here", "label": "this is displayed", "data": { "this": "is optional" } }
     * @param {String} searchTerm
     * @returns {Promise<Array>}
     */
    _searchOptions(searchTerm: string): Promise<any[]>;
    /**
     * _setValue is only used when multiple is false. It is designed for single
     * selection.
     */
    _setValue(data: any): void;
    /**
     * Show the the options container. It's position is based on the position of the text field
     * and is adjusted based on if the window goes past the browser window's rectangle.
     */
    _trigger(): void;
}
import { TagCloud } from "../tagcloud/tagcloud.js";

import { debounce } from "../utilities/debounce.js";
import { TagCloud } from "../tagcloud/tagcloud.js";

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
	constructor() {
		super();

      this._options = [];
      this._isVisible = false;

      // Attributes
      this._placeholder = this.getAttribute("placeholder") || "";
      this._label = this.getAttribute("label");
      this._name = this.getAttribute("name") || "autocomplete";
      this._multiple = this.getAttribute("multiple") === "true" ? true : false;
      this._submissionStyle = this.getAttribute("submission-style") || "delimited";
      this._delimiter = this.getAttribute("delimiter") || ",";
      this._debounce = this.getAttribute("debounce") ? parseInt(this.getAttribute("debounce")) : 300;

      /*
       * Elements
       */
      this._textFieldID = `autoCompleteTextField${Math.floor(Math.random() * 100000)}`;
      this._textField = null;                                                             /* The text field a user types in to search */
      this._hiddenFields = [];                                                            /* One or more hidden fields to hold selected values */
      this._optionsContainer = null;                                                      /* Element used to show found options*/
      this._tagCloud = null;                                                              /* Selected values when multiple is true */
      this._foundOptions = [];                                                            /* When a user searches, these are the options we find */
      this._highlightOption = -1;                                                         /* Index of the selected value if using the keyboard */

      this._createComponents();
	}

	connectedCallback() {
      this._textField.addEventListener("input", this._onTextFieldInput.bind(this));

      /*
       * Re-open the container if we click the trigger and there is text in the trigger box
       */
      this._textField.addEventListener("click", () => {
         if (this._textField.value) {
            this._onTextFieldInput({
               target: {
                  value: this._textField.value,
               },
            });
         }
      });

      /*
       * Close the container if we click outside of it or the trigger
       */
      document.addEventListener("click", (e) => {
         if (e.target !== this._textField && !this.contains(e.target)) {
            this._hide();
         }
      });
   }

   get onChange() {
      return this._onChange;
   }

   set onChange(fn) {
      this._onChange = fn;
   }

   get options() {
      return this._options;
   }

   set options(value) {
      this._options = value;
   }

   /**
    * _appendValue is used when multiple is true. Here are the scenarios:
    *    - submission-style == "delimited": A single hidden field represents a
    *      delimited list of selections.
    *    - submission-style == "json": The selections are converted to a JSON array
    *    - submission-style == "multiple": Multiple hidden inputs are maintained
    */
   _appendValue(data) {
      console.log(`appending new selection: `, data);
      this._tagCloud.addTags([
         {
            id: data.value,
            label: data.label,
            data: data.data,
         },
      ]);

      /*
       * If multiple style, add another hidden element.
       */
      if (this._submissionStyle === "multiple") {
         const newHiddenField = document.createElement("hidden");
         newHiddenField.type = "hidden";
         newHiddenField.name = `${this._name}${this._hiddenFields.length+1}`;
         newHiddenField.value = data.value;

         this._hiddenFields.push(newHiddenField);
         this.appendChild(newHiddenField);
         return;
      }

      /*
       * If we are using delimited style, pull the value, push a new one
       * in, and join it together with the specified delimiter.
       */
      if (this._submissionStyle === "delimited") {
         const currentValues = this._hiddenFields[0].value;
         const deconstructed = currentValues.split(this._delimiter);
         deconstructed.push(`${data.value}`);

         this._hiddenFields[0].value = this._removeBlankEntries(deconstructed).join(this._delimiter);
         return;
      }

      /*
       * JSON is similar. Pull the value out, deserialize it, add it,
       * and serialize it back.
       */
      if (this._submissionStyle === "json") {
      }
   }

   /**
    * Create the components for the AutoComplete. This creates the label, text field, hidden field, and options container.
    */
   _createComponents() {
      /*
       * Create a label if a label value is provided.
       */
      if (this._label) {
         const label = document.createElement("label");
         label.setAttribute("for", this._textFieldID);
         label.textContent = this._label;

         this.appendChild(label);
      }

      /*
       * Text field used to search for values.
       */
      this._textField = document.createElement("input");
      this._textField.type = "text";
      this._textField.id = this._textFieldID;
      this._textField.placeholder = this._placeholder;
      this._textField.autocomplete = "off";
      this._textField.addEventListener("keydown", this._onNavigation.bind(this));
      this._textField.style.marginBottom = "0.24rem";

      this.appendChild(this._textField);

      /*
       * Create hidden fields to store user selections. The rules are this:
       *    - If multiple is true, and submission-style is multiple, we'll 
       *      create many hidden inputs. In this scenario, hidden fields are
       *      added during selection.
       *    - All other cases create a single hidden input field which is
       *      created right away.
       */
      if (!this._multiple || (this._multiple && this._submissionStyle !== "multiple")) {
         const newHiddenField = document.createElement("input");
         newHiddenField.type = "hidden";
         newHiddenField.name = this._name;

         this._hiddenFields.push(newHiddenField);
         this.appendChild(newHiddenField);
      }

      /*
       * If we are selecting multiple, we will display a tag cloud 
       * beneath our control.
       */
      if (this._multiple) {
         // this._tagCloud = document.createElement("<tag-cloud>");
         this._tagCloud = new TagCloud();
         this._tagCloud.addEventListener("tag-remove", this._onRemoveSelection.bind(this));  

         this.appendChild(this._tagCloud);
      }

      /*
       * The options container
       */
      this._optionsContainer = document.createElement("ul");
      this._optionsContainer.classList.add("autocomplete-options-container");
      this._optionsContainer.classList.add("autocomplete-options-hidden");

      this.appendChild(this._optionsContainer);
   }

   /**
    * Hide the options container
    */
   _hide() {
      this._isVisible = false;
      this._optionsContainer.classList.add("autocomplete-options-hidden");
   }

   _highlightNextOption() {
      if (this._foundOptions.length === 0) {
         this._highlightOption = -1;
         return;
      }

      this._highlightOption++;

      if (this._highlightOption >= this._foundOptions.length) {
         this._highlightOption = 0;
      }
   }

   _highlightPreviousOption() {
      if (this._foundOptions.length === 0) {
         this._highlightOption = -1;
         return;
      }

      this._highlightOption--;

      if (this._highlightOption < 0) {
         this._highlightOption = this._foundOptions.length - 1;
      }
   }

   /**
    * Called when the user navigates using up and down arrow keypresses. 
    * This function will essentially highlight the next or previous option
    * allowing the user to press Enter to select.
    */
   _onNavigation(e) {
      console.group(`_onNavigation`);
      console.log(`in keydown: `, e);
      if (!this._isVisible) {
         console.log(`returning because we aren't visible`);
         console.groupEnd();
         return;
      }

      if (e.key === "ArrowDown") {
         console.log(`arrow down`);
         e.preventDefault();
         this._highlightNextOption();

         this._renderOptions();
         console.groupEnd();
         return
      } 

      if (e.key === "ArrowUp") {
         e.preventDefault();
         this._highlightPreviousOption();

         this._renderOptions();
         return;
      } 

      if (e.key === "Enter") {
         e.preventDefault();
         this._selectHighlightedOption();
      }
   }

   /** 
    * Event handler for when a user clicks to remove a selection (tag). This will
    * adjust the hidden field(s) to remove the selected item.
    */
   _onRemoveSelection(e) {
      console.log(`removing ${e.detail.label}`);
   }

   /**
   * When an option is selected, we want to set the value of the text field and hidden field(s).
   * If this control is set to multiple, the style and delimiters will dictate how hidden fields
   * are populated and created.
   */
   _onSelectOption(data) {
      if (this._multiple) {
         this._appendValue(data);
      } else {
         this._setValue(data);
      }

      this._hide();
   }

   /**
    * When the text field input event is triggered, we want to search the options and display them in the options container.
    * @param {Event} e 
    */
   async _onTextFieldInput(e) {
      if (e.target.value === "") {
         this._hide();
         return;
      }

      this._foundOptions = await this._searchOptions(e.target.value);

      if (this._foundOptions.length === 0) {
         if (this._isVisible) {
            this._hide();
         }

         return;
      }

      this._renderOptions();
      this._trigger();
   }

   _removeBlankEntries(values) {
      return values.filter(v => !!v && v !== "");
   }

   /**
    * Render the options in the options container.
    */
   _renderOptions() {
      this._optionsContainer.innerHTML = "";

      this._foundOptions.forEach((option, index) => {
         const optionEl = document.createElement("li");
         optionEl.classList.add("autocomplete-option");
         optionEl.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            this._onSelectOption(option) 
         });
         
         const a = document.createElement("a");
         a.textContent = option.label;
         a.href = "javascript:void(0)";
         a.dataset.id = option.value;

         if (option.data) {
            a.dataset.data = JSON.stringify(option.data);
         }

         /*
         * If the user has navigated using the keyboard, _highlightOption will be set to the 
         * index of the option. Add a class for it. Moving the mouse will remove the class.
         */
         if (this._highlightOption === index) {
            a.classList.add("hover");
         }

         a.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            this._onSelectOption(option) 
         });

         optionEl.appendChild(a);

         /*
          * When the mouse over the container, remove any anchors with a hover class.
          */
         optionEl.addEventListener("mouseover", () => {
            this._optionsContainer.querySelectorAll("a").forEach((anchor) => {
               anchor.classList.remove("hover");
            });
         });

         this._optionsContainer.appendChild(optionEl);
      });
   }

   /**
    * Search the options based on the search term. If the options are a function, call the function and pass the search term.
    * If the options are an array, filter the array based on the search term. The result MUST be in the format of
    *    { "value": "value here", "label": "this is displayed", "data": { "this": "is optional" } }
    * @param {String} searchTerm 
    * @returns {Promise<Array>}
    */
   async _searchOptions(searchTerm) {
      return new Promise((resolve) => {
         if (typeof this._options === "function") {
            debounce(async () => {
               const result = await this._options(searchTerm);
               resolve(result);
            }, this._debounce);

            return;
         }

         /*
          * If this is not a function, it's an array. Filter the array based on the search term
          */
         const result = this._options.filter((option) => {
            return option.label.toLowerCase().includes(searchTerm.toLowerCase());
         });

         resolve(result);
      });
   }

   /**
    * _setValue is only used when multiple is false. It is designed for single
    * selection.
    */
   _setValue(data) {
      this._textField.value = data.label;
      this._hiddenFields[0].value = data.value;

      this.dispatchEvent(new CustomEvent("select", {
         detail: data,
      }));
   }

   /**
    * Show the the options container. It's position is based on the position of the text field
    * and is adjusted based on if the window goes past the browser window's rectangle.
    */
   _trigger() {
		let triggerRect = document
			.getElementById(this._textFieldID)
			.getBoundingClientRect();

      let containerRect = this._optionsContainer.getBoundingClientRect();
		let buffer = 3;

		let left = triggerRect.left;
      this._optionsContainer.style.left = `${left}px`;

		if (left + containerRect.width > window.innerWidth) {
         left = window.innerWidth - containerRect.width - buffer;
         this._optionsContainer.style.left = `${left}px`;
		}

      let top = triggerRect.y + triggerRect.height + buffer;
		this._optionsContainer.style.top = `${top}px`;

      if (top + containerRect.height > window.innerHeight) {
         top = triggerRect.y - containerRect.height - buffer;
         this._optionsContainer.style.top = `${top}px`;
      }

		this._isVisible = true;
		this._optionsContainer.classList.remove("autocomplete-options-hidden");
   }

}

if (!customElements.get("auto-complete")) {
	customElements.define("auto-complete", AutoComplete);
}

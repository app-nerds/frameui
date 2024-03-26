import { fetcher } from "../http/fetcher.js";

/**
 * AjaxTable
 *
 * Usage:
 *
 *   // Simple
 *   <ajax-table 
 *     id="myTable" 
 *     fetch-on-load="true"
 *     url="/api/contacts"
 *   >
 *     <table>
 *       <thead>
 *         <tr>
 *           <th data-key="name">Name</th>
 *           <th data-key="email">Email</th>
 *         </tr>
 *       </thead>
 *     </table>
 *   </ajax-table>
 *
 *   // Complex
 *   <ajax-table id="myTable" fetch-on-load="true">
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Column 1</th>
 *           <th>Column 2</th>
 *         </tr>
 *       </thead>
 *       <tbody></tbody>
 *     </table>
 *   </ajax-table>
 *
 *   <script>
 *     const t = document.querySelector("#myTable");
 *
 *     t.columnMapping = [
 *       "key1",
 *       (record, index) => {
 *         return `Key 2 is ${record.key2}`;
 *       },
 *     ];
 *
 *     t.fetcher = async () => {
 *       const options = {
 *         method: "GET",
 *         headers: {
 *           "Content-Type": "application/json",
 *         },
 *       };
 *
 *       const response = await fetch(`/api/getdata`, options);
 *       const json = await response.json();
 *       return json;
 *     };
 *     
 *     t.addEventListener("before-fetch", () => {
 *       console.log("before fetch");
 *     });
 *
 *     t.addEventListener("after-fetch", (e) => {
 *       console.log(`after fetch: `, e.detail);
 *     });
 *
 *     // you can refresh data by calling reload
 *     t.reload();
 *
 *   </script>
 */
export class AjaxTable extends HTMLElement {
   constructor() {
      super();

      this._data = [];
      this._totalCount = 0;
      this._page = 0;

      /*
       * Elements
       */
      this._tbody = null;
      this._previousButtonEl = null;
      this._pageInfoEl = null;
      this._nextButtonEl = null;

      /*
       * Attributes
       */
      this._fetchOnLoad = (this.getAttribute("fetch-on-load") === "false") ? false : true;
      this._url = this.getAttribute("url");
      this._recordsKey = this.getAttribute("records-key");
      this._totalCountKey = this.getAttribute("total-count-key");
      this._groupKey = this.getAttribute("group-key");
      this._pageKey = this.getAttribute("page-key");
      this._pageSize = (this.getAttribute("page-size")) ? parseInt(this.getAttribute("page-size")) : 10;
      this._previousButton = this.getAttribute("previous-button");
      this._pageInfo = this.getAttribute("page-info");
      this._nextButton = this.getAttribute("next-button");

      /*
       * Settings
       */
      this._fetcher = null;
      this._columnMapping = [];
      this._noPagesText = "No pages";
      this._groupRenderer = null;
   }

   /***********************************************************
    * Getters and setters
    **********************************************************/
   get fetcher() {
      return this._fetcher;
   }

   set fetcher(value) {
      if (typeof value !== "function") {
         throw new Error("'fetcher' must be a function");
      }

      this._fetcher = value;

      if (this._fetchOnLoad) {
         this._fetch();
      }
   }

   get columnMapping() {
      return this._columnMapping;
   }

   set columnMapping(value) {
      this._columnMapping = value;
   }

   get data() {
      return this._data;
   }

   set data(value) {
      this._data = value;
      this._fetch();
   }

   get groupRenderer() {
      return this._groupRenderer;
   }

   set groupRenderer(value) {
      if (typeof value !== "function") {
         throw new Error("'groupRenderer' must be a function");
      }

      this._groupRenderer = value;
   }

   get page() {
      return this._page;
   }

   set page(value) {
      this._page = value;
      this._fetch();
   }

   /***********************************************************
    * Public methods
    **********************************************************/
   reload() {
      this._page = 1;
      this._fetch();
   }

   setColumnMapping(index, mapping) {
      this._columnMapping[index] = mapping;
   }

   /***********************************************************
    * Private methods
    **********************************************************/
   connectedCallback() {
      if (!this.querySelector("table")) {
         throw new Error("You must provide a table element inside of this control");
      }

      this._tbody = this.querySelector("table").querySelector("tbody");

      if (!this._tbody) {
         throw new Error("You must provide a tbody element inside of the table");
      }

      /*
       * If the user has provided paging configuration, ensure they 
       * have paging elements.
       */
      if (this._usePagingInfo()) {
         this._previousButtonEl = this.querySelector(this._previousButton);
         this._nextButtonEl = this.querySelector(this._nextButton);
         this._pageInfoEl = this.querySelector(this._pageInfo);

         if (!this._previousButtonEl || !this._nextButtonEl || !this._pageInfoEl) {
            throw new Error("You must provide previousButton, nextButton, and pageInfo elements when paging keys are provided");
         }

         this._noPagesText = this._pageInfoEl.innerHTML;
         this._previousButtonEl.addEventListener("click", this._goToPreviousPage.bind(this));
         this._nextButtonEl.addEventListener("click", this._goToNextPage.bind(this));
      }

      /*
       * Build first part of column mapping from the markup. We
       * are looking for "key" data items in the header. Any header
       * column with out a key will need to be provided by calling
       * setColumnMapping().
       */
      const thEls = this.querySelectorAll("table thead th");
      let thIndex = -1

      thEls.forEach((el) => {
         thIndex++;

         // Skip the first column if we are grouping.
         if (thIndex === 0 && this._groupKey) {
            return;
         }

         const key = el.dataset.key;

         if (!key) {
            this._columnMapping.push(null);
            return;
         }

         this._columnMapping.push(key);
      });

      /*
       * If we have a URL and fetch on load is true, call the fetch function.
       * If a fetcher was already provided, it will be called by virtue
       * of setting the fetcher function.
       */
      if (this._url && this._fetchOnLoad) {
         this._fetch();
      }
   }

   /*
    * Fetches data and re-renders the body. It will dispatch events
    * before and after the fetch.
    */
   async _fetch() {
      if (!this._columnMapping || !this._columnMapping.length) {
         throw new Error("You must provide a columnMapping");
      }

      this.dispatchEvent(new CustomEvent("before-fetch", {}));
      await this._getDataAndPagingInfo();

      this._renderTable();
      this.dispatchEvent(new CustomEvent("after-fetch", { detail: this._data }));
   }

   async _getDataAndPagingInfo() {
      let result = {};

      if (this._url) {
         result = await this._getDataFromURL();
      } else if (this._fetcher) {
         result = await this._fetcher(this._page || 1);
      }

      if (this._recordsKey in result) {
         this._data = result[this._recordsKey];
      }

      if (this._usePagingInfo() && this._responseHasPagingInfo(result)) {
         this._page = result[this._pageKey];
      }

      if (this._totalCountKey in result) {
         this._totalCount = result[this._totalCountKey];
      }
   }

   async _getDataFromURL() {
      const page = this._page || 1;

      const options = {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      };

      const response = await fetcher(`${this._url}?page=${page}`, options);
      const result = await response.json();
      return result;
   }

   /*
    * Draws table rows and columns from fetched data.
    */
   _renderTable() {
      let currentGroup = {value: "", records: []};
      let data = [];

      this._tbody.innerHTML = "";

      /*
       * First, assemble the data locally. If we are using a group key, this
       * means we are grouping things by a key value. If not, we are just
       * rendering straight rows without rowspans.
       */
      if (!this._groupKey) {
         this._data.forEach(record => {
            const tr = document.createElement("tr");
               
            this._columnMapping.forEach((columnMapping, index) => {
               const td = this._renderColumn(columnMapping, record, index);
               tr.appendChild(td);
            });

            this._tbody.appendChild(tr);
         });
      } else {
         this._data.forEach(record => {
            const groupValue = record[this._groupKey];

            if (groupValue !== currentGroup.value) {
               if (currentGroup.records.length > 0) {
                  data.push(currentGroup);
               }

               currentGroup = {records: [], value: groupValue};
            }

            currentGroup.records.push(record);
         });

         if (currentGroup.records.length > 0) {
            data.push(currentGroup);
         }

         data.forEach(group => {
            let first = true;

            group.records.forEach(record => {
               const tr = document.createElement("tr");

               if (first) {
                  first = false;

                  const groupCol = Object.assign(document.createElement("td"), {
                     rowSpan: group.records.length,
                     innerHTML: (this._groupRenderer) ? this.groupRenderer(record, this._groupKey) : record[this._groupKey],
                     classList: ["has-row-span"],
                  });

                  tr.appendChild(groupCol);
               }

               this._columnMapping.forEach((columnMapping, index) => {
                  const td = this._renderColumn(columnMapping, record, index);
                  tr.appendChild(td);
               });

               this._tbody.appendChild(tr);
            });
         });
      }

      if (this._usePagingInfo()) {
         this._previousButtonEl.disabled = !this._hasPreviousPage();
         this._nextButtonEl.disabled = !this._hasNextPage();
      }

      if (this._usePagingInfo() && this._data.length <= 0) {
         this._pageInfoEl.innerHTML = this._noPagesText;
      } else if (this._usePagingInfo()) {
         this._pageInfoEl.innerHTML = `Page ${this._page} of ${this._calculateNumPages()}`;
      }
   }

   /*
    * Uses the column mapping to retrieve a specific key of data. If
    * the column mapping is a function, call it passing in the record.
    * A function should return either HTML string or an element.
    */
   _renderColumn(columnMapping, record, index) {
      let data = "";

      if (typeof columnMapping === "string") {
         data = record[columnMapping];
      } else if (typeof columnMapping === "function") {
         data = columnMapping(record, index);
      }

      const td = document.createElement("td");

      if (typeof data === "string") {
         td.innerHTML = data;
      } else if (typeof content === "object") {
         td.appendChild(data);
      } 

      return td;
   }

   _usePagingInfo() {
      return this._pageKey && this._totalCountKey;
   }

   _responseHasPagingInfo(response) {
      return (this._pageKey in response) && (this._totalCountKey in response);
   }

   _calculateNumPages() {
      return Math.ceil(this._totalCount / this._pageSize);
   }

   _hasNextPage() {
      return (this._page - 1) * this._pageSize + this._pageSize < this._totalCount;
   }

   _hasPreviousPage() {
      return this._page > 1;
   }

   _goToNextPage() {
      if (this._hasNextPage()) {
         this._page++;

         this.dispatchEvent(new CustomEvent("page-change", { detail: this._page }));
         this._fetch();
      }
   }

   _goToPreviousPage() {
      if (this._hasPreviousPage()) {
         this._page--;

         this.dispatchEvent(new CustomEvent("page-change", { detail: this._page }));
         this._fetch();
      }
   }
}

if (!customElements.get("ajax-table")) {
   customElements.define("ajax-table", AjaxTable);
}

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
    _data: any[];
    _totalCount: number;
    _page: number;
    _tbody: HTMLTableSectionElement;
    _previousButtonEl: Element;
    _pageInfoEl: Element;
    _nextButtonEl: Element;
    _fetchOnLoad: boolean;
    _url: string;
    _recordsKey: string;
    _totalCountKey: string;
    _groupKey: string;
    _pageKey: string;
    _pageSize: number;
    _previousButton: string;
    _pageInfo: string;
    _nextButton: string;
    _fetcher: any;
    _columnMapping: any[];
    _noPagesText: string;
    _groupRenderer: any;
    set fetcher(value: any);
    /***********************************************************
     * Getters and setters
     **********************************************************/
    get fetcher(): any;
    set columnMapping(value: any[]);
    get columnMapping(): any[];
    set data(value: any[]);
    get data(): any[];
    set groupRenderer(value: any);
    get groupRenderer(): any;
    set page(value: number);
    get page(): number;
    /***********************************************************
     * Public methods
     **********************************************************/
    reload(): void;
    setColumnMapping(index: any, mapping: any): void;
    /***********************************************************
     * Private methods
     **********************************************************/
    connectedCallback(): void;
    _fetch(): Promise<void>;
    _getDataAndPagingInfo(): Promise<void>;
    _getDataFromURL(): Promise<any>;
    _renderTable(): void;
    _renderColumn(columnMapping: any, record: any, index: any): HTMLTableCellElement;
    _usePagingInfo(): string;
    _responseHasPagingInfo(response: any): boolean;
    _calculateNumPages(): number;
    _hasNextPage(): boolean;
    _hasPreviousPage(): boolean;
    _goToNextPage(): void;
    _goToPreviousPage(): void;
}

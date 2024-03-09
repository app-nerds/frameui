# Ajax Table

The Ajax Table web component that adds the ability to decorate a regular
`<table>` element by fetching JSON data from a server-side endpoint to populate
table rows. It also provides the ability to page through results.

## 🚀 Getting Started

To start using this component simply include the script on your page, or as 
a module in your Javascript. Place an `<ajax-table>` component in your markup,
defining a URL and the object keys needed to get data from the fetched results.
Next add a table with a `<thead>` section, each `<th>` having a **data-key**
attribute to define which key in the resulting data objects has its data.

Here is a basic sample that fetches and displays contacts.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Base Example</title>
  <link rel="stylesheet" href="/static/base.min.css" />
  <link rel="stylesheet" href="/static/icons.min.css" />
  <link rel="stylesheet" href="/static/components.min.css" />
</head>

<body>
  <main>
    <ajax-table
      id="contactsTable"
      fetch-on-load="true"
      url="/api/contacts"
      records-key="contacts"
      total-count-key="totalCount"
      page-key="page"
      previous-button="#previous"
      page-info="#pageInfo"
      next-button="#next"
    >
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">First Name</th>
            <th style="width: 20%;" data-key="lastName">Last Name</th>
            <th style="width: 40%;" data-key="email">Email</th>
            <th style="width: 20%;" data-key="phone">Phone</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>

      <ul class="table-paging">
        <li>
          <button id="previousPage" alt="Previous page" title="Previous page">
            <i class="icon--mdi icon--mdi--skip-previous"></i>
          </button>
        </li>
        <li>
          <span id="pageInfo">No contacts</span>
        </li>
        <li>
          <button id="nextPage" alt="Next page" title="Next page">
            <i class="icon--mdi icon--mdi--skip-next"></i>
          </button>
        </li>
      </ul>
    </ajax-table>
  </main>

  <script type="module">
    import { AjaxTable } from "/static/js/ajax-table.js";

    const contactsTable = document.querySelector("#contactsTable");

    /*
     * This sets the mapping for the First Name column by using a function
     * to return the data. We can then do something special with the column's
     * rendering.
     */
    contactsTable.setColumnMapping(0, (record) => {
      return `<a href="#contactID=${record.id}">${record.firstName}</a>`;
    });
  </script>
</body>
</html>
```

### Sample of data 
Here is a sample of the data used to populate this table.

```json
{
  "contacts": [
    {
      "id": 1,
      "firstName": "Adam",
      "lastName": "Presley",
      "email": "adam@adampresley.com",
      "phone": "555-666-1234",
    },
    {
      "id": 2,
      "firstName": "Maryanne",
      "lastName": "Presley",
      "email": "test1@test.com",
      "phone": "555-666-1233",
    },
    {
      "id": 3,
      "firstName": "John",
      "lastName": "Doe",
      "email": "test2@test.com",
      "phone": "555-666-1232",
    },
    {
      "id": 4,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "test3@test.com",
      "phone": "555-666-1231",
    },
    {
      "id": 5,
      "firstName": "Bob",
      "lastName": "Smith",
      "email": "test4@test.com",
      "phone": "555-666-1230",
    },
  ],
  "totalCount": 10,
  "page": page
}
```

## Using a Custom Fetcher

If you need more control of how to fetch data for the table you can assign
a custom fetcher function to the table component. As an example, we'll take
the same table above, but remove the URL attribute and use a custom fetcher.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Base Example</title>
  <link rel="stylesheet" href="/static/base.min.css" />
  <link rel="stylesheet" href="/static/icons.min.css" />
  <link rel="stylesheet" href="/static/components.min.css" />
</head>

<body>
  <main>
    <ajax-table
      id="contactsTable"
      fetch-on-load="true"
      records-key="contacts"
      total-count-key="totalCount"
      page-key="page"
      previous-button="#previous"
      page-info="#pageInfo"
      next-button="#next"
    >
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">First Name</th>
            <th style="width: 20%;" data-key="lastName">Last Name</th>
            <th style="width: 40%;" data-key="email">Email</th>
            <th style="width: 20%;" data-key="phone">Phone</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>

      <ul class="table-paging">
        <li>
          <button id="previousPage" alt="Previous page" title="Previous page">
            <i class="icon--mdi icon--mdi--skip-previous"></i>
          </button>
        </li>
        <li>
          <span id="pageInfo">No contacts</span>
        </li>
        <li>
          <button id="nextPage" alt="Next page" title="Next page">
            <i class="icon--mdi icon--mdi--skip-next"></i>
          </button>
        </li>
      </ul>
    </ajax-table>
  </main>

  <script type="module">
    import { AjaxTable } from "/static/js/ajax-table.js";

    const contactsTable = document.querySelector("#contactsTable");

    /*
     * This sets the mapping for the First Name column by using a function
     * to return the data. We can then do something special with the column's
     * rendering.
     */
    contactsTable.setColumnMapping(0, (record) => {
      return `<a href="#contactID=${record.id}">${record.firstName}</a>`;
    });

    contactsTable.fetcher = async (page) => {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(`/api/contacts?page=${page}`, options);
      const data = await response.json();
      return data;
    };
  </script>
</body>
</html>
```


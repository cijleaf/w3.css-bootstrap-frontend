window.statusMapping = {
  "2": "Open",
  "3": "Pending",
  "4": "Resolved",
  "5": "Closed"
}

window.priorityMapping = {
  "1": "Low",
  "2": "Medium",
  "3": "High",
  "4": "Urgent"
}

/*
 * Shows the user a popup notification saying
 * an error occurred.
 * Disappears after 3 seconds.
 *
*/
function showApiError() {
  var snackbar = document.getElementById("snackbar");
  // set the text inside the snackbar
  snackbar.innerText = "An API call was not successful.";

  // show the snackbar
  snackbar.classList.add("show", "w3-orange");

  // hide the snackbar
  // note that the timeout correlates with the animation in snackbar.css
  setTimeout(function() {
    snackbar.className = snackbar.classList.remove("show");
    }, 4000);
}

/*
 * Shows the user a popup notification saying
 * an operation succeeded.
 * The text param is shown to the user.
 * Disappears after 3 seconds.
 *
*/
function showSuccessNote(text) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerText = text;

  // show the snackbar
  snackbar.classList.add("show", "w3-green");

  // hide the snackbar
  // note that the timeout correlates with the animation in snackbar.css
  setTimeout(function() {
    snackbar.className = snackbar.classList.remove("show");
    }, 4000);
}

/*
 * Serializes the Order form and sends
 * it to the web service.
*/
function createOrder() {
  // show loading spinner
  var submitBtn = document.getElementById("submit-order-btn");
  submitBtn.classList.add("loading");

  var pickup = getOrderPickupInfo();
  var dest = getOrderDestInfo();
  var rest = getOrderRestInfo();

  // put it all together
  var data = {
    "pickup": pickup,
    "destination": dest,
    "rest": rest
  };
  as_json = JSON.stringify(data);
  apiCreateOrder(as_json); // make request to web service
}

/*
 * Adds options to the Services dropdown
 * in the Order form.
 * The services parameter is a list of
 * available services.
*/
function setServices(services) {
  var dropdown = document.getElementById("servicesDropdown");
  for(i=0; i<services.length; i++) {
    var option = document.createElement("option");
    option.value = services[i];
    option.innerHTML = services[i];
    dropdown.appendChild(option);
  }
}

/*
 * Displays the OrderNumber from
 * the given data object for the user to see.
*/
function submitOrderSuccess(data) {
  // remove loading spinner
  var submitBtn = $("#submit-order-btn");
  submitBtn.removeClass("loading");

  // show order number
  var element = $("#order-number");
  var orderNumber = data["OrderNumber"]
  element.text("Order Number: " + orderNumber);
  element.removeClass("w3-hide");

  // show user notification
  var msg = "Order Number: " + orderNumber + ", also shown at top of page."
  showSuccessNote(msg);
}

/*
 * Adds the tickets in the given data
 * object to the portal.
*/
function addTickets(data) {
  var rows = "";

  // loop through the data and add a row for each item
  for (i in data) {
    row_html = returnTicketRowHTML(data[i]);
    rows += row_html;
  }

  // add the rows to the table
  $("#tickets-table thead").after(rows);

  // set up the accordions
  toggleTableAccordion();
}

/*
 * Accepts a string representing a date
 * and time, converts it to a Date object
 * and returns the locale date and time
 * as a string.
*/
function returnDateTimeString(dtString) {
    var date = new Date(dtString);
    var res = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    return res;
}

/*
 * Returns the HTML for a row
 * containing ticket data.
*/
function returnTicketRowHTML(item) {
    var statusText = statusMapping[item["status"]];
    var priorityText = priorityMapping[item["priority"]];
    var updatedText = returnDateTimeString(item["updated_at"]);
    var createdText = returnDateTimeString(item["created_at"]);
    var ticketUrl = config["freshdesk_url"] + "support/tickets/" + item["id"];

    var html = `
        <tbody>
          <tr class="table-accordion w3-hover-pale-green">
            <td>${item['subject']}</td>
            <td>${statusText}</td>
            <td>${priorityText}</td>
            <td>${item['type']}</td>
            <td>${updatedText}</td>
            <td>${createdText}</td>
          </tr>
          <tr class="w3-transparent">
            <td colspan="5">${item['description_text']}</td>
            <td colspan="1">
              <a href="${ticketUrl}" class="w3-button w3-block bg-color-prim w3-text-white" target="_blank">View Ticket</a>
            </td>
          </tr>
        </tbody>`;

    return html
}

/*
 * Expands/Collapses a table row.
 * This is done by showing/hiding the row's
 * next sibling row.
*/
function toggleTableAccordion() {
    var ticketsTable = $("#tickets-table");

    // hide the rows that are not accordions
    ticketsTable.find("tr")
                .not(":first")
                .not(".table-accordion")
                .hide();

    // register a click even on the accordions
    ticketsTable.find(".table-accordion")
                .click(function() {
                    $(this).nextUntil(".table-accordion")
                           .fadeToggle(250);
                });
}

/*
 * Populates options into the Pickup Date
 * and Pickup Time dropdowns in the Order Form.
*/
function loadPickupDateTimeOptions() {
    // populate dates 6 weeks into the future
    var dateSelect = $("#pickup-date-dropdown")[0];
    var today = new Date();

    for (i=0; i<43; i++) {

      var option = document.createElement("option");
      option.value = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();  // mm/dd/yyyy

      option.innerHTML = today.toDateString();
      dateSelect.appendChild(option);

      // increment day by 1
      today.setDate(today.getDate() + 1);
    }
}

/*
 * Sets the yellowfin iframe based on the
 * value in the config file.
*/
function setYellowfinIframeURL() {
    var iframe = $("#yf-iframe")[0];
    iframe.src = config["yellowfin_url"];
}

/*
 * Sets the default destination info in
 * the order form based on the
 * value in the config file.
*/
function setDefaultOrderDestination() {
  // set the values
  $("#dest_location").val(config["default_dest_location"]);
  $("#dest_address_field").val(config["default_dest_address"]);
  $("#dest_city_field").val(config["default_dest_city"]);
  $("#dest_zip_field").val(config["default_dest_zip"]);
  $("#dest_contact").val(config["default_dest_contact"]);
  $("#dest_contact_number").val(config["default_dest_number"]);
  $("#dest_notes").val(config["default_dest_notes"]);

  // disable the inputs
  $("#dest_location").prop("disabled", true);
  $("#dest_address_field").prop("disabled", true);
  $("#dest_city_field").prop("disabled", true);
  $("#dest_zip_field").prop("disabled", true);
  $("#dest_contact").prop("disabled", true);
  $("#dest_contact_number").prop("disabled", true);
  $("#dest_notes").prop("disabled", true);

  // make the edit button
  $("#editDestinationLink").text("Edit");
  $("#editDestinationLink").on("click", enableDestinationInputs);

}

/*
 * Enables the inputs on the destination
 * section of the Order Form.
 * Clears the values of the inputs.
*/
function enableDestinationInputs() {
  // clear out the values
  $("#dest_location").val("");
  $("#dest_address_field").val("");
  $("#dest_city_field").val("");
  $("#dest_zip_field").val("");

  // enable the inputs
  $("#dest_location").prop("disabled", false);
  $("#dest_address_field").prop("disabled", false);
  $("#dest_city_field").prop("disabled", false);
  $("#dest_zip_field").prop("disabled", false);
  $("#dest_contact").prop("disabled", false);
  $("#dest_contact_number").prop("disabled", false);
  $("#dest_notes").prop("disabled", false);

  // focus on destination location
  $("#dest_location").focus();

  // make the edit button a default button
  $("#editDestinationLink").text("Default");
  $("#editDestinationLink").on("click", setDefaultOrderDestination);
}

/*
 * Returns the pickup location data
 * from the order form.
*/
function getOrderPickupInfo() {
  var pickup = {};
  pickup["location"] = $("#pickup_location").val();
  pickup["address"] = $("#pickup_address_field").val();
  pickup["city"] = $("#pickup_city_field").val();
  pickup["zip"] = $("#pickup_zip_field").val();
  pickup["contact"] = $("#pickup_contact").val();
  pickup["contact_number"] = $("#pickup_contact_number").val();
  pickup["notes"] = $("#pickup_notes").val();

  return pickup
}

/*
 * Returns the destination location data
 * from the order form.
*/
function getOrderDestInfo() {
  var dest = {};
  dest["location"] = $("#dest_location").val();
  dest["address"] = $("#dest_address_field").val();
  dest["city"] = $("#dest_city_field").val();
  dest["zip"] = $("#dest_zip_field").val();
  dest["contact"] = $("#dest_contact").val();
  dest["contact_number"] = $("#dest_contact_number").val();
  dest["notes"] = $("#dest_notes").val();

  return dest;
}

/*
 * Returns the rest of the data
 * from the order form.
*/
function getOrderRestInfo() {
  var rest = {};
  rest["service_type"] = $("#servicesDropdown").val();
  rest["ready_date"] = $("#pickup-date-dropdown").val();
  rest["ready_time"] = $("#pickup-time-dropdown").val();
  rest["round_trip"] = $("#round-trip-checkbox").is(":checked");

  return rest;
}

/*
 * Clears the datalist used for
 * pickup and destination locations.
*/
function clearLocations() {
  // these are set in js/autocomplete.js
  window.locationsDatalist.innerHTML = "";
  window.locationsObjects = {};
}

/*
 * Clears the services available to the
 * customer in the order form.
*/
function clearServices() {
  $("#servicesDropdown")
    .children()
    .remove()
    .end()
    .append('<option disabled selected>Choose Service Type</option>');
}

/*
 * Clears the customer's tickets
 * from the table.
*/
function clearTickets() {
  $("#tickets-table:not(:first)").remove();
}

/*
 * Refreshes customer-specific data
 * such as locations, services, tickets.
 * Clears out old data and makes requests
 * for new data.
*/
function refreshCustomerData(data) {
  // clear data
  clearLocations();
  clearServices();
  clearTickets();

  // load new data
  loadCustomerNames(data);
  apiGetServices();
  apiListTickets();
}

/*
 * Sets the name of the active customer
 * to be shown on the customer dropdown
 * list and on the account page.
 * Param data contains the ID of the
 * active customer and a mapping of the
 * available customers and their IDs.
*/
function setActiveCustomerName(data) {
  // parse active customer name
  var activeId = data["active_id"];
  var name = data["customers"][activeId];

  // set active customer name in header
  var btn = $("#activeCustomerName");
  var innerHTML = '<span class="fa fa-user-circle"></span>&nbsp;&nbsp;';
  innerHTML += name;
  btn.html(innerHTML);

  // set active customer name on account page
  var span = $("#accountPageActiveCust");
  var innerHTML = "<b>" + name + "</b>";
  span.html(innerHTML);
}

/*
 * Sets the names of the rest of the
 * customers available to the user in
 * the customer dropdown list.
 * Clicking on a customer name changes
 * the active customer.
 * Param data contains the ID of the
 * active customer and a mapping of the
 * available customers and their IDs.
*/
function setRemainingCustomerNames(data) {
  setRemainingCustsInHeader(data);
  setRemainingCustsAccountPage(data);
}

/*
 * Populates the dropdown in the portal header.
*/
function setRemainingCustsInHeader(data) {
  // parse the customers
  var customers = data["customers"];

  // remove all items but the last one which
  // is the logout button
  var dropdownList = $("#customerNamesDropdown");
  dropdownList.children().not(":last").remove();

  // set new children
  for (var id in customers) {
    // create button that has a customer name
    // and function to call the API when clicked
    var item = $("<a></a>")
      .attr("onclick", "apiUpdateActiveCustomer(" + id + ");")
      .addClass("w3-bar-item w3-button w3-hover-indigo")
      .append(customers[id]);
    dropdownList.prepend(item);
  }
}

/*
 * Populates the dropdown on the account page.
*/
function setRemainingCustsAccountPage(data) {
  // parse the customers
  var customers = data["customers"];

  // clear existing customer names
  var dropdownList = $("#accountPageCustDropdown");
  dropdownList.children().remove();

  // set new customer names
  for (var id in customers) {
    // create button that has a customer name
    // and function to call the API when clicked
    var item = $("<a></a>")
      .attr("onclick", "apiUpdateActiveCustomer(" + id + ");")
      .addClass("w3-bar-item w3-button w3-hover-indigo")
      .append(customers[id]);
    dropdownList.append(item);
  }
}

/*
 * Shows the active customer in the site
 * header and account page.
 * Adjusts the dropdown to include the
 * other available customers.
*/
function loadCustomerNames(data) {
  setActiveCustomerName(data);
  setRemainingCustomerNames(data);
}

/*
 * Filters the tickets table on all
 * columns, based on user input.
*/
function filterTicketsTable() {
  // select all rows minus the header
  var rows = $("#tickets-table tbody");
  var input = $("#filter-input").val().toLowerCase();

  // filter
  rows.filter(function() {
    var isMatch = ($(this).text()
                          .toLowerCase()
                          .indexOf(input) > -1);
    $(this).toggle(isMatch);
  });
}

/*
 * Refreshes user-specific data
 * such as email.
*/
function refreshUserinfo(data) {
  var email = data["email"];
  var html = "<b>" + email + "</b>";
  $("#userEmail").html(html);
}

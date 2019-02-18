// configure jquery AJAX
$.ajaxSetup({
  contentType: "application/json; charset=utf-8"
});

/*
 * Returns the value of the cookie
 * with the given name.
 * Returns an empty string if no such
 * cookie is found.
*/
function getCookie(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*
 * Sends a GET request to the web service
 * for all the available services.
 * Adds the returned services to the Order
 * form if the request is successful.
*/
function apiGetServices() {
  $.ajax({
    method: "GET",
    url: "/services/get",
    success: function(data) {
      setServices(data);
    },
    error: function(data) {
      console.log("error: GET /services/get ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a POST request to the web service
 * to create an order using the given data.
 * Shows the created OrderID to the user if
 * the request is successful.
*/

function apiCreateOrder(data) {
  var csrfToken = getCookie("csrftoken");
  $.ajax({
    method: "POST",
    url: "/orders/create",
    data: data,
    headers: {
      "X-CSRFToken": csrfToken
    },
    success: function(data) {
      submitOrderSuccess(data);
    },
    error: function(data) {
      console.log("error: POST /orders/create ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a GET request to the web service
 * for all the users support tickets in
 * freshdesk.
 * Adds the tickets to the portal on success.
*/
function apiListTickets() {
  $.ajax({
    method: "GET",
    url: "/tickets/list",
    success: function(data) {
      addTickets(data);
    },
    error: function(data) {
      console.log("error: GET /tickets/list ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a POST request to the web service
 * to update the current active customer.
 * On success, refreshes customer-specific
 * data such as locations and services.
*/
function apiUpdateActiveCustomer(id) {
  var csrfToken = getCookie("csrftoken");
  var data = {"new_active_id": id}
  data = JSON.stringify(data);

  $.ajax({
    method: "POST",
    url: "/update_active_id",
    data: data,
    headers: {
      "X-CSRFToken": csrfToken
    },
    success: function(data) {
      refreshCustomerData(data);
    },
    error: function(data) {
      console.log("error: POST /update_active_id ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a GET request to the web service
 * to get the customers available to the
 * user as well as the active customer.
*/
function apiGetCustomers() {
  $.ajax({
    method: "GET",
    url: "/customers",
    success: function(data) {
      refreshCustomerData(data);
    },
    error: function(data) {
      console.log("error: GET /customers ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a GET request to the web service
 * to initiate a change password request
 * with Auth0.
*/
function apiChangePassword() {
  $.ajax({
    method: "GET",
    url: "/change_password",
    success: function(data) {
      var text = "Success! Please check your email for further instructions.";
      showSuccessNote(text);
    },
    error: function(data) {
      console.log("error: GET /change-password ", data.status, data.statusText);
      showApiError(data);
    }
  });
};

/*
 * Sends a GET request to the web service
 * to get information about the user
 * such as his email, etc.
*/
function apiGetUserinfo() {
  $.ajax({
    method: "GET",
    url: "/userinfo",
    success: function(data) {
      refreshUserinfo(data);
    },
    error: function(data) {
      console.log("error: GET /userinfo ", data.status, data.statusText);
      showApiError(data);
    }
  });
};


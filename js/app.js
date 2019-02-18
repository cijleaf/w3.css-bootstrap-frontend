// You can comment this JS out and the app will still work.
(function() {
  var app = {
    'routes': {
      'account': {
        'rendered': function() {
          console.log('view currently showing is "account"');
          app.preventScroll();
        }
      },
      'orders': {
        'rendered': function() {
          console.log('view currently showing is "orders"');
          app.preventScroll();
        }
      },
      'tickets': {
        'rendered': function() {
          console.log('view currently showing is "tickets"');
          app.preventScroll();
        }
      },
      'map': {
        'rendered': function() {
          console.log('view currently showing is "map"');
          app.preventScroll();
        }
      },
      'insights': {
        'rendered': function() {
          console.log('view currently showing is "insights"');
          app.preventScroll();
        }
      },
      'dash': {
        'rendered': function() {
          console.log('view currently showing is "dash"');
          app.preventScroll();
        }
      },
    },
    'default': 'dash',
    'preventScroll': function() {
      document.querySelector('html').scrollTop = 0;
    },
    'routeChange': function() {
      app.routeID = location.hash.slice(1);
      app.route = app.routes[app.routeID];
      app.routeElem = document.getElementById(app.routeID);
      app.route.rendered();
    },
    'init': function() {
      window.addEventListener('hashchange', function() {
        app.routeChange();
      });
      if (!window.location.hash) {
        window.location.hash = app.default;
      } else {
        app.routeChange();
      }
    }
  };
  window.app = app;
})();

app.init();

window.onload = function () {
  apiGetUserinfo();  // returns user info such as email, etc.
  apiGetCustomers(); // get the customers the user can switch between
                     // also loads customer's tickets and services
  setYellowfinIframeURL();  // uses config file to load YF iframe
  setDefaultOrderDestination();  // sets default destination in Order Form
  loadPickupDateTimeOptions();  // populates dropdown options in Order Form
};

/*
    This script implements an autosuggest feature on the pickup location and destination location inputs of the order form.
    The script listens to keyUp events on the pickup and destination location inputs.
    When the user enters the first character, a request is made to retrieve all locations that start with that character.
    A javascript object acts as a cache of locations that have already been retrieved. We wont make requests for the same first character twice.
    The results are added to an HTML datalist that shows the user the results in a dropdown fashion.
    When the user selects an option from the dropdown, we use it to autocomplete the remaining fields (address, city, zip) for the location.
    The script is adapted from https://dev.to/stephenafamo/how-to-create-an-autocomplete-input-with-plain-javascript
*/

window.addEventListener("load", function(){

    // Add a keyup event listener to our input elements
    var location_input = document.getElementById("pickup_location");
    $("#pickup_location").on("input", function(event){hinter(event)});
    $("#dest_location").on("input", function(event){hinter(event)});

    // create one global XHR object
    // so we can abort old requests when a new one is made
    window.hinterXHR = new XMLHttpRequest();
    window.locationsDatalist = document.getElementById("locations-datalist");
    window.locationsObjects = {};
});

// Autocomplete for form
function hinter(event) {

    // retrieve the input element
    var input = event.target;
    var name = input.value;
    var firstLetter = name[0] || "";  // first letter if not empty
    firstLetter = firstLetter.toLowerCase();

    // if the input value matches an item from the datalist
    // then populate the city, state, zip fields
    if (window.locationsObjects.hasOwnProperty(firstLetter) &&
        window.locationsObjects[firstLetter].hasOwnProperty(name)) {
        // get fields to populate
        var fields = getFieldsToPopulate(input.id);

        // populate fields
        fields[0].val(window.locationsObjects[firstLetter][name]["address"]);
        fields[1].val(window.locationsObjects[firstLetter][name]["city"]);
        fields[2].val(window.locationsObjects[firstLetter][name]["zip_field"]);
    }

    // dont make a request for locations we already fetched
    if (name.length != 1 ||
        window.locationsObjects.hasOwnProperty(firstLetter)) {
        return;
    }
    // otherwise make a request for locations starting with the first letter
    else {
        // abort any pending requests
        window.hinterXHR.abort();
        // show loading spinner
        input.classList.add("loading");

        window.hinterXHR.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // add the first letter to the locationsObjects dictionary
                // so we dont make future requests for it
                window.locationsObjects[firstLetter] = {};

                // popuplate the datalist as well as our locationsObjects
                var response = JSON.parse( this.responseText );
                response.forEach(function(item) {
                    // Create a new <option> element.
                    var name = item["name"];
                    var option = document.createElement('option');
                    option.value = name;
                    window.locationsObjects[firstLetter][name] = item;

                    // attach the option to the datalist element
                    window.locationsDatalist.appendChild(option);
                });

            // remove loading spinner
            input.classList.remove("loading");
            }
        };

        window.hinterXHR.open("GET", "/pickup_locations/get?text=" + name, true);
        window.hinterXHR.send()
    }
}

/*
 * Returns an array of [addressField, cityField, zipField]
 * based on the given inputId.
 * If inputId is pickup_location, we return the fields
 * corresponding to the pickup address.
 * If inputId is dest_location, we return the fields
 * corresponding to the destination address.
 * If inputId is neither, we log an error and return
 * an array of undefined.
*/
function getFieldsToPopulate(inputId) {
    var address_field = undefined;
    var city_field = undefined;
    var zip_field = undefined;

    if (inputId == "pickup_location") {
        address_field = $("#pickup_address_field");
        city_field = $("#pickup_city_field");
        zip_field = $("#pickup_zip_field");
    }
    else if (inputId == "dest_location") {
        address_field = $("#dest_address_field");
        city_field = $("#dest_city_field");
        zip_field = $("#dest_zip_field");
    }
    else {
        console.error("Input ID is neither pickup_location nor dest_location: ", inputId);
    }

    return [address_field, city_field, zip_field];
}

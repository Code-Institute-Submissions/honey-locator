

/*let geoJSONObject = '{"type": "FeatureCollection", "features": [{"geometry": {"coordinates": [-5.851389, 54.264296],"type": "Point"},"properties": {"category": "online","name": "Castle Farm Fresh Produce","phone": "+447568436413","website": "https://www.castlefarmni.com/","storeid": "02"},"type": "Feature"}, {"geometry": {"coordinates": [-2.7721087, 53.9136975],"type": "Point"},"properties": {"category": "online","name": "Lancashire Honey","phone": "+447787758033","website": "http://www.lancashirehoney.com/","storeid": "06"},"type": "Feature"},]}'
var geoObject = JSON.parse(geoJSONObject);
var features = [];
features = geoObject.features;
console.log(features.name);*/
// initilise Map

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5.5,
    center: { lat: 55.08122, lng: -3.016536 },
    mapTypeControl: false,
  });

    new AutocompleteDirectionsHandler(map);

  // set markers and clusters

  map.data.loadGeoJson("assets/js/honey-data.json", null, function (features) {
    markers = features.map(function (feature) {
      let marker = new google.maps.Marker({
        position: feature.getGeometry().get(0),
        icon: {
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        },
      });

      // add mouseover

      marker.addListener("mouseover", function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(60, 60),
        });
      });

      marker.addListener("mouseout", function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        });
      });

      // open infowindow on click

      infowindow = new google.maps.InfoWindow();

      marker.addListener("click", function () {
        let feat = feature;
        let name = feat.getProperty("name");
        let phone = feat.getProperty("phone");
        let website = feat.getProperty("website");
        let position = feat.getGeometry().get();
        let html = `<b> ${name}</b><br>
        <i class="fas fa-phone-alt icon-color" alt="phone"></i> ${phone}
        <br><i class="fas fa-globe icon-color" alt="globe"></i> <a class="website" target="_blank" href=" ${website}">link</a> <br><div onclick="newElement()" id="addTo" class="addBtn" value='${name}${phone}${website}'>Add</>`;
        infowindow.setContent(html);
        infowindow.open(map, marker);
      });
      return marker;
    });
    let markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  });

  map.data.setMap(null);

  //geolocator

  let locatorBTN = document.getElementById("locatorBTN");
  locatorBTN.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infowindow.setPosition(pos);
          infowindow.setContent(
            "<p class = 'general-text'>Your location <img src ='assets/images/icon_Online.jpg' class='icon' alt='logo'></p>"
          );
          infowindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infowindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infowindow.open(map);
  }
}

// Let user create list of their choices 

//close button 
let myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
let close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    let div = this.parentElement;
    div.style.display = "none";
  };
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  let li = document.createElement("li");
  let inputValue = document.getElementById("addTo").getAttribute("value");
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  document.getElementById("listItems").appendChild(li);

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement;
      div.style.display = "none";
    };
  }
}

//hide/show list
$(document).ready(function () {
  $(".toggleList").click(function () {
    $("#userList").toggle();
  });
});

$(".toggleList").click(function () {
  let $this = $(this);
  $this.toggleClass("toggleList");
  if ($this.hasClass("toggleList")) {
    $this.text("Hide list");
  } else {
    $this.text("Show list");
  }
});

  
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  this.directionsService = new google.maps.DirectionsService;
  this.directionsRenderer = new google.maps.DirectionsRenderer;
  this.directionsRenderer.setMap(map);

  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var modeSelector = document.getElementById('mode-selector');

  var originAutocomplete = new google.maps.places.Autocomplete(originInput);
  // Specify just the place data fields that you need.
  originAutocomplete.setFields(['place_id']);

  var destinationAutocomplete =
      new google.maps.places.Autocomplete(destinationInput);
  // Specify just the place data fields that you need.
  destinationAutocomplete.setFields(['place_id']);

  this.setupClickListener('changemode-walking', 'WALKING');
  this.setupClickListener('changemode-transit', 'TRANSIT');
  this.setupClickListener('changemode-driving', 'DRIVING');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
    id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;

  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
    autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route(
      {
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
      },
      function(response, status) {
        if (status === 'OK') {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
};


let txt = '{"category": "online", "name": "Castle Farm Fresh Produce", "latitude":"-5.851389", "longitude":"54.264296", "phone": "+447568436413", "website": "https://www.castlefarmni.com/","storeid": "02"}'
let obj = JSON.parse(txt);
document.getElementById("demo").innerHTML = obj.latitude + obj.longitude;

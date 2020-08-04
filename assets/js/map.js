// Map styling
let mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#81BC84",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#DFD3AE",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#C27156",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#A8E1E8",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

// initilise Map

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5.5,
    center: { lat: 55.08122, lng: -3.016536 },
    mapTypeControl: false,
    styles: mapStyle,
  });

  // set markers and clusters

  map.data.loadGeoJson("assets/js/honey-data.json", null, function (features) {
    markers = features.map(function (feature) {
      let marker = new google.maps.Marker({
        position: feature.getGeometry().get(0),
        icon: {
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // add mouseover

      marker.addListener("mouseover", function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        });
      });

      marker.addListener("mouseout", function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty("category")}.jpg`,
          scaledSize: new google.maps.Size(40, 40),
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
        let html = `<div class="content-text"><h4>${name}</h4>
        <i class="fas fa-phone-alt honey-col" alt="phone"></i> ${phone}
        <br><i class="fas fa-globe honey-col" alt="globe"></i> <a class="website content-text" target="_blank" href="${website}">${website}</a> <br><div onclick="newElement()" id="addTo" class="addBtn" info="${
          name + phone + website
        }">Add</></div>`;
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
          infowindow.setContent("<p class = 'general-text'>Your location</p>");
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

  //search bar autocomplete
  let card = document.getElementById("pac-card");
  let input = document.getElementById("pac-input");
  let types = document.getElementById("type-selector");
  let strictBounds = document.getElementById("strict-bounds-selector");
  let options = {
    types: ["address"],
    componentRestrictions: { country: "gb" },
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.bindTo("bounds", map);

  autocomplete.setFields(["address_components", "geometry", "name"]);

  const originMarker = new google.maps.Marker({ map: map });
  originMarker.setVisible(false);
  let originLocation = map.getCenter();

  autocomplete.addListener("place_changed", async () => {
    originMarker.setVisible(false);
    originLocation = map.getCenter();

    const place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert(
        "Sorry, we can't seem to find: '" +
          place.name +
          "' please try a new search."
      );
      return;
    }

    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    map.setZoom(10);
    console.log(place);

    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);
  });
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
  let inputValue = document.getElementById("addTo").getAttribute("info");
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
    $this.html(`<i class="fas fa-minus-square"></i>`);
  } else {
    $this.html(`<i class="fas fa-plus-square"></i>`);
  }
});


//----------benefits
$(function(){
    $(".flip").flip({
        trigger: 'click'
    });
});

//----------quiz

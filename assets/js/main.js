// send form
function sendForm() {
  emailjs.sendForm("gmail", "honey_locator", "#myForm").then(
    function () {
      alert("Thanks for your suggestion, we'll get back to you asap!");
    },
    function (error) {
      alert("Hmm something has gone wrong here, please try again...", error);
    }
  );
  return false;
}

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
          url: `assets/images/icon_online.jpg`,
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // add mouseover

      marker.addListener("mouseover", function () {
        marker.setIcon({
          url: `assets/images/icon_online.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        });
      });

      marker.addListener("mouseout", function () {
        marker.setIcon({
          url: `assets/images/icon_online}.jpg`,
          scaledSize: new google.maps.Size(40, 40),
        });
      });

      // open infowindow on click

      infowindow = new google.maps.InfoWindow();

      marker.addListener("click", function () {
        let name = feature.getProperty("name");
        let phone = feature.getProperty("phone");
        let website = feature.getProperty("website");
        let address = feature.getProperty("Address");
        let gLink = feature.getProperty("Google Maps URL");
        let position = feature.getGeometry().get();
        let streetView = `<img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyCYEFJ6Ls3eG2snRN2rZx7zHIZ8SS5UeKE"/>`;

        // html for infoWindow

        let html = `<div class="content-text">
            <h5>${name}</h5>
            <div class="py-1"><i class="fas fa-phone-alt honey-col" alt="phone"></i> ${phone}</div>
            <div class="py-1">
                <i class="fas fa-globe honey-col" alt="globe"></i>
                <a class="website text-hvr content-text" target="_blank" href="${website}">Website</a>
            </div>
            <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${address}</div>
             <div class="pt-2">
            ${streetView}
            </div>
            <div onclick="listHandlers.newItem();" id="addTo" class="button text-small text-center float-left" inputValue= "${
              name + "  |  " + phone + "  |  " + website + "  |  " + address
            }">Add to your list
        </div>
        <div>
            <a class="button text-small text-center" target="_blank" href="${gLink}">View on GoogleMaps</a>
        </div>`;

        let htmlAlt = `<div class="content-text">
            <h5>${name}</h5>
            <div class="py-1"><i class="fas fa-phone-alt honey-col" alt="phone"></i> ${phone}</div>
            <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${address}</div>
            <div class="pt-2">
            ${streetView}
            </div>
            <div onclick="listHandlers.newItem();" id="addTo" class="text-small button text-center float-left" inputValue= "${
              name + "  |  " + phone + "  |  " + address
            }">Add to your list
        </div>
        <div>
            <a class="button text-small text-center" target="_blank" href="${gLink}">View on GoogleMaps</a>
        </div>`;
        // If no website info is present display htmlAlt, otherwise display html

        if (website == null) {
          infowindow.setContent(htmlAlt);
          infowindow.open(map, marker);
        } else {
          infowindow.setContent(html);
          infowindow.open(map, marker);
        }
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

  if (navigator.geolocation) {
    infowindow = new google.maps.InfoWindow();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infowindow.setPosition(pos);
        infowindow.setContent(
          "<p class = 'general-text'>You are here!</p><div class='center'><img src ='assets/images/icon_online.jpg' class='logo-nav' alt='logo'></div>"
        );
        infowindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infowindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

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

  let card = document.getElementById("pac-container");
  let input = document.getElementById("pac-input");
  let options = {
    types: ["address"],
    componentRestrictions: { country: "gb" },
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

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

//new list

let ul = document.getElementById("yourListUl");
let itemsArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];

localStorage.setItem("items", JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem("items"));

let listView = {
  liMaker: function (text) {
    let li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  },
};

//List handlers

let listHandlers = {
  newItem: function () {
    let inputValue = document
      .getElementById("addTo")
      .getAttribute("inputValue");

    if (itemsArray.indexOf(inputValue) == -1) {
      itemsArray.push(inputValue);
      localStorage.setItem("items", JSON.stringify(itemsArray));
      listView.liMaker(inputValue);
    } else {
      alert(
        "Looks like you've already got this one on your list! Please try another."
      );
      return;
    }
  },

  clearBtn: function () {
    localStorage.clear();
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  },
};

data.forEach((item) => {
  listView.liMaker(item);
});

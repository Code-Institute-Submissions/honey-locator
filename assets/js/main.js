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

let pos;
let map;
let infoWindow;
let currentInfoWindow;
let service;
let myList;
let addTo;

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

// Initialize map
function initMap() {
  // Initialize variables
  infoWindow = new google.maps.InfoWindow();
  myList = document.getElementById("yourListUl");
  currentInfoWindow = infoWindow;

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5.5,
    center: { lat: 55.08122, lng: -3.016536 },
    styles: mapStyle,
  });

  // geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map = new google.maps.Map(document.getElementById("map"), {
          center: pos,
          zoom: 10,
          styles: mapStyle,
        });

        infoWindow.setPosition(pos);
        infoWindow.setContent(
          "<p class = 'general-text'>You are here!</p><div class='center'><img src ='assets/images/icon_online.jpg' class='logo-nav' alt='logo'></div>"
        );
        infoWindow.open(map);
        map.setCenter(pos);

        // Call Places Nearby Search on user's location
        getNearbyPlaces(pos);
      },
      () => {
        // Browser supports geolocation, but user has denied permission
        handleLocationError(true, infoWindow);
      }
    );
  } else {
    // Browser doesn't support geolocation
    handleLocationError(false, infoWindow);
  }

  //search bar autocomplete

  let card = document.getElementById("pac-container");
  let input = document.getElementById("pac-input");
  let options = {
    types: ["address"],
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.setFields(["address_components", "geometry", "name"]);

  autocomplete.addListener("place_changed", async () => {
    let originMarker = new google.maps.Marker({
      map: map,
    });

    let place = autocomplete.getPlace();

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

    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);
    getNearbyPlaces(originLocation);
  });
}

// Perform a Places Nearby Search Request
function getNearbyPlaces(position) {
  let request = {
    location: position,
    rankBy: google.maps.places.RankBy.DISTANCE,
    keyword: "Honey Farm",
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}

// Set markers at the location of each place result
function createMarkers(places) {
  addTo = document.getElementById("addTo");
  places.forEach((place) => {
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
      icon: {
        url: `assets/images/icon_online.jpg`,
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    marker.addListener("mouseover", function () {
      marker.setIcon({
        url: `assets/images/icon_online.jpg`,
        scaledSize: new google.maps.Size(50, 50),
      });
    });

    marker.addListener("mouseout", function () {
      marker.setIcon({
        url: `assets/images/icon_online.jpg`,
        scaledSize: new google.maps.Size(40, 40),
      });
    });

    // Add click listener to each marker
    google.maps.event.addListener(marker, "click", () => {
      let request = {
        placeId: place.place_id,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "rating",
          "website",
          "photos",
          "formatted_phone_number",
          "url",
        ],
      };
      service.getDetails(request, (placeResult, status) => {
        showDetails(placeResult, marker, status);
        addTo.onclick = function () {
          newItem(placeResult);
        };
      });
    });
  });
}

// InfoWindow
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    if (placeResult.rating) rating = placeResult.rating;
    placeInfowindow.setContent(`<div class="content-text">
            <h5>${placeResult.name}</h5>
            <div class="py-1"><i class="fas fa-phone-alt honey-col" alt="phone"></i>${placeResult.formatted_phone_number}</div>
            <div class="py-1">
                <i class="fas fa-globe honey-col" alt="globe"></i>
                <a class="website text-hvr content-text" target="_blank" href="${placeResult.website}">Website</a>
            </div>
            <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${placeResult.formatted_address}</div>
                      <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${placeResult.rating}</div>
        <div>
            <a class="button text-small text-center" target="_blank" target="_blank" href="${placeResult.url}">View on GoogleMaps</a>
        </div>`);

    placeInfowindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfowindow;
  } else {
    console.log("showDetails failed: " + status);
  }
}

let itemsArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];
let data = JSON.parse(localStorage.getItem("items"));

//new list item

function newItem(placeResult) {
  //list item content
  let content = document.createElement("div");
  content.classList.add("col");
  let inputValue = (content.innerHTML = `
  <li>
  <div class="card" style="width: 18rem;">
  <img src="${placeResult.photos[0].getUrl()}" class="card-img-top" alt="googlemaps photo" style="height: 12rem;">
  <div class="card-body">
    <h5 class="card-title">${placeResult.name}</h5>
    <p class="card-text">   <div class="py-1"><i class="fas fa-phone-alt honey-col" alt="phone"></i>${
      placeResult.formatted_phone_number
    }</div>
            <div class="py-1">
                <i class="fas fa-globe honey-col" alt="globe"></i>
                <a class="website text-hvr content-text" target="_blank" href="${
                  placeResult.website
                }">Website</a>
            </div>
            <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${
              placeResult.formatted_address
            }</div>
            <div class="pt-1"><i class="fas fa-store honey-col" alt="store"></i>${
              placeResult.rating
            }</div>
        <div></p> <a class="button text-small text-center" target="_blank" target="_blank" href="${
          placeResult.url
        }">View on GoogleMaps</a>     
  </div>
</div>
</li>
`);

  //if an item is not already in local storage, add myList and local storage
  if (itemsArray.indexOf(inputValue) == -1) {
    myList.appendChild(content);
    itemsArray.push(inputValue);
    localStorage.setItem("items", JSON.stringify(itemsArray));
  } else {
    alert(
      "Looks like you've already got this one on your list! Please try another."
    );
  }
}

// html remains on page after refresh
data.forEach(() => {
  document.getElementById("yourListUl").innerHTML = data;
});

function clearBtn() {
  localStorage.clear();
  while (myList.firstChild) {
    myList.removeChild(myList.firstChild);
  }
  itemsArray = [];
}

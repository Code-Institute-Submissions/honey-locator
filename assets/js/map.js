// initilise Map

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5.5,
    center: { lat: 55.08122, lng: -3.016536 },
    mapTypeControl: false,
  });

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

  
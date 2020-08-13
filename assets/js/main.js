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

//navbar-collapse hide on click
$(".navbar-nav>li>a").on("click", function () {
  $(".navbar-collapse").collapse("hide");
});

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
        let html = `<div class="content-text"><h5>${name}</h5>
        <i class="fas fa-phone-alt honey-col" alt="phone"></i> ${phone}
        <br><i class="fas fa-globe honey-col" alt="globe"></i> <a class="website content-text" target="_blank" href="${website}">${website}</a><br><i class="fas fa-store honey-col" alt="store"> </i>${address}<br><p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyCYEFJ6Ls3eG2snRN2rZx7zHIZ8SS5UeKE"></p>
<div onclick="listHandlers.newItem();" id="addTo" class="addBtn text-small btn-hover" info= "${
          name + " | " + phone + " | " + website + " | " + address
        } <img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyCYEFJ6Ls3eG2snRN2rZx7zHIZ8SS5UeKE">">Add to your list</div><div><a class="addBtn text-small btn-hover" target="_blank" href="${gLink}">View on GoogleMaps</a></div>`;
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

  if (navigator.geolocation) {
    infowindow = new google.maps.InfoWindow();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infowindow.setPosition(pos);
        infowindow.setContent("<p class = 'general-text'>You are here!</p><div class='center'><img src ='assets/images/icon_online.jpg' class='logo-nav' alt='logo'></div>");
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

function liMaker(text) {
  let li = document.createElement("li");
  li.innerHTML = text;
  ul.appendChild(li);
}

//List handlers
let listHandlers = {
  newItem: function () {
    let inputValue = document.getElementById("addTo").getAttribute("info");
    let repeated = itemsArray.filter(function (a) {
      return a.inputValue == inputValue;
    }).length;

    if (!repeated) {
      itemsArray.push(inputValue);
      localStorage.setItem("items", JSON.stringify(itemsArray));
      liMaker(inputValue);
    } else {
      alert("already added");
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
  liMaker(item);
});

/*// Close list item on click

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

  let div = document.createElement("DIV");
  let txt = document.createTextNode("\u00D7");
  div.className = "close";
  div.appendChild(txt);
  li.appendChild(div);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement;
      div.style.display = "none";
    };
  }
}

// hide/show list

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
});*/

// flip function for benefits cards
$(function () {
  $(".flip").flip({
    trigger: "click",
  });
});

// Quiz questions
let questions = [
  {
    question:
      "Approximately how many flowers must honeybees visit to make one kilogram of honey?",
    option1: "Four Hundred",
    option2: "Four Thousand",
    option3: "Four Million",
    corAnswer: "3",
  },
  {
    question:
      "How many miles does a beehive fly (collectively) to make a pound of honey?",
    option1: " 55,000 miles",
    option2: "100,00 miles",
    option3: "900 miles",
    corAnswer: "1",
  },
  {
    question: "How much honey does an average worker bee make in its lifetime?",
    option1: "half a teaspoon",
    option2: "one whole teaspoon",
    option3: "one tenth of a teaspoon",
    corAnswer: "3",
  },
  {
    question:
      "A bees' buzz is the sound made by the beat of their wings, how many times do the beat per minute?",
    option1: "1400 times",
    option2: "11,400 times",
    option3: "140 times",
    corAnswer: "2",
  },
  {
    question: "How fast can a honeybee fly?",
    option1: "Up to five miles per hour",
    option2: "Up to ten miles per hour",
    option3: "Up to fifteen miles per hour",
    corAnswer: "2",
  },
];

let currentQuestion = 0;

function loadQuestion(i) {
  let question = document.getElementById("question");
  let option1 = document.getElementById("option1");
  let option2 = document.getElementById("option2");
  let option3 = document.getElementById("option3");
  let q = questions[i];
  question.textContent = i + 1 + ". " + q.question;
  option1.textContent = q.option1;
  option2.textContent = q.option2;
  option3.textContent = q.option3;
}

function nextQuestion() {
  let quizQuestionsContainer = document.getElementById(
    "quizQuestionsContainer"
  );
  let totalQuestions = questions.length;
  let quizResultsContainer = document.getElementById("quizResultsContainer");
  let restart = document.getElementById("restart");
  let showAnswers = document.getElementById("showAnswers");
  let score = 0;
  let selectedOption = document.querySelector("input[type = radio]:checked");
  let corAnswer = selectedOption.value;

  if (!selectedOption) {
    alert("Please choose an answer");
    return;
  }
  if (questions[currentQuestion].corAnswer == corAnswer) {
    score += 1;
    console.log("success");
  }
  selectedOption.checked = false;
  currentQuestion++;
  if (currentQuestion === totalQuestions - 1) {
    nextBtn.textContent = "Finish";
  }
  if (currentQuestion === totalQuestions) {
    quizQuestionsContainer.style.display = "none";
    quizResultsContainer.style.display = "";
    quizResultsContainer.innerHTML = `Your Score  ${score}  /5`;
    quizResultsContainer.appendChild(showAnswers);
    quizResultsContainer.appendChild(restart);
    return;
  }
  progBar.value = progBar.value + 10;
  loadQuestion(currentQuestion);
}

$(document).ready(function () {
  $("#answers").hide();
  $("#showAnswers").click(function () {
    $("#answers").toggle();
  });
});

loadQuestion(currentQuestion);

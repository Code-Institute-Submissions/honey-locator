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
        <div class = "py-1"><i class="fas fa-phone-alt honey-col" alt="phone"></i> ${phone}</div>
        <div class = "py-1"><i class="fas fa-globe honey-col" alt="globe"></i> <a class="website content-text" target="_blank" href="${website}">Website</a></div><div class = "pt-1"><i class="fas fa-store honey-col" alt="store"> </i>${address}</div><br><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=AIzaSyCYEFJ6Ls3eG2snRN2rZx7zHIZ8SS5UeKE"><br>
<div onclick="listHandlers.newItem();" id="addTo" class="addBtn text-small btn-hover" info= "${
          name + " | " + phone + " | " + website + " | " + address
        }">Add to your list</div><div><a class="addBtn text-small btn-hover" target="_blank" href="${gLink}">View on GoogleMaps</a></div>`;

        if (website === null) {
          console.log;
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
    li.appendChild(this.createDeleteButton());
    for (let i = 0; i < itemsArray.length; i++) {
      li.id = i;
    }
  },

  createDeleteButton: function () {
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";
    return deleteButton;
  },
};

//List handlers

let listHandlers = {
  newItem: function () {
    let inputValue = document.getElementById("addTo").getAttribute("info");
    if (itemsArray.indexOf(inputValue) == -1) {
      itemsArray.push(inputValue);
      localStorage.setItem("items", JSON.stringify(itemsArray));
      listView.liMaker(inputValue);
    } else {
      alert("Already added");
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
let question = document.getElementById("question");

function loadQuestion(i) {
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
  let selectedOption = document.querySelector("input[type = radio]:checked");
  let corAnswer = selectedOption.value;

  let score = 0;

  if (!selectedOption) {
    alert("Please choose an answer");
    return;
  }
  if (questions[currentQuestion].corAnswer == corAnswer) {
    score += 1;
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

function resetQuiz() {
    document.getElementById("quizTest").reset();
  }
  
$(document).ready(function () {
  $("#answers").hide();
  $("#showAnswers").click(function () {
    $("#answers").toggle();
  });
});

loadQuestion(currentQuestion);

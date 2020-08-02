// initilise Map

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5.5,
    center: { lat: 55.08122, lng: -3.016536 },
    mapTypeControl: false,
  });

// set markers and clusters

  map.data.loadGeoJson('assets/js/honey-data.json', null, function (features) {
    markers = features.map(function (feature) {
      let marker = new google.maps.Marker({
        position: feature.getGeometry().get(0),
        icon: {
          url: `assets/images/icon_${feature.getProperty('category')}.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        },
      });

// add mouseover

      marker.addListener('mouseover', function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty('category')}.jpg`,
          scaledSize: new google.maps.Size(60, 60),
        });
      });

      marker.addListener('mouseout', function () {
        marker.setIcon({
          url: `assets/images/icon_${feature.getProperty('category')}.jpg`,
          scaledSize: new google.maps.Size(50, 50),
        });
      });

// open infowindow on click

  infowindow = new google.maps.InfoWindow();

      marker.addListener('click', function () {
        let feat = feature;
        let name = feat.getProperty('name');
        let phone = feat.getProperty('phone');
        let website = feat.getProperty('website');
        let position = feat.getGeometry().get();
        let html = `<b> ${name}</b><br>
        <i class='fas fa-phone-alt icon-color' alt='phone'></i> ${phone}
        <br><i class='fas fa-globe icon-color' alt='globe'></i> <a class='website' target='_blank' href=' ${website}'>link</a>`;
        infowindow.setContent(html);
        infowindow.open(map, marker);
      });
      return marker;
    });
    let markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
  });

  map.data.setMap(null);
  
}

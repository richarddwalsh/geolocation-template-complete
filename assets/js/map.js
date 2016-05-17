var $markersArray = [];

$(document).ready(function() {
  var marker;
  var geocoder = new google.maps.Geocoder();
  var myLatLng = new google.maps.LatLng(51.0486, -114.0708);
  var mapOptions = {
    center: myLatLng,
    zoom: 10,
    draggable: false,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
  }
  var map = new google.maps.Map($("#map").get(0), mapOptions);

  var address = "2500 University Dr NW, Calgary, AB T2N 1N4"
  geocoder.geocode({ address: address }, function(results,status) {

    // Check if Geocoder Status OK
    if (status == google.maps.GeocoderStatus.OK) {

      // Add Marker
      marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
        title: results[0].formatted_address,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });

      $markersArray.push(marker);

      // Reset Center and Zoom to Geocoded Location
      map.setCenter(results[0].geometry.location);
      map.setZoom(12);

      // adds message balloon
      var infoWindow = new google.maps.InfoWindow({
        content: "This is: <h3>" + address + "</h3>"
      });

      if (navigator.geolocation) {
        getCurrentLocation();
      }

    } else {
      alert(status)
    }
  })



});

function getCurrentLocation() {
  // If HTML5 Geolocation is supported in this browser
  if (navigator.geolocation) {
    // Use HTML5 Geolocation API to Get Current Position
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { timeout: 10000 });

  } else {
    alert("Geolocation API is not supported in your browser.");
  }
}

function successCallback(result) {

  var lat = result.coords.latitude;
  var lng = result.coords.longitude;
  var myLatLng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    draggable: false,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
  }
  var map = new google.maps.Map($("#map").get(0), mapOptions);

  // Add Marker
  var currentMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "Current Location",
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
  });

  $markersArray.push(currentMarker);

  var marker, i;
  var bounds = new google.maps.LatLngBounds();
  for (i = 0; i < $markersArray.length; i++) {
    marker = new google.maps.Marker({
      position: $markersArray[i].position,
      map: map,
      title: $markersArray[i].title,
      icon: $markersArray[i].icon
    });

    var infowindow = new google.maps.InfoWindow();

    bounds.extend(marker.getPosition());

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent("<b>" + $markersArray[i].title + "</b>");
        infowindow.open(map, marker);
      }
    })(marker, i));

  }
  map.fitBounds(bounds);
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // User defined access to location. Perhaps redirect to alternate content?
      alert("User Location Permission was Denied");
      break;
    case error.POSITION_UNAVAILABLE:
			alert('Position is currently unavailable.');
			break;
		case error.PERMISSION_DENIED_TIMEOUT:
			alert('User took to long to grant/deny permission.');
			break;
		case error.UNKNOWN_ERROR:
			alert('An unknown error occurred.')
			break;
  }
}

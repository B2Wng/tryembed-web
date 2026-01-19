let map;
let indoorRenderer;

function initMap() {
  console.log("init map");

  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 1.3395609, lng: 103.7057931 },
    zoom: 19
  });

  const conf = {
    defaultFloor: 1,
    venue: "120",
    responsive: "desktop"
  };

  const widgetConf = { units: "metric" };

  // ✅ IMPORTANT: do NOT use const here
  indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf);
  indoorRenderer.setMap(map);

  indoorRenderer.addListener("indoor_feature_selected", (feature) => {
    console.log("Feature selected:", feature);
  });

  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log("Venue loaded:", venue);

    map.fitBounds(
      new window.woosmap.map.LatLngBounds(
        { lat: 1.3384293, lng: 103.7041998 },
        { lat: 1.3406925, lng: 103.7073863 }
      )
    );

    hideLoader();
  });
}

window.updateUserLocation = function(lat, lng, level, bearing = 0, forceFocus = true) {
  if (!indoorRenderer) {
    console.warn("indoorRenderer not ready yet");
    return false;
  }

  const inside = indoorRenderer.isUserInsideVenue(lat, lng);
  console.log("updateUserLocation:", { lat, lng, level, inside });

  indoorRenderer.setUserLocation(lat, lng, level, bearing, forceFocus, false);
  console.log("getUserLocation:", indoorRenderer.getUserLocation());
  return true;
};

function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

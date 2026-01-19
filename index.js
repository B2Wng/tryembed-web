let map;
let indoorRenderer;

function initMap() {
  console.log("init map");

  // Create map centered roughly on  indoor venue
  map = new window.woosmap.map.Map(
    document.getElementById("map"),
    {
      center: { lat: 1.3395609, lng: 103.7057931 },
      zoom: 19
    }
  );

  // Indoor renderer configuration
  const conf = {
    defaultFloor: 1,
    venue: "120",
    responsive: "desktop"
  };

  const widgetConf = {
    units: "metric"
  };

  const indoorRenderer = new window.woosmap.map.IndoorWidget(
    widgetConf,
    conf
  );

  indoorRenderer.setMap(map);

  // Triggered when user taps a POI
  indoorRenderer.addListener("indoor_feature_selected", (feature) => {
    console.log("Feature selected:", feature);
  });

  // Triggered when indoor venue finishes loading
  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log("Venue loaded:", venue);

    // Fit map to  venue area (based on routing points)
    map.fitBounds(
      new window.woosmap.map.LatLngBounds(
        { lat: 1.3384293, lng: 103.7041998 }, // SOUTH-WEST
        { lat: 1.3406925, lng: 103.7073863 }  // NORTH-EAST
      )
    );

    hideLoader();
  });
}

/**
 * Android will call this to update simulated user location
 */
window.updateUserLocation = function(lat, lng, level, bearing = 0, forceFocus = true) {
  if (!indoorRenderer) {
    console.warn("indoorRenderer not ready yet");
    return;
  }

  // optional check
  const inside = indoorRenderer.isUserInsideVenue(lat, lng);
  console.log("updateUserLocation:", { lat, lng, level, inside });

  indoorRenderer.setUserLocation(lat, lng, level, bearing, forceFocus, false);

  // You can also read it back:
  console.log("getUserLocation:", indoorRenderer.getUserLocation());
};


function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

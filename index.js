let map;

function initMap() {
  console.log("init map");

  // Create map centered roughly on your indoor venue
  map = new window.woosmap.map.Map(
    document.getElementById("map"),
    {
      center: { lat: 43.6066, lng: 3.9218 },
      zoom: 19
    }
  );

  // Indoor renderer configuration
  const conf = {
    defaultFloor: 3,        // same level you used in routing
    venue: "1",             // ✅ MATCH your implementation
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

    // Fit map to YOUR venue area (based on your routing points)
    map.fitBounds(
      new window.woosmap.map.LatLngBounds(
        { lat: 43.60650, lng: 3.92170 }, // southwest
        { lat: 43.60665, lng: 3.92195 }  // northeast
      )
    );

    hideLoader();
  });
}

function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

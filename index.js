let map;
let indoorRenderer;        // <-- make global
let indoorService;         // <-- for routing
let currentDirections = null;
let steps = [];
let stepIndex = 0;

function initMap() {
  console.log("init map");

  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 1.3395609, lng: 103.7057931 },
    zoom: 19
  });

  const conf = { defaultFloor: 1, venue: "120", responsive: "desktop" };
  const widgetConf = { units: "metric" };

  indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf);
  indoorRenderer.setMap(map);

  indoorService = new window.woosmap.map.IndoorService();

  indoorRenderer.addListener("indoor_feature_selected", (feature) => {
    console.log("Feature selected:", feature);
  });

  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log("Venue loaded:", venue);

    map.fitBounds(new window.woosmap.map.LatLngBounds(
      { lat: 1.3384293, lng: 103.7041998 },
      { lat: 1.3406925, lng: 103.7073863 }
    ));

    hideLoader();

    // OPTIONAL: auto create a test route when venue is ready
    // window.makeRouteTest();
  });

  indoorRenderer.addListener("indoor_highlight_step", (step) => {
    console.log("HIGHLIGHT STEP:", step);
    console.log("STEP END LOCATION:", step?.end_location);
  });
}

// ====== CONTROL FUNCTIONS Android can call ======

// 1) Move blue dot
window.updateUserLocation = function(lat, lng, level, bearing = 0, focus = false) {
  if (!indoorRenderer) return "not_ready";
  indoorRenderer.getRenderer().setUserLocation(lat, lng, level, bearing, focus);
  return "ok";
};

// 2) Create route (so steps exist)
window.makeRouteTest = function() {
  if (!indoorService) return "not_ready";

  const req = {
    venueId: "120",
    units: "metric",
    origin: { lat: 1.33990, lng: 103.70650 },
    originLevel: 1,
    destination: { lat: 1.34010, lng: 103.70690 },
    destinationLevel: 1
  };

  indoorService.directions(req, (directions) => {
    console.log("DIRECTIONS:", directions);
    currentDirections = directions;
    steps = directions.routes?.[0]?.legs?.[0]?.steps || [];
    stepIndex = 0;

    indoorRenderer.setDirections(directions);

    // highlight first step if exists
    if (steps.length) {
      indoorRenderer.getRenderer().highlightStep(steps[0], true, false, false);
      console.log("STEP 0 END:", steps[0].end_location);
    }
  });

  return "routing_requested";
};

// 3) Next step (your timer / beacon triggers this)
window.nextStep = function() {
  if (!steps.length) return "no_steps";

  stepIndex = Math.min(stepIndex + 1, steps.length - 1);
  indoorRenderer.getRenderer().highlightStep(steps[stepIndex], true, false, false);

  console.log("NOW STEP:", stepIndex, "END:", steps[stepIndex].end_location);
  return `ok_${stepIndex}`;
};

function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

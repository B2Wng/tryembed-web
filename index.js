let map;
let indoorRenderer;        // <-- make global
let indoorService;         // <-- for routing
let currentDirections = null;
let steps = [];
let stepIndex = 0;
let renderer = null;
let validLevels = new Set();

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
    renderer = indoorRenderer.getRenderer();
    validLevels = new Set((venue.levels || []).map(l => l.level)); // venue carries levels :contentReference[oaicite:2]{index=2}
  });

  indoorRenderer.addListener("indoor_highlight_step", (step) => {
    console.log("HIGHLIGHT STEP:", step);
    console.log("STEP END LOCATION:", step?.end_location);
  });
}

// ====== CONTROL FUNCTIONS Android can call ======

// 1) Move blue dot
window.updateUserLocation = function(lat, lng, level, bearing = 0, focus = false) {
  if (!renderer) return "not_ready";

  if (!validLevels.has(level)) return "invalid_level";

  // If isUserInsideVenue exists in your version, use it; otherwise rely on warning
  if (typeof renderer.isUserInsideVenue === "function" && !renderer.isUserInsideVenue(lat, lng)) {
    return "outside_venue";
  }

  renderer.setUserLocation(lat, lng, level, bearing, focus);
  return "ok";
};

// 2) Create route (so steps exist)
window.makeRouteTest = function() {
  if (!indoorService) return "not_ready";

  const req = {
    venueId: "120",
    units: "metric",
    origin: new window.woosmap.map.LatLng(1.33990, 103.70650),
    originLevel: 1,
    destination: new window.woosmap.map.LatLng(1.34010, 103.70690),
    destinationLevel: 1
  };

  indoorService.directions(req, (directions) => {
    console.log("DIRECTIONS:", directions);

    steps = directions.routes?.[0]?.legs?.[0]?.steps || [];
    stepIndex = 0;

    indoorRenderer.setDirections(directions); // ok for widget usage :contentReference[oaicite:3]{index=3}

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
  const s = steps[stepIndex];

  indoorRenderer.getRenderer().highlightStep(s, true, false, false);
  console.log("NOW STEP:", stepIndex, "END:", s.end_location);

  return `ok_${stepIndex}`;
};


function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

let map;
let indoorRenderer;
let indoorService;
let venueReady = false;
let routeReady = false;

let steps = [];
let stepIndex = 0;

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 1.3395609, lng: 103.7057931 },
    zoom: 19
  });

  const conf = { defaultFloor: 1, venue: "120", responsive: "desktop" };
  const widgetConf = { units: "metric" };

  indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf);
  indoorRenderer.setMap(map);

  indoorService = new window.woosmap.map.IndoorService();

  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log("Venue loaded:", venue);
    venueReady = true;
    hideLoader();
  });
}

// call from Android only after venueReady
window.makeRouteTest = function() {
  if (!venueReady) return "venue_not_ready";
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

    indoorRenderer.setDirections(directions);

    routeReady = steps.length > 0;
    console.log("routeReady:", routeReady, "steps:", steps.length);
  });

  return "routing_requested";
};

window.updateUserLocation = function(lat, lng, level, bearing = 0, focus = false) {
  if (!venueReady) return "venue_not_ready";
  indoorRenderer.getRenderer().setUserLocation(lat, lng, level, bearing, focus);
  return "ok";
};

window.nextStep = function() {
  if (!routeReady) return "no_steps_yet";

  stepIndex = Math.min(stepIndex + 1, steps.length - 1);
  indoorRenderer.getRenderer().highlightStep(steps[stepIndex], true, false, false);

  console.log("NOW STEP:", stepIndex, "END:", steps[stepIndex].end_location);
  return `ok_${stepIndex}`;
};

window.isVenueReady = () => venueReady;
window.isRouteReady = () => routeReady;

window.initMap = initMap;

let map;
let widget; // IndoorWidget instance

function initMap() {
  console.log("initMap called");

  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 1.3395609, lng: 103.7057931 },
    zoom: 19
  });

  const rendererOptions = {
    venue: "120",
    defaultFloor: 1,
    responsive: "desktop"
  };

  const widgetOptions = {
    units: "metric"
  };

  widget = new window.woosmap.map.IndoorWidget(widgetOptions, rendererOptions);
  widget.setMap(map);

  widget.addListener("indoor_venue_loaded", (venue) => {
    console.log("✅ indoor_venue_loaded", venue);
  });
}

// Android will call this:
window.setUser = function (lat, lng, level, forceFocus) {
  console.log("📍 setUser called:", lat, lng, level, forceFocus);

  if (!widget) {
    console.warn("widget not ready yet");
    return "widget_not_ready";
  }

  const renderer = widget.getRenderer();
  renderer.setUserLocation(lat, lng, level, 0, forceFocus);

  // Return something so Android can see a result (optional)
  return "ok";
};

window.initMap = initMap;

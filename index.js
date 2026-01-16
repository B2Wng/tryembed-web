let map;
let indoorRenderer;
let indoorNavigation;
let indoorService;
let venue;

function initMap() {
  venue = "1";

  map = new window.woosmap.map.Map(
    document.getElementById("map"),
    { center: { lat: 43.6066, lng: 3.9218 } }
  );

  const conf = {
    venue: venue,
    responsive: "desktop"
  };

  indoorRenderer = new window.woosmap.map.IndoorRenderer(conf);
  indoorRenderer.setMap(map);

  indoorRenderer.addListener("indoor_venue_loaded", () => {
    indoorService = new window.woosmap.map.IndoorService();

    const request = {
      venueId: "1",
      origin: new window.woosmap.map.LatLng(43.60659127, 3.92172824),
      originLevel: 3,
      destination: new window.woosmap.map.LatLng(43.60651833, 3.92188677),
      destinationLevel: 3,
      units: "metric",
      originId: null,
      destinationId: null
    };

    indoorService.directions(request, (response) => {
      if (response) {
        indoorRenderer.setDirections(response);
        indoorNavigation = new window.woosmap.map.NavigationWidget(
          indoorRenderer,
          exitNavigation
        );
        indoorNavigation.setMap(map);
        hideLoader();
      }
    });
  });
}

function exitNavigation() {
  indoorNavigation.setMap(null);
  indoorRenderer.setDirections(null);
}

function hideLoader() {
  const loader = document.querySelector(".progress");
  if (loader) loader.remove();
}

window.initMap = initMap;

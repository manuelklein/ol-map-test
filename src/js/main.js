import '../css/style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Icon, Style, Stroke, Fill, Circle as CircleStyle} from 'ol/style.js';
import * as locations from '../config/locations.json'
import {circular} from 'ol/geom/Polygon';

// create map focused on yax's hut
const yaxshutLonLat = [8.586178, 48.881013]; // switch coordiinates received from Google Maps in order Lat Lon
const yaxshutWebMercator = fromLonLat(yaxshutLonLat);
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: yaxshutWebMercator,
    zoom: 18
  })
});

// display station locations
// create marker features from locations json
let iconFeatures = [];
for(var key in locations) {
  let coordinate = fromLonLat(locations[key]);
  let feature = new Feature({
    geometry: new Point(coordinate),
    name: 'Test country',
    taboo: 'chocolate',
  });
  iconFeatures.push(feature);
}
// set marker styles
const geoStyleStation = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({color: 'black'}),
    stroke: new Stroke({
      color: 'white',
      width: 2,
    }),
  }),
});
iconFeatures.forEach(element => {
  element.setStyle(geoStyleStation)
});
// add markers to map via VectorLayer
map.addLayer(
  new VectorLayer({
    source: new VectorSource({
      features: iconFeatures
    }),
    name: 'stations'
  })
);

// display user position
// create VectorLayer for user position
const source = new VectorSource();
const layer = new VectorLayer({
  source: source,
  name: 'userposition',
});
map.addLayer(layer);
// get user position from GPS
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    function (pos) {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      const accuracy = circular(coords, pos.coords.accuracy);
      source.clear(true);
      source.addFeatures([
        new Feature(
          accuracy.transform('EPSG:4326', map.getView().getProjection())
        ),
        new Feature(new Point(fromLonLat(coords))),
      ]);
    },
    function (error) {
      alert(`ERROR: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
    }
  );
}
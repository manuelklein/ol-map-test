import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';

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
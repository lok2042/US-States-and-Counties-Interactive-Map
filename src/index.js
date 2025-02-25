"use strict";

import "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";

let map;
let info;

let statesGeojson;
let countiesGeojson;

let selectedState;

const renderMap = async () => {
  map = L.map("map");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const states = await getStates();

  statesGeojson = L.geoJson(states, {
    onEachFeature: onEachState,
  }).addTo(map);

  map.fitBounds(statesGeojson.getBounds());

  info = L.control();

  info.onAdd = function (_map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  info.update = function (props) {
    if (props && props.NAME) {
      this._div.innerHTML = "<h4>County</h4>" + `<b>${props.NAME}</b>`;
    } else if (props && props.name) {
      this._div.innerHTML = "<h4>State</h4>" + `<b>${props.name}</b>`;
    } else {
      this._div.innerHTML = "Hover over a state or county";
    }
  };

  info.addTo(map);

  createResetDefaultStateButton();
};

////////////////////////////////////////////
// State

async function getStates() {
  const response = await fetch("./assets/us-states.geojson");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

function onEachState(_feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToState,
  });
}

async function zoomToState(e) {
  const state = e.target.feature.properties.name;

  if (selectedState === state) return;

  if (selectedState !== undefined) {
    map.removeLayer(countiesGeojson);
  }

  selectedState = state;

  map.fitBounds(e.target.getBounds());

  const counties = await getCounties(state);

  const geoJson = {
    type: "FeatureCollection",
    features: counties,
  };

  countiesGeojson = L.geoJson(geoJson, {
    onEachFeature: onEachCounty,
  }).addTo(map);
}

////////////////////////////////////////////
// County

async function getCounties(state) {
  const response = await fetch("assets/us-counties.geojson");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const counties = data.features.filter(
    (x) => x.properties.STATEFP === stateNameToFips(state)
  );

  return counties;
}

function onEachCounty(_feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToCounty,
  });
}

async function zoomToCounty(e) {
  map.fitBounds(e.target.getBounds());
}

////////////////////////////////////////////
// Event Handlers

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  statesGeojson.resetStyle(e.target);
  info.update();
}

function resetDefaultState() {
  if (selectedState === undefined) return;

  map.removeLayer(countiesGeojson);
  selectedState = undefined;

  map.fitBounds(statesGeojson.getBounds());
}

////////////////////////////////////////////
// Controls

function createResetDefaultStateButton() {
  L.easyButton("fa-up-down-left-right", resetDefaultState).addTo(map);
}

////////////////////////////////////////////
// Utilities

function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

function stateNameToFips(stateName) {
  const stateCodes = {
    Alabama: "01",
    Alaska: "02",
    Arizona: "04",
    Arkansas: "05",
    California: "06",
    Colorado: "08",
    Connecticut: "09",
    Delaware: "10",
    "District of Columbia": "11",
    Florida: "12",
    Georgia: "13",
    Hawaii: "15",
    Idaho: "16",
    Illinois: "17",
    Indiana: "18",
    Iowa: "19",
    Kansas: "20",
    Kentucky: "21",
    Louisiana: "22",
    Maine: "23",
    Maryland: "24",
    Massachusetts: "25",
    Michigan: "26",
    Minnesota: "27",
    Mississippi: "28",
    Missouri: "29",
    Montana: "30",
    Nebraska: "31",
    Nevada: "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    Ohio: "39",
    Oklahoma: "40",
    Oregon: "41",
    Pennsylvania: "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    Tennessee: "47",
    Texas: "48",
    Utah: "49",
    Vermont: "50",
    Virginia: "51",
    Washington: "53",
    "West Virginia": "54",
    Wisconsin: "55",
    Wyoming: "56",
  };

  return stateCodes[stateName] || "Unknown";
}

renderMap();

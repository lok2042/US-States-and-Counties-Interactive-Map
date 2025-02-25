# US States and Counties Interactive Map

This project builds upon the interactive choropleth map tutorial from Leaflet (https://leafletjs.com/examples/choropleth/), extending it to display US counties within a selected state.

**Key Features:**

- **Interactive US State Selection:** Hover on a state to highlight it.
- **Dynamic County Rendering:** Upon state selection, the map dynamically renders the counties within that state.

**Current Limitations:**

- Currently, polygon colors and map legends are removed due to the absence of population density (or similar) data in the US counties GeoJSON.
- The map only shows the state and county boundaries.

**Future Enhancements:**

- Reintroduction of choropleth coloring and map legends once a suitable GeoJSON dataset with relevant data (e.g., population density) for US counties is obtained.

**Inspiration:**

- Leaflet Choropleth Tutorial: https://leafletjs.com/examples/choropleth/

## Initialize the Project

```sh
npm init -y
```

## Install Dependencies

```sh
npm install --save-dev parcel
npm install leaflet
npm install leaflet-easybutton
```

## Configure `package.json`

Modify the `scripts` section in `package.json`:

```json
"scripts": {
  "start": "parcel index.html",
  "build": "parcel build index.html"
}
```

## Assets

Move the `/assets` folder containing `us-states.json` and `us-counties.json` into the `/dist` directory.

## Run the Project

```sh
npm start
```

## Build for Production

```sh
npm run build
```

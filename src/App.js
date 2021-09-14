import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibG9yZW5hcnVpeiIsImEiOiJja3RrOHg5cWYwNHZtMnVwZXB2NHgwdTU3In0.XbSDbq4TPHFlPH4mvDiA9A';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.082);
  const [lat, setLat] = useState(4.610);
  const [zoom, setZoom] = useState(11);


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  })

  useEffect(() => {
    map.current.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource('maine', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            // These coordinates outline Maine.
            'coordinates': [
              [
                [
                  -74.0654748,
                  4.7600065
                ],
                [
                  -74.0654748,
                  4.7600065
                ],
                [
                  -74.0223662,
                  4.746663
                ],
                [
                  -74.0285491,
                  4.7124476
                ],
                [
                  -74.0285491,
                  4.7124476
                ],
                [
                  -74.0278621,
                  4.6994453
                ],
                [
                  -74.0376517,
                  4.6804547
                ],
                [
                  -74.0546546,
                  4.6861006
                ],
                [
                  -74.0659899,
                  4.6898645
                ],
                [
                  -74.0738903,
                  4.7194619
                ],
                [
                  -74.0654748,
                  4.7600065
                ]
              ]
            ]
          }
        }
      });

      // Add a new layer to visualize the polygon.
      map.current.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'maine', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#ff0000', // blue color fill
          'fill-opacity': 0.5
        }
      });
      // Add a black outline around the polygon.
      map.current.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'maine',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 3
        }
      });
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitud: {lng} | Latitud: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />

    </div>
  );
}

export default App;

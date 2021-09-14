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

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    
    </div>
  );
}

export default App;

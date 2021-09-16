import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { db } from './firebase/firebaseConfig';

function Mapas() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.082);
  const [lat, setLat] = useState(4.610);
  const [zoom, setZoom] = useState(11);

  /* const callback = (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("Add mapa", change.doc.data());
        //agregar nueva zona en el mapa

      }
      if (change.type === "modified") {
        // console.log("Modified city: ", change.doc.data());
        //actualizar zona, sobre demanda oferta o ubicación
      }
      if (change.type === "removed") {
        // console.log("Removed city: ", change.doc.data());
        //Quitar zona del mapa
      }
    });
  } */

  mapboxgl.accessToken = 'pk.eyJ1IjoibG9yZW5hcnVpeiIsImEiOiJja3RrOHg5cWYwNHZtMnVwZXB2NHgwdTU3In0.XbSDbq4TPHFlPH4mvDiA9A';


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
      
      
      const coorden = db.collection("Zonas").onSnapshot((querySnapshot) => {       
        querySnapshot.forEach((doc) => {
          console.log("Doc´foreach ",doc.id);
          let data = [];
          doc.data().poligono.forEach((coordenada) => {
            let cord = [];
            let latitude = coordenada.latitude;
            let longitude = coordenada.longitude;
            cord.push(latitude);
            cord.push(longitude);
            data.push(cord)
          })
          //console.log(JSON.stringify(data))
          console.log('maine' + doc.id);
          map.current.addSource('maine' + doc.id, {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates':[
                   data
                ]
              }
            }
          });
          
          map.current.addLayer({
            'id': 'outline3' + doc.id,
            'type': 'fill',
            'source': 'maine' + doc.id, // reference the data source
            'layout': {},
            'paint': {
              'fill-color': color, // blue color fill
              'fill-opacity': 0.5
            }
          });
          // Add a black outline around the polygon.
          map.current.addLayer({
            'id': 'outline4' + doc.id,
            'type': 'line',
            'source': 'maine '+ doc.id,
            'layout': {},
            'paint': {
              'line-color': '#000',
              'line-width': 3
            }
          });
        });
        return () => coorden()
      })
    })
  }, [])
    
     /* useEffect(() => {
    map.current.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource('main', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            
            'coordinates': [
              [
              [ -74.0721293,4.5753983],
              [-74.0721293, 4.5753983],
              [ -74.092052,4.591825 ],
              [-74.1133487,4.5976428],
              [-74.1298364,4.6000383],
              [-74.1356758,4.5966161],
              [-74.1284624,4.575056],
              [-74.1229665,4.5569177],
              [-74.1222795,4.5209818],
              [-74.1167836,4.4959968],
              [-74.0951435,4.4939432],
              [-74.0820907,4.5086606],
              [-74.0810602,4.5333029],
              [-74.0838081,4.5521263],
              [-74.0724728,4.5757405]
            ]
          ]
          }
        }
      });
      map.current.addLayer({
        'id': 'outline1',
        'type': 'fill',
        'source': 'main', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#ff0000', // blue color fill
          'fill-opacity': 0.5
        }
      });
      // Add a black outline around the polygon.
      map.current.addLayer({
        'id': 'outline2',
        'type': 'line',
        'source': 'main',
        'layout': {},
        'paint': {
          'line-color': '#33ff6e',
          'line-width': 3
        }
      });
    });
    }, []);  
 */


  return (
    <div>
      <div className="sidebar">
        Longitud: {lng} | Latitud: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />

    </div>
  );
}
export default Mapas;
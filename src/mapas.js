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


      // create the popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Construction on the Washington Monument began in 1848.'
      );

      // create DOM element for the marker
      const el = document.createElement('div');
      el.id = 'marker';

      // create the marker
      new mapboxgl.Marker(el)
        .setLngLat([-74.04045210439463, 4.770416860152286])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map.current);
      const coorden = db.collection("Zonas").onSnapshot((snapshot) => {
        console.log(snapshot)

        snapshot.docChanges().forEach((change) => {
          console.log(change)
          const doc = change.doc
          if (change.type === "added" || change.type === "modified") {
            /* console.log("Doc´foreach ",doc.id); */
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
            /* console.log('maine' + doc.id); */
            if (map.current.getSource('maine' + doc.id)) {

              map.current.getSource('maine' + doc.id).setData(
                {
                  'type': 'geojson',
                  'data': {
                    'type': 'Feature',
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [
                        data
                      ]
                    }
                  }
                });
            }
            else {
              map.current.addSource('maine' + doc.id, {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                      data
                    ]
                  }
                }
              });
            }





            let mensajeros = doc.data().mensajeros;
            let servicios = doc.data().servicios;
            /* let operacion = (1-(servicios/mensajeros));
            let operacion2 = -(100*operacion); */
            let operacion2 = ((servicios / mensajeros) * 100);
            console.log(doc.id + 'mensajeros' + doc.data().mensajeros)
            console.log(doc.id + 'servicios' + doc.data().servicios)
            console.log(doc.id, operacion2)
            if (operacion2 >= 50) {
              map.current.addLayer({
                'id': 'outline3' + doc.id,
                'type': 'fill',
                'source': 'maine' + doc.id, // reference the data source
                'layout': {},
                'paint': {
                  'fill-color': "#ff2121", // blue color fill
                  'fill-opacity': 0.5
                }
              });
            } else if (operacion2 >= 25 & operacion2 < 50) {
              map.current.addLayer({
                'id': 'outline3' + doc.id,
                'type': 'fill',
                'source': 'maine' + doc.id, // reference the data source
                'layout': {},
                'paint': {
                  'fill-color': '#ffee21', // blue color fill
                  'fill-opacity': 0.5
                }
              });
            } else {
              map.current.addLayer({
                'id': 'outline3' + doc.id,
                'type': 'fill',
                'source': 'maine' + doc.id, // reference the data source
                'layout': {},
                'paint': {
                  'fill-color': '#14f803', // blue color fill
                  'fill-opacity': 0.5
                }
              });
            }




            // Add a black outline around the polygon.
            map.current.addLayer({
              'id': 'outline4' + doc.id,
              'type': 'line',
              'source': 'maine' + doc.id,
              'layout': {},
              'paint': {
                'line-color': '#689309',
                'line-width': 1
              }
            });
            map.current.on('click', 'outline3' + doc.id, (e) => {
              console.log(e.lngLat.lat)
              console.log(e.lngLat.lng)
              // Copy coordinates array.
              const coordinates = [e.lngLat.lng, e.lngLat.lat];
              const description = 'prueba';

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map.current);
            });
          }
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
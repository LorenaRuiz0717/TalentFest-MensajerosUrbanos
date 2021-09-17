import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { db } from './firebase/firebaseConfig';
import logotype from './assets/logotype.png'
import Button from '@mui/material/Button';
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import Swal from 'sweetalert2';
import Box from './box.png'
import Helmet from './Helmet.png'
import { auth } from './firebase/firebaseConfig';
import { useHistory } from 'react-router-dom'
import ReactWhatsapp from 'react-whatsapp';



function Mapas() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.082);
  const [lat, setLat] = useState(4.610);
  const [zoom, setZoom] = useState(11);
  const [pointsRed, setPointsRed] = useState([]);
  const [pointsYellow, setPointsYellow] = useState([]);
  const [pointsGreen, setPointsGreen] = useState([]);

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
      el.id = '';

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


          if (change.type === "added") {
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
              // map.current.removeLayer('maine' + doc.id)
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
            let intPorcentaje = Math.round(operacion2)
            console.log(doc.id + 'mensajeros' + doc.data().mensajeros)
            console.log(doc.id + 'servicios' + doc.data().servicios)
            console.log(doc.id, operacion2)
            if (operacion2 >= 50) {
              pointsRed.push('outline3' + doc.id);
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
              pointsYellow.push('outline3' + doc.id);
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
              pointsGreen.push('outline3' + doc.id);
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
            if (map.current.getLayer('maine' + doc.id)) {
              map.current.getLayer('maine' + doc.id).setData(
                {
                  'id': 'outline4' + doc.id,
                  'type': 'line',
                  'source': 'maine' + doc.id,
                  'layout': {},
                  'paint': {
                    'line-color': '#689309',
                    'line-width': 1
                  }

                });
            }


            map.current.on('click', 'outline3' + doc.id, (e) => {
              console.log(e.lngLat.lat)
              console.log(e.lngLat.lng)
              // Copy coordinates array.
              const coordinates = [e.lngLat.lng, e.lngLat.lat];
              // const coordinates2 = [-74.3761,4.7550];
              const description = doc.id + `<br>` + `<br>` + `<img src='${Box}'> \n` + 'Mensajeros: ' + doc.data().mensajeros + `<br>` + `<br>` + `<img src='${Helmet}'> \n` + 'Servicios: ' + doc.data().servicios + `<br>` + `<br>` + 'Ocupación al' + `\n` + intPorcentaje + '%';

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

          } else if (change.type === "modified") {
            console.log('modified')
            let data = [];
            doc.data().poligono.forEach((coordenada) => {
              let cord = [];
              let latitude = coordenada.latitude;
              let longitude = coordenada.longitude;
              cord.push(latitude);
              cord.push(longitude);
              data.push(cord)

            });
            if (map.current.getSource('maine' + doc.id)) {
              // map.current.removeLayer('maine' + doc.id)
              map.current.getSource('maine' + doc.id).setData(
                {
                  'type': 'FeatureCollection',
                  "features": [{
                    "type": "Feature",
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [data]
                    }
                  }]
                });
            }
            let mensajeros = doc.data().mensajeros;
            let servicios = doc.data().servicios;
            /* let operacion = (1-(servicios/mensajeros));
            let operacion2 = -(100*operacion); */
            let operacion2 = ((servicios / mensajeros) * 100);
            let intPorcentaje = Math.round(operacion2)
            console.log(doc.id + 'mensajeros' + doc.data().mensajeros)
            console.log(doc.id + 'servicios' + doc.data().servicios)
            console.log(doc.id, operacion2)
            let indexRed = pointsRed.indexOf('outline3' + doc.id)
            let indexYellow = pointsYellow.indexOf('outline3' + doc.id)
            let indexGreen = pointsGreen.indexOf('outline3' + doc.id)
            if (indexRed > (-1)) {
              pointsRed.splice(indexRed, 1)
            } else if (indexYellow > (-1)) {
              pointsYellow.splice(indexYellow, 1)
            } else {
              pointsGreen.splice(indexGreen, 1)
            }
            if (operacion2 >= 50) {
              pointsRed.push('outline3' + doc.id);
              map.current.setPaintProperty('outline3' + doc.id, 'fill-color', "#ff2121");
              map.current.setPaintProperty('outline3' + doc.id, 'fill-opacity', 0.5);


            } else if (operacion2 >= 25 & operacion2 < 50) {
              pointsYellow.push('outline3' + doc.id);
              map.current.setPaintProperty('outline3' + doc.id, 'fill-color', '#ffee21');
              map.current.setPaintProperty('outline3' + doc.id, 'fill-opacity', 0.5);


            } else {
              pointsGreen.push('outline3' + doc.id);
              map.current.setPaintProperty('outline3' + doc.id, 'fill-color', '#14f803');
              map.current.setPaintProperty('outline3' + doc.id, 'fill-opacity', 0.5);


            }
            map.current.on('click', 'outline3' + doc.id, (e) => {
              console.log(e.lngLat.lat)
              console.log(e.lngLat.lng)
              // Copy coordinates array.
              const coordinates = [e.lngLat.lng, e.lngLat.lat];
              // const coordinates2 = [-74.3761,4.7550];
              const description = doc.id + `<br>` + `<br>` + `<img src='${Box}'> \n` + 'Mensajeros: ' + doc.data().mensajeros + `<br>` + `<br>` + `<img src='${Helmet}'> \n` + 'Servicios: ' + doc.data().servicios + `<br>` + `<br>` + 'Ocupación al' + `\n` + intPorcentaje + '%';

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
          console.log('Point: ' + pointsRed.length, pointsYellow.length, pointsGreen.length)
        });
        return () => coorden()
      })

    })
  }
    , [])


  const logout = () => {
    auth.signOut()
      .then(() => {
        history.push('/')
      })
  }

  const history = useHistory();

  return (
    <div>
      <div className='logoMapa'>
        <img src={logotype} alt="logotype" width='auto' height='80px' />
        <div className='alert'>
          <span>
            <h2>BOG-COL</h2>
            <h3>Ciudad</h3>
          </span>
          <span>
            <Alert severity="error" >
              <AlertTitle></AlertTitle>
              <strong><h3 onChange={() => setPointsRed(pointsRed)}> {pointsRed.length}</h3></strong>
            </Alert>
          </span>
          <span>
            <Alert severity="warning">
              <AlertTitle></AlertTitle>
              <strong> <h3 onChange={() => setPointsYellow(pointsYellow)}> {pointsYellow.length}</h3></strong>
            </Alert>
          </span>
          <span>
            <Alert severity="success">
              <strong><h3 onChange={() => setPointsGreen(pointsGreen)}> {pointsGreen.length}</h3></strong>
            </Alert>
          </span>
          <span className='boton'>
            <ReactWhatsapp number="+573004305325" message=" Hola *Mensajero Urbano* en la zona 6 te necesita.
Recuerda que tienes un incentivo del *10%* para realizar servicios en esta zona.

 Gracias por ayudarnos a cubrir esta zona.

Ingresa aquí y ve a la zona https://bit.ly/2XAsGYi
" element={Button} variant="outlined" color="error" sx={{ mt: 2, mb: 2 }}>Enviar Alerta</ReactWhatsapp>
            <span>
              <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={logout}>Cerrar Sesiòn</Button>
            </span>
          </span>
        </div>
      </div>
      <div ref={mapContainer} className="map-container">
        <h4 className="sidebar">
          Longitud: {lng} | Latitud: {lat} | Zoom: {zoom}
        </h4>
      </div>
    </div>
  );
}
export default Mapas;
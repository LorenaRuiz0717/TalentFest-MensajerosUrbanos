import {db} from './firebaseConfig';
export function getPoligono(callback) {
  
    return db.collection("Zonas").onSnapshot(callback);

//     db.collection("Zonas").onSnapshot((querySnapshot) => {
//     let data = [];
//     querySnapshot.forEach((doc) => {
//         doc.data().poligono.forEach((coordenada)=>{
//         /*data.push(`${doc.data().poligono[0].latitude},${doc.data().poligono[0].longitude}`);*/
//         let cord =[];
//         let latitude = coordenada.latitude;
//         let longitude = coordenada.longitude;
//         cord.push(latitude);
//         cord.push(longitude);
//         data.push(cord)
//     })
//     });
//    return data
// });
}

/*
data.push(`${doc.data().poligono[0].latitude},${doc.data().poligono[0].longitude}`);
*/
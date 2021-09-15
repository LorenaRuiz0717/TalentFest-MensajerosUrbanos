import {db} from './firebaseConfig';
export function getPoligono() {
db.collection("Zonas").onSnapshot((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
        data.push({...doc.data().poligono})
        
    });
    console.log(data) 
});
}

/*
data.push(`${doc.data().poligono[0].latitude},${doc.data().poligono[0].longitude}`);
*/
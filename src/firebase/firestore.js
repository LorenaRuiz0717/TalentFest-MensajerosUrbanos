import {db} from './firebaseConfig';
export function getPoligono() {
db.collection("Zonas").get().then((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
        data.push(`${doc.data().poligono[0].latitude},${doc.data().poligono[0].longitude}`);
    });
    console.log(data);
});
}

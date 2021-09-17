import firebase from "firebase/app";
import 'firebase/auth';
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE_ppoYK55IzQzZh94vAOisbL4NUUXC_o",
  authDomain: "talentfest-mensajeros-urbanos.firebaseapp.com",
  projectId: "talentfest-mensajeros-urbanos",
  storageBucket: "talentfest-mensajeros-urbanos.appspot.com",
  messagingSenderId: "1051607467040",
  appId: "1:1051607467040:web:7d3365e8226d141b722845"
};
// Initialize Firebase
const fb =firebase.initializeApp(firebaseConfig);
export const auth = fb.auth();
export const db = fb.firestore();

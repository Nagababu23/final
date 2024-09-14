import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyD3hXolXfGbuhrpoq-gbdQqtgEnEh80wpY",
  authDomain: "linker-47c88.firebaseapp.com",
  projectId: "linker-47c88",
  storageBucket: "linker-47c88.appspot.com",
  messagingSenderId: "942587016546",
  appId: "1:942587016546:web:fa4ea374df649c172aa83b",
  measurementId: "G-5B2FKTG2ME"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app); 

export { app, auth, db, storage }; 

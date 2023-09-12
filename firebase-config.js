import {initializeApp, getApps, getApp} from "firebase/app";
import {getDatabase} from "firebase/database";


export const firebaseConfig = {
    apiKey: "AIzaSyA4C5V5oIE0r9c2xvTQiHM7a-RyORaKkpw",
    authDomain: "drugie-zycie.firebaseapp.com",
    databaseURL: "https://drugie-zycie-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "drugie-zycie",
    storageBucket: "drugie-zycie.appspot.com",
    messagingSenderId: "53229084395",
    appId: "1:53229084395:web:e2883122ee2366a36da8ae",
    measurementId: "G-H9MFH660H9"

};

let firebase = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseApp = firebase;
export const firebaseDb = getDatabase(firebaseApp);






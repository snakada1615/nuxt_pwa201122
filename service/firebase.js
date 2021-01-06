import firebase from "firebase"
import 'firebase/auth'
import 'firebase/database'


if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDvKPZ5i_uhsa5iay8U01hMG4wyAK6Nols",
    authDomain: "nuxt-first-237f0.firebaseapp.com",
    databaseURL: "https://nuxt-first-237f0.firebaseio.com",
    projectId: "nuxt-first-237f0",
    storageBucket: "nuxt-first-237f0.appspot.com",
    messagingSenderId: "992060477484",
    appId: "1:992060477484:web:0ae244982aa3415aa24189",
    measurementId: "G-BMHH9K5NJL"
  })
}


export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export default firebase


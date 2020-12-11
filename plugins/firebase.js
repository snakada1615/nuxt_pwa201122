import firebase from "firebase"

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

export default firebase

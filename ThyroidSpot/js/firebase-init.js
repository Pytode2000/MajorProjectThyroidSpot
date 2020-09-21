// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAJOmgi_23UV7szjryl9Bv6Bd9uK13C0KU",
    authDomain: "thyroidspot.firebaseapp.com",
    databaseURL: "https://thyroidspot.firebaseio.com",
    projectId: "thyroidspot",
    storageBucket: "thyroidspot.appspot.com",
    messagingSenderId: "652518093634",
    appId: "1:652518093634:web:5cc7a86bd8119cfcfe0edb",
    measurementId: "G-VLNKVKH5GT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// This JS file is imported by the navbar, so all pages (EXCEPT verify-email) will have this file.
// This file allows the usage of Firebase Auth functions.
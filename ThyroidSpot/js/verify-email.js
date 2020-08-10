// Firebase configuration (THIS PAGE NEEDS THIS BECAUSE navbar.html WILL NOT BE IMPORTED HERE).
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


// Send verification email 
function resendVerificationEmail() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function () {
        alert("A verification email has been sent to: " + user.email);
    }).catch(function (error) {
    });
}


// LOGOUT
function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';

    }).catch(function (error) {
    });
}


// Refresh
function refresh() {
    window.location.reload();
    return false;
}


// Check state
firebase.auth().onAuthStateChanged(firebaseUser => {
    const text = document.getElementById("welcome-text");
    text.innerHTML = "<b>Verified: </b>" + firebaseUser.emailVerified + "<br><b>Email: </b>" + firebaseUser.email + "<br><b>UID: </b>" + firebaseUser.uid + "<br>";
    // User is logged in.
    if (firebaseUser) {
        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            // sessionStorage.setItem("user_logged_in", 'y');
            window.location.href = 'profile.html';
        }
        // User's email is not verified.
        else {
            // sessionStorage.setItem("user_logged_in", 'y');
        }
    }
    // User not logged in.
    else {
        // sessionStorage.setItem("user_logged_in", 'n');
    }
});






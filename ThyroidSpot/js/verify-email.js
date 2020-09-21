// Firebase configuration (THIS PAGE NEEDS THIS BECAUSE navbar.html WILL NOT BE IMPORTED in this page).
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
        $('#alertEmailModal').modal('toggle'); // Informs user that an email has been sent.
        console.log("Sent email.");
    }).catch(function (error) {
    });
}


// LOGOUT
function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = 'account.html';

    }).catch(function (error) {
    });
}


// Refresh
function refresh() {
    window.location.reload();
    return false;
}

// (THIS PAGE NEEDS THIS BECAUSE navbar.html WILL NOT BE IMPORTED HERE).
// Check state. This only checks if user's email is verified. If it is, then user will be redirected away. If not, user is stuck on this page until they
// 1. logout.
// 2. verify their email.
firebase.auth().onAuthStateChanged(firebaseUser => {
    const text = document.getElementById("welcome-text");
    text.innerHTML = "<b>Verified: </b>" + firebaseUser.emailVerified + "<br><b>Email: </b>" + firebaseUser.email + "<br><b>UID: </b>" + firebaseUser.uid + "<br>";
    // User is logged in.
    if (firebaseUser) {
        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            window.location.href = 'index.html';
            // When in index.html, the firebase-log-state.js will be imported. All the states will be tagged to the user then, so I do not 
            // need to repeat all of the firebase-log-state.js code here. 
        }
        // User's email is not verified.
        else {
            // No action is required.
        }
    }
    // User not logged in (not possible, but its ok to leave this else statement here).
    else {
        // No action is required.
    }
});






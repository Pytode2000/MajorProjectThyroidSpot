// // Test script to test the different access control in the navigation bar.

// user_logged_in = "n"


// var user_logged_in = "y"

var user_account_type = "patient" // Placeholder unti l the "user" table is ready.
// // var user_account_type = "clinician"
// // var user_account_type = "admin"

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        // user_logged_in = 'y'
        sessionStorage.setItem("user_logged_in", 'y');
        sessionStorage.setItem("user_email", firebaseUser.email);
        console.log(firebaseUser.email)


        // btnLogout.classList.remove('hide');
        console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
    }
    else {
        sessionStorage.setItem("user_logged_in", 'n');
        console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
        // btnLogout.classList.add('hide');

    }
});

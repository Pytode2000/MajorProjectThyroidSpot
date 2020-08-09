// // Test script to test the different access control in the navigation bar.

// user_logged_in = "n"


// var user_logged_in = "y"

var user_account_type = "patient" // Placeholder unti l the "user" table is ready.
// // var user_account_type = "clinician"
// // var user_account_type = "admin"

firebase.auth().onAuthStateChanged(firebaseUser => {
    // User is logged in.
    if (firebaseUser) {
        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            console.log(firebaseUser.email);
            // user_logged_in = 'y'
            sessionStorage.setItem("user_logged_in", 'y');
            sessionStorage.setItem("user_email", firebaseUser.email);
            sessionStorage.setItem("uniqueid", firebaseUser.uid);
            console.log(firebaseUser.uid)
            console.log(firebaseUser.email)
            console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
        }
        // User's email is not verified.
        else {
            // If it loads too fast, subsequent functions in Register can't be called.
            setTimeout(function () {
                window.location.href = "verify-email.html";
            }, 2000);

            sessionStorage.setItem("user_logged_in", 'y');
            sessionStorage.setItem("user_email", firebaseUser.email);
        }


    }
    // User not logged in.
    else {
        sessionStorage.setItem("user_logged_in", 'n');
        sessionStorage.setItem("user_email", null);
        console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
        // btnLogout.classList.add('hide');

    }
});

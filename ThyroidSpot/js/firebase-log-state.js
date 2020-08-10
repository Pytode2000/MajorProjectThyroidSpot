/*  This .js file logs the current state of the user. 
    This .js file will be imported by almost all pages.
    The 2 variable in regard to the state of user are:
    a) "user_logged_in", a boolean based on whether user is logged in ('y') or not ('n').
    b) "user_account_type", a string retrieved from the "user" table. The 3 types are admin, clinician, and patient.
*/



var user_account_type = "patient" // Placeholder unti l the "user" table is ready.
// // var user_account_type = "clinician"
// // var user_account_type = "admin"

firebase.auth().onAuthStateChanged(firebaseUser => {
    // User is logged in.
    if (firebaseUser) {
        // Set a bunch of sessions for logged in state.
        sessionStorage.setItem("user_logged_in", 'y');
        sessionStorage.setItem("user_email", firebaseUser.email);
        sessionStorage.setItem("unique_id", firebaseUser.uid);
        console.log(firebaseUser.uid);
        console.log(firebaseUser.email);

        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            // Don't have to do anything because onclick login already redirects user to a page.
            console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
        }
        // User's email is not verified.
        else {
            // If it loads too fast, subsequent functions in Register can't be called.
            setTimeout(function () {
                // Redirect user to "verify-email.html"
                window.location.href = "verify-email.html";
            }, 2000);
        }

    }
    // User not logged in.
    else {
        sessionStorage.setItem("user_logged_in", 'n');
        sessionStorage.setItem("user_email", null);
        sessionStorage.setItem("unique_id", null);

        console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
    }
});

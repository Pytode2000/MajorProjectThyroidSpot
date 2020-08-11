/*  This .js file logs the current state of the user. 
    This .js file will be imported by almost all pages.
    The 2 variable in regard to the state of user are:
    a) "user_logged_in", a boolean based on whether user is logged in ('y') or not ('n').
    b) "user_account_type", a string retrieved from the "user" table. The 3 types are admin, clinician, and patient.
*/

var userURI = "https://localhost:44395/api/User/";

// User's account type is set in login function.

firebase.auth().onAuthStateChanged(firebaseUser => {
    // User is logged in.
    if (firebaseUser) {
        sessionStorage.setItem("user_logged_in", "y");
        sessionStorage.setItem("user_fb_uid", firebaseUser.uid)
        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            // If email is verified, on login/registration, GET "user" table's "account_type" via "user_id" (firebase unique id, or uid).
            currentUserArray = []
            $.ajax({
                type: 'GET',
                url: userURI + firebaseUser.uid,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    currentUserArray = data;
                    // console.log(currentUserArray.account_type);
                    sessionStorage.setItem("user_account_type", currentUserArray.account_type);
                }
            });

        }
        // User's email is not verified.
        else {
            // If it loads too fast, subsequent functions in Register can't be called.
            setTimeout(function () {
                window.location.href = "verify-email.html";
            }, 1000);
        }
    }
    // User not logged in.
    else {
        sessionStorage.setItem("user_logged_in", 'n');
        sessionStorage.setItem("user_account_type", "none")
        sessionStorage.setItem("user_fb_uid", "none")

    }

    console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
    console.log("Account type: " + sessionStorage.getItem("user_account_type"));
    console.log("User's UID: " + sessionStorage.getItem("user_fb_uid"));

});


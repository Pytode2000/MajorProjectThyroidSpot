/*  This JS file logs the current state of the user. 
    This JS file will be imported by almost all pages (except for verify-email.html).

    The 2 variable in regard to the state of user are:
    a) "user_logged_in", a boolean based on whether user is logged in ('y') or not ('n').
    b) "user_account_type", a string retrieved from the "user" table. The 3 types are admin, clinician, and patient.

    There are 2 additional sessions:
    a) "user_unique_id", a string of the user's firebase UID.
    b) "user_email", a string of the user's email address.
*/

// URI to manage user API.
var userURI = "https://localhost:44395/api/User/";

/* Firebase's inbuilt state checker.
First, it checks if the user is logged in.
If no, sessions are set to specify the user is not logged in (e.g., sessionStorage.setItem("user_logged_in", 'n')).
Else, "user_logged_in" session is set to 'y'. And then, the next condition checks if the user's email is verified.
If user's email is verified, a GET function followed by a try catch block is called.
It GETs the user's "user" table instance and then TRIES to store information as session. If it stores, then all is well.
If not, it means that the user has been deleted by the admin in the manage.html page. If so, then this user's Firebase Auth instance will be removed. 
A notification will be shown.
*/
firebase.auth().onAuthStateChanged(firebaseUser => {
    // User is logged in.
    if (firebaseUser) {

        // Set session to specify user is logged in.
        sessionStorage.setItem("user_logged_in", "y");

        // User's email is verified.
        if (firebaseUser.emailVerified === true) {
            // If email is verified, on login/registration, GET "user" table's "account_type" via "user_id" (firebase unique id, or uid).
            currentUserArray = []

            $.ajax({
                type: 'GET',
                async: false,
                url: userURI + firebaseUser.uid,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    currentUserArray = data;

                    // TRY to set the GET-ed information (account_type) as session.
                    try {
                        sessionStorage.setItem("user_unique_id", firebaseUser.uid);
                        sessionStorage.setItem("user_email", firebaseUser.email);
                        sessionStorage.setItem("user_account_type", currentUserArray.account_type);

                    } catch (err) {
                        // If the try block fails, it means that this user has been deleted by the admin. All SQL information for this user has been removed, except for 
                        // the Firebase Auth instance. As such, remove the Firebase Auth instance and show a notification before the user is redirected out.
                        console.log("Account is deleted already.")
                        console.log(sessionStorage.getItem("user_email"));
                        alert("This account has already been deleted!")
                        if (firebaseUser != null) {
                            // Remove Firebase Auth instance.
                            firebaseUser.delete().then(function () {
                                // User deleted from FB.
                                // Set sessions to not logged in.
                                console.log("Firebase instance deleted.");
                                sessionStorage.setItem("user_logged_in", 'n');
                                sessionStorage.setItem("user_account_type", "none")
                                sessionStorage.setItem("user_email", "none");
                                sessionStorage.setItem("user_unique_id", "none")

                            }).catch(function (error) {
                                // No action required.
                                console.log("FB user null")

                            });
                        }
                        else {
                            // No action required.
                            console.log("FB user null 2")
                        }


                    }
                }
            });

        }
        // User's email is not verified.
        else {
            // If it loads too fast, subsequent functions in Register can't be called. Wait 2 seconds.
            setTimeout(function () {
                // Redirect user to "verify-email.html"
                window.location.href = "verify-email.html";
            }, 2000);
        }
    }
    // User not logged in.
    else {
        // Set sessions to specify user is not logged in.
        sessionStorage.setItem("user_logged_in", 'n');
        sessionStorage.setItem("user_account_type", "none")
        sessionStorage.setItem("user_email", "none");
        sessionStorage.setItem("user_unique_id", "none")
    }

    console.log("Logged in: " + sessionStorage.getItem("user_logged_in"));
    console.log("Account type: " + sessionStorage.getItem("user_account_type"));
    console.log("Email: " + sessionStorage.getItem("user_email"));
    console.log("User UID: " + sessionStorage.getItem("user_unique_id"));
});


// Keeping my password checking function here since this file is imported to (almost) every page.
// This function is used in account.html, profile.html, and manage.html.
function checkPasswordVisibility(passwordInputId) {
    var password = document.getElementById(passwordInputId);
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}
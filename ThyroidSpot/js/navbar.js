// Functions in this page are called on all pages after loading (except for verify-email.html since that page does not import navbar).

// Animation function (not used as animations does not look nice in online presentations).
$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");
});


// LOGOUT FUNCTION. Called when the logout tab in navbar is clicked.
const btnLogout = document.getElementById("nav-tab-logout");
btnLogout.addEventListener("click", e => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Logged Out");
        window.location.href = 'account.html';

    }).catch(function (error) {
        console.log("Error occurred when logging out");
    });
});


function navigation_control() {
    // sessions are set in firebase-log-state.js.

    /* Check if user is logged in or not. */
    user_logged_in = sessionStorage.getItem("user_logged_in");

    /* Check user's account type. */
    user_account_type = sessionStorage.getItem("user_account_type");

    // If user is *not* logged in, "Logout" button in navbar will not show. 
    // If user is *not* logged in, "Profile" button in navbar will not show. 
    if (user_logged_in != "y") {
        document.getElementById('nav-tab-logout').style.display = "none";
        document.getElementById('nav-tab-profile').style.display = "none";
    }

    // If user *is* logged in, "Account" button (to login/register) in navbar will not show. 
    if (user_logged_in == "y") {
        document.getElementById('nav-tab-account').style.display = "none";
    }

    /* If user is logged in, check what account type user is (admin, clinician or patient). */

    // If user is *not* logged in OR account type is not patient, "Health" button (used by account_type="patient") in navbar will not show.
    if (user_logged_in == "n" || user_account_type != "patient") {
        document.getElementById('nav-tab-health').style.display = "none";
    }

    // If user is *not* logged in OR account type is not clinician, "Patients" button (used by account_type="clinician") in navbar will not show.
    if (user_logged_in == "n" || user_account_type != "clinician") {
        document.getElementById('nav-tab-patients').style.display = "none";
    }

    // If user is *not* logged in OR account type is not admin, "Manage" button (used by account_type="admin") in navbar will not show.
    if (user_logged_in == "n" || user_account_type != "admin") {
        document.getElementById('nav-tab-manage').style.display = "none";
    }

    /* More specific navigation controls. BENEATH IF conditions are created to prevent users from going to pages where they are not allowed to by
    change directory/routes directly from the URL. For example, if a user that is not logged in changes the directory to profile.html, the below
    conditions will redirect the user back to account.html where he has to signup/login first. */
    // The matchPath() function is created below.

    // If user is at account.html but he IS logged in, redirect user to profile page.
    if (matchPath("account.html") == true && user_logged_in == 'y') {
        window.location.href = "profile.html";
    }

    // If user is at profile.html but he IS NOT logged in, redirect user to account page.
    if (matchPath("profile.html") == true && user_logged_in != 'y') {

        window.location.href = "account.html";
    }

    // If user is either NOT logged in OR account type is NOT admin, don't let them go manage.html. 
    // Redirect user to account page where they can login/signup.
    if (user_logged_in == 'n' || user_account_type != "admin") {
        if (matchPath("manage.html") == true) {
            window.location.href = "account.html";
        }
    }

    // If user is either NOT logged in or account type is NOT clinician, don't let them go patient-info-doctor.html AND all-patien. 
    // Redirect user to account page where they can login/signup.
    if (user_logged_in == 'n' || user_account_type != "clinician") {
        if (matchPath("patient-info-doctor.html") == true) {
            window.location.href = "account.html";
        }
        if (matchPath("all-patient.html") == true) {

            window.location.href = "account.html";
        }
    }

    // If user is either NOT logged in or account type is NOT patient, don't let them go patientinfo.html.
    // Redirect user to account page where they can login/signup.
    if (user_logged_in == 'n' || user_account_type != "patient") {
        if (matchPath("patientinfo.html") == true) {
            window.location.href = "account.html";
        }
    }

}

function matchPath(desiredPathHtml) {
    // Makes the navigation more robust. E.g., If user types index.html#, it'll still work.

    // Get current path
    const currentLoc = window.location.href;
    
    // Checks by matching with inputted parameter (where the user wants to go). 
    if (currentLoc.match(desiredPathHtml)) {
        return true
    }
    else {
        return false
    }
}


const nav = document.getElementById("navbar-main");
// Sometimes the "user_account_type" session does not SET as it loads too fast. When this happens, 
// users are logged in without an account type. To fix this, when it happens, delay the calling of the navigation control by 1.5 seconds.
if (sessionStorage.getItem("user_account_type") === "none" && sessionStorage.getItem("user_logged_in") === 'y') {
    setTimeout(function () {
        navigation_control();
        nav.classList.remove("hide");
    }, 1500);
} // When it does not happen, just call the nav control normally (immediately after page load).
else {
    navigation_control();
    nav.classList.remove("hide");
}


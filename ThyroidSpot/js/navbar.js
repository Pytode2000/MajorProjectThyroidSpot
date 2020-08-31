

$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");
});



// LOGOUT FUNCTION
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

    // need to allow admin soon
    // if (user_logged_in == "n") {
    //     if (user_account_type != "patient" || user_account_type != "admin") {
    //         document.getElementById('nav-tab-diseases').style.display = "none";
    //     }
    // }


    // If user is *not* logged in OR account type is not clinician, "Patients" button (used by account_type="clinician") in navbar will not show.
    if (user_logged_in == "n" || user_account_type != "clinician") {
        document.getElementById('nav-tab-patients').style.display = "none";
    }

    // If user is *not* logged in OR account type is not admin, "Manage" button (used by account_type="admin") in navbar will not show.
    if (user_logged_in == "n" || user_account_type != "admin") {
        document.getElementById('nav-tab-manage').style.display = "none";
    }


    // More specific navigation control.
    // const currentLoc = window.location.href;
    // console.log(currentLoc)
    // if (currentLoc == "http://127.0.0.1:5500/html-pages/index.html" && user_logged_in == 'y') {
    if (matchPath("account.html") == true && user_logged_in == 'y') {
        window.location.href = "profile.html";
    }
    // if (currentLoc == "http://127.0.0.1:5500/html-pages/profile.html" && user_logged_in != 'y') {
    if (matchPath("profile.html") == true && user_logged_in != 'y') {

        window.location.href = "account.html";
    }
    // User not logged in.

    // If user is either not logged in or account type is not admin, don't let them go manage.html.
    if (user_logged_in == 'n' || user_account_type != "admin") {
        // Blocked URLs.
        // if (currentLoc == "http://127.0.0.1:5500/html-pages/manage.html") {
        if (matchPath("manage.html") == true) {

            window.location.href = "account.html";
        }
    }

    // If user is either not logged in or account type is not clinician, don't let them go patientinfo.html.
    if (user_logged_in == 'n' || user_account_type != "clinician") {
        if (matchPath("patient-info-doctor.html") == true) {
            window.location.href = "account.html";
        }
        if (matchPath("all-patient.html") == true) {

            window.location.href = "account.html";
        }
        // Blocked URLs.
        //if () {
        //    window.location.href = "account.html";
        //
    }

    // If user is either not logged in or account type is not patient, don't let them go disease.html.
    if (user_logged_in == 'n' || user_account_type != "patient") {
        // Blocked URLs.
        // if (currentLoc == "http://127.0.0.1:5500/html-pages/disease.html") {
        // if (matchPath("disease.html") == true) {

        //     window.location.href = "account.html";
        // }
        // else if (currentLoc == "http://127.0.0.1:5500/html-pages/patientinfo.html") {
        if (matchPath("patientinfo.html") == true) {

            window.location.href = "account.html";
        }
    }

    // if (user_logged_in == 'n') {
    //     if (user_account_type != "patient" || user_account_type != "admin") {
    //         if (matchPath("disease.html") == true) {
    //             window.location.href = "account.html";
    //         }
    //     }
    // }

    // Maybe need to edit.
    // if (user_logged_in == 'n' || user_account_type != "patient" || user_account_type != "admin") {
    //     if (matchPath("disease.html") == true) {
    //         window.location.href = "account.html";
    //     }
    // }

    if (matchPath("navbar.html") == true || matchPath("footer.html") == true) {
        window.location.href = "index.html";
    }




}

function matchPath(desiredPathHtml) {
    // Makes the navigation more robust. E.g., If user types index.html#, it'll still work.
    const currentLoc = window.location.href;
    if (currentLoc.match(desiredPathHtml)) {
        return true
    }
    else {
        return false
    }
}

// IF USER IS LOGGED IN BUT NO ROLES, WAIT AWHILE.

const nav = document.getElementById("navbar-main");

if (sessionStorage.getItem("user_account_type") === "none" && sessionStorage.getItem("user_logged_in") === 'y') {
    setTimeout(function () {
        navigation_control();
        nav.classList.remove("hide");
    }, 1500);
}
else {
    navigation_control();
    nav.classList.remove("hide");
}


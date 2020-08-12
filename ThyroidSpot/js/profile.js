var userURI = "https://localhost:44395/api/User/";
var patientInfoURI = "https://localhost:44395/api/patientinfo/";


if (sessionStorage.getItem("user_account_type") != "patient") // Only user_account_type = patient wil be be able to see their own patient information
{
    const togglePatientBtn = document.getElementById("togglePatientBtn");
    togglePatientBtn.classList.add("hide");
}





/* Toggle between Profile and Information Tab */
// GET DOM
// const profileSection = document.getElementById("profileSection");
// const patientSection = document.getElementById("patientSection");
// const toggleProfileBtn = document.getElementById("toggleProfileBtn");
// const togglePatientBtn = document.getElementById("togglePatientBtn");

// SHOW Profile, HIDE Information.
function toggleProfile() {
    // BUGGED, doesn't work if delcared first.
    const profileSection = document.getElementById("profileSection");
    const patientSection = document.getElementById("patientSection");
    const toggleProfileBtn = document.getElementById("toggleProfileBtn");
    const togglePatientBtn = document.getElementById("togglePatientBtn");
    patientSection.classList.add("hide");
    profileSection.classList.remove("hide");

    toggleProfileBtn.classList.add("active");
    togglePatientBtn.classList.remove("active");
    console.log("Information hidden")
}

// SHOW Information, HIDE Profile. 
function toggleInformation() {
    const profileSection = document.getElementById("profileSection");
    const patientSection = document.getElementById("patientSection");
    const toggleProfileBtn = document.getElementById("toggleProfileBtn");
    const togglePatientBtn = document.getElementById("togglePatientBtn");
    profileSection.classList.add("hide");
    patientSection.classList.remove("hide");

    togglePatientBtn.classList.add("active");
    toggleProfileBtn.classList.remove("active");
    console.log("Profile hidden")
}

// Used to hold tables user & patient_information's primary key, id and patient_id respectively. 
// Used for delete account.
var user_table_id;
var patient_table_patient_id;

function getUser() {
    currentUserArray = []
    const user_id = sessionStorage.getItem("user_unique_id");
    const user_email = sessionStorage.getItem("user_email");
    $.ajax({
        type: 'GET',
        url: userURI + user_id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            currentUserArray = data;
            document.getElementById("profName").innerHTML = currentUserArray.full_name;
            document.getElementById("profType").innerHTML = currentUserArray.account_type;
            document.getElementById("profUid").innerHTML = currentUserArray.user_id;
            document.getElementById("profEmail").innerHTML = user_email;
            user_table_id = currentUserArray.id;
        }
    });
}

function getPatientInfo() {
    currentPatientArray = []
    const user_id = sessionStorage.getItem("user_unique_id");
    // const user_email = sessionStorage.getItem("user_email");
    $.ajax({
        type: 'GET',
        url: patientInfoURI + user_id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            currentPatientArray = data;

            document.getElementById("profGender").innerHTML = currentPatientArray.gender;
            document.getElementById("profDiagnosis").innerHTML = currentPatientArray.diagnosis;
            document.getElementById("profBloodType").innerHTML = currentPatientArray.blood_type;
            document.getElementById("profDOB").innerHTML = currentPatientArray.date_of_birth;
            document.getElementById("profNRIC").innerHTML = currentPatientArray.ic_number;
            patient_table_patient_id = currentPatientArray.patient_id;
        }
    });
}



// Calling the function.
getUser()
if (sessionStorage.getItem("user_account_type") == "patient") {
    getPatientInfo()
}



function changeEmail() {
    var user = firebase.auth().currentUser;

    const txtEmail = document.getElementById("changeEmail");

    const email = txtEmail.value;

    user.updateEmail(email).then(function () {
        // Update successful.
        user.sendEmailVerification().then(function () {
            alert("A verification email has been sent to: " + user.email);
        }).catch(function (error) {
        });

        console.log("Email has been update!")
        $('#changeEmailModal').modal('hide');
        window.location.href = "verify-email.html"

    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when changing email.")

    });
}

function changePassword() {
    var user = firebase.auth().currentUser;

    const txtPassword = document.getElementById("changePassword");
    const txtRePassword = document.getElementById("retypeChangePassword");

    const password = txtPassword.value;
    const rePassword = txtRePassword.value;

    user.updatePassword(password).then(function () {
        // Update successful.
        console.log("Password has been update!")
        $('#changePasswordModal').modal('hide');

    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when changing password.")

    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Logged Out");
        window.location.href = 'index.html';

    }).catch(function (error) {
        console.log("Error occurred when logging out.");
    });
}

function deleteAccount() {
    // If user is "patient", delete instances from 3 tables. 
    // Else, only delete from 2 tables.

    // DELETE from firebase Auth
    var user = firebase.auth().currentUser;
    user.delete().then(function () {
        // User deleted from FB.
        console.log("Firebase instance deleted.");


        // Delete from "user" table.
        $.ajax({
            type: 'DELETE',
            url: userURI + user_table_id,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log("User instance deleted.")
                // $('#deleteAccountModal').modal('hide');
            }
        });

        if (sessionStorage.getItem("user_account_type") == "patient") {
            // If user is a patient, delete from the "patient_information" table.
            $.ajax({
                type: 'DELETE',
                url: patientInfoURI + patient_table_patient_id,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("Patient instance deleted.")
                }
            });
        }

        window.location.href = "index.html";

    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when deleting account.")
    });
}

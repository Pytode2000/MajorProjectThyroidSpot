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
            try {
                document.getElementById("profName").innerHTML = currentUserArray.full_name;
                document.getElementById("profType").innerHTML = currentUserArray.account_type;
                document.getElementById("profUid").innerHTML = currentUserArray.user_id;
                document.getElementById("profEmail").innerHTML = user_email;
                user_table_id = currentUserArray.id;
            } catch (e) {
                console.log(e)
            }
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


            // This is for the update (pre-set values).
            document.getElementById("editId").defaultValue = currentPatientArray.ic_number;
            document.getElementById("editBirthdate").defaultValue = currentPatientArray.date_of_birth;
            $("#editDiagnosis").val(currentPatientArray.diagnosis);
            $("#editBloodType").val(currentPatientArray.blood_type);
            if (currentPatientArray.gender == "Male") {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Male"]').attr('checked', true);
            }
            else {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Female"]').attr('checked', true);
            }

        }
    });
}



// Calling the function.
getUser()
if (sessionStorage.getItem("user_account_type") == "patient") {
    // If user is patient, get patient info + show edit patient info's FAB.
    getPatientInfo()
    const editPatientInfoFAB = document.getElementById("FAB-edit");
    editPatientInfoFAB.classList.remove("hide")
}



function changeEmail() {
    var user = firebase.auth().currentUser;

    const txtEmail = document.getElementById("changeEmail");

    const email = txtEmail.value;

    user.updateEmail(email).then(function () {
        // Update successful.
        user.sendEmailVerification().then(function () {
            console.log("Email has been update!")
            $('#changeEmailModal').modal('hide');
            $('#profileSettingModal').modal('hide');
            $('#alertEmailModal').modal('toggle');
            setTimeout(function () {
                // Redirect user to "verify-email.html"
                window.location.href = "verify-email.html";
            }, 3000);

        }).catch(function (error) {
        });



    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when changing email.");
        $('#changeEmailModal').modal('hide');
        $('#errorModal').modal('toggle');

    });
}

function changePassword() {
    var user = firebase.auth().currentUser;

    const txtPassword = document.getElementById("changePassword");
    const txtRePassword = document.getElementById("retypeChangePassword");

    const password = txtPassword.value;
    const rePassword = txtRePassword.value;

    if (password === rePassword) {

        user.updatePassword(password).then(function () {
            // Update successful.
            console.log("Password has been update!");
            $('#changePasswordModal').modal('hide');
            $('#errorModal').modal('toggle');


        }).catch(function (error) {
            // An error happened.
            console.log("An error occurred when changing password.");
            $('#changePasswordModal').modal('hide');
            $('#errorModal').modal('toggle');


        });
    }
    else {
        // Password and retype different.
        const changePwAlert = document.getElementById("changePwAlert");

        changePwAlert.classList.remove("hide");
        changePwAlert.innerHTML = "Password and re-type password different! Please try again.";
    }
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
        console.log("An error occurred when deleting account.");
        $('#deleteAccountModal').modal('hide');

        $('#errorModal').modal('toggle');

    });
}


/* Update Profile */

function updateProfile() {
    const user_id = sessionStorage.getItem("user_unique_id");

    var diagnosis = document.getElementById("editDiagnosis");
    var diagnosisChosen = diagnosis.options[diagnosis.selectedIndex].text;

    var genderChosen;
    if (document.getElementById('genderMaleRadio').checked) {
        genderChosen = "Male"
    }
    else {
        genderChosen = "Female"
    }

    var bloodType = document.getElementById("editBloodType");
    var bloodTypeChosen = bloodType.options[bloodType.selectedIndex].text;

    var patientInfoInstance = {
        user_id: user_id, diagnosis: diagnosisChosen, ic_number: $('#editId').val(),
        date_of_birth: $('#editBirthdate').val(), gender: genderChosen, blood_type: bloodTypeChosen, timestamp: "-"
    };


    $.ajax({
        type: 'PUT',
        url: patientInfoURI + patient_table_patient_id,
        data: JSON.stringify(patientInfoInstance),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#editPatientModal').modal('hide');
            console.log("Successfully updated patient's information.")
            window.location.reload();
        }
    });


}


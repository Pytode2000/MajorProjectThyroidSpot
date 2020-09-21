// URI to manage API.
var userURI = "https://localhost:44395/api/User/";
var patientInfoURI = "https://localhost:44395/api/patientinfo/";
var diagnosisURI = "https://localhost:44395/api/diagnosis";
var dosageURI = "https://localhost:44395/api/dosage";
var reportURI = "https://localhost:44395/api/report";

// To store current patient's doctor. If user is not patient, then this variable will not be used.
var patient_doctor;

// Used to hold tables user & patient_information's primary key, id and patient_id respectively. 
// Used for delete account.
var user_table_id;
var patient_table_patient_id;

// Stores all current patient's diagnosis (if any). Variable will not be used if user is not a patient.
var currentPatientDiagnosis = [];

// For selected diagnosis. Used for deleting diagnosis.
var selectedDiagnosis;


// On load, check if user type is patient. If not, hide the toggle patient information button.
if (sessionStorage.getItem("user_account_type") != "patient") // Only user_account_type = patient wil be be able to see their own patient information.
{
    const togglePatientBtn = document.getElementById("togglePatientBtn");
    togglePatientBtn.classList.add("hide");
}


/* Toggle between Profile and Information Tab */

// SHOW USER INFORMATION, HIDE PATIENT INFORMATION.
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

// SHOW PATIENT INFORMATION, HIDE USER INFORMATION.
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

// GET user's information and set in html to see.
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

// GET patient's information and set in html to see.
function getPatientInfo() {
    // Hold current patient's information.
    currentPatientArray = [];

    // Hold current patient's diagnosis (or diagnoses).
    currentPatientDiagnosis = [];

    // Get current user's user_id for GET(id) - "patient_information" table API.
    const user_id = sessionStorage.getItem("user_unique_id");

    $.ajax({
        type: 'GET',
        url: patientInfoURI + user_id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            currentPatientArray = data;

            // SET data to html.
            document.getElementById("profGender").innerHTML = currentPatientArray.gender;
            document.getElementById("profBloodType").innerHTML = currentPatientArray.blood_type;
            document.getElementById("profDOB").innerHTML = currentPatientArray.date_of_birth;
            document.getElementById("profNRIC").innerHTML = currentPatientArray.ic_number;
            patient_doctor = currentPatientArray.doctor_id;
            patient_table_patient_id = currentPatientArray.patient_id;

            // This is for the update (pre-set values).
            document.getElementById("editId").defaultValue = currentPatientArray.ic_number;
            document.getElementById("editBirthdate").defaultValue = currentPatientArray.date_of_birth;
            $("#editBloodType").val(currentPatientArray.blood_type);
            // Preset gender's radio button.
            if (currentPatientArray.gender == "Male") {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Male"]').attr('checked', true);
            }
            else {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Female"]').attr('checked', true);
            }

            // GET Diagnosis (or diagnoses).
            $.ajax({
                type: 'GET',
                url: diagnosisURI + '/' + currentPatientArray.patient_id,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    currentPatientDiagnosis = data;


                    number_of_original_diagnosis = currentPatientDiagnosis.length
                    for (i = 0; i < currentPatientDiagnosis.length; i++) {

                        // FOR patient information.
                        // For each diagnosis, append to HTML.
                        var diagnosis = "  <a class='diagnosis-class' onclick='profileClickDiagnosis(" +
                            currentPatientDiagnosis[i].diagnosis_id +
                            ")'><div class='alert alert-secondary' role='alert'>" +
                            currentPatientDiagnosis[i].diagnosis1 + "<hr></div></a>"
                        $("#profDiagnosis").append(diagnosis);

                        // FOR THE EDIT MODAL DIAGNOSIS (preset).
                        // Append again, but this time in the edit modal.
                        var diagnosis_edit =
                            "<select id='editDiagnosis" + currentPatientDiagnosis[i].diagnosis_id + "' class='custom-select' style='width:80%; margin-bottom: 10px;'>" +
                            "<option>De Quervain's thyroiditis</option>" +
                            "<option>Differentiated thyroid carcinoma</option>" +
                            " <option>Graves' disease</option>" +
                            "<option>Hashimoto's thyroiditis</option>" +
                            "<option>Hyperthyroidism</option>" +
                            "<option>Hypothyroidism</option>" +
                            "<option>Post-radioiodine ablation</option>" +
                            "<option>Post-thyroidectomy</option>" +
                            "<option>Riedel's thyroiditis</option>" +
                            "<option>Thyrotoxicosis</option>" +
                            "<option>Toxic adenoma</option>" +
                            "<option>Toxic multinodular goitre</option>" +
                            "<option>Others</option>" +
                            "</select>" +
                            "<button onclick='selectedDeleteModal(" + currentPatientDiagnosis[i].diagnosis_id + ")' type='button' class='btn btn-default diagnosisBtn'>" +
                            "<i class='fas fa-times fa-2x' style='color: rgba(255, 255, 255); '></i></button></div>";

                        $("#diagnosisEditBlock").append(diagnosis_edit);

                        // After appending, PRESET DIAGNOSIS VALUE IN EDIT MODAL.
                        $("#editDiagnosis" + currentPatientDiagnosis[i].diagnosis_id).val(currentPatientDiagnosis[i].diagnosis1);
                    }
                }
            });
        }
    });
}

// This function allows patient users to click their diagnosis (or diagnoses). Onclicking, it redirects them to the 
// disease page with the selected disease modal opened.
function profileClickDiagnosis(selected_profile_diagnosis_id) {
    $.ajax({
        type: 'GET',
        url: diagnosisURI + '?diagnosisid=' + selected_profile_diagnosis_id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log(data.diagnosis1)
            sessionStorage.setItem("view_disease", data.diagnosis1);
            window.location.href = "disease.html";
        }
    });
}

// Takes in the selected diagnosis' id and opens the delete diagnosis modal.
function selectedDeleteModal(diagnosis_id) {
    $('#deleteDiagnosisModal').modal('toggle');
    selectedDiagnosis = diagnosis_id;
}

// The selectedDeleteModal( ) function opens a modal which can call this function (when user clicks delete).
function removeDefaultDiagnosis() {
    $.ajax({
        type: 'DELETE',
        url: diagnosisURI + '/' + selectedDiagnosis,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Diagnosis instance deleted.")
            $('#deleteDiagnosisModal').modal('hide');
            $('#diagnosisEditBlock').html('');
            $('#profDiagnosis').html('');
            getPatientInfo();
        }
    });
}

// This counter ensures that all the new diagnosis have different IDs. This is required to remove the diagnosis if the user decides not to create them after all.
var diagnosisCounter = 1;
// In the edit patient profile flaoting action button, patient users can add new diagnosis (or diagnoses).
function addNewDiagnosis() {
    diagnosisCounter = diagnosisCounter + 1;
    document.getElementById("diagnosisEditBlock").style.display = "block";
    var html = "<div id='diagnosis-" + diagnosisCounter + "'>" +
        "<select class='custom-select diagnosisClass' style='margin-bottom: 10px; width: 80%;'>" +
        "<option>De Quervain's thyroiditis</option>" +
        "<option>Differentiated thyroid carcinoma</option>" +
        "<option>Graves' disease</option>" +
        "<option>Hashimoto's thyroiditis</option>" +
        "<option>Hyperthyroidism</option>" +
        "<option>Hypothyroidism</option>" +
        "<option>Post-radioiodine ablation</option>" +
        "<option>Post-thyroidectomy</option>" +
        "<option>Riedel's thyroiditis</option>" +
        "<option>Thyrotoxicosis</option>" +
        "<option>Toxic adenoma</option>" +
        "<option>Toxic multinodular goitre</option>" +
        "<option>Others</option>" +
        "</select>" +
        "<button  onclick='removeAddedDiagnosis(" + diagnosisCounter + ")' type='button' class='btn btn-default diagnosisBtn'>" +
        "<i class='fas fa-times fa-2x' style='color: rgba(255, 255, 255, 0.650); '></i></button></div>";

    $("#diagnosisEditBlock").append(html);

    console.log("New diagnosis number: " + diagnosisCounter)
}


// If user adds new diagnosis (or diagnoses) but have yet to confirm the update, the user can click the (X) beside each diagnosis to remove them (using this function).
function removeAddedDiagnosis(counter) {
    var diagnosisNumberX = document.getElementById("diagnosis-" + counter);
    diagnosisNumberX.remove();
    console.log("Removed Diagnosis Number: " + counter)
}


/* Update Profile function, called by clicking on the Patient Information floating action button. Only for patient users.  */
function updateProfile() {

    // To use PUT(ID) (patient_information table API).
    const user_id = sessionStorage.getItem("user_unique_id");
    console.log(currentPatientDiagnosis)

    // For loop to update diagnosis/diagnoses.
    for (i = 0; i < currentPatientDiagnosis.length; i++) {

        diagnosisX = document.getElementById("editDiagnosis" + currentPatientDiagnosis[i].diagnosis_id);
        diagnosisXText = diagnosisX.options[diagnosisX.selectedIndex].text;

        diagnosis_data = { patient_id: currentPatientDiagnosis[i].patient_id, diagnosis1: diagnosisXText }

        $.ajax({
            type: 'PUT',
            url: diagnosisURI + '/' + currentPatientDiagnosis[i].diagnosis_id,
            data: JSON.stringify(diagnosis_data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log("Updated Diagnosis")
            }
        });
    }

    // Creates new diagnosis/diagnoses. 
    // All new diagnosis have the "diagnosisClass" class.
    allDiagnosis = $('.diagnosisClass'); // Stores all values of inputs with the "diagnosisClass" class.
    // Loops through all the values and creates diagnosis.
    if (allDiagnosis.length > 0) {
        for (i = 0; i < allDiagnosis.length; i++) {
            // Each new diagnosis is tagged with the current patient user's patient_id.
            single_diagnosis = { patient_id: patient_table_patient_id, diagnosis1: allDiagnosis[i].options[allDiagnosis[i].selectedIndex].text };
            $.ajax({
                type: 'POST',
                url: diagnosisURI,
                data: JSON.stringify(single_diagnosis),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("Diagnosis created.");

                }
            });
        }
    }

    /* Beneath is to update patient_information table. */
    // Gets the gender value.
    var genderChosen;
    if (document.getElementById('genderMaleRadio').checked) {
        genderChosen = "Male"
    }
    else {
        genderChosen = "Female"
    }

    // Gets the blood type value.
    var bloodType = document.getElementById("editBloodType");
    var bloodTypeChosen = bloodType.options[bloodType.selectedIndex].text;

    var patientInfoInstance = {
        // user_id: user_id, diagnosis: diagnosisChosen, ic_number: $('#editId').val(),
        user_id: user_id, ic_number: $('#editId').val(),
        date_of_birth: $('#editBirthdate').val(), gender: genderChosen, blood_type: bloodTypeChosen, timestamp: "-", doctor_id: patient_doctor
    };

    // Update function for patient_information table using API (PUT).
    $.ajax({
        type: 'PUT',
        url: patientInfoURI + patient_table_patient_id,
        data: JSON.stringify(patientInfoInstance),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#editPatientModal').modal('hide');
            console.log("Successfully updated patient's information.")
            // window.location.reload();
            $('#diagnosisEditBlock').html('');
            $('#profDiagnosis').html('');
            getPatientInfo()
        }
    });
}


// Calling the functions onload.
getUser() // Called for all types of users.

// If user is patient, then call getPatientInfo( ), and show the edit patient info FAB.
if (sessionStorage.getItem("user_account_type") == "patient") {
    getPatientInfo()
    const editPatientInfoFAB = document.getElementById("FAB-edit");
    editPatientInfoFAB.classList.remove("hide")
}

/***** BENEATH ARE FUNCTIONS FOR USER SETTING (FIREBASE AUTH) (logout, change email, change password, and delete account). *****/
function changeFbEmail() {
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
                // Redirect user to "verify-email.html" after email is changed since the new email is not verified.
                window.location.href = "verify-email.html";
            }, 3000);

        }).catch(function (error) {
            // No action required.
        });

    }).catch(function (error) {
        // An error happened. Show the error.
        console.log("An error occurred when changing email.");
        const changeEmailAlert = document.getElementById("changeEmailAlert");
        changeEmailAlert.classList.remove("hide");
        changeEmailAlert.innerHTML = error.message;
    });
}

function changeUserPassword() {
    var user = firebase.auth().currentUser;

    const passwordTxt = $('#changePassword').val();
    const rePasswordTxt = $('#retypeChangePassword').val()

    // Checks if the values for password and password retype are the same. 
    if (passwordTxt === rePasswordTxt) {
        // If yes, then update.
        user.updatePassword(passwordTxt).then(function () {
            // Update successful.
            console.log("Password has been update!");
            $('#changePasswordModal').modal('hide');
            // $('#errorModal').modal('toggle');


        }).catch(function (error) {
            // An error happened.
            const changePwAlert = document.getElementById("changePwAlert");
            changePwAlert.classList.remove("hide");
            changePwAlert.innerHTML = error.message;
        });
    }
    else {
        // If not same, then show error.
        const changePwAlert = document.getElementById("changePwAlert");
        changePwAlert.classList.remove("hide");
        changePwAlert.innerHTML = "Password and re-type password different! Please try again.";
    }
}

// Logout user. firebase-log-state.js will do the removing of sessions/state.
function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Logged Out");
        window.location.href = 'account.html';
    }).catch(function (error) {
        console.log("Error occurred when logging out.");
    });
}

function deleteAccount() {
    // If user is "patient", delete instances from 5 SQL tables ("user", "patient_information", "diagnosis", "patient_report", "drug_dosage", ) 
    // and 1 Firebase Auth instance. 
    // Else, only delete from 1 SQL table ("user") and 1 Firebase Auth instance.

    // DELETE from firebase Auth (ALL types of users).
    var user = firebase.auth().currentUser;
    user.delete().then(function () {
        // User deleted from FB.
        console.log("Firebase instance deleted.");

        // On successful deletion of Firebase Auth instance, delete "user" instance.
        // Delete from "user" table.
        $.ajax({
            type: 'DELETE',
            url: userURI + user_table_id,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log("User instance deleted.");
                // $('#deleteAccountModal').modal('hide');
            }
        });

        // If user is patient, delete from another 4 tables. 
        if (sessionStorage.getItem("user_account_type") == "patient") {

            // If user is a patient, delete from the "patient_information" table.
            $.ajax({
                type: 'DELETE',
                url: patientInfoURI + patient_table_patient_id,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("Patient instance deleted.");

                    // Try to delete patient's diagnosis/diagnoses (TRY because patient may not have any diagnosis if they removed all in profile).
                    try {
                        $.ajax({ // This deletes ALL diagnosis that has the user's patient_id. 1 AJAX DELETE deletes multiple instances.
                            type: 'DELETE',
                            url: diagnosisURI + "?patientid=" + patient_table_patient_id,
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (data) {
                                console.log("diagnosis instance deleted.");
                            }
                        })
                    }
                    catch (err) {
                        console.log("No diagnosis to delete");
                    }

                    // Try to delete patient's report(s) (TRY because patient may not have any reports).
                    try {
                        $.ajax({ // This deletes ALL reports that has the user's patient_id. 1 AJAX DELETE deletes multiple instances.
                            type: 'DELETE',
                            url: reportURI + "?patientid=" + patient_table_patient_id,
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (data) {
                                console.log("report instance deleted.")
                            }
                        })
                    }
                    catch (err) {
                        console.log("No report to delete")
                    }

                    // Try to delete patient's dosage (TRY because patient may not have any dosage).
                    try {
                        $.ajax({ // This deletes ALL dosage that has the user's patient_id. 1 AJAX DELETE deletes multiple instances.
                            type: 'DELETE',
                            url: dosageURI + "?patientid=" + patient_table_patient_id,
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (data) {
                                console.log("diagnosis instance deleted.")
                            }
                        })
                    }
                    catch (err) {
                        console.log("No dosage to delete")
                    }
                }
            });
        }
        setTimeout(function () {
            // Redirect user to account.html after 3 seconds.
            window.location.href = "account.html";
        }, 3000);

    }).catch(function (error) {
        // An error happened. Show error.
        console.log("An error occurred when deleting account.");
        const deleteAccAlert = document.getElementById("deleteAccAlert");
        deleteAccAlert.classList.remove("hide");
        deleteAccAlert.innerHTML = error.message;
    });
}


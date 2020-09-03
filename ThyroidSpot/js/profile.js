var userURI = "https://localhost:44395/api/User/";
var patientInfoURI = "https://localhost:44395/api/patientinfo/";
var diagnosisURI = "https://localhost:44395/api/diagnosis";
var dosageURI = "https://localhost:44395/api/dosage"; //?patientid={patientid}
var reportURI = "https://localhost:44395/api/report"; //?patientid={patientid}

var patient_doctor;

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

// var number_of_original_diagnosis;
var currentPatientDiagnosis = [];

function getPatientInfo() {
    currentPatientArray = [];
    currentPatientDiagnosis = [];
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
            // document.getElementById("profDiagnosis").innerHTML = currentPatientArray.diagnosis;
            // console.log(currentPatientArray.diagnosis)
            document.getElementById("profBloodType").innerHTML = currentPatientArray.blood_type;
            document.getElementById("profDOB").innerHTML = currentPatientArray.date_of_birth;
            document.getElementById("profNRIC").innerHTML = currentPatientArray.ic_number;
            patient_doctor = currentPatientArray.doctor_id;
            patient_table_patient_id = currentPatientArray.patient_id;


            // This is for the update (pre-set values).
            document.getElementById("editId").defaultValue = currentPatientArray.ic_number;
            document.getElementById("editBirthdate").defaultValue = currentPatientArray.date_of_birth;
            // $("#editDiagnosis").val("test");
            $("#editBloodType").val(currentPatientArray.blood_type);
            if (currentPatientArray.gender == "Male") {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Male"]').attr('checked', true);
            }
            else {
                $('input:radio[name="genderMaleRadio"]').filter('[value="Female"]').attr('checked', true);
            }

            // GET Diagnosis
            $.ajax({
                type: 'GET',
                url: diagnosisURI + '/' + currentPatientArray.patient_id,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    currentPatientDiagnosis = data;
                    // $("#editDiagnosis").val(currentPatientDiagnosis[0].diagnosis1);
                    // document.getElementById("editDiagnosis").value = currentPatientDiagnosis[0].diagnosis1
                    // console.log("TEST " + currentPatientDiagnosis[0].diagnosis1)
                    // document.getElementById('editDiagnosis').value = currentPatientDiagnosis[0].diagnosis1;
                    // document.getElementById("diagnosisEditBlock").style
                    number_of_original_diagnosis = currentPatientDiagnosis.length
                    for (i = 0; i < currentPatientDiagnosis.length; i++) {

                        // FOR THE EDIT MODAL DIAGNOSIS
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
                            // "<button onclick='removeDefaultDiagnosis(" + currentPatientDiagnosis[i].diagnosis_id + ")' type='button' class='btn btn-default diagnosisBtn'>" +
                            "<button onclick='selectedDeleteModal(" + currentPatientDiagnosis[i].diagnosis_id + ")' type='button' class='btn btn-default diagnosisBtn'>" +
                            "<i class='fas fa-times fa-2x' style='color: rgba(255, 255, 255); '></i></button></div>";

                        $("#diagnosisEditBlock").append(diagnosis_edit);

                        // PRESET DIAGNOSIS VALUE IN EDIT MODAL
                        $("#editDiagnosis" + currentPatientDiagnosis[i].diagnosis_id).val(currentPatientDiagnosis[i].diagnosis1);

                        // FOR PROFILE
                        // var test = "<a onclick='profileClickDiagnosis(" + currentPatientDiagnosis[i].diagnosis1 + ")'>"
                        var diagnosis = "  <a class='diagnosis-class' onclick='profileClickDiagnosis(" +
                            currentPatientDiagnosis[i].diagnosis_id +
                            ")'><div class='alert alert-secondary' role='alert'>" +
                            currentPatientDiagnosis[i].diagnosis1 + "<hr></div></a>"
                        $("#profDiagnosis").append(diagnosis);

                    }
                }
            });



        }
    });
}

function profileClickDiagnosis(selected_profile_diagnosis_id) {
    // no choice, cannot get the disease's name coz some diseases have names that contains apostrophe (')

    // toDisease = []
    // var selected_profile_diagnosis_name;
    $.ajax({
        type: 'GET',
        url: diagnosisURI + '?diagnosisid=' + selected_profile_diagnosis_id,
        // /diagnosis?diagnosisid={diagnosisid}
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            // toDisease = data;
            // console.log(toDisease);
            // console.log(toDisease.diagnosis_id)
            // toDisease = data;
            // selected_profile_diagnosis_name = toDisease.diagnosis1
            console.log(data.diagnosis1)
            sessionStorage.setItem("view_disease", data.diagnosis1);
            window.location.href = "disease.html";
        }
    });
    // console.log(selected_profile_diagnosis_name)





    // window.location.href = "disease.html";
    // console.log(diagnosis_id)
    // sessionStorage.setItem("selected_disease", diagnosis_id);
}



var selectedDiagnosis;
function selectedDeleteModal(diagnosis_id) {
    $('#deleteDiagnosisModal').modal('toggle');
    selectedDiagnosis = diagnosis_id;
}

function removeDefaultDiagnosis() {
    $.ajax({
        type: 'DELETE',
        url: diagnosisURI + '/' + selectedDiagnosis,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Diagnosis instance deleted.")
            window.location.reload();
        }
    });
}

var diagnosisCounter = 1;
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

function removeAddedDiagnosis(counter) {
    var diagnosisNumberX = document.getElementById("diagnosis-" + counter);
    diagnosisNumberX.remove();
    console.log("Removed Diagnosis Number: " + counter)
}



/* Update Profile */

function updateProfile() {
    const user_id = sessionStorage.getItem("user_unique_id");
    console.log(currentPatientDiagnosis)

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

    // New diagnosis.
    allDiagnosis = $('.diagnosisClass');
    new_diagnosis_data = [];
    if (allDiagnosis.length > 0) {
        for (i = 0; i < allDiagnosis.length; i++) {
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


    // var diagnosis = document.getElementById("editDiagnosis");
    // var diagnosisChosen = diagnosis.options[diagnosis.selectedIndex].text;
    // diagnosis_data = [];
    // allDiagnosis = $('.diagnosisClass');
    // console.log(number_of_original_diagnosis);
    // if(allDiagnosis.length > number_of_original_diagnosis)

    // Update the original diagnoses first.

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
        // user_id: user_id, diagnosis: diagnosisChosen, ic_number: $('#editId').val(),
        user_id: user_id, ic_number: $('#editId').val(),
        date_of_birth: $('#editBirthdate').val(), gender: genderChosen, blood_type: bloodTypeChosen, timestamp: "-", doctor_id: patient_doctor
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









// Calling the function.
getUser()
if (sessionStorage.getItem("user_account_type") == "patient") {
    // If user is patient, get patient info + show edit patient info's FAB.
    getPatientInfo()
    const editPatientInfoFAB = document.getElementById("FAB-edit");
    editPatientInfoFAB.classList.remove("hide")
}



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
                // Redirect user to "verify-email.html"
                window.location.href = "verify-email.html";
            }, 3000);

        }).catch(function (error) {

        });



    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when changing email.");
        // $('#changeEmailModal').modal('hide');
        // $('#errorModal').modal('toggle');
        const changeEmailAlert = document.getElementById("changeEmailAlert");
        changeEmailAlert.classList.remove("hide");
        changeEmailAlert.innerHTML = error.message;

    });
}

function changeUserPassword() {
    var user = firebase.auth().currentUser;

    // const txtPassword = document.getElementById("changePassword");
    // const txtRePassword = document.getElementById("retypeChangePassword");

    const passwordTxt = $('#changePassword').val();
    const rePasswordTxt = $('#retypeChangePassword').val()

    // const password = txtPassword.value;
    // const rePassword = txtRePassword.value;

    if (passwordTxt === rePasswordTxt) {

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
        window.location.href = 'account.html';

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


                    try {
                        $.ajax({
                            type: 'DELETE',
                            url: diagnosisURI + "?patientid=" + patient_table_patient_id,//?patientid={patientid}
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (data) {
                                console.log("diagnosis instance deleted.")
                            }
                        })
                    }
                    catch (err) {
                        console.log("No diagnosis to delete")
                    }

                    try {
                        $.ajax({
                            type: 'DELETE',
                            url: reportURI + "?patientid=" + patient_table_patient_id,//?patientid={patientid}
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

                    try {
                        $.ajax({
                            type: 'DELETE',
                            url: dosageURI + "?patientid=" + patient_table_patient_id,//?patientid={patientid}
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
            // Redirect user to "verify-email.html"
            window.location.href = "account.html";
        }, 3000);

    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred when deleting account.");
        // $('#deleteAccountModal').modal('hide');

        // $('#errorModal').modal('toggle');
        const deleteAccAlert = document.getElementById("deleteAccAlert");

        deleteAccAlert.classList.remove("hide");
        deleteAccAlert.innerHTML = error.message;

    });
}





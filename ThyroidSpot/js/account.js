var userURI = "https://localhost:44395/api/User";
var patientInfoURI = "https://localhost:44395/api/patientinfo";


/* Toggle between Login and Register Tab */

// GET DOM
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleLoginBtn = document.getElementById("toggleLoginBtn");
const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");

// SHOW REGISTER FORM, HIDE LOGIN FORM.
function toggleRegister() {
    loginForm.classList.add("hide");
    registerForm.classList.remove("hide");

    toggleRegisterBtn.classList.add("active");
    toggleLoginBtn.classList.remove("active");
}

// SHOW LOGIN FORM, HIDE REGISTER FORM. 
function toggleLogin() {
    registerForm.classList.add("hide");
    loginForm.classList.remove("hide");

    toggleLoginBtn.classList.add("active");
    toggleRegisterBtn.classList.remove("active");
}


/* Firebase Login and Register function */
// NOTE: FORM CONTROL NOT IMPLEMENTED YET.
function login() {
    const txtEmail = document.getElementById("loginEmail");
    const txtPassword = document.getElementById("loginPassword");

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.then(firebaseUser => {

        //DO NOT REMOVE: need to use it to create patient report in case not created on sign in
        // var s = sessionStorage.setItem("firebaseUID", firebaseUser.uid)

        setTimeout(function () {
            window.location.href = "profile.html";
        }, 3000);

    })
    promise.catch(e => {
        console.log(e.message);
        // document.getElementById("modalId").innerHTML = currentSelectedUserArray.id;
        const loginAlert = document.getElementById("loginAlert");

        loginAlert.classList.remove("hide");
        loginAlert.innerHTML = e.message;
    });
}

function register() {
    const txtEmail = document.getElementById("registerEmail");
    const txtPassword = document.getElementById("registerPassword");
    const txtRePassword = document.getElementById("registerRetypePassword");

    if (txtPassword.value === txtRePassword.value) {


        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.then(firebaseUser => {
            const user = firebase.auth().currentUser;
            const userUid = user.uid;
            console.log(userUid);

            // Creates an instance (row) in the "user" table.
            var userInstance = { user_id: userUid, full_name: $('#registerFullName').val(), account_type: "patient" }; // Register function only creates "patient" accounts.
            console.log(userInstance)
            $.ajax({
                type: 'POST',
                url: userURI,
                data: JSON.stringify(userInstance),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("User instance created.")
                    // $('#registerFullName').val('')
                }
            });

            // Creates an instance (row) in the "patient_information" table.
            // var diagnosis = document.getElementById("registerDiagnosis");
            // var diagnosisChosen = diagnosis.options[diagnosis.selectedIndex].text;

            var genderChosen;
            if (document.getElementById('genderMaleRadio').checked) {
                genderChosen = "Male"
            }
            else {
                genderChosen = "Female"
            }

            var bloodType = document.getElementById("registerBloodType");
            var bloodTypeChosen = bloodType.options[bloodType.selectedIndex].text;

            var patientInfoInstance = {
                user_id: userUid, ic_number: $('#registerId').val(),
                date_of_birth: $('#registerBirthdate').val(), gender: genderChosen, blood_type: bloodTypeChosen, timestamp: "-", doctor_id: ""
            };

            console.log(patientInfoInstance);
            $.ajax({
                type: 'POST',
                url: patientInfoURI,
                data: JSON.stringify(patientInfoInstance),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("Patient's Data: " + data)


                    // GET patient'id using firebase UID FOR DIAGNOSIS
                    var patient_array = []
                    $.ajax({
                        type: 'GET',
                        url: patientInfoURI + "/" + userUid,
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            console.log("DATA " + data)
                            patient_array = data;
                            createDiagnosis(patient_array.patient_id)
                            console.log("patient_array.patient_id: " + patient_array.patient_id)
                            console.log("Created diagnosis!")
                        }
                    });



                }
            });


            // Send Email
            user.sendEmailVerification().then(function () {
                $('#alertEmailModal').modal('toggle');
            }).catch(function (error) {
            });

            console.log(user)
        });
        promise.catch(e => {
            console.log(e.message);
            const registerAlert = document.getElementById("registerAlert");

            registerAlert.classList.remove("hide");
            registerAlert.innerHTML = e.message;
        });

    }
    else {
        // Password and retype different.
        const registerAlert = document.getElementById("registerAlert");

        registerAlert.classList.remove("hide");
        registerAlert.innerHTML = "Password and re-type password different! Please try again.";
    }
}



// var auth = firebase.auth();
// var emailAddress = "user@example.com";



// #forgetPasswordTxt
function forgotPassword() {
    // forgotPasswordEmail
    var auth = firebase.auth();
    const fpEmail = document.getElementById("forgotPasswordEmail");
    const email = fpEmail.value;

    auth.sendPasswordResetEmail(email).then(function () {
        console.log("Email to change password sent to: " + email);
        $('#forgotPasswordModal').modal('hide');
    }).catch(function (error) {
        // An error happened.
        console.log("An error occurred.");
        const forgotPwAlert = document.getElementById("forgotPwAlert");

        forgotPwAlert.classList.remove("hide");
        forgotPwAlert.innerHTML = error.message;
    });
}












// DIAGNOSIS
var diagnosisCounter = 1;
function addNewDiagnosis() {
    diagnosisCounter = diagnosisCounter + 1;
    document.getElementById("diagnosisBlock").style.display = "block";
    var html = "<div id='diagnosis-" + diagnosisCounter + "'>" +
        "<select class='custom-select diagnosisClass' style='margin-bottom: 10px; width: 80%; font-size: 20px;'>" +
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
        "<i class='fas fa-times fa-2x' style='color: rgba(255, 255, 255, 0.789); '></i></button></div>";

    $("#diagnosisBlock").append(html);

    console.log("New diagnosis number: " + diagnosisCounter)
    // console.log(diagnosisCounter)
}
// id='removeDiagnosis'" + diagnosisCounter + "' index='" + diagnosisCounter + "'
function removeAddedDiagnosis(counter) {
    var diagnosisNumberX = document.getElementById("diagnosis-" + counter);
    diagnosisNumberX.remove();
    console.log("Removed Diagnosis Number: " + counter)
}

var diagnosisURI = "https://localhost:44395/api/diagnosis"

function createDiagnosis(patient_number) {
    // var diagnosis = document.getElementById("registerDiagnosis");
    // var diagnosisChosen = diagnosis.options[diagnosis.selectedIndex].text;

    allDiagnosis = $('.diagnosisClass');
    diagnosis_data = [];
    for (i = 0; i < allDiagnosis.length; i++) {
        // console.log(allDiagnosis[i].options[allDiagnosis[i].selectedIndex].text)
        // diagnosis_data.push(allDiagnosis[i].options[allDiagnosis[i].selectedIndex].text) // 
        single_diagnosis = { patient_id: patient_number, diagnosis1: allDiagnosis[i].options[allDiagnosis[i].selectedIndex].text };
        // i put 1 first to test

        console.log(single_diagnosis);
        // diagnosis_data.push(single_diagnosis); // doesnt work, not sure why.

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

        // diagnosis_data = { patient_id: 1, diagnosis1: allDiagnosis.options[allDiagnosis.selectedIndex].text }

    }
    console.log(diagnosis_data);

    // $.ajax({
    //     type: 'POST',
    //     url: diagnosisURI,
    //     data: JSON.stringify(diagnosis_data),
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         console.log("Diagnosis created.");

    //     }
    // });

}

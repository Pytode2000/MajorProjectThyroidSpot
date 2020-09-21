// URI to manage API.
var userURI = "https://localhost:44395/api/User";
var patientInfoURI = "https://localhost:44395/api/patientinfo";
var diagnosisURI = "https://localhost:44395/api/diagnosis";


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


// Login function. Takes in email and password.
function login() {
    const txtEmail = document.getElementById("loginEmail");
    const txtPassword = document.getElementById("loginPassword");

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.then(firebaseUser => {
        setTimeout(function () {
            window.location.href = "profile.html";
        }, 3000);

    })
    // Catch errors e.g. email not found or wrong password.
    promise.catch(e => {
        console.log(e.message);
        const loginAlert = document.getElementById("loginAlert");

        loginAlert.classList.remove("hide");
        loginAlert.innerHTML = e.message;
    });
}
// Register function. Takes in email, full name, password, retype password, NRIC, birthdate, diagnosis (or diagnoses), gender and blood type.
function register() {
    const txtEmail = document.getElementById("registerEmail");
    const txtPassword = document.getElementById("registerPassword");
    const txtRePassword = document.getElementById("registerRetypePassword");

    // Checks if the value of password and retype is the same.
    if (txtPassword.value === txtRePassword.value) {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.then(firebaseUser => {
            const user = firebase.auth().currentUser;
            const userUid = user.uid;
            console.log(userUid);

            // Creates an instance (row) in the "user" table. Account type is fixed as "patient". Admin and clinician accounts are to be created by admins
            // in the admin's manage page. User instance's foreign key "user_id" is the user's firebase UID.
            var userInstance = { user_id: userUid, full_name: $('#registerFullName').val(), account_type: "patient" };
            console.log(userInstance)
            $.ajax({
                type: 'POST',
                url: userURI,
                data: JSON.stringify(userInstance),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("User instance created.")
                }
            });

            /* For "patient_information" instace.*/
            // Obtain the selected gender radio button's value.
            var genderChosen;
            if (document.getElementById('genderMaleRadio').checked) {
                genderChosen = "Male"
            }
            else {
                genderChosen = "Female"
            }

            // Obtain the selected blood type select menu value.
            var bloodType = document.getElementById("registerBloodType");
            var bloodTypeChosen = bloodType.options[bloodType.selectedIndex].text;

            // Creates an instance (row) in the "patient_information" table. Fields in this row: NRIC, birthdate, gender and blood type. The foregin key is
            // the user's firebase UID. "doctor_id" is set as empty string by default (will be updated after a clinician "adopts" this patient).
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
                            // Function to create diagnosis (or diagnoses).
                            createDiagnosis(patient_array.patient_id)
                            console.log("patient_array.patient_id: " + patient_array.patient_id)
                            console.log("Created diagnosis!")
                        }
                    });

                }
            });


            // Send verification email on registration.
            user.sendEmailVerification().then(function () {
                $('#alertEmailModal').modal('toggle');
            }).catch(function (error) {
            });

            console.log(user)
        });
        // Catch errors.
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

// Diagnosis is a table on its own. Each patient can have more than 1 diagnosis.
// This function gets all the selected diagnosis (or diagnoses) (can be one or more) and then loops through all of them. In each loop, it creates an instance
// of the diagnosis and tags it to the patient.
function createDiagnosis(patient_number) {
    // This function is called in the "register()" function.

    // All diagnosis select menu input have the "diagnosisClass" class.
    allDiagnosis = $('.diagnosisClass');

    // Loop to loop thorugh all the selected diagnosis (or diagnoses).
    for (i = 0; i < allDiagnosis.length; i++) {

        // In each loop, create an instance of diagnosis and tag it to the patient.
        single_diagnosis = { patient_id: patient_number, diagnosis1: allDiagnosis[i].options[allDiagnosis[i].selectedIndex].text };

        console.log(single_diagnosis);

        // Jquery's AJAX function to POST (create) an instance to the diagnosis table.
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

// This function called by a small plus (+) icon. When clicked, a new select menu for diagnosis is generated.
var diagnosisCounter = 1; // Need a counter so that each diagnosis select menu have different ID (USED FOR REMOVING DIAGNOSIS).
// NOTE: This function only ADDS a new select menu. It does not create an instance (that is done in the createDiagnosis() function).
function addNewDiagnosis() {
    // Each time a new diagnosis select menu is created, the counter increases by one. This is so that the select menus have different ID.
    diagnosisCounter = diagnosisCounter + 1;
    document.getElementById("diagnosisBlock").style.display = "block";

    // Creation of a new diagnosis select menu.
    // Note the ID part. The id is added with the diagnosisCounter which increments for each diagnosis menu created.
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
}

// Function to remove diagnosis select menu are that are added. *CANNOT REMOVE THE FIRST ONE*.
// This function is called by a small (X) button beside each new diagnosis select menu.
// Since each diagnosis select menu (except for the default one) has different ID, this function removes 
// them by using their unique IDs.
function removeAddedDiagnosis(counter) {
    // Get the selected diagnosis select menu's ID.
    var diagnosisNumberX = document.getElementById("diagnosis-" + counter);
    // Remove.
    diagnosisNumberX.remove();
    console.log("Removed Diagnosis Number: " + counter)
}

// #forgetPasswordTxt
// Sends change password email to the user. User can then change his/her password from their email account.
function forgotPassword() {
    // forgotPasswordEmail
    var auth = firebase.auth();
    const fpEmail = document.getElementById("forgotPasswordEmail");
    const email = fpEmail.value;

    auth.sendPasswordResetEmail(email).then(function () {
        console.log("Email to change password sent to: " + email);
        $('#forgotPasswordModal').modal('hide');
    }).catch(function (error) {
        // Catch errors such as email does not exist.
        // An error happened.
        console.log("An error occurred.");
        const forgotPwAlert = document.getElementById("forgotPwAlert");

        forgotPwAlert.classList.remove("hide");
        forgotPwAlert.innerHTML = error.message;
    });
}
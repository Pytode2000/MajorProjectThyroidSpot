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
            var diagnosis = document.getElementById("registerDiagnosis");
            var diagnosisChosen = diagnosis.options[diagnosis.selectedIndex].text;

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
                user_id: userUid, diagnosis: diagnosisChosen, ic_number: $('#registerId').val(),
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
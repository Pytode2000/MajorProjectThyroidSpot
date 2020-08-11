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


//         sessionStorage.setItem("uniqueid", "none")

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
        }
    });
}

getUser()
getPatientInfo()


// https://firebase.google.com/docs/auth/web/manage-users
// var user = firebase.auth().currentUser;

// user.updateProfile({
//   displayName: "Jane Q. User",
//   photoURL: "https://example.com/jane-q-user/profile.jpg"
// }).then(function() {
//   // Update successful.
// }).catch(function(error) {
//   // An error happened.
// });


// var user = firebase.auth().currentUser;

// user.updateEmail("user@example.com").then(function() {
//   // Update successful.
// }).catch(function(error) {
//   // An error happened.
// });

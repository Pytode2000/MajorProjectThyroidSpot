// Store current admin's UID.
var currentAdminUid = sessionStorage.getItem("user_unique_id");

// URI to manage API.
var userURI = "https://localhost:44395/api/User";
var patientInfoURI = "https://localhost:44395/api/patientinfo";

// Store all users.
var usersArray = [];

var currentSelectedUserUid; // For GET.
var currentSelectedUserArray; // For GET-ting a selected user's information.
var currentSelectedUserId; // For delete.
var currentSelectedUserAccountType; // For delete.

// Get all users' "user" information and show all (except for the current admin).
function getAllUsers() {
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            usersArray = data;
            $("#usersUL").html("");
            for (iteration = 0; iteration < usersArray.length; iteration++) {
                // Don't show the admin's own account.
                if (usersArray[iteration].user_id != currentAdminUid) {
                    userListItem = "<li><a id='userAnchorList' index='" + usersArray[iteration].user_id + "'>" + usersArray[iteration].full_name + "<b style='float: right; margin-right: 2em;'>" + usersArray[iteration].account_type + "</b></a></li>"
                    $('#usersUL').append(userListItem);
                }
            }
        }
    });
}

// On selecting a user, call getSelectedUser() function which GETS all the selected user's information and then append to the user modal.
// Then, open the user modal.
$(document).on("click", "#userAnchorList", function () {
    currentSelectedUserUid = $(this).attr("index");
    console.log(currentSelectedUserUid);
    getSelectedUser();
    $('#userModal').modal('toggle');
});


function getSelectedUser() {
    $.ajax({
        type: 'GET',
        url: userURI + '/' + currentSelectedUserUid,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            currentSelectedUserArray = data;
            document.getElementById("modalId").innerHTML = currentSelectedUserArray.id;
            document.getElementById("modalUid").innerHTML = currentSelectedUserArray.user_id;
            document.getElementById("userModalLabel").innerHTML = currentSelectedUserArray.full_name;
            document.getElementById("modalAccountType").innerHTML = currentSelectedUserArray.account_type;

            // If selected user is also an admin, hide the delete button. Admin accounts cannot be removed by other admins.
            deleteBtn = document.getElementById("deleteButton");
            if (currentSelectedUserArray.account_type == "admin") {
                deleteBtn.classList.add("hide");
            }
            else {
                deleteBtn.classList.remove("hide");

            }
            // For deletion of account if admin wants to.
            currentSelectedUserId = currentSelectedUserArray.id;
            currentSelectedUserAccountType = currentSelectedUserArray.account_type;
        }
    });
}

function deleteUser() {

    // NOTE: FIREBASE AUTH's INSTANCE CANNOT BE DELETED HERE. It will only be deleted after a "deleted" user logs in.
    // When a deleted user logs in, his/her firebase auth will be then removed. After the Auth instance is removed, user will be redirected out.

    // If the selected user is "patient", delete instances from 5 SQL tables ("user", "patient_information", "diagnosis", "patient_report", "drug_dosage", ) 
    // Else, only delete from 1 SQL table ("user").

    // Delete instance from "user" table. APPLIES to all types of users.
    $.ajax({
        type: 'DELETE',
        url: userURI + '/' + currentSelectedUserId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("User instance deleted.")
        }
    });

    // If selected user is patient, delete instances from another 4 SQL tables.
    if (currentSelectedUserAccountType == "patient") {

        // If selected user is a patient, delete from the "patient_information" table.
        // GET patient_id first.
        patientArray = [];
        var selectedPatientID;


        $.ajax({
            type: 'GET',
            url: patientInfoURI + '/' + currentSelectedUserUid,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                patientArray = data;
                selectedPatientID = patientArray.patient_id;
                console.log("PATIENT ID" + selectedPatientID)

                // After successfully getting the selected patient's id, delete the patient_information instance by patient_id.
                $.ajax({
                    type: 'DELETE',
                    url: patientInfoURI + '/' + patientArray.patient_id,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log("Patient instance deleted.")

                        // Then, try to delete patient's diagnosis/diagnoses (TRY because patient may not have any diagnosis if they removed all in profile).
                        try {  // This deletes ALL diagnosis that has the selected user's patient_id. 1 AJAX DELETE deletes multiple instances.
                            $.ajax({
                                type: 'DELETE',
                                url: diagnosisURI + "?patientid=" + selectedPatientID,
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

                        // Try to delete patient's report (TRY because patient may not have any report).
                        try {
                            $.ajax({ // This deletes ALL reports that has the selected user's patient_id. 1 AJAX DELETE deletes multiple instances.
                                type: 'DELETE',
                                url: reportURI + "?patientid=" + selectedPatientID,
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
                            $.ajax({  // This deletes ALL dosage that has the selected user's patient_id. 1 AJAX DELETE deletes multiple instances.
                                type: 'DELETE',
                                url: dosageURI + "?patientid=" + selectedPatientID,
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
        });
    }
    // Hide all modals after deletion.
    $('#deleteUserModal').modal('hide');
    $('#userModal').modal('hide');

    // After deletion, wait 3s before updating the list of users.
    setTimeout(function () {
        getAllUsers()
    }, 3000);

}

// Admin can use this function to create admin and clinician accounts.
function createUser() {
    emailTxt = $('#newUserEmail').val();
    passwordTxt = $('#newUserPassword').val();
    rePasswordTxt = $('#newUserRePassword').val()
    fullNameTxt = $('#newUserFullName').val()

    // Check if the value of password and retype password are the same.
    if (passwordTxt === rePasswordTxt) { // Same.

        // Variable to store the account type value from radio button.
        var acc_type;
        if (document.getElementById('typeAdminRadio').checked) {
            acc_type = "admin"
        }
        else {
            acc_type = "clinician"
        }

        // Secondary "app" to create account (workaround).
        var config = {
            apiKey: "AIzaSyAJOmgi_23UV7szjryl9Bv6Bd9uK13C0KU",
            authDomain: "thyroidspot.firebaseapp.com",
            databaseURL: "https://thyroidspot.firebaseio.com",
            projectId: "thyroidspot",
            storageBucket: "thyroidspot.appspot.com",
            messagingSenderId: "652518093634",
            appId: "1:652518093634:web:5cc7a86bd8119cfcfe0edb",
            measurementId: "G-VLNKVKH5GT"
        };
        var secondaryApp = firebase.initializeApp(config, "Secondary");

        secondaryApp.auth().createUserWithEmailAndPassword(emailTxt, passwordTxt).then(function (firebaseUser) {
            var uid = firebaseUser.user.uid;

            console.log("User " + firebaseUser.uid + " created successfully!");

            // Create user instance.
            var userInstance = { user_id: uid, full_name: fullNameTxt, account_type: acc_type };
            console.log(userInstance)
            $.ajax({
                type: 'POST',
                url: userURI,
                data: JSON.stringify(userInstance),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("User instance created.");
                    $('#newUserModal').modal('hide');
                    getAllUsers()
                }
            });
            // Logout of the second app.
            secondaryApp.auth().signOut();
        }).catch(function (error) {
            // Show error occurred.
            const adminCreateUserAlert = document.getElementById("adminCreateUserAlert");
            adminCreateUserAlert.classList.remove("hide");
            adminCreateUserAlert.innerHTML = error.message;

            // Logout of the second app.
            secondaryApp.auth().signOut();
        });
    }
    else {
        // Values of password and retype password are different.

        // Show error.
        const adminCreateUserAlert = document.getElementById("adminCreateUserAlert");
        adminCreateUserAlert.classList.remove("hide");
        adminCreateUserAlert.innerHTML = "Password and re-type password different! Please try again.";
    }
}


/*** Search and Filter ***/

// Search function, called by clicking the magnifying glass.
function searchFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("usersUL");
    li = ul.getElementsByTagName('li');

    if (input.value.length == 0) {
        $("#filterSearch").val("");
    }

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

}

// Small "X" icon that clears the seach input box.
function resetFilterOnSearch() {
    $("#filterSearch").val("");
    $('input[type=text]#searchInput').val("");
    searchFunction();
}

// Filter function to see all, patients, clinicians, or admins.
function filterByAccountType() {
    var filter = document.getElementById("filterSearch");
    var filterSelected = filter.options[filterSearch.selectedIndex].value;

    $('input[type=text]#searchInput').val(filterSelected);

    // Call the search function.
    searchFunction();

    // Empty textbox.
    $('input[type=text]#searchInput').val("");
}



// Clear filter.
function clearFilter() {
    $("#filterSearch").val("");
}

// Call function onload.
getAllUsers()
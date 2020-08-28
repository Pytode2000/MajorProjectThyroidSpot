var currentAdminUid = sessionStorage.getItem("user_unique_id");

var userURI = "https://localhost:44395/api/User";
var patientInfoURI = "https://localhost:44395/api/patientinfo";

var usersArray = [];

var currentSelectedUserUid; // For GET.
var currentSelectedUserArray;
var currentSelectedUserId; // For delete.
var currentSelectedUserAccountType;


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

            deleteBtn = document.getElementById("deleteButton");
            if (currentSelectedUserArray.account_type == "admin") {
                deleteBtn.classList.add("hide");
            }
            else {
                deleteBtn.classList.remove("hide");

            }
            // For delete.
            currentSelectedUserId = currentSelectedUserArray.id;
            currentSelectedUserAccountType = currentSelectedUserArray.account_type;

        }
    });
}

function deleteUser() {

    // Delete from "user" table.
    $.ajax({
        type: 'DELETE',
        url: userURI + '/' + currentSelectedUserId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("User instance deleted.")
        }
    });

    if (currentSelectedUserAccountType == "patient") {
        // If user is a patient, delete from the "patient_information" table.
        // GET patient_id first
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

                $.ajax({
                    type: 'DELETE',
                    url: patientInfoURI + '/' + patientArray.patient_id,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log("Patient instance deleted.")



                        try {
                            $.ajax({
                                type: 'DELETE',
                                url: diagnosisURI + "?patientid=" + selectedPatientID,//?patientid={patientid}
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
                                url: reportURI + "?patientid=" + selectedPatientID,//?patientid={patientid}
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
                                url: dosageURI + "?patientid=" + selectedPatientID,//?patientid={patientid}
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
    $('#deleteUserModal').modal('hide');
    $('#userModal').modal('hide');

    setTimeout(function () {
        window.location.reload();
    }, 3000);

}



function createUser() {
    emailTxt = $('#newUserEmail').val();
    passwordTxt = $('#newUserPassword').val();
    rePasswordTxt = $('#newUserRePassword').val()
    fullNameTxt = $('#newUserFullName').val()

    if (passwordTxt === rePasswordTxt) {

        var acc_type;
        if (document.getElementById('typeAdminRadio').checked) {
            acc_type = "admin"
        }
        else {
            acc_type = "clinician"
        }

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
        // var fbUid;

        secondaryApp.auth().createUserWithEmailAndPassword(emailTxt, passwordTxt).then(function (firebaseUser) {
            // fbUid = firebaseUser.uid;
            var uid = firebaseUser.user.uid;

            console.log("User " + firebaseUser.uid + " created successfully!");
            // console.log(uid)

            // var newUserFbId = firebaseUser.uid
            // console.log(newUserFbId);

            var userInstance = { user_id: uid, full_name: fullNameTxt, account_type: acc_type }; // NOT DONE UID HAVENT ADD
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
                    // Send verification email? maybe
                    window.location.reload();


                }
            });

            secondaryApp.auth().signOut();
        }).catch(function (error) {
            const adminCreateUserAlert = document.getElementById("adminCreateUserAlert");

            adminCreateUserAlert.classList.remove("hide");
            adminCreateUserAlert.innerHTML = error.message;
            secondaryApp.auth().signOut();
        });
    }
    else {
        // password and retype passwrong different.
        const adminCreateUserAlert = document.getElementById("adminCreateUserAlert");

        adminCreateUserAlert.classList.remove("hide");
        adminCreateUserAlert.innerHTML = "Password and re-type password different! Please try again.";
    }
}




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

function filterByAccountType() {
    var filter = document.getElementById("filterSearch");
    var filterSelected = filter.options[filterSearch.selectedIndex].value;

    $('input[type=text]#searchInput').val(filterSelected);

    // Call the search function.
    searchFunction();

    // Empty textbox.
    $('input[type=text]#searchInput').val("");
}

function resetFilterOnSearch() {
    $("#filterSearch").val("");
    $('input[type=text]#searchInput').val("");
    searchFunction();
}

function clearFilter() {
    $("#filterSearch").val("");
}


getAllUsers()
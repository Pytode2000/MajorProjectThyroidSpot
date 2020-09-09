var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var latestReportArray = [];
var patientInformationArray = [];
var userInfoArray = [];
var patientName;
var valueFT4;
var valueTSH;
var totalPatient;
var latestUpdate;
var doctorID = sessionStorage.getItem("user_unique_id");
var patientUnderClinician = [];


function getPatientName() {
    console.log("retrieving patient name...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            userInfoArray = data;
            for(i=0; i < userInfoArray.length; i++) {
                if (userInfoArray[i].user_id == doctorID){
                    document.getElementById('displayClinicianName').innerHTML = "Dr. "+userInfoArray[i].full_name
                }
            }
        }
    });
}



function getAllPatientUnderClinician() {
    $.ajax({
        type: 'GET',
        url: patientURI + '?doctorid=' + doctorID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            var patientInformationArray = data;
            $.ajax({
                type: 'GET',
                url: userURI,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    var userInfoArray = data;
                    $('#patientCard').html('');
                    for (i = 0; i < patientInformationArray.length; i++) {
                        //console.log("hhhi" + patientInformationArray[i].user_id)
                        //console.log("bye" + patientInformationArray[i].user_id)
                        var reportArray = data;
                        for (j = 0; j < userInfoArray.length; j++) {
                            //console.log("hdi" + patientInformationArray[i].user_id)
                            if (patientInformationArray[i].user_id == userInfoArray[j].user_id) {
                                //console.log(patientInformationArray[i]) // NEED TO USE PATIENT_ID to get report id
                                $.ajax({
                                    type: 'GET',
                                    async: false,
                                    url: reportURI + "?patientid=" + patientInformationArray[i].patient_id,
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (reportData) {
                                        reportArray = reportData;
                                        console.log(reportArray)
                                    }
                                })

                                try {
                                    // GET THE LATEST
                                    lastReport = reportArray.pop();
                                    lastReportTimestamp = lastReport.timestamp;
                                    lastReportFT4 = lastReport.FT4;
                                    lastReportTSH = lastReport.TSH;
                                } catch (err) {
                                    console.log("This user no report.");

                                }


                                $('#patientCard').append("<div id='singlePatientCard' class='card patient-card' data-string='" + userInfoArray[j].full_name + "'><div class='card-body'>" +
                                    "<h5 id='patientName' class='card-title text-center'>" + userInfoArray[j].full_name + "</h5>" +
                                    "<p class='card-text text-center'>Gender : " + patientInformationArray[i].gender + "</p>" +
                                    "<p class='card-text text-center'>FT4 : " + lastReportFT4 + "</p>" +
                                    "<p class='card-text text-center'>TSH :" + lastReportTSH + "</p>" +
                                    "<button id='patientDetailsBtn' num='" + patientInformationArray[i].patient_id + "' index='" + patientInformationArray[i].user_id + "'" +
                                    "class='btn btn-secondary btn-block'>More Details</button>" +
                                    "<button id='openGraphModalBtn' class='btn btn-secondary btn-block' data-toggle='modal' data-target='#graphModal'>Graph</button>" +
                                    "<button id='abandonPatientBtn' index='" + i + "' num='" + patientInformationArray[i].patient_id + "' class='btn btn-secondary btn-block' data-toggle='modal' data-target='#abandonPatientModal'>Abandon Patient</button>" +
                                    "</div><div class='card-footer'>" +
                                    "<small class='text-muted'>Last Updated: " + lastReportTimestamp + " </small></div></div>")
                                totalPatient += 1;

                            }

                        }
                    }


                }
            });
        }
    });
}

// Search Patient By Name
$(document).on("keyup", "#searchInput", function () {
    var input = $(this).val().toUpperCase();

    $(".card").each(function () {
        if ($(this).data("string").toUpperCase().indexOf(input) < 0) {
            $(this).hide();
        } else {
            $(this).show();
        }
    })
});

function sortListDir() {
    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
    list = document.getElementById("patientCard");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByClassName("card");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should switch place with the current item,
            based on the sorting direction (asc or desc): */
            if (dir == "asc") {
                if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                    /* If next item is alphabetically lower than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
                    /* If next item is alphabetically higher than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
            // Each time a switch is done, increase switchcount by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}



$(document).on("click", "#abandonPatientBtn", function () {
    var currentPatient = $(this).attr('index')
    document.getElementById("confirmAbandonPatientBtn").val = currentPatient
});

function adoptPatient() {
    console.log(patientInformationArray)
    for (i = 0; i < patientInformationArray.length; i++) {
        if ($('#patientICInput').val() == patientInformationArray[i].ic_number) {
            var patientInformation = {
                patient_id: patientInformationArray[i].patient_id, user_id: patientInformationArray[i].user_id,
                diagnosis: patientInformationArray[i].diagnosis, ic_number: patientInformationArray[i].ic_number, date_of_birth: patientInformationArray[i].date_of_birth,
                gender: patientInformationArray[i].gender, blood_type: patientInformationArray[i].blood_type, timestamp: patientInformationArray[i].timestamp,
                doctor_id: doctorID
            };
            $.ajax({
                type: 'PUT',
                url: patientURI + '/' + patientInformationArray[i].patient_id,
                data: JSON.stringify(patientInformation),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("success")
                }
            });


        }
    }

}

$(document).on("click", "#transferPatientBtn", function () {
    var currentPatient = document.getElementById("confirmAbandonPatientBtn").val
    console.log(userInfoArray)
    newClinicianID = $('#newClinicianID').val()
    for (i = 0; i < userInfoArray.length; i++) {
        if (newClinicianID == userInfoArray[i].user_id) {
            if (userInfoArray[i].account_type != "clinician") {
                document.getElementById("wrongIDPrompt").style.display = "";
                document.getElementById("wrongIDPrompt").innerHTML = "This user is not a clinician"
            }
            else {
                var patientInformation = {
                    patient_id: patientInformationArray[currentPatient].patient_id, user_id: patientInformationArray[currentPatient].user_id,
                    diagnosis: patientInformationArray[currentPatient].diagnosis, ic_number: patientInformationArray[currentPatient].ic_number, date_of_birth: patientInformationArray[currentPatient].date_of_birth,
                    gender: patientInformationArray[currentPatient].gender, blood_type: patientInformationArray[currentPatient].blood_type, timestamp: patientInformationArray[currentPatient].timestamp,
                    doctor_id: newClinicianID
                };
                $.ajax({
                    type: 'PUT',
                    url: patientURI + '/' + patientInformationArray[currentPatient].patient_id,
                    data: JSON.stringify(patientInformation),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log("success")
                    }
                });
            }
        }
        else if (i == (userInfoArray.length - 1) && newClinicianID != userInfoArray[i].user_id) {
            document.getElementById("wrongIDPrompt").style.display = "";
            document.getElementById("wrongIDPrompt").innerHTML = "Wrong ID";
        }
    }

});

$(document).on("click", "#confirmAbandonPatientBtn", function () {
    var currentPatient = document.getElementById("confirmAbandonPatientBtn").val
    console.log(currentPatient)
    var patientInformation = {
        patient_id: patientInformationArray[currentPatient].patient_id, user_id: patientInformationArray[currentPatient].user_id,
        diagnosis: patientInformationArray[currentPatient].diagnosis, ic_number: patientInformationArray[currentPatient].ic_number, date_of_birth: patientInformationArray[currentPatient].date_of_birth,
        gender: patientInformationArray[currentPatient].gender, blood_type: patientInformationArray[currentPatient].blood_type, timestamp: patientInformationArray[currentPatient].timestamp,
        doctor_id: ""
    };
    $.ajax({
        type: 'PUT',
        url: patientURI + '/' + patientInformationArray[currentPatient].patient_id,
        data: JSON.stringify(patientInformation),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("success")
        }
    });



});

$("#adoptPatientForm").submit(function (e) {
    e.preventDefault();
});


$(document).on("click", "#patientDetailsBtn", function () {
    var currentPatientUserId = $(this).attr('index');
    var currentPatientId = $(this).attr('num')
    localStorage.setItem("currentPatientUserId", currentPatientUserId)
    localStorage.setItem("currentPatientId", currentPatientId)
    window.location.href = "patient-info-doctor.html"

});


$(document).on("click", "#openGraphModalBtn", function () {
    var ctx = document.getElementById('displayGraph').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ft4', 'TSH', 'ABC'],
            datasets: [{
                label: 'value xx',
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
})


//This function will get the full name of the patient
function getPatientReport() {
    console.log("Retrieving Patient Report...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            reportArray = data;
            return reportArray;
        }
    });
}




getPatientName();
getAllPatientUnderClinician();



var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var latestReportArray = [];
var allPatientArray = [];
var patientUnderClinicianArray = [];
var userInfoArray = [];
var patientName;
var valueFT4;
var valueTSH;
var totalPatient;
var latestUpdate;
var doctorID = sessionStorage.getItem("user_unique_id");
var patientUnderClinician = [];

// Get User Info Array and Display Clinician's Name
function getAllPatientDetails() {
    console.log("retrieving patient name...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            userInfoArray = data;
            $.ajax({
                type: 'GET',
                url: patientURI,
                dataType: 'json',
                contentType: 'application/json',
                success: function(patientData){
                    allPatientArray = patientData
                    for(i=0; i < userInfoArray.length; i++) {
                        if (userInfoArray[i].user_id == doctorID){
                            document.getElementById('displayClinicianName').innerHTML = "Dr. "+userInfoArray[i].full_name
                        }
                    }
                }
            })

        }
    });
}


// Get All Patient Under Current Clinician With Clinician's user_id
function getAllPatientUnderClinician() {
    $.ajax({
        type: 'GET',
        url: patientURI + '?doctorid=' + doctorID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            var patientUnderClinicianArray = data;
            $.ajax({
                type: 'GET',
                url: userURI,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    var userInfoArray = data;
                    $('#patientCard').html('');
                    for (i = 0; i < patientUnderClinicianArray.length; i++) {
                        for (j = 0; j < userInfoArray.length; j++) {
                            if (patientUnderClinicianArray[i].user_id == userInfoArray[j].user_id) {
                                $.ajax({
                                    type: 'GET',
                                    async: false,
                                    url: reportURI + "?patientid=" + patientUnderClinicianArray[i].patient_id,
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (reportData) {
                                        reportArray = reportData;
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
                                    lastReportTimestamp = "No Report"
                                    lastReportFT4 = " -"
                                    lastReportTSH = " -"
                                }


                                $('#patientCard').append("<div id='singlePatientCard' class='card patient-card' data-string='" + userInfoArray[j].full_name + "'><div class='card-body'>" +
                                    "<h5 id='patientName' class='card-title text-center'>" + userInfoArray[j].full_name + "</h5>" +
                                    "<p class='card-text text-center'>Gender : " + patientUnderClinicianArray[i].gender + "</p>" +
                                    "<p class='card-text text-center'>FT4 : <a class='ft4'>" + lastReportFT4 + "</a></p>" +
                                    "<p class='card-text text-center'>TSH : <a class='tsh'>" + lastReportTSH + "</a></p>" +
                                    "<button id='patientDetailsBtn' num='" + patientUnderClinicianArray[i].patient_id + "' index='" +patientUnderClinicianArray[i].user_id + "'" +
                                    "class='btn btn-secondary btn-block'>More Details</button>" +
                                    "<button id='openGraphModalBtn' class='btn btn-secondary btn-block' data-toggle='modal' data-target='#graphModal'>Graph</button>" +
                                    "<button id='abandonPatientBtn' index='" + i + "' num='" + patientUnderClinicianArray[i].patient_id + "' class='btn btn-secondary btn-block' data-toggle='modal' data-target='#abandonPatientModal'>Abandon Patient</button>" +
                                    "</div><div class='card-footer'>" +
                                    "<small class='text-muted'>Last Updated: <a class='timestamp'>" + lastReportTimestamp + "</a></small></div></div>")
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

// Sort patient by alphabetical order
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


function sortByFT4Value() {
    var list, b,switching, i, x, y, shouldSwitch;
    list = document.getElementById("patientCard");
    switching = true;
    dir = "low";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      b = list.getElementsByClassName("card");
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 0; i < (b.length - 1); i++) {
        //start by saying there should be no switching:
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = b[i].getElementsByClassName("ft4")[0];
        y = b[i + 1].getElementsByClassName("ft4")[0];
        innerX = x.innerHTML;
        innerY = y.innerHTML;
        if (isNaN(innerX)){
            innerX = 0;
        }
        if (isNaN(innerY)){
            innerY = 0;
        }
        console.log(Number(innerY))
        console.log(Number(innerX))
        //check if the two rows should switch place:
        if (Number(innerX) < Number(innerY)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  }

function sortByTSHValue() {
var list, b,switching, i, x, y, shouldSwitch;
list = document.getElementById("patientCard");
switching = true;
/*Make a loop that will continue until
no switching has been done:*/
while (switching) {
    //start by saying: no switching is done:
    switching = false;
    b = list.getElementsByClassName("card");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < (b.length - 1); i++) {
    //start by saying there should be no switching:
    /*Get the two elements you want to compare,
    one from current row and one from the next:*/
    x = b[i].getElementsByClassName("tsh")[0];
    y = b[i + 1].getElementsByClassName("tsh")[0];
    innerX = x.innerHTML;
    innerY = y.innerHTML;
    if (isNaN(innerX)){
        innerX = 0;
    }
    if (isNaN(innerY)){
        innerY = 0;
    }
    console.log(Number(innerY))
    console.log(Number(innerX))
    //check if the two rows should switch place:
    if (Number(innerX) < Number(innerY)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
    }
    }
    if (shouldSwitch) {
    /*If a switch has been marked, make the switch
    and mark that a switch has been done:*/
    b[i].parentNode.insertBefore(b[i + 1], b[i]);
    switching = true;
    }
}
}

function sortByDate() {
    var list, b,switching, i, x, y, shouldSwitch;
    list = document.getElementById("patientCard");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        b = list.getElementsByClassName("card");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 0; i < (b.length - 1); i++) {
        //start by saying there should be no switching:
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = b[i].getElementsByClassName("timestamp")[0];
        y = b[i + 1].getElementsByClassName("timestamp")[0];
        innerX = convertDate(x.innerHTML);
        innerY = convertDate(y.innerHTML);
        if (isNaN(innerX)){
            innerX = 0;
        }
        if (isNaN(innerY)){
            innerY = 0;
        }
        console.log(Number(innerY))
        console.log(Number(innerX))
        //check if the two rows should switch place:
        if (Number(innerX) < Number(innerY)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
        }
        }
        if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        }
    }
    }

function convertDate(d) {
    var p = d.split("-");
    return +(p[2]+p[1]+p[0]);
  }
  


$(document).on("click", "#abandonPatientBtn", function () {
    var currentPatient = $(this).attr('index')
    document.getElementById("confirmAbandonPatientBtn").val = currentPatient
});

function adoptPatient() {
    for (i = 0; i < allPatientArray.length; i++) {
        if ($('#patientICInput').val() == allPatientArray[i].user_id) {
            var patientInformation = {
                patient_id: allPatientArray[i].patient_id, user_id: allPatientArray[i].user_id,
                diagnosis: allPatientArray[i].diagnosis, ic_number: allPatientArray[i].ic_number, date_of_birth: allPatientArray[i].date_of_birth,
                gender: allPatientArray[i].gender, blood_type: allPatientArray[i].blood_type, timestamp: allPatientArray[i].timestamp,
                doctor_id: doctorID
            };
            $.ajax({
                type: 'PUT',
                url: patientURI + '/' + allPatientArray[i].patient_id,
                data: JSON.stringify(patientInformation),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("success")
                }
            });


        } else {
            document.getElementById("wrongPatientIdPrompt").style.display = "";
            document.getElementById("wrongPatientIdPrompt").innerHTML = "This Patient Does Not Exist"
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




getAllPatientDetails();
getAllPatientUnderClinician();



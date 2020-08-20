var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var patientInfoArray = [];
var userInfoArray = [];
var patientName;
var valueFT4;
var valueTSH;
var latestUpdate;



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
            return userInfoArray;
        }
    });
}

function getAllPatientInfo() {
    console.log("retrieving all patient infomation...")
    $.ajax({
        type: 'GET',
        url: patientURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            patientInfoArray = data;
            console.log(patientInfoArray)
            $('#patientCard').html('');
            for (i = 0; i < patientInfoArray.length; i++) {
                console.log(patientInfoArray[i].user_id)
                //getPatientName(patientInfoArray[i].user_id)
                //getPatientReport(patientInfoArray[i].patient_id)           
                $('#patientCard').append("<article class='patient-card'> <div class='text'><h3>Name</h3><p>"+patientInfoArray[i].ic_number+"</p>"+
                  "<p><b>Details</b></p><p>Gender:"+patientInfoArray[i].gender+"</p><p>Blood Type: "+patientInfoArray[i].blood_type+"</p>"+
                  "<a id='patientDetailsBtn' num='"+ patientInfoArray[i].patient_id + "' index='"+ patientInfoArray[i].user_id + "' class='button patient-details-btn' >More Details</a>"+
                  "<a class='patient-details-btn button' href='#'>Graph</a></div></article>");
                console.log("btn val:"+$('#patientDetailsBtn').attr('index'))
            }
        }
    });
}

//Update Amount of volunteers for event
function adoptPatient(){
    var doctorID = sessionStorage.getItem("user_unique_id");
    for(i=0; i <patientInfoArray;i++){
        if ($('#patientICInput').val() == patientInfoArray[i].ic_number){
            var patientInformation = { patient_id: patientInfoArray[i].patient_id,user_id: patientInfoArray[i].user_id,
                diagnosis: patientInfoArray[i].diagnosis, ic_number: patientInfoArray[i].ic_number, date_of_birth: patientInfoArray[i].date_of_birth,
                gender: patientInfoArray[i].gender, blood_type: patientInfoArray[i].blood_type, timestamp: patientInfoArray[i].timestamp,
                doctor_id: doctorID}
            $.ajax({
                type: 'PUT',
                url: patientURI + "/" + patientInfoArray[i].user_id,
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

$("#adoptPatientForm").submit(function(e) {
    e.preventDefault();
});


// Place details into Project Modal
$(document).on("click", "#patientDetailsBtn", function () {
    var currentPatientUserId = $(this).attr('index');
    var currentPatientId = $(this).attr('num')
    localStorage.setItem("currentPatientUserId",currentPatientUserId)
    localStorage.setItem("currentPatientId",currentPatientId)
    window.location.href = "patient-info-doctor.html"

});



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





getAllPatientInfo();



var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var patientInfoArray = [];
var userInfoArray = [];
var currentPatientID;
var patientName;
var valueFT4;
var valueTSH;
var latestUpdate;


function getPatientName(userId) {
    console.log("retrieving patient name...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            userInfoArray = data;
            for(i = 0; i < userInfoArray.length; i++) {
                if (userId == userInfoArray[i].user_id) {
                    patientName = userInfoArray[i].full_name;
                }
            }
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
                getPatientName(patientInfoArray[i].user_id)
                getPatientReport(patientInfoArray[i].patient_id)           
                $('#patientCard').append("<article> <div class='text'><h3>"+patientName+"</h3><p>x</p>"+
                  "<p><b>Latest Update</b></p><p>FT4:x</p><p>TSH: x</p>"+
                  "<a class='button' href='patient-info-doctor.html' >More Details</a>"+
                  "<a class='button' href='#'>Graph</a></div></article>");
            }
        }
    });
}



//This function will get the full name of the patient
function getPatientReport(patientId) {
    console.log("Retrieving Patient Report...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            reportArray = data;
             for(i = 0; i < reportArray.length; i++) {
                if (patientId == reportArray[i].patient_id) {
                        valueFT4 = reportArray[i].FT4,
                        valueTSH = reportArray[i].TSH,
                        latestUpdate = reportArray[i].timestamp
                    
                }
            }
        }
    });
}

$(window).on('load', function() {
    getAllPatientInfo();
   });

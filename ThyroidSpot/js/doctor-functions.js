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

//This function will consume the disease GET API
function getAllPatientInfo() {
    console.log("retrieving all patient infomation...")
    $.ajax({
        type: 'GET',
        url: patientURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            patientInfoArray = data;
            console.log(patientInfoArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#patientCard').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < patientInfoArray.length; i++) {
                getPatientName(patientInfoArray[i].user_id)
                patientReportDetails = getPatientReport(patientInfoArray[i].patient_id)
                $('#patientCard').append("<article> <div class='text'><h3>"+patientName+"</h3><p>"+patientReportDetails.latestUpdate+"</p>"+
                  "<p><b>Latest Update</b></p><p>FT4: "+patientReportDetails.valueFT4+"</p><p>TSH: "+patientReportDetails.valueTSH+"</p>"+
                  "<a class='button' href='patient-info-doctor.html' >More Details</a>"+
                  "<a class='button' href='#'>Graph</a></div></article>");
            }
        }
    });
}


//This function will get the full name of the patient
function getPatientName(userId) {
    console.log("retrieving patient name...")
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            userInfoArray = data;
            for(i = 0; i < userInfoArray.length; i++) {
                if (userId == userInfoArray[i].user_id) {
                    return patientName = userInfoArray[i].full_name
                }
            }
        }
    });
}

//This function will get the full name of the patient
function getPatientReport(patientId) {
    console.log("Retrieving Patient Report...")
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            reportArray = data;
            for(i = 0; i < reportArray.length; i++) {
                if (patientId == reportArray[i].patient_id) {
                    return{
                        valueFT4 : reportArray[i].FT4,
                        valueTSH : reportArray[i].TSH,
                        latestUpdate : reportArray[i].timestamp
                    } ;
                }
            }
        }
    });
}
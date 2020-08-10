// all patient functions go here

//disease functions
var patientURI = 'https://localhost:44395/api/patientInfo';
var patientInfoArray = [];
var currentPatientID; //this variable will contain the patient ID that's selected

//This function will consume the patient info GET API (FOR DOCTORS)
function getOnePatientInfo() {
    
    var getuid = sessionStorage.getItem("uniqueid");
    console.log("retrieving all patient info...")
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
            $('#patientCardContent').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < patientInfoArray.length; i++) {
                if (getuid == patientInfoArray[i].user_id){

                    currentPatientID = patientInfoArray[i].patient_id;

                    viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
                    // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                    //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");

                    //TODO: get user
                    $('#patientCardContent').append("<h2 style='text-align: center'>Test Name</h2><table class='centerTable'><tr>"+
                        "<td></p><b>IC number: " + patientInfoArray[i].ic_number + 
                        "</b></p></td><td class='shiftedrow'><p>Diagnosis: "+patientInfoArray[i].diagnosis+"</p></td>"+
                        "<td class='shiftedrow'>D.O.B: "+patientInfoArray[i].date_of_birth+"</td><td class='shiftedrow'>Gender: "+patientInfoArray[i].gender+
                        "</td><td class='shiftedrow'>Blood Type: "+patientInfoArray[i].blood_type+"</td></tr></table>");

                    getPatientReport();

                }
                else if (i == patientInfoArray.length-1){
                    createinfobutton = "<button id='createnewinfo' class=' btn btn-info btn-sm'>Create New Patient Info</button>"
                    $('#patientCardContent').append("<div class = 'centerText'>" +
                    "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
                     "<div class='centerTitle'></p>No patient info yet"+
                     "</p><div class='centerContent'><p>Please click on the link to create one</p></div>" +createinfobutton+ "</div>");
                }
            }
        }
    });
}

// //only patients can access it based on their assigned unique ID
// function getPatientInfo_DoctorOnly() {
//     console.log("retrieving all patient info...")
//     $.ajax({
//         type: 'GET',
//         url: patientURI,
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function (data) {
//             //put json data into bookArray
//             patientInfoArray = data;
//             console.log(patientInfoArray)
//             //clear the tbody of the table so that it will be refreshed everytime
//             $('#patientCardContent').html('');
//             //Iterate through the diseaseInfoArray to generate rows to populate the table
//             for (i = 0; i < patientInfoArray.length; i++) {
//                 //TODO: need code an if else statement to match firebase ID

//                 viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
//                 // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
//                 //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
//                 $('#patientCardContent').append("<div class = 'centerText'>" +
//                     "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
//                      "<div class='centerTitle'></p><b>" + patientInfoArray[i].ic_number + 
//                      "</b></p><div class='centerContent'><p>Diagnosis: "+patientInfoArray[i].diagnosis+"</p></div>" +viewreportbutton+ "</div>");
//             }
//         }
//     });
// }

//create patient info
function postPatientInfo() {
    //getting firebase UID from sessionstorage GET and putting in 'user_id'
    var getuser_id = sessionStorage.getItem("uniqueid");
    
    //creating date
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


    var patientinfo = { user_id: getuser_id, diagnosis: $('#newDiagnosisDDL').val(), ic_number: $('#newIC').val(), date_of_birth: $('#newDOB').val(),
     gender: $('#newGenderDDL').val(), blood_type: $('#newBloodTypeDDL').val(), timestamp: date}

    console.log(patientinfo);

    $.ajax({
        type: 'POST',
        url: patientURI,
        data: JSON.stringify(patientinfo),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            getOnePatientInfo();
            document.getElementById('newPatientModal').style.display='none'
        }
    });
}



//GET PATIENT REPORT:
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected


//only patients can access it based on their assigned unique ID
function getPatientReport() {
    console.log("retrieving all patient report...")

    console.log(currentPatientID)
    
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            reportArray = data;
            //clear the tbody of the table so that it will be refreshed everytime
            
            // $('#reportContent').html('');

            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < reportArray.length; i++) {

                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                // $('#reportContent').append("<div class = 'centerText'>" +
                //     "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
                //      "<div class='centerTitle'></p><b>" + reportArray[i].report_id + //TODO: get username from the user table 
                //      "</b></p><div class='centerContent'><p>FT4: "+reportArray[i].FT4 +"</p><p>TSH: "+reportArray[i].TSH +
                //      "</p><p>Drug Dose: "+reportArray[i].drug_dose +"</p><p>Last updated: "+reportArray[i].timestamp +"</p></div></div>");

                if (currentPatientID == reportArray[i].patient_id){
                    
                    //TODO: show reports of the patient
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    return console.log(report)
                }
                else if (i == reportArray.length-1){
                    $('#reportcontainer').html('');
                    createreportbtn = "<button id='createrpt' class=' btn btn-info btn-sm'>Create Report</button>"
                    $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
                    return console.log("sot liao u")
                }
            }
        }
    });
}


//TODO: create function for postPatientReport




$(document).on("click", "#createnewinfo", function () {
    document.getElementById('newPatientModal').style.display='block'
});

//TODO: create a doc model for postPatientReport

getOnePatientInfo();
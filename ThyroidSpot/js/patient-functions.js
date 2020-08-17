// all patient functions go here

//QUERY FOR USERNAME
var userURI = 'https://localhost:44395/api/user';
var userInfoArray = [];
var username;
function getUserName(){
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            userInfoArray = data;

            for (i = 0; i < userInfoArray.length; i++) {
                if (getuid == userInfoArray[i].user_id){
                    username = userInfoArray[i].full_name;
                    return getOnePatientInfo();
                }
            }
        }
    });
}


//disease functions
var patientURI = 'https://localhost:44395/api/patientInfo';
var patientInfoArray = [];
var currentPatientID; //this variable will contain the patient ID that's selected


//This function will consume the patient info GET API (FOR DOCTORS)
function getOnePatientInfo() {
    
    var getuid = sessionStorage.getItem("user_unique_id");
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

            // $('#reportcontainer').html('');

            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < patientInfoArray.length; i++) {
                if (getuid == patientInfoArray[i].user_id){

                    currentPatientID = patientInfoArray[i].patient_id;

                    viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
                   
                    
                    $('#patientCardContent').append("<h2 style='text-align: center'>"+username+"</h2><table class='infoTable'><tr>"+
                        "<td class='shiftedrow' style='padding-left: -5px'><b>IC number: " + patientInfoArray[i].ic_number + 
                        "</b></td><td class='shiftedrow'>Diagnosis: "+patientInfoArray[i].diagnosis+"</td>"+
                        "<td class='shiftedrow'>D.O.B: "+patientInfoArray[i].date_of_birth+"</td><td class='shiftedrow'>Gender: "+patientInfoArray[i].gender+
                        "</td><td class='shiftedrow'>Blood Type: "+patientInfoArray[i].blood_type+"</td></tr></table>");

                    return  getPatientReport();


                }
                else if (getuid != patientInfoArray[i].user_id && i == patientInfoArray.length-1){
                    $('#reportcontainer').html('');
                    createinfobutton = "<button id='createnewinfo' class=' btn btn-info btn-sm'>Create New Patient Info</button>"
                    $('#patientCardContent').append("<div class = 'centerText'>" +
                    
                     "<div class='centerTitle'></p>No patient info yet"+
                     "</p><div class='centerContent'><p>Please click on the link to create one</p></div>" +createinfobutton+ "</div>");

                    return console.log("that's enough")
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

//create patient info (FOR DEBUGGING PURPOSES)
function postPatientInfo() {
    //getting firebase UID from sessionstorage GET and putting in 'user_id'
    var getuser_id = sessionStorage.getItem("user_unique_id");
    
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



//GET + CREATE PATIENT REPORT:
var reportURI = 'https://localhost:44395/api/report';
var dosageURI = 'https://localhost:44395/api/dosage';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected
var reportIDArray = [];

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
            console.log(reportArray)
            // $('#reportContent').html('');
            $('#dosagehist').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            if (reportArray == ""){
                $('#reportcontainer').html('');
                createreportbtn = "<button id='createrpt' class=' btn btn-info btn-sm'>Create Report</button>"
                $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
            }
            else{
            for (i = 0; i < reportArray.length; i++) {
                if (currentPatientID == reportArray[i].patient_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}

                    viewdosagebtn = "<button id='viewdosage' class=' btn btn-info btn-sm'>View Prescription</button>";

                    //TODO: onclick on button to view report in a modal (then can add on a button to export it as PDF)
                    $('#dosagehist').append("<div style='margin-bottom: 0.5em;'><table class='dosageTable'>"+
                    "<tr><td class='reportTD'>"+report.timestamp+"</td><td class='reportFT'>"+report.FT4+"</td><td class='reportTSH'>"+
                    ""+report.TSH+"</td><td class='reportDRNA'>"+viewdosagebtn+"</td></tr></table></div>");
                    

                }
                else if (currentPatientID != reportArray[i].patient_id && i == reportArray.length-1){
                    $('#reportcontainer').html('');
                    createreportbtn = "<button id='createrpt' class=' btn btn-info btn-sm'>Create Report</button>"
                    $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
                    return console.log("no report history")
                }
            }
        }
        }
    });
}


//TODO: create a prescription modal and function to view prescription



//create function for postPatientReport
var captureportid //global variable to get report id after adding

function postPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID
    console.log(currentPatientID)

    //creating date
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    console.log(date);

    
    var patientinfo = {patient_id: getuser_id, FT4: $('#newFT4').val(), TSH: $('#newTSH').val(), timestamp: date}
    console.log(patientinfo);

    $.ajax({
        type: 'POST',
        url: reportURI,
        data: JSON.stringify(patientinfo),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            console.log(data)
            getReportID();
        }
    });
}


//get report id after posting
function getReportID(){
    console.log("calling get rpt id")
    
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            reportIDArray = data
            console.log(reportIDArray)

            console.log(reportIDArray[reportIDArray.length-1].report_id); //get recent added id
            captureportid = reportIDArray[reportIDArray.length-1].report_id
            postDosage();
        }
    });
}

//Post drug name and drug dosage to dosage table
function postDosage(){
    
    console.log("calling post dosage")
    
    send = $('.newDrugName')
    send2 = $('.newDrugDose')

    array_to_add = []
    for (i = 0 ; i < send.length; i++){
        //druginfo = {report_id: captureportid, drug_dose: send[i].value, drug_name: send2[i].value}
        druginfo = {report_id: 2, drug_dose: send[i].value, drug_name: send2[i].value}
        array_to_add.push(druginfo)
    }
    //var druginfo = {report_id: 2, drug_dose: $('#newDrugDose').val(), drug_name: $('#newDrugName').val()}
    console.log(array_to_add)

    //var druginfo = {report_id: captureportid, drug_dose: $('#newDrugDose').val(), drug_name: $('#newDrugName').val()}
    //console.log(druginfo)
    $.ajax({
        type: 'POST',
        url: dosageURI,
        data: JSON.stringify(array_to_add),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            getOnePatientInfo();
            document.getElementById('newPatientModal').style.display='none'
            window.location.reload();
        }
    });
}


//TODO: function to export patient info with dosage report as PDF (screw the graph first bc that one is really hard)
function exportData(){
     
}

$(document).on('click', '#addMoreRows', function(){
    var html = "<tr><td class='firsttd'><label>Drug Name:</label></td><td class='labeltd'><input class='newDrugName'></td><td class='firsttd'>"+
    "<label>Drug dose:</label></td></td><td class='labeltd'><input class='newDrugDose'></td></tr>";
    $("#addon").append(html);
});

//(FOR DEBUG) doc model for postPatientInfo
$(document).on("click", "#createnewinfo", function () {
    document.getElementById('newPatientModal').style.display='block'
});

//doc model for postPatientReport
$(document).on("click", "#createrpt", function () {
    document.getElementById('newReportModal').style.display='block'
});

//TODO: add onclick function to launch prescription model

getUserName();
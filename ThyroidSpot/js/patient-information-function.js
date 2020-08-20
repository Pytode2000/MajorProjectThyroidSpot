var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';

var dosageURI = 'https://localhost:44395/api/dosage';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected
var reportIDArray = [];
var currentUser = [];

var secondReportArray = [] // for search function
var storeReports = [] //second array for search function

var patientInfo = []
currentPatientUserId = localStorage.getItem("currentPatientUserId")
currentPatientId = localStorage.getItem("currentPatientId")

function getPatientName(){
    $.ajax({
        type: 'GET',
        url: userURI +"/"+currentPatientUserId,
        dataType: 'json',
        contentType: 'application/json',
        success: function(data){
            currentUser = data;
            $('#patient-name').text(currentUser.full_name)

        }
    })
}

function getSpecificPatientInfo(){
    $.ajax({
        type: 'GET',
        url: patientURI +"/"+currentPatientUserId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            patientInfo = data
            $('#patient-ic-number').text("IC Number: "+ patientInfo.ic_number)
            $('#patient-diagnosis').text("Diagnosis: "+ patientInfo.diagnosis)
            $('#patient-date-of-birth').text("Date of Birth: "+ patientInfo.date_of_birth)
            $('#patient-gender').text("Gender: "+ patientInfo.gender)
            $('#patient-blood-type').text("Blood Type: "+ patientInfo.blood_type)

        }
});
}



function getPatientReport() {
    console.log("retrieving all patient report...")

    console.log(currentPatientId)
    
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            reportArray = data;
            secondReportArray = data;
            //clear the tbody of the table so that it will be refreshed everytime
            console.log(reportArray)
            // $('#reportContent').html('');
            $('#dosagehist').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            if (reportArray == ""){
                $('#searchRPTcontain').html('');
                $('#reportcontainer').html('');
                createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3 >No patient report found</h3><div>"+createreportbtn+"<div></div>");
            }
            else{
            for (i = 0; i < reportArray.length; i++) {
                if (currentPatientId == reportArray[i].patient_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    storeReports.push(report)
                    viewdosagebtn = "<button id='viewdosage' num="+reportArray[i].report_id+" class=' btn btn-info btn-sm'>View / Edit Prescription</button>";

                    //TODO: onclick on button to view report in a modal (then can add on a button to export it as PDF)
                    $('#dosagehist').append("<div style='margin-bottom: 0.5em;'><table class='dosageTable'>"+
                    "<tr><td class='reportTD'>"+report.timestamp+"</td><td class='reportFT'>"+report.FT4+"</td><td class='reportTSH'>"+
                    ""+report.TSH+"</td><td class='reportDRNA'>"+viewdosagebtn+"</td></tr></table></div>");
                    

                }
                else if (currentPatientId != reportArray[i].patient_id && i == reportArray.length-1){
                    $('#searchRPTcontain').html('');
                    $('#reportcontainer').html('');
                    createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                    $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
                    return console.log("no report history")
                }
            }
        }
        }
    });
}


var doseArray = []//defining array to store all dosages
function getPrescription(){
    $.ajax({
        type: 'GET',
        url: dosageURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            doseArray = data;
            
            console.log(doseArray)
            $('#prescriptionTable').html('');
            for (i = 0; i < doseArray.length; i++) {
                if (currentReportID == doseArray[i].report_id){
                    
                    var prescription = {report_id: doseArray[i].report_id, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose}
                    
                    console.log(prescription)
                    
                    $('#prescriptionTable').append("<tr><td>"+prescription.drug_name+"</td><th style='width: 50%;'></th><td>"+prescription.drug_dose+"</td></tr>");

                }
            }
        }
    });
}

//get one patient info
function getOneReportInfo(){
    console.log("retrieving all patient report...")
    
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
            for (i = 0; i < reportArray.length; i++) {
                if (currentReportID == reportArray[i].report_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    
                    //for prescription modal:
                    $('#tdDiagnosis').text(diagnosis)
                    $('#tdCheckup').text(report.timestamp)
                    $('#tdFt4').text(report.FT4)
                    $('#tdTsh').text(report.TSH)

                    getPrescription(); //function to show drug name and drug dose
                }
            }
        }
    });
}

$(document).on("click", "#viewdosage", function () {
    currentReportID = $(this).attr('num');
    console.log(currentReportID);
    getOneReportInfo(currentReportID);
    document.getElementById('prescriptionModal').style.display='block'
});



getSpecificPatientInfo();
getPatientReport()
getPatientName();

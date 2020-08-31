var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var diagnosisURI = 'https://localhost:44395/api/diagnosis';

var dosageURI = 'https://localhost:44395/api/dosage';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected
var reportIDArray = [];
var currentUser = [];

var secondReportArray = [] // for search function
var storeReports = [] //second array for search function

var diagnosis;
var currentDiagnosis;

var diagnosisInformation = [];
var patientInfo = [];
currentPatientUserId = localStorage.getItem("currentPatientUserId");
currentPatientId = localStorage.getItem("currentPatientId");

// Get The Current Patient Name
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

// Get Patient Full Information From Users table
function getSpecificPatientInfo(){
    $.ajax({
        type: 'GET',
        url: patientURI +"/"+currentPatientUserId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            patientInfo = data
            $.ajax({
                type: 'GET',
                url: diagnosisURI +"/"+currentPatientId,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    diagnosisInformation = data
                    console.log(diagnosisInformation.diagnosis1)
                    $('#patient-ic-number').text("IC Number: "+ patientInfo.ic_number)
                    $('#patient-diagnosis').text("Diagnosis: "+ diagnosisInformation[0].diagnosis1)
                    $('#patient-date-of-birth').text("Date of Birth: "+ patientInfo.date_of_birth)
                    $('#patient-gender').text("Gender: "+ patientInfo.gender)
                    $('#patient-blood-type').text("Blood Type: "+ patientInfo.blood_type)
                    localStorage.setItem(currentDiagnosis,patientInfo.diagnosis)

        }
            });
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

//create function for postPatientReport
function postPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID
    console.log(currentPatientID)

    //TODO: change date format to DD-MM-YYYY instead
    var date =  moment(new Date()).format("DD-MM-YYYY")
    console.log(date);

    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');
   
    
    var patientinfo = {patient_id: getuser_id, FT4: $('#newFT4').val(), TSH: $('#newTSH').val(), timestamp: date}
    console.log(patientinfo);

    //check if FT4 and TSH matches with defined regex
    if (patientinfo.FT4.match(decimalregex) && patientinfo.TSH.match(decimalregex)){
            $.ajax({
                type: 'POST',
                url: reportURI,
                data: JSON.stringify(patientinfo),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log(data)
                    getReportID();
                }
            });
    }
    //if FT4 and TSH DOES NOT match with defined regex
    else{
        alert("Please input a proper reading for FT4 and TSH")
    }
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
                    
                    var prescription = {dosage_id:doseArray[i].idDosage,report_id: doseArray[i].report_id, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose}
                    
                    console.log(prescription)
                    
                    $('#prescriptionTable').append("<tr><td><input id='newDrugName"+i+"' value="+prescription.drug_name+">"+
                    "</input></td><th style='width: 20%;'></th><td><input id='newDrugDose"+i+"' value="+prescription.drug_dose+"></input><button id='updatePrescriptionBtn' report-id='"+prescription.report_id+"' num='"+i+"' index='"+prescription.dosage_id+"'>update</button></td></tr>");

                }
            }
        }
    });
}

$(document).on("click", "#updatePrescriptionBtn", function (){
    var currentDosageID = $(this).attr('index');
    var currentReportID = $(this).attr('report-id')
    var currentIndex = $(this).attr('num')
    var prescriptionInformation = {idDosage: currentDosageID,report_id: currentReportID, drug_name: $("#newDrugName"+currentIndex+"").val(),
            drug_dose: $("#newDrugDose"+currentIndex+"").val() };
    $.ajax({
        type: 'PUT',
        url: dosageURI+"/"+currentDosageID,
        data: JSON.stringify(prescriptionInformation),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Sucessfully Updated")
        }
    })
});

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
                    console.log("drugdose:"+report.drug_name)
                    //for prescription modal:
                    patientDiagnosis = localStorage.getItem(currentDiagnosis)
                    $('#tdDiagnosis').text(patientDiagnosis)
                    $('#tdCheckup').text(report.timestamp)
                    $('#tdFt4').text(report.FT4)
                    $('#tdTsh').text(report.TSH)

                    getPrescription(); //function to show drug name and drug dose
                }
            }
        }
    });
}

var captureportid;
function getReportID(){
    console.log("calling get rpt id")
    
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            reportIDArray = data
            console.log(reportIDArray)

            console.log(reportIDArray[reportIDArray.length-1].report_id); //get recent added id
            captureportid = reportIDArray[reportIDArray.length-1].report_id
            postDosage();
        }
    });
}




$(document).on("click", "#viewdosage", function () {
    currentReportID = $(this).attr('num');
    console.log(currentReportID);
    getOneReportInfo(currentReportID);
    document.getElementById('prescriptionModal').style.display='block'
});

$(document).on('click', '#addMoreRows', function(){
    var html = "<div class='appended'><p><label>Drug Name: </label><input class='newDrugName' maxlength='255' placeholder='Enter drug name...' required>"+
    "<br class='divider'><br class='divider'><label> Drug dose: </label><input class='newDrugDose' maxlength='5' placeholder='Enter dose...' required></p></div>";
    $("#addon").append(html);
});


$(document).on('click', '#closereportmodal', function(){
    $(".appended").remove();
});

//(FOR DEBUG) doc model for postPatientInfo
$(document).on("click", "#createnewinfo", function () {
    document.getElementById('newPatientModal').style.display='block'
});

//doc model for postPatientReport
$(document).on("click", "#createrpt", function () {
    document.getElementById('newReportModal').style.display='block'
});

//doc model for postPatientReport (using middle report button)
$(document).on("click", "#rpt", function () {
    document.getElementById('newReportModal').style.display='block'
});



getSpecificPatientInfo();
getPatientReport()
getPatientName();

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

FT4Array = []; //array to store FT4 readings of patient
TSHArray = []; //array to store TSH readings of patient
TreatmentArray = []; //FT4 + TSH array
ExportationArray = []; //FT4 + TSH array for export

storediagnosis = [];
var diagnosis;
var currentDiagnosis;
var createreport;

var viewdiagnosisbutton;
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
                    viewdiagnosisbutton = "<button id='diagnosisbtn' class=' btn btn-info btn-sm custom-class' index='" + patientInfo.patient_id + "'>View Diagnosis</button>"

                    viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfo.patient_id + "'>View Report</button>"
                   
                    createreport = "<button id='createrptbtn' onclick='document.getElementById('newReportModal').style.display='block'' class=' btn btn-info btn-sm custom-class'>Add Results</button>"
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

function getDiagnosisDetails(){
    $.ajax({
        type: 'GET',
        url: diagnosisURI +"/"+currentPatientId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            storediagnosis = data;
            //console.log(storediagnosis)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDisplay').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            return getPatientReport();
        }
    });
}



function getPatientReport() {
    console.log("retrieving all patient report...")

    //console.log(currentPatientID)
    //console.log(storediagnosis)
    
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
            //console.log(reportArray)
            // $('#reportContent').html('');
            $('#dosagehist').html('');
            $('#prescriptionButton').html('')
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
                    FT4Array.push(report.FT4)
                    TSHArray.push(report.TSH)
                    TreatmentArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                    ExportationArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                    viewdosagebtn = "<button id='viewdosage' num="+storeReports[storeReports.length-1].report_id+" class='btn btn-info btn-sm custom-class'>View Prescription</button>";
                    aptdate = storeReports[storeReports.length-1].timestamp;

                    
                    $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
                    "<tr><td>"+report.timestamp+"</td><td>"+report.FT4+"</td><td>"+
                    ""+report.TSH+"</td></tr></tr>");
                    
                    if (currentPatientId != reportArray[i].patient_id && i == reportArray.length-1){
                        $('#searchRPTcontain').html('');
                        $('#reportcontainer').html('');
                        createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                        $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
                        return console.log("no report history")
                    }

                }
                //console.log(reportArray.length)
                if (i == reportArray.length-1){

                    $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn +"<br class='divider'>" +createreport);
                    return startCalc();
                }
            }
        }
        }
    });
}

//function for getting patient report without affecting graph
function regetPatientReport() {
    console.log("retrieving all patient report...")
    
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
           
            // $('#reportContent').html('');
            $('#dosagehist').html('');
            $('#prescriptionButton').html('')
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            if (reportArray == ""){
                $('#searchRPTcontain').html('');
                $('#reportcontainer').html('');
                createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3 >No patient report found</h3><div>"+createreportbtn+"<div></div>");
            }
            else{
            for (i = 0; i < reportArray.length; i++) {
                if (currentPatientID == reportArray[i].patient_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    storeReports.push(report)
                    FT4Array.push(report.FT4)
                    TSHArray.push(report.TSH)
                    TreatmentArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                    viewdosagebtn = "<button id='viewdosage' num="+storeReports[storeReports.length-1].report_id+" class='btn btn-info btn-sm custom-class'>View Prescription</button>";
                    aptdate = storeReports[storeReports.length-1].timestamp;

                    
                    $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
                    "<tr><td>"+report.timestamp+"</td><td>"+report.FT4+"</td><td>"+
                    ""+report.TSH+"</td></tr></tr>");
                    
                    if (currentPatientID != reportArray[i].patient_id && i == reportArray.length-1){
                        $('#searchRPTcontain').html('');
                        $('#reportcontainer').html('');
                        createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                        $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3>No patient report found</h3><div>"+createreportbtn+"<div></div>");
                        return console.log("no report history")
                    }

                }
                //console.log(reportArray.length)
                if (i == reportArray.length-1){

                    return $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn +"<br class='divider'>" +createreport);
                }
            }
        }
        }
    });
}

var stonks
function searchPatientReport(){
    //console.log("hi")
    const searchTerm = document.getElementById("searchInputBox").value;

    if (searchTerm.length == 0)
    {  
        storeReports = []
        secondReportArray = []
        //reportArray = []
       regetPatientReport(); //call function when backspace
       stonks = ""
       return false; 
    }  	
    
    if (!searchTerm) {
        return;
    }
    
    secondReportArray = storeReports.filter(currentGoal => {
        if (currentGoal.timestamp && searchTerm) {
            if (currentGoal.timestamp.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    stonks =  currentGoal.timestamp
                    console.log(currentGoal.timestamp)
                    return true; 
            }
            return false;
          }
    });

    console.log(secondReportArray)
    $('#dosagehist').html('');
    $('#prescriptionButton').html('');
    for (i = 0; i < secondReportArray.length; i++){
        viewdosagebtn = "<button id='viewdosage' num="+secondReportArray[secondReportArray.length-1].report_id+" class=' btn btn-info btn-sm custom-class'>View Prescription</button>";
        
        $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
        "<tr><td>"+secondReportArray[i].timestamp+"</td><td>"+secondReportArray[i].FT4+"</td><td>"+
        ""+secondReportArray[i].TSH+"</td></tr></tr>");

        if (i == secondReportArray.length-1){

            return $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn+"<br class='divider'>" +createreport);
            //return startCalc();
        }
    }
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

var reportft //store ft4 for pdf
var reportts //store tsh for pdf
var reporttime //store timestamp for pdf
var reportdia = [] //store diagnosis for pdf
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
            $('#tdDiagnosis').html('');
            for (i = 0; i < reportArray.length; i++) {
                if (currentReportID == reportArray[i].report_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    
                    //for prescription modal:
                    
                    console.log(storediagnosis)

                    reportdia = [] //clear array
                    for (x = 0; x < storediagnosis.length; x++){
                        $('#tdDiagnosis').append(storediagnosis[x].diagnosis1+"<br>")
                        reportdia.push(storediagnosis[x].diagnosis1)
                    }
                    $('#tdCheckup').text(report.timestamp)
                    $('#tdFt4').text(report.FT4)
                    $('#tdTsh').text(report.TSH)

                    reportft = report.FT4
                    reportts = report.TSH
                    reporttime = report.timestamp


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
getDiagnosisDetails();
getPatientName();

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


//patient functions
var patientURI = 'https://localhost:44395/api/patientInfo';
var patientInfoArray = [];
var currentPatientID; //this variable will contain the patient ID that's selected
var dob; //this variable will get diagnosis and display it at diagnosis modal
var bt; //this variable will get blood type and display at diagnosis modal
var gender; //this variable will get gender and display at diagnosis modal
var aptdate //this variable will get most recent appointment date for diagnosis modal
var viewdiagnosisbutton;

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

                    
                    
                    dob = patientInfoArray[i].date_of_birth;
                    bt = patientInfoArray[i].blood_type;
                    gender = patientInfoArray[i].gender

                    viewdiagnosisbutton = "<button id='diagnosisbtn' class=' btn btn-info btn-sm custom-class' index='" + patientInfoArray[i].patient_id + "'>View Diagnosis</button>"

                    viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
                   
                    //TODO: make table to bootstrap
                    $('#patientCardContent').append("<h2 style='text-align: center'>"+username+"</h2><table class='infoTable table-sm'><tr>"+
                        "<td class='shiftedrow' style='width: 25%'><b>IC number: " + patientInfoArray[i].ic_number + 
                        "</b></td><td style='width: 20%'>Blood Type: "+patientInfoArray[i].blood_type+"</td>"+
                        "<td class='shiftedrow' style='width: 25%'>Gender: "+patientInfoArray[i].gender+
                        "</td><td class='shiftedrow'>D.O.B: "+patientInfoArray[i].date_of_birth+"</td></tr></table>");


                    return  getDiagnosisDetails();


                }
                else if (getuid != patientInfoArray[i].user_id && i == patientInfoArray.length-1){
                    $('#reportcontainer').html('');
                    $('#searchRPTcontain').html('');
                    createinfobutton = "<button id='createnewinfo' class=' btn btn-info btn-sm'>Create New Patient Info</button>"
                    $('#patientCardContent').append("<div id='missingInfo'><div class = 'centerText'>" +
                    
                     "<div class='centerTitle'></p>No patient info yet"+
                     "</p><div class='centerContent'><p>Please click on the link to create one</p></div>" +createinfobutton+ "</div></div>");

                    return console.log("that's enough")
                }
            }
        }
    });
}

//get diagnosis
var diagnosisURL = "https://localhost:44395/api/diagnosis"
var diagnosisArray = []
function getPatientDiagnosis() {
    console.log(currentPatientID)
    $.ajax({
        type: 'GET',
        url: diagnosisURL +"/"+currentPatientID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diagnosisArray = data;
            console.log(diagnosisArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDispl').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < diagnosisArray.length; i++) {
                //storediagnosis.push(diagnosis[i].diagnosis1)
                $('#diagnosisDispl').append(diagnosisArray[i].diagnosis1+"<br>");
            }
            $("#tdDOB").text(dob);
            $("#tdGender").text(gender);
            $("#tdBloodType").text(bt);
            $("#tdAptDate").text(aptdate)
        }
    });
}

//create patient info (FOR DEBUGGING PURPOSES)
function postPatientInfo() {
    //getting firebase UID from sessionstorage GET and putting in 'user_id'
    var getuser_id = sessionStorage.getItem("user_unique_id");
    
    //creating date
    var today = new Date();

    var date =  today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();


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

//Arrays to be sent to graph_algorithm.js
FT4Array = []; //array to store FT4 readings of patient
TSHArray = []; //array to store TSH readings of patient
TreatmentArray = []; //FT4 + TSH array

storediagnosis = []; //to capture all diagnosis matched to user id

var secondReportArray = [] // for search function
var storeReports = [] //second array for search function

//only patients can access it based on their assigned unique ID
function getDiagnosisDetails(){
    $.ajax({
        type: 'GET',
        url: diagnosisURL +"/"+currentPatientID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            storediagnosis = data;
            //console.log(storediagnosis)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDispl').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            return getPatientReport();
        }
    });
}

function getPatientReport() {
    console.log("retrieving all patient report...")

    console.log(currentPatientID)
    console.log(storediagnosis)
    
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

                    //TODO: onclick on button to view report in a modal (then can add on a button to export it as PDF)
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

                    $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn);
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

    console.log(currentPatientID)
    console.log(storediagnosis)
    
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

                    //TODO: onclick on button to view report in a modal (then can add on a button to export it as PDF)
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

                    return $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn);
                }
            }
        }
        }
    });
}

//search function based on date (WILL EDIT: date format currently in YYYY-M-DD, will change to DD/MM/YYYY)
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
        viewdosagebtn = "<button id='viewdosage' num="+secondReportArray[secondReportArray.length-1].report_id+" class=' btn btn-info btn-sm'>View Prescription</button>";
        //TODO: onclick on button to view report in a modal (then can add on a button to export it as PDF)
        $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
        "<tr><td>"+secondReportArray[i].timestamp+"</td><td>"+secondReportArray[i].FT4+"</td><td>"+
        ""+secondReportArray[i].TSH+"</td></tr></tr>");

        if (i == secondReportArray.length-1){

            return $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn);
            //return startCalc();
        }
    }
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
            $('#tdDiagnosis').html('');
            for (i = 0; i < reportArray.length; i++) {
                if (currentReportID == reportArray[i].report_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    
                    //for prescription modal:
                    
                    console.log(storediagnosis)
                    
                    for (x = 0; x < storediagnosis.length; x++){
                        $('#tdDiagnosis').append(storediagnosis[x].diagnosis1+"<br>")
                    }
                    $('#tdCheckup').text(report.timestamp)
                    $('#tdFt4').text(report.FT4)
                    $('#tdTsh').text(report.TSH)

                    getPrescription(); //function to show drug name and drug dose
                }
            }
        }
    });
}

//get dosage and display it on a table
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
                    
                    var prescription = {report_id: doseArray[i].report_id, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose, 
                        drug_days: doseArray[i].drug_days, drug_img: doseArray[i].drug_img, remarks: doseArray[i].remarks}
                    
                    console.log(prescription)

                    coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + prescription.drug_img + "'/>";
                    
                    $('#prescriptionTable').append("<tr><td>"+prescription.drug_name+"</td>"+
                    "<td>"+prescription.drug_dose+"</td><td>"+prescription.drug_days+"</td>"+
                    "<td>"+coverImage+"</td><td>"+prescription.remarks+"</td></tr>");

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
                    //getReportID();

                    getOnePatientInfo();
                    document.getElementById('newPatientModal').style.display='none'
                    window.location.reload();
                }
            });
    }
    //if FT4 and TSH DOES NOT match with defined regex
    else{
        alert("Please input a proper reading for FT4 and TSH")
    }
}

//get report id after posting
var captureportid;
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


//FOR KAILONG:
//Post drug name and drug dosage to dosage table
function postDosage(){

    //NOTE TO KAILONG: u need to get the report id on ur end to make this work,
    //                 furthermore, the input for drug_img has yet to be edited
    var f = $(".newDrugImage")[i].files[0]; // get image object (VARNING: THIS ONLY TAKES 1 IMAGE)
    var reader = new FileReader();
    //This function will be triggered after the code executes reader.readAsBinaryString(f);
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            console.log("calling post dosage")
            
            send = $('.newDrugName')
            send2 = $('.newDrugDose')
            send3= $('.newTabletsDay')
            send4 = $('.newRemarks')

            array_to_add = []
            for (i = 0 ; i < send.length; i++){
                
                //previously I've declared a capturereportid for adding prescription
                druginfo = {report_id: captureportid, drug_name: send[i].value, drug_dose: send2[i].value, drug_days: send3[i].value, 
                drug_img: window.btoa(binaryData), remarks: send4[i].value}
                array_to_add.push(druginfo)
            }
            
            console.log(array_to_add)

            
            // $.ajax({
            //     type: 'POST',
            //     url: dosageURI,
            //     data: JSON.stringify(array_to_add),
            //     dataType: 'json',
            //     contentType: 'application/json',
            //     success: function (data) {
                    
            //         getOnePatientInfo();
            //         document.getElementById('newPatientModal').style.display='none'
            //         window.location.reload(); //reload page after adding so it shows the newly added report + prescription
            //     }
            // });
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}



//TODO: function to export patient info with dosage report as PDF (ignore the graph first bc that one is really hard)
function exportData(){
    
}



//FOR KAILONG:
$(document).on('click', '#addMoreRows', function(){
    document.getElementById('addon').style.display='block'
    var html = "<div class='appended'><div class='form-row col-xs-4  col-md-12'><div class='col-md-6'><label>Drug:</label><div><select name='bloodtype' class='newDrugName'>"+
    "<option value='' selected disabled hidden>--Choose here--</option><option value='carbimazole'>carbimazole</option>"+
    "<option value='methimazole'>methimazole</option><option value='thiamazole'>thiamazole</option>"+
    "<option value='propylthiouracil'>propylthiouracil</option><option value='levothyroxine'>levothyroxine</option>"+
    "<option value='liothyronine'>liothyronine</option><option value='propranolol'>propranolol</option>"+
    "<option value='others'>others</option></select></div></div><br class='divider'>"+
    "<div class='col-md-6'><label>Tablets:</label><div><input type='text' class='newDrugDose' placeholder='Enter No...' required>"+
    "</div></div> </div><div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Tablets per day:</label><div>"+
    "<input type='text' class='form-control newTabletsDay' placeholder='Enter prescription...' required></div></div></div>"+
    "<div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Remarks:</label><div>"+
    "<input type='text' class='form-control newRemarks' placeholder='Enter remarks...'></div></div></div>"+
    "<div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Medicine image:</label><div>"+
    "<input type='file' class='form-control newDrugImage' required></div></div></div></div><br></br>";
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
$(document).on("click", "#createrptbtn", function () {
    document.getElementById('newReportModal').style.display='block'
});

//doc model for getDiagnosisInfo
$(document).on("click", "#diagnosisbtn", function () {
    currentReportID = $(this).attr('num');
    console.log(currentReportID);
    getPatientDiagnosis(currentReportID);
    document.getElementById('DiagnosisCardContent').style.display='block'
});

//doc model for postPatientReport (using middle report button)
$(document).on("click", "#rpt", function () {
    document.getElementById('newReportModal').style.display='block'
});

// doc prescription model for getOneReportInfo and getPrescription
$(document).on("click", "#viewdosage", function () {
    currentReportID = $(this).attr('num');
    console.log(currentReportID);
    getOneReportInfo(currentReportID);
    document.getElementById('prescriptionModal').style.display='block'
});

// window.onload = function () {
//     document.getElementById('addon').style.display = "none";
// }

getUserName();
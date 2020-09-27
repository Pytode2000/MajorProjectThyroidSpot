var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var diagnosisURI = 'https://localhost:44395/api/diagnosis';
var dosageURI = 'https://localhost:44395/api/dosage';
var notificationURI = 'https://localhost:44395/api/notification';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected
var reportIDArray = [];
var currentUser = [];
var diagnosisArray = [];
var currentDosageId;
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
var updatedDrugPrescription;
var updatedImage;

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
            $('#tableName').text(currentUser.full_name)
            getSpecificPatientInfo();

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
                    getDiagnosisDetails();
                    dob = patientInfo.date_of_birth;
                    bt = patientInfo.blood_type;
                    gender = patientInfo.gender
                    viewdiagnosisbutton = "<button id='diagnosisbtn' data-toggle='modal' data-target='#diagnosisModal' class='btn btn-dark btn-sm custom-class' index='" + patientInfo.patient_id + "'>View Diagnosis</button>"            
                    createreport = "<button id='addResultsBtn' data-toggle='modal' data-target='#addPatientResultModal' class=' btn btn-primary btn-sm custom-class'>Add Results</button>"
                    diagnosisInformation = data

                    $('#patient-ic-number').text("IC Number: "+ patientInfo.ic_number)
                    $('#patient-date-of-birth').text("Date of Birth: "+ patientInfo.date_of_birth)
                    $('#patient-gender').text("Gender: "+ patientInfo.gender)
                    $('#tableBirthDate').text(patientInfo.date_of_birth)
                    $('#tableGender').text(patientInfo.gender)
                    $('#patient-blood-type').text("Blood Type: "+ patientInfo.blood_type)
                    
                    $('#patient-diagnosis').text("Diagnosis: "+ diagnosisInformation[0].diagnosis1)
                    $('#tableDiagnosis').text(diagnosisInformation[0].diagnosis1)
                    
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
            getPatientReport();
        }
    });
}



function getPatientReport() {
 
    $.ajax({
        type: 'GET',
        url: reportURI+"?patientid="+currentPatientId,
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
                createreportbtn = "<button id='rpt' data-toggle='modal' data-target='#addPatientResultModal' class='btn btn-info btn-sm'>Create Report</button>"
                $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3 >No patient report found</h3><div>" + createreportbtn + "<div></div>");
            }
            else{
                reportArray.sort(function (a, b) {
                    //console.log(dateToNum(a.timestamp))
                    return dateToNum(a.timestamp) - dateToNum(b.timestamp);
                });
                function dateToNum(d) {
                    d = d.split("-"); return Number(d[2] + d[1] + d[0]);
                }
                for (i = 0; i < reportArray.length; i++) {
                    if (currentPatientId == reportArray[i].patient_id){
                        
                        var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                        storeReports.push(report)
                        FT4Array.push(report.FT4)
                        TSHArray.push(report.TSH)
                        TreatmentArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                        ExportationArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                        viewdosagebtn = "<button id='viewdosage' num='"+storeReports[storeReports.length-1].report_id+"' class='btn btn-dark btn-sm custom-class' data-toggle='modal' data-target='#prescriptionModal' >View Prescription</button>";
                        aptdate = storeReports[storeReports.length-1].timestamp;
                        editDeleteResultBtn = "<button id='openEditDeleteResultModalBtn' class='btn btn-info' data-toggle='modal' data-target='#editDeleteResultModal' index='"+i+"' ft4='"+report.FT4+"' tsh='"+report.TSH+"'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>"+
                        "<path fill-rule='evenodd' d='M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z'>"+
                        "</path></svg></button>"

                        
                        $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
                        "<tr><td>"+report.timestamp+"</td><td>"+report.FT4+"</td><td>"+
                        ""+report.TSH+"</td><td>"+editDeleteResultBtn+"</td></tr></tr>");
                        

                    }
                    //console.log(reportArray.length)
                    if (i == reportArray.length-1){

                        $('#prescriptionButton').append(viewdiagnosisbutton + " " + viewdosagebtn + "<br class='divider'>" + createreport);
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
                if (currentPatientId == reportArray[i].patient_id){
                    
                    var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}
                    storeReports.push(report)
                    FT4Array.push(report.FT4)
                    TSHArray.push(report.TSH)
                    TreatmentArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                    viewdosagebtn = "<button id='viewdosage' num='"+storeReports[storeReports.length-1].report_id+"' class='btn btn-info btn-sm custom-class'>View Prescription</button>";
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

                    return  $('#prescriptionButton').append(viewdiagnosisbutton + " " + viewdosagebtn + "<br class='divider'>" + createreport);
                }
            }
        }
        }
    });
}

//search function
$(document).ready(function () {
    $('#searchInputBox').on("keyup", function () {
        var v = $(this).val().toLowerCase();

        $('#dosagehist tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1)
        })
    })
})




//create function for postPatientReport
function postPatientReport() {
    //getting patient id and putting it into a variable

    //TODO: change date format to DD-MM-YYYY instead
    var date =  moment(new Date()).format("DD-MM-YYYY")
    console.log(date);

    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');
    
    
    var FT4unit = $('#newUnitDDL').val();
    var TSHunit = $('#newUnit1DDL').val();

    var FT4value = $('#newFT4').val();
    var TSHvalue = $('#newTSH').val();

    var FT4string = ""
    var TSHstring = ""

    //convert FT4 units and round to nearest 1 dp (by default FT4 will be in pmol/L)
    if (FT4unit == "mU/L") {
        var convertFT4 = (FT4value / 7.125);
        FT4value = (Math.round(convertFT4 * 10) / 10).toString();
        FT4string = "(" + $('#newFT4').val() + "mU/L)"
    }
    else {
        FT4value = (Math.round(FT4value * 10) / 10).toString();
    }

    //convert TSH units and round to nearest 1 dp (by default TSH will be in mU/L)
    if (TSHunit == "pmol/L") {
        var convertTSH = (TSHvalue * 7.125);
        TSHvalue = (Math.round(convertTSH * 10) / 10).toString();
        TSHstring = "(" + $('#newTSH').val() + "pmol/L)"
    }
    else {
        TSHvalue = (Math.round(TSHvalue * 10) / 10).toString();
    }
    
    var patientinfo = {patient_id: currentPatientId, FT4: FT4value, TSH: TSHvalue, timestamp: date}
    console.log(patientinfo);

    //check if FT4 and TSH matches with defined regex
    if (patientinfo.FT4.match(decimalregex) && patientinfo.TSH.match(decimalregex)){
        var cfm = confirm("Please confirm your results before saving it to database: \r\n" +
        "FT4: " + patientinfo.FT4 + "pmol/L " + FT4string + "\r\n" +
        "TSH: " + patientinfo.TSH + "mU/L " + TSHstring)
        if(cfm == true){
            $.ajax({
                type: 'POST',
                url: reportURI,
                data: JSON.stringify(patientinfo),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    window.location.reload();
                }
            });
        }
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
                if (currentPatientId == doseArray[i].patient_id){
                    
                    var prescription = {dosageId: doseArray[i].idDosage, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose, 
                        drug_days: doseArray[i].drug_days, drug_img: doseArray[i].drug_img, remarks: doseArray[i].remarks}
                    
                    console.log(prescription)
                    
                    coverImage = "<img id='expandImg' data-toggle='modal' data-target='#modalImg' num="+doseArray[i].idDosage+" style='width:100px' src='data:image/jpeg;base64," + prescription.drug_img + "'/>";
                    editDeletePrescriptionBtn = "<button id='openEditPrescriptionModalBtn' class='btn btn-info' data-toggle='modal' data-target='#editPrescriptionModal' index='"+i+"' dosageId='"+prescription.dosageId+"' '><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>"+
                    "<path fill-rule='evenodd' d='M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z'>"+
                    "</path></svg></button>"
                    
                    $('#prescriptionTable').append("<tr><td style='padding:30px;'>"+prescription.drug_name+"</td>"+
                    "<td>"+prescription.drug_dose+"</td><td>"+prescription.drug_days+"</td>"+
                    "<td>"+coverImage+"</td><td>"+prescription.remarks+"</td><td>"+editDeletePrescriptionBtn+"</td></tr>");

                }
            }
        }
    });
}

// //Post drug name and drug dosage to dosage table
 function postDosage(){

     //NOTE TO KAILONG: u need to get the report id on ur end to make this work,
     //                 furthermore, the input for drug_img has yet to be edited
     var newDrugImage = $(".newDrugImage")[0].files[0]; // get image object (WARNING: THIS ONLY TAKES 1 IMAGE)
     var reader = new FileReader();
     //This function will be triggered after the code executes reader.readAsBinaryString(f);
     reader.onload = (function (theFile) {
         return function (e) {
             var binaryData = e.target.result;
             console.log("calling post dosage")
            
             newDrugName = $('.newDrugName').val();
             newDrugDose = $('.newDrugDose').val();
             newPrescription= $('.newPrescription').val();
             newRemarks = $('.newRemarks').val()
             newImage = window.btoa(binaryData)

            //previously I've declared a capturereportid for adding prescription
            var newDrugPrescription = {drug_name: newDrugName, drug_dose: newDrugDose, drug_days: newPrescription, 
            patient_id: parseInt(currentPatientId), drug_img: newImage, remarks: newRemarks}
            console.log(newDrugPrescription)
              $.ajax({
                  type: 'POST',
                  url: dosageURI,
                  data: JSON.stringify(newDrugPrescription),
                  dataType: 'json',
                  contentType: 'application/json',
                  success: function (data) {                    
                      currentNotificationMessage = "There is a new prescription added by the clinician"
                      postNotification();
                      window.location.reload(); //reload page after adding so it shows the newly added report + prescription
                  }
              });
         };
     })(newDrugImage);
     // Read in the image file as a data URL.
     reader.readAsBinaryString(newDrugImage);
 }

 function deletePrescription(){
    
    $.ajax({
        type: 'DELETE',
        url: dosageURI + '/' + currentDosageId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            window.location.reload();
        }
    });
 }

 function updatePrescription(){
    updatedDrugImage = $('#currentDrugImage')[0].files[0];
    console.log("img:"+updatedDrugImage)
    updatedDrugName = $('#currentDrugName').val();
    updatedDrugDose = $('#currentDrugDose').val();
    updatedPrescription = $('#currentPrescription').val();
    updatedRemarks = $('#currentRemarks').val();
    updatedDrugPrescription = {idDosage:parseInt(currentDosageId) ,drug_name: updatedDrugName, drug_dose: updatedDrugDose, drug_days: updatedPrescription, 
        patient_id: parseInt(currentPatientId), drug_img: updatedImage, remarks: updatedRemarks}
    if (updatedDrugImage != null){
        var reader = new FileReader();
        reader.onload = (function (theFiles) {
            return function (e) {
                var binaryData = e.target.result;
                updatedDrugPrescription.drug_img = window.btoa(binaryData);
                $.ajax({
                    type: 'PUT',
                    url: dosageURI+"/"+currentDosageId,
                    data: JSON.stringify(updatedDrugPrescription),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {       
                        currentNotificationMessage = "Your prescription has been updated by the clinician";     
                        postNotification();        
                    }
                }); 
            };
            
        })(updatedDrugImage);
    
        reader.readAsBinaryString(updatedDrugImage);   
    }
    else{
        updatedDrugPrescription.drug_img = doseArray[currentIndex].drug_img;
        $.ajax({
            type: 'PUT',
            url: dosageURI+"/"+currentDosageId,
            data: JSON.stringify(updatedDrugPrescription),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {       
                currentNotificationMessage = "Your prescription has been updated by the clinician";     
                postNotification();        
            }
        }); 
    }


 }

 function updateImage(){
    var reader = new FileReader();
    reader.onload = (function (theFiles) {
        return function (e) {
            var binaryData = e.target.result;
            console.log("calling post dosage")
           
            updatedDrugName = $('#currentDrugName').val();
            updatedDrugDose = $('#currentDrugDose').val();
            updatedPrescription = $('#currentPrescription').val();
            updatedRemarks = $('#currentRemarks').val();
            updatedImage = window.btoa(binaryData);

           //previously I've declared a capturereportid for adding prescription
           var updatedDrugPrescription = {idDosage:parseInt(currentDosageId) ,drug_name: updatedDrugName, drug_dose: updatedDrugDose, drug_days: updatedPrescription, 
            patient_id: parseInt(currentPatientId), drug_img: updatedImage, remarks: updatedRemarks}

            $.ajax({
                 type: 'PUT',
                 url: dosageURI+"/"+currentDosageId,
                 data: JSON.stringify(updatedDrugPrescription),
                 dataType: 'json',
                 contentType: 'application/json',
                 success: function (data) { 
                     console.log("success update pres with pic")                   
                     //window.location.reload(); //reload page after adding so it shows the newly added report + prescription
                 }
             });
        };
    })(updatedDrugImage);

    reader.readAsBinaryString(updatedDrugImage);   
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

function getOneReportInfo(){
    
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

function getPatientDiagnosis() {
    $.ajax({
        type: 'GET',
        url: diagnosisURI +"/"+currentPatientId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diagnosisArray = data;
            console.log(diagnosisArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDisplay').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < diagnosisArray.length; i++) {
                //storediagnosis.push(diagnosis[i].diagnosis1)
                $('#diagnosisDisplay').append(diagnosisArray[i].diagnosis1+"<br>");
            }
            $("#tdDOB").text(dob);
            $("#tdGender").text(gender);
            $("#tdBloodType").text(bt);
            $("#tdAptDate").text(aptdate)
        }
    });
}

function updateReport(){
    currentReportId = currentReportId;
    newFT4Value = $('#newFT4Value').val();
    newTSHValue = $('#newTSHValue').val();
    var report = {report_id: reportArray[currentReportId].report_id, patient_id: reportArray[currentReportId].patient_id,
          FT4: newFT4Value, TSH: newTSHValue, timestamp: reportArray[currentReportId].timestamp}
    $.ajax({
        type: 'PUT',
        url: reportURI + '/' + report.report_id,
        data: JSON.stringify(report),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            currentNotificationMessage = "Your Health Report has been updated by your clinician" 
            postNotification();
            window.location.reload();
        }
    });

}

function deleteReport(){
    currentReportId = currentReportId;
    $.ajax({
        type: 'DELETE',
        url: reportURI + '/' + reportArray[currentReportId].report_id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            window.location.reload();
        }
    });

}

function postNotification(){
    var date =  moment(new Date()).format("DD-MM-YYYY")

    var newNotification = {patient_id:currentPatientId, notification_content:currentNotificationMessage,
        seen: "False",timestamp: date}

    $.ajax({
        type: 'POST',
        url: notificationURI,
        data: JSON.stringify(newNotification),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) { 
            window.location.reload();                   
        }
    });
}


$(document).on("click", "#viewdosage", function () {
    currentReportID = $(this).attr('num');
    console.log("currentReportID:"+currentReportID);
    getOneReportInfo(currentReportID);
});

$(document).on("click", '#openEditDeleteResultModalBtn', function(){
    currentReportId = $(this).attr('index');
    document.getElementById('newFT4Value').value = $(this).attr('ft4')
    document.getElementById('newTSHValue').value = $(this).attr('tsh')
    
})

 /*$(document).on('click', '#addMoreRows', function(){
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
*/

$(document).on('click', '#openEditPrescriptionModalBtn', function(){
    currentIndex = $(this).attr('index')
    currentDosageId = $(this).attr('dosageId')
    document.getElementById('currentDrugName').value = doseArray[currentIndex].drug_name;
    document.getElementById('currentDrugDose').value = doseArray[currentIndex].drug_dose;
    document.getElementById('currentPrescription').value = doseArray[currentIndex].drug_days;
    document.getElementById('currentRemarks').value = doseArray[currentIndex].remarks;
})

$(document).on('click', '#closereportmodal', function(){
    $(".appended").remove();
});

$(document).on("click", "#diagnosisbtn", function () {
    currentReportID = $(this).attr('num');
    console.log(currentReportID);
    getPatientDiagnosis(currentReportID);
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

$(document).on("click", "#openAddPrescriptionModalBtn", function () {
    $('#prescriptionModal').modal('hide');
});

$(window).resize(function(){
    if($(window).width()<601){
          $("#graphTable").addClass("table-responsive");
      } 
      else {
          $("#graphTable").removeClass("table-responsive");
      }
  });



//getSpecificPatientInfo();
//getDiagnosisDetails();
getPatientName();

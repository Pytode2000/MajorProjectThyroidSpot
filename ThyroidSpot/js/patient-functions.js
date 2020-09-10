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
            //console.log(patientInfoArray)
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
                   
                    createreport = "<button id='createrptbtn1' class=' btn btn-info btn-sm custom-class'>Add Results</button>"
                    
                    $('#patientCardContent').append("<h2 style='text-align: center'>"+username+"</h2><table class='infoTable table-sm'><tr>"+
                        "<td class='shiftedrow1'><b>IC number: " + patientInfoArray[i].ic_number + 
                        "</b></td><td class='shiftedrow2''>Blood Type: "+patientInfoArray[i].blood_type+"</td>"+
                        "<td class='shiftedrow3'>Gender: "+patientInfoArray[i].gender+
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
ExportationArray = []; //FT4 + TSH array for export

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
            secondReportArray = data; //for search reports
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

                reportArray.sort(function (a, b) {
                    //console.log(dateToNum(a.timestamp))
                    return dateToNum(b.timestamp) - dateToNum(a.timestamp);
                });
                function dateToNum(d) {
                    d = d.split("-"); return Number(d[2] + d[1] + d[0]);
                }


                for (i = 0; i < reportArray.length; i++) {
                    if (currentPatientID == reportArray[i].patient_id){
                        
                        var report = {report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp}

                        //search reports array
                        storeReports.push(report)

                        //algorithm and export to pdf array
                        FT4Array.push(report.FT4)
                        TSHArray.push(report.TSH)
                        TreatmentArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})
                        ExportationArray.push({TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp})


                        viewdosagebtn = "<button id='viewdosage' num="+storeReports[storeReports.length-1].report_id+" class='btn btn-info btn-sm custom-class'>View Prescription</button>";
                        aptdate = storeReports[storeReports.length-1].timestamp;

                        // Only creator and clinician can update thread.
                        if (sessionStorage.getItem("user_account_type") == "clinician") {
                            deleteButton = "<button num='" + reportArray[i].report_id + "'  id='deleteReadingbtn' class='dropdown-item' data-target='#deleteThreadModal' data-toggle='modal'>Delete</button> ";
                        }
                        else {
                            deleteButton = ""
                        }
                        // admins can only delete
                        if (currentPatientID == reportArray[i].patient_id || sessionStorage.getItem("user_account_type") == "clinician") {
                            updateButton = "<button num='" + reportArray[i].report_id + "' id='updateReadingbtn' class='dropdown-item' data-toggle='modal'>Update</button> ";
                            
                            console.log(reportArray[i].patient_id)

                            dropdown = "<div class='dropdown' style='float:right'>" +
                                "<button class='btn btn-sm btn-secondary' style='background-color:transparent; border-style: none; ' type='button'" +
                                " id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                                "<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-three-dots-vertical' fill='dark-grey' xmlns='http://www.w3.org/2000/svg'>" +
                                "<path fill-rule='evenodd' d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>" +
                                "</svg></button><div class='dropdown-menu' aria-labelledby='dropdownMenu2'>" + updateButton + "" +
                                "" + deleteButton + "</div></div>"
                        }
                        else {
                            updateButton = ""
                            deleteButton = ""
                            dropdown = ""
                        }

                        
                        $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>"+
                        "<tr><td>"+report.timestamp+"</td><td>"+report.FT4+"</td><td>"+
                        ""+report.TSH+"</td><td>"+dropdown+"</td></tr></tr>");
                        
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

                        $('#prescriptionButton').append(viewdiagnosisbutton+"<br class='divider'>"+viewdosagebtn +"<br class='divider'>" +createreport);
                        return startCalc();
                    }
                }
            }
        }
    });
}



//search function based on date
$(document).ready(function () {
    $('#searchInputBox').on("keyup", function () {
        var v = $(this).val().toLowerCase();

        $('#dosagehist tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1)
        })
    })
})




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

//get dosage and display it on a table
var currentDosageID //get dosage ID to retrieve img in a bootstrap modal
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

                    
                    coverImage = "<img id='expandImg' data-toggle='modal' num="+doseArray[i].idDosage+" style='width:100px' src='data:image/jpeg;base64," + prescription.drug_img + "'/>";
                    
                    $('#prescriptionTable').append("<tr><td>"+prescription.drug_name+"</td>"+
                    "<td>"+prescription.drug_dose+"</td><td>"+prescription.drug_days+"</td>"+
                    "<td>"+coverImage+"</td><td>"+prescription.remarks+"</td></tr>");

                }
            }
        }
    });
}

var getDosageInfo;
function getMedicineImg(){
    console.log("getting drug image...")
   
    $.ajax({
        type: 'GET',
        url: dosageURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            doseArray = data;
            
            
            $('#newImageModal').html('');
            for (i = 0; i < doseArray.length; i++) {
                if (currentDosageID == doseArray[i].idDosage){
                    
                    getDosageInfo = {report_id: doseArray[i].report_id, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose, 
                        drug_days: doseArray[i].drug_days, drug_img: doseArray[i].drug_img, remarks: doseArray[i].remarks}
                    
                    
                    currentDosageID = doseArray[i].idDosage
                    var medImage = "<img style='width:100%; height:300px' src='data:image/jpeg;base64," + getDosageInfo.drug_img + "'/>";
                    
                    $('#newImageModal').append(medImage)
                    // $('#prescriptionTable').append("<tr><td>"+prescription.drug_name+"</td>"+
                    // "<td>"+prescription.drug_dose+"</td><td>"+prescription.drug_days+"</td>"+
                    // "<td id='expandImg'>"+coverImage+"</td><td>"+prescription.remarks+"</td></tr>");

                }
            }
        }
    });   
}

function updateMedicineImg(){
    var file = $(".newDrugImage")[0].files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        // invalid file type code goes here.
        alert("This file is not an image")
    }
    else{
        console.log("updating drug image...")
        var checksub = confirm("Are you sure you want to save image?")

        console.log(getDosageInfo)
        console.log(currentDosageID)

        if (checksub == true){
            var reader = new FileReader();
            //This function will be triggered after the code executes reader.readAsBinaryString(f);
            reader.onload = (function (theFile) {
                return function (e) {
                    var binaryData = e.target.result;
                
                    
                    getDosageInfo.drug_img = window.btoa(binaryData)

                   
                    console.log(currentDosageID)
                    console.log(getDosageInfo)

                    
                    $.ajax({
                        type: 'PUT',
                        url: dosageURI +"/"+currentDosageID,
                        data: JSON.stringify(getDosageInfo),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            alert("Image successfully saved!")
                            $('#updatemodalImg').modal('hide')
                            window.location.reload(); //reload page after adding so it shows the newly added report + prescription
                        }
                    });
                };
            })(file);
            // Read in the image file as a data URL.
            reader.readAsBinaryString(file);
        }
        else{
            console.log("DO NOT RUN FUNCTION")
        }
    }
}



//create function for postPatientReport
function postPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID
    console.log(currentPatientID)


    var date =  moment(new Date()).format("DD-MM-YYYY")
    console.log(date);

    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');
   
    console.log($('#newUnitDDL').val())
    console.log($('#newUnit1DDL').val())

    var FT4unit = $('#newUnitDDL').val()
    var TSHunit = $('#newUnit1DDL').val()

    var FT4reading = $('#newFT4').val()
    var TSHreading =  $('#newTSH').val()

    var FT4string = ""
    var TSHstring = ""

    if(FT4unit == "mU/L"){
        var convertFT4 = (FT4reading / 7.125);
        FT4reading = (Math.round(convertFT4 * 10) / 10).toString();
        FT4string = "(" + $('#newFT4').val() + "mU/L)"
    }
    else{
        FT4reading = (Math.round(FT4reading * 10) / 10).toString();
    }


    if (TSHunit == "pmol/L"){
        var convertTSH = (TSHreading * 7.125);
        TSHreading = (Math.round(convertTSH * 10) / 10).toString();
        TSHstring = "(" + $('#newTSH').val() + "pmol/L)"
    }
    else{
        TSHreading = (Math.round(TSHreading * 10) / 10).toString();
    }

    console.log(FT4string)
    console.log(TSHstring)

    var patientinfo = {patient_id: getuser_id, FT4: FT4reading, TSH:TSHreading, timestamp: date}
    console.log(patientinfo);

    //check if FT4 and TSH matches with defined regex
    if (patientinfo.FT4.match(decimalregex) && patientinfo.TSH.match(decimalregex)){
            var cfm  = confirm("Please confirm your results before saving it to database: \r\n" +
             "FT4: "+ patientinfo.FT4+ "pmol/L "+ FT4string + "\r\n"+
             "TSH: "+ patientinfo.TSH+ "mU/L "+ TSHstring )
            if (cfm == true){
                $.ajax({
                    type: 'POST',
                    url: reportURI,
                    data: JSON.stringify(patientinfo),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data)

                        getOnePatientInfo();
                        document.getElementById('newPatientModal').style.display='none'
                        window.location.reload();
                    }
                });
            }
            else{
                alert("entry not saved to database")
            }
    }
    //if FT4 and TSH DOES NOT match with defined regex
    else{
        alert("Please input a proper reading for FT4 and TSH")
    }
}

var appointmentdate //capture appointment date in global var
//edit function for PatientReport
function putPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID
    console.log(currentPatientID)

    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');
   
    var FT4unit = $('#FT4unitDDL').val()
    var TSHunit = $('#TSHunitDDL').val()

    var FT4reading = $('#updateFT4').val()
    var TSHreading =  $('#updateTSH').val()

    var FT4string = ""
    var TSHstring = ""

    if(FT4unit == "mU/L"){
        var convertFT4 = (FT4reading / 7.125);
        FT4reading = (Math.round(convertFT4 * 10) / 10).toString();
        FT4string = "(" + $('#updateFT4').val() + "mU/L)"
    }
    else{
        FT4reading = (Math.round(FT4reading * 10) / 10).toString();
    }


    if (TSHunit == "pmol/L"){
        var convertTSH = (TSHreading * 7.125);
        TSHreading = (Math.round(convertTSH * 10) / 10).toString();
        TSHstring = "(" + $('#updateTSH').val() + "pmol/L)"
    }
    else{
        TSHreading = (Math.round(TSHreading * 10) / 10).toString();
    }

    console.log(FT4string)
    console.log(TSHstring)

    var reportinfo = {patient_id: getuser_id, FT4: FT4reading, TSH:TSHreading, timestamp: appointmentdate}
    console.log(reportinfo);

    //check if FT4 and TSH matches with defined regex
    if (reportinfo.FT4.match(decimalregex) && reportinfo.TSH.match(decimalregex)){
            var cfm  = confirm("Please confirm your results before saving it to database: \r\n" +
             "FT4: "+ reportinfo.FT4+ "pmol/L "+ FT4string + "\r\n"+
             "TSH: "+ reportinfo.TSH+ "mU/L "+ TSHstring + "\r\n"+
             "Date: "+ reportinfo.timestamp)
            if (cfm == true){
                alert("successfully added to database")
                $.ajax({
                    type: 'PUT',
                    url: reportURI +"/"+ currentReportID,
                    data: JSON.stringify(reportinfo),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data)
                        $('#editReportModal').modal('hide');
                        //getOnePatientInfo();
                        window.location.reload();
                    }
                });
            }
            else{
                alert("entry not saved to database")
            }
    }
    //if FT4 and TSH DOES NOT match with defined regex
    else{
        alert("Please input a proper reading for FT4 and TSH")
    }
}


// //FOR KAILONG:
// //Post drug name and drug dosage to dosage table
// function postDosage(){

//     //NOTE TO KAILONG: u need to get the report id on ur end to make this work,
//     //                 furthermore, the input for drug_img has yet to be edited
//     var f = $(".newDrugImage")[i].files[0]; // get image object (VARNING: THIS ONLY TAKES 1 IMAGE)
//     var reader = new FileReader();
//     //This function will be triggered after the code executes reader.readAsBinaryString(f);
//     reader.onload = (function (theFile) {
//         return function (e) {
//             var binaryData = e.target.result;
//             console.log("calling post dosage")
            
//             send = $('.newDrugName')
//             send2 = $('.newDrugDose')
//             send3= $('.newTabletsDay')
//             send4 = $('.newRemarks')

//             array_to_add = []
//             for (i = 0 ; i < send.length; i++){
                
//                 //previously I've declared a capturereportid for adding prescription
//                 druginfo = {report_id: captureportid, drug_name: send[i].value, drug_dose: send2[i].value, drug_days: send3[i].value, 
//                 drug_img: window.btoa(binaryData), remarks: send4[i].value}
//                 array_to_add.push(druginfo)
//             }
            
//             console.log(array_to_add)

            
//             // $.ajax({
//             //     type: 'POST',
//             //     url: dosageURI,
//             //     data: JSON.stringify(array_to_add),
//             //     dataType: 'json',
//             //     contentType: 'application/json',
//             //     success: function (data) {
                    
//             //         getOnePatientInfo();
//             //         document.getElementById('newPatientModal').style.display='none'
//             //         window.location.reload(); //reload page after adding so it shows the newly added report + prescription
//             //     }
//             // });
//         };
//     })(f);
//     // Read in the image file as a data URL.
//     reader.readAsBinaryString(f);
// }



function exportData(){
    console.log("Exporting data...")

    var titlename = username.replace(/ /g,"_").toUpperCase();
    var ch = reporttime
    var ft = reportft
    var ts = reportts
    var di = reportdia
    console.log(doseArray)
    console.log(ch)
    console.log(ft)
    console.log(ts)
    console.log(di)
    

    //Sending data to the hidden div (located in prescription modal)
    $("#exDiagnosis").html("")
    for (x = 0; x < reportdia.length; x++){
        $("#exDiagnosis").append(reportdia[x] +"<br/>")
    }

    $("#exCheckup").text(ch)
    $("#exFt4").text(ft + " pmol/L")
    $("#exTsh").text(ts + " mU/L")
    $("#exportDoseTable").html('')

    var title= titlename +"_Appointment_"+ch
    console.log(title)
    console.log(doseArray.length)
    for (x = 0; x<doseArray.length; x++){
        stonksImage = "<img style='width:120px; height:120px' src='data:image/jpeg;base64," + doseArray[x].drug_img + "'/>";

        
        $("#exportDoseTable").append("<tr><td style='font-size: 20px ;text-align:left; width: 40%; font-weight: bold;padding-top: 50px; padding-bottom: 10px;'><u>Prescription no. "+ (x+1)+"</u></td>"+
        "</tr><tr><td style=' text-align:left; padding-bottom: 10px;  width: 30%; font-weight: bold;'>Drug Name:</td><td>"+doseArray[x].drug_name+"</td></tr>"+
        "<tr><td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Pills:</td><td>"+doseArray[x].drug_dose+"</td></tr><tr>"+
        "<td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Prescription:</td><td>"+doseArray[x].drug_days+"</td></tr><tr>"+
        "<td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Image:</td><td>"+stonksImage+"</td></tr><tr>"+
        "<td style='text-align:left; vertical-align: top; font-weight: bold;'>Remarks:</td><td>"+doseArray[x].remarks+"</td></tr><br/>")
    }

    //Export selected div class as PDF
    printJS({ printable: "export1", type: 'html'})
}



//FOR KAILONG:
// $(document).on('click', '#addMoreRows', function(){
//     document.getElementById('addon').style.display='block'
//     var html = "<div class='appended'><div class='form-row col-xs-4  col-md-12'><div class='col-md-6'><label>Drug:</label><div><select name='bloodtype' class='newDrugName'>"+
//     "<option value='' selected disabled hidden>--Choose here--</option><option value='carbimazole'>carbimazole</option>"+
//     "<option value='methimazole'>methimazole</option><option value='thiamazole'>thiamazole</option>"+
//     "<option value='propylthiouracil'>propylthiouracil</option><option value='levothyroxine'>levothyroxine</option>"+
//     "<option value='liothyronine'>liothyronine</option><option value='propranolol'>propranolol</option>"+
//     "<option value='others'>others</option></select></div></div><br class='divider'>"+
//     "<div class='col-md-6'><label>Tablets:</label><div><input type='text' class='newDrugDose' placeholder='Enter No...' required>"+
//     "</div></div> </div><div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Tablets per day:</label><div>"+
//     "<input type='text' class='form-control newTabletsDay' placeholder='Enter prescription...' required></div></div></div>"+
//     "<div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Remarks:</label><div>"+
//     "<input type='text' class='form-control newRemarks' placeholder='Enter remarks...'></div></div></div>"+
//     "<div class='form-row col-xs-4  col-md-12'><div class='col' style='text-align: left;'><label>Medicine image:</label><div>"+
//     "<input type='file' class='form-control newDrugImage' required></div></div></div></div><br></br>";
//     $("#addon").append(html);
// });


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

//doc model for postPatientReport
$(document).on("click", "#createrptbtn1", function () {
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

//doc model for postPatientReport
$(document).on("click", "#expandImg", function () {
    currentDosageID = $(this).attr('num');
    console.log(currentDosageID);
    $('#modalImg').modal('show')
    getMedicineImg();
});

$(document).on("click", "#editImageBtn", function () {
    //currentDosageID = $(this).attr('num');
    document.getElementById('prescriptionModal').style.display='none'
    $('#modalImg').modal('hide')
    $('#updatemodalImg').modal('show')
    
});


//call modal and display previous data to edit in the update FT4/TSH modal
$(document).on("click", "#updateReadingbtn", function () {
    currentReportID = $(this).attr('num');
    for (y = 0; y < secondReportArray.length; y++) {
        if (currentReportID == secondReportArray[y].report_id) {
            //console.log(postArray1[y])
            $('#editReportModal').modal('show');
            $('#updateFT4').val(secondReportArray[y].FT4)
            $('#updateTSH').val(secondReportArray[y].TSH)
            appointmentdate = secondReportArray[y].timestamp;
        }
    }
    $('#editReportModal').modal('show');
});



getUserName();
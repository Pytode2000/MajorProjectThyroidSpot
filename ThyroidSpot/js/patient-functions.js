// all patient functions go here

//QUERY FOR USERNAME (security check)
var userURI = 'https://localhost:44395/api/user';
var userInfoArray = [];
var username;
function getUserName() {
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

            userInfoArray = data;

            for (i = 0; i < userInfoArray.length; i++) {
                if (getuid == userInfoArray[i].user_id) {
                    username = userInfoArray[i].full_name;
                    return getOnePatientInfo();
                }
            }
        }
    });
}


//patient functions and variables for them
var patientURI = 'https://localhost:44395/api/patientInfo';
var patientInfoArray = [];
var currentPatientID; //this variable will contain the patient ID that's selected
var dob; //this variable will get diagnosis and display it at diagnosis modal
var bt; //this variable will get blood type and display at diagnosis modal
var gender; //this variable will get gender and display at diagnosis modal
var aptdate //this variable will get most recent appointment date for diagnosis modal
var viewdiagnosisbutton;

//This function gets the patient info based on the user token, which will be be displayed as the header below the patient's name
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
            
            //clear the tbody of the table so that it will be refreshed everytime
            $('#patientCardContent').html('');

            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < patientInfoArray.length; i++) {
                if (getuid == patientInfoArray[i].user_id) {

                    currentPatientID = patientInfoArray[i].patient_id;



                    dob = patientInfoArray[i].date_of_birth;
                    bt = patientInfoArray[i].blood_type;
                    gender = patientInfoArray[i].gender

                    viewdiagnosisbutton = "<button id='diagnosisbtn' class=' btn btn-dark btn-sm custom-class' index='" + patientInfoArray[i].patient_id + "'>View Diagnosis</button>"

                    viewreportbutton = "<button id='forumdescbtn' class=' btn btn-dark btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"


                    createreport = "<button id='createrptbtn1' class='btn btn-primary btn-sm custom-class' data-toggle='modal' data-target='#createHealthReportModal'>Add Results</button>"

                    $('#patientCardContent').append("<h2 style='text-align: center'>" + username + "</h2><table class='infoTable table-sm'><tr>" +
                        "<td class='shiftedrow1'><b>IC number: " + patientInfoArray[i].ic_number +
                        "</b></td><td class='shiftedrow2''>Blood Type: " + patientInfoArray[i].blood_type + "</td>" +
                        "<td class='shiftedrow3'>Gender: " + patientInfoArray[i].gender +
                        "</td><td class='shiftedrow'>D.O.B: " + patientInfoArray[i].date_of_birth + "</td></tr></table>");


                    return getDiagnosisDetails(); //after displaying, call get function on Diagnosis to retrieve patient's diagnosis details


                }
                else if (getuid != patientInfoArray[i].user_id && i == patientInfoArray.length - 1) {
                    $('#reportcontainer').html('');
                    $('#searchRPTcontain').html('');
                    createinfobutton = "<button id='createnewinfo' class=' btn btn-info btn-sm'>Create New Patient Info</button>"
                    $('#patientCardContent').append("<div id='missingInfo'><div class = 'centerText'>" +

                        "<div class='centerTitle'></p>No patient info yet" +
                        "</p><div class='centerContent'><p>Please click on the link to create one</p></div>" + createinfobutton + "</div></div>");

                    return console.log("end of array")
                }
            }
        }
    });
}

//get diagnosis of the patient, 
//which will be displayed in a separate modal "view diagnosis", as well as featured in "view prescription"
var diagnosisURL = "https://localhost:44395/api/diagnosis"
var diagnosisArray = []
function getPatientDiagnosis() {
    
    $.ajax({
        type: 'GET',
        url: diagnosisURL + "/" + currentPatientID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diagnosisArray = data;
            
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDispl').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < diagnosisArray.length; i++) {
                $('#diagnosisDispl').append("&bull; "+diagnosisArray[i].diagnosis1 + "<br>");
            }
            $("#tdDOB").text(dob);
            $("#tdGender").text(gender);
            $("#tdBloodType").text(bt);
            $("#tdAptDate").text(aptdate)
        }
    });
}

//create patient info (FOR DEBUGGING PURPOSES, ACTUAL FUNCTION IS LOCATED IN "account.js")
function postPatientInfo() {
    //getting firebase UID from sessionstorage GET and putting in 'user_id'
    var getuser_id = sessionStorage.getItem("user_unique_id");

    //creating date
    var today = new Date();

    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();


    var patientinfo = {
        user_id: getuser_id, diagnosis: $('#newDiagnosisDDL').val(), ic_number: $('#newIC').val(), date_of_birth: $('#newDOB').val(),
        gender: $('#newGenderDDL').val(), blood_type: $('#newBloodTypeDDL').val(), timestamp: date
    }


    $.ajax({
        type: 'POST',
        url: patientURI,
        data: JSON.stringify(patientinfo),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            getOnePatientInfo();
            document.getElementById('newPatientModal').style.display = 'none'
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
function getDiagnosisDetails() {
    $.ajax({
        type: 'GET',
        url: diagnosisURL + "/" + currentPatientID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            storediagnosis = data;
            
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diagnosisDispl').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            return getPatientReport(); //after getting diagnosis details, call and display all patient readings (called PatientReport)
        }
    });
}

//function to get all patient readings based on the patient's ID in patient info table (in turn, related to the user's id)
function getPatientReport() {
    console.log("retrieving all patient report...")

    $.ajax({
        type: 'GET',
        //async: true,
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            reportArray = data;
            secondReportArray = data; //for search reports
            //clear the tbody of the table so that it will be refreshed everytime
            
            $('#dosagehist').html('');
            $('#prescriptionButton').html('')
            //Iterate through the diseaseInfoArray to generate rows to populate the table
           
            if (reportArray == "") {
                $('#searchRPTcontain').html('');
                $('#reportcontainer').html('');
                createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3 >No patient report found</h3><div>" + createreportbtn + "<div></div>");
            }
            else if (reportArray != "") {

                //sorting all readings date by latest automatically
                reportArray.sort(function (a, b) {
                    
                    return dateToNum(b.timestamp) - dateToNum(a.timestamp);
                });
                function dateToNum(d) {
                    d = d.split("-"); return Number(d[2] + d[1] + d[0]);
                }

                //displaying readings upon matching with the patient ID
                for (i = 0; i < reportArray.length; i++) {
                    if (currentPatientID == reportArray[i].patient_id) {

                        var report = { report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp }

                        //search reports array
                        storeReports.push(report)

                        //algorithm and export to pdf array
                        FT4Array.push(report.FT4)
                        TSHArray.push(report.TSH)
                        TreatmentArray.push({ TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp })
                        ExportationArray.push({ TSH: report.TSH, FT4: report.FT4, timestamp: report.timestamp })


                        viewdosagebtn = "<button id='viewdosage' num=" + storeReports[0].report_id + " class='btn btn-dark btn-sm custom-class'>View Prescription</button>";
                        aptdate = storeReports[0].timestamp;

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

                       
                        $('#dosagehist').append("<tr style='margin-bottom: 0.5em;'>" +
                            "<tr><td>" + report.timestamp + "</td><td>" + report.FT4 + "</td><td>" +
                            "" + report.TSH + "</td><td>" + dropdown + "</td></tr></tr>");

                        if (currentPatientID != reportArray[i].patient_id && i == reportArray.length - 1) {
                            $('#searchRPTcontain').html('');
                            $('#reportcontainer').html('');
                            createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                            $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3>No patient report found</h3><div>" + createreportbtn + "<div></div>");
                            return console.log("no report history")
                        }

                    }
                    // else{
                    //     $('#searchRPTcontain').html('');
                    //     $('#reportcontainer').html('');
                    //     createreportbtn = "<button id='rpt' class=' btn btn-info btn-sm'>Create Report</button>"
                    //     $('#reportcontainer').append("<div style='text-align: center; margin-top: 10%; margin-left: auto; margin-right: auto;'><h3 >No patient report found</h3><div>"+createreportbtn+"<div></div>");
                    // }
                    
                    if (i == reportArray.length - 1) {
                        $('#prescriptionButton').append(viewdiagnosisbutton + " " + viewdosagebtn + "<br class='divider'>" + createreport);
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



//getting prescription info
var reportft //store ft4 for pdf
var reportts //store tsh for pdf
var reporttime //store timestamp for pdf
var reportdia = [] //store diagnosis for pdf

//get one patient reading only (for "view prescription" modal)
function getOneReportInfo() {
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
           
            // $('#reportContent').html('');
            $('#tdDiagnosis').html('');
            for (i = 0; i < reportArray.length; i++) {
                if (currentReportID == reportArray[i].report_id) {

                    var report = { report_id: reportArray[i].report_id, patient_id: reportArray[i].patient_id, drug_name: reportArray[i].drug_name, FT4: reportArray[i].FT4, TSH: reportArray[i].TSH, drug_dose: reportArray[i].drug_dose, timestamp: reportArray[i].timestamp }

                    //for prescription modal:

                    

                    reportdia = [] //clear array
                    for (x = 0; x < storediagnosis.length; x++) {
                        $('#tdDiagnosis').append("&bull; "+storediagnosis[x].diagnosis1 + "<br>")
                        reportdia.push(storediagnosis[x].diagnosis1)
                    }
                    $('#tdCheckup').text(report.timestamp)
                    $('#tdFt4').text(report.FT4)
                    $('#tdTsh').text(report.TSH)

                    reportft = report.FT4
                    reportts = report.TSH
                    reporttime = report.timestamp


                    getPrescription(); //call function to show drug name and drug dose
                }
            }
        }
    });
}

//get all medicines with its dosage and image, and display it on a table in the modal
var currentDosageID //get dosage ID to retrieve img in a bootstrap modal
var doseArray = []//defining array to store all dosages
function getPrescription() {
    $.ajax({
        type: 'GET',
        url: dosageURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

            doseArray = data;

            $('#prescriptionTable').html('');
            $('#drugTableMobile').html('');
            for (i = 0; i < doseArray.length; i++) {
                if (currentPatientID == doseArray[i].patient_id) {

                    var prescription = {
                        drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose,
                        drug_days: doseArray[i].drug_days, drug_img: doseArray[i].drug_img, remarks: doseArray[i].remarks
                    }

                    if (prescription.remarks == null)
                    {
                        prescription.remarks = "no remarks"
                    }


                    coverImage = "<img id='expandImg' data-toggle='modal' num=" + doseArray[i].idDosage + " style='width:100px' src='data:image/jpeg;base64," + prescription.drug_img + "'/>";
                    mobilecoverImage="<img class='card-img-top' style='width: 140px; height: 120px; margin-left:auto; margin-right: auto;' id='expandImg' data-toggle='modal' num=" + doseArray[i].idDosage + " src='data:image/jpeg;base64," + prescription.drug_img + "' alt='Card image cap'>"
                    
                    //for desktop version
                    $('#prescriptionTable').append("<tr><td>" + prescription.drug_name + "</td>" +
                        "<td>" + prescription.drug_dose + "</td><td>" + prescription.drug_days + "</td>" +
                        "<td>" + coverImage + "</td><td>" + prescription.remarks + "</td></tr>");

                    //for mobile version
                    $('#drugTableMobile').append("<div class='card' style='width: 18rem; margin-left: auto; margin-right: auto;'>"+
                    ""+mobilecoverImage+"<div class='card-body'><h4 class='card-title'>" + prescription.drug_name + "</h4>"+
                    "<p class='card-text'>Total dosage: " + prescription.drug_dose + "</p>"+
                    "<p class='card-text'>Dose per day: " + prescription.drug_days + "</p></div>"+
                    "<ul class='list-group list-group-flush'><li class='list-group-item'>Remarks: " + prescription.remarks + "</li>"+
                    "</ul></div>");
                }
            }
        }
    });
}

//obtaining medicine's image after user selects on it (enlarge it for user to see it clearly)
var getDosageInfo;
function getMedicineImg() {
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
                if (currentDosageID == doseArray[i].idDosage) {

                    getDosageInfo = {
                        report_id: doseArray[i].report_id, drug_name: doseArray[i].drug_name, drug_dose: doseArray[i].drug_dose,
                        drug_days: doseArray[i].drug_days, drug_img: doseArray[i].drug_img, remarks: doseArray[i].remarks
                    }


                    currentDosageID = doseArray[i].idDosage
                    var medImage = "<img style='width:300px; height:300px; margin-left:auto; margin-right:auto;' src='data:image/jpeg;base64," + getDosageInfo.drug_img + "'/>";

                    $('#newImageModal').append(medImage)
                   
                }
            }
        }
    });
}

//upload medicine image (clinicians will be able to evaluate it and determine if the patient sent the correct one),
//should the image not be correct, the clinicians can upload their own one for the patient to see
function updateMedicineImg() {
    var file = $(".newDrugImage")[0].files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        // invalid file type code goes here.
        alert("This file is not an image")
    }
    else {
        console.log("updating drug image...")
        var checksub = confirm("Are you sure you want to save image?")

        if (checksub == true) {
            var reader = new FileReader();
            //This function will be triggered after the code executes reader.readAsBinaryString(f);
            reader.onload = (function (theFile) {
                return function (e) {
                    var binaryData = e.target.result;

                    getDosageInfo.drug_img = window.btoa(binaryData)


                    $.ajax({
                        type: 'PUT',
                        url: dosageURI + "/" + currentDosageID,
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
        else {
            console.log("DO NOT RUN FUNCTION")
        }
    }
}



//fucntion to add new FT4 and TSH values
function postPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID


    var date = moment(new Date()).format("DD-MM-YYYY")

    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');


    var FT4unit = $('#newUnitDDL').val()
    var TSHunit = $('#newUnit1DDL').val()

    var FT4reading = $('#newFT4').val()
    var TSHreading = $('#newTSH').val()

    var FT4string = ""
    var TSHstring = ""

    //convert FT4 units and round to nearest 1 dp (by default FT4 will be in pmol/L)
    if (FT4unit == "mU/L") {
        var convertFT4 = (FT4reading / 7.125);
        FT4reading = (Math.round(convertFT4 * 10) / 10).toString();
        FT4string = "(" + $('#newFT4').val() + "mU/L)"
    }
    else {
        FT4reading = (Math.round(FT4reading * 10) / 10).toString();
    }

    //convert TSH units and round to nearest 1 dp (by default TSH will be in mU/L)
    if (TSHunit == "pmol/L") {
        var convertTSH = (TSHreading * 7.125);
        TSHreading = (Math.round(convertTSH * 10) / 10).toString();
        TSHstring = "(" + $('#newTSH').val() + "pmol/L)"
    }
    else {
        TSHreading = (Math.round(TSHreading * 10) / 10).toString();
    }

    var patientinfo = { patient_id: getuser_id, FT4: FT4reading, TSH: TSHreading, timestamp: date }


    //check if FT4 and TSH matches with defined decimal regex
    if (patientinfo.FT4.match(decimalregex) && patientinfo.TSH.match(decimalregex)) {
        var cfm = confirm("Please confirm your results before saving it to database: \r\n" +
            "FT4: " + patientinfo.FT4 + "pmol/L " + FT4string + "\r\n" +
            "TSH: " + patientinfo.TSH + "mU/L " + TSHstring)
        if (cfm == true) {
            $.ajax({
                type: 'POST',
                url: reportURI,
                data: JSON.stringify(patientinfo),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {

                    getOnePatientInfo();
                    $('#updatemodalImg').modal('hide')
                    window.location.reload(); //reload page after adding so it shows the newly added report + prescription
                }
            });
        }
        else {
            alert("entry not saved to database")
        }
    }
    //if FT4 and TSH DOES NOT match with defined regex return form input warning
    else {
        alert("Please input a proper reading for FT4 and TSH")
    }
}

var appointmentdate //capture appointment date in global var

//edit function for test results (should patient input a wrong value by mistake, 
//no delete function available as it will be on clinician side)
function putPatientReport() {
    //getting patient id and putting it into a variable
    var getuser_id = currentPatientID


    //regex to check decimals for FT4 and TSH
    var decimalregex = new RegExp('[+-]?([0-9]*[.])?[0-9]+');

    var FT4unit = $('#FT4unitDDL').val()
    var TSHunit = $('#TSHunitDDL').val()

    var FT4reading = $('#updateFT4').val()
    var TSHreading = $('#updateTSH').val()

    var FT4string = ""
    var TSHstring = ""

     //convert FT4 units and round to nearest 1 dp (by default FT4 will be in pmol/L)
    if (FT4unit == "mU/L") {
        var convertFT4 = (FT4reading / 7.125);
        FT4reading = (Math.round(convertFT4 * 10) / 10).toString();
        FT4string = "(" + $('#updateFT4').val() + "mU/L)"
    }
    else {
        FT4reading = (Math.round(FT4reading * 10) / 10).toString();
    }

    //convert TSH units and round to nearest 1 dp (by default TSH will be in mU/L)
    if (TSHunit == "pmol/L") {
        var convertTSH = (TSHreading * 7.125);
        TSHreading = (Math.round(convertTSH * 10) / 10).toString();
        TSHstring = "(" + $('#updateTSH').val() + "pmol/L)"
    }
    else {
        TSHreading = (Math.round(TSHreading * 10) / 10).toString();
    }

    var reportinfo = { patient_id: getuser_id, FT4: FT4reading, TSH: TSHreading, timestamp: appointmentdate }


    //check if FT4 and TSH matches with defined decimal regex
    if (reportinfo.FT4.match(decimalregex) && reportinfo.TSH.match(decimalregex)) {
        var cfm = confirm("Please confirm your results before saving it to database: \r\n" +
            "FT4: " + reportinfo.FT4 + "pmol/L " + FT4string + "\r\n" +
            "TSH: " + reportinfo.TSH + "mU/L " + TSHstring + "\r\n" +
            "Date: " + reportinfo.timestamp)
        if (cfm == true) {
            alert("successfully added to database")
            $.ajax({
                type: 'PUT',
                url: reportURI + "/" + currentReportID,
                data: JSON.stringify(reportinfo),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    $('#editReportModal').modal('hide');
                    window.location.reload();
                }
            });
        }
        else {
            alert("entry not saved to database")
        }
    }
    //if FT4 and TSH DOES NOT match with defined regex
    else {
        alert("Please input a proper reading for FT4 and TSH")
    }
}


//function to export the "view prescription" data into a PDF (so that if the patient checks into another clinic in real life, 
// he/she can show the other doctor on what is the patient's current condition and medication administered prior)
function exportData() {
    console.log("Exporting data...")

    var titlename = username.replace(/ /g, "_").toUpperCase();
    var ch = reporttime
    var ft = reportft
    var ts = reportts
    var di = reportdia

    //Sending data to the hidden div (located in prescription modal)
    $("#exDiagnosis").html("")
    for (x = 0; x < reportdia.length; x++) {
        $("#exDiagnosis").append(reportdia[x] + "<br/>")
    }

    $("#exCheckup").text(ch)
    $("#exFt4").text(ft + " pmol/L")
    $("#exTsh").text(ts + " mU/L")
    $("#exportDoseTable").html('')


    for (x = 0; x < doseArray.length; x++) {
        stonksImage = "<img style='width:120px; height:120px' src='data:image/jpeg;base64," + doseArray[x].drug_img + "'/>";

        //append to the hidden div that will be used for exporting data into pdf
        $("#exportDoseTable").append("<tr><td style='font-size: 20px ;text-align:left; width: 40%; font-weight: bold;padding-top: 50px; padding-bottom: 10px;'><u>Prescription no. " + (x + 1) + "</u></td>" +
            "</tr><tr><td style=' text-align:left; padding-bottom: 10px;  width: 30%; font-weight: bold;'>Drug Name:</td><td>" + doseArray[x].drug_name + "</td></tr>" +
            "<tr><td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Pills:</td><td>" + doseArray[x].drug_dose + "</td></tr><tr>" +
            "<td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Prescription:</td><td>" + doseArray[x].drug_days + "</td></tr><tr>" +
            "<td style='text-align:left; vertical-align: top; padding-bottom: 10px; font-weight: bold;'>Image:</td><td>" + stonksImage + "</td></tr><tr>" +
            "<td style='text-align:left; vertical-align: top; font-weight: bold;'>Remarks:</td><td>" + doseArray[x].remarks + "</td></tr><br/>")
    }

    //Export selected div class as PDF
    printJS({ printable: "export1", type: 'html' })
}



$(document).on('click', '#closereportmodal', function(){
    $(".appended").remove();
});


//doc model for getDiagnosisInfo
$(document).on("click", "#diagnosisbtn", function () {
    currentReportID = $(this).attr('num');
    getPatientDiagnosis(currentReportID);
    // document.getElementById('DiagnosisCardContent').style.display = 'block'
    $('#diagnosisCardModal').modal('toggle');
});


// doc prescription model for getOneReportInfo and getPrescription
$(document).on("click", "#viewdosage", function () {
    currentReportID = $(this).attr('num');
    getOneReportInfo(currentReportID);
    // document.getElementById('prescriptionModal').style.display = 'block'
    $('#prescriptionModal').modal('toggle');
});

//doc model for postPatientReport
$(document).on("click", "#expandImg", function () {
    currentDosageID = $(this).attr('num');
    $('#prescriptionModal').modal('hide')
    $('#modalImg').modal('show')
    getMedicineImg();
});

$(document).on("click", "#editImageBtn", function () {
    //currentDosageID = $(this).attr('num');
    // document.getElementById('prescriptionModal').style.display = 'none'
    $('#prescriptionModal').modal('hide');
    $('#modalImg').modal('hide')
    $('#updatemodalImg').modal('show')
});


//call modal and display previous data to edit in the update FT4/TSH modal
$(document).on("click", "#updateReadingbtn", function () {
    currentReportID = $(this).attr('num');
    for (y = 0; y < secondReportArray.length; y++) {
        if (currentReportID == secondReportArray[y].report_id) {
            $('#editReportModal').modal('show');
            $('#updateFT4').val(secondReportArray[y].FT4)
            $('#updateTSH').val(secondReportArray[y].TSH)
            appointmentdate = secondReportArray[y].timestamp;
        }
    }
    $('#editReportModal').modal('show');
});



getUserName(); //call username query first to check if it is really the user or not
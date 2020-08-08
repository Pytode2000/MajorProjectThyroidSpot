// all patient functions go here

//disease functions
var patientURI = 'https://localhost:44395/api/patientInfo';
var patientInfoArray = [];
var currentPatientID; //this variable will contain the patient ID that's selected

//This function will consume the patient info GET API (FOR DOCTORS)
function getAllPatientInfo() {
    //TODO: localstorage and if statement to get account, if role == doctor, use this function
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
                //ALERT: need code an if else statement to determine role of user


                //ALERT: need code a localstorage GET to get username

                viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                $('#patientCardContent').append("<div class = 'centerText'>" +
                    "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
                     "<div class='centerTitle'></p><b>" + patientInfoArray[i].ic_number + 
                     "</b></p><div class='centerContent'><p>Diagnosis: "+patientInfoArray[i].diagnosis+"</p></div>" +viewreportbutton+ "</div>");
            }
        }
    });
}

//only patients can access it based on their assigned unique ID
function getPatientInfo_PatientsOnly() {
    console.log("retrieving all patient info...")

    //TODO: need a localstorage to get unique ID

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
                //TODO: need code an if else statement to match firebase ID

                viewreportbutton = "<button id='forumdescbtn' class=' btn btn-info btn-sm' index='" + patientInfoArray[i].patient_id + "'>View Report</button>"
                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                $('#patientCardContent').append("<div class = 'centerText'>" +
                    "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
                     "<div class='centerTitle'></p><b>" + patientInfoArray[i].ic_number + 
                     "</b></p><div class='centerContent'><p>Diagnosis: "+patientInfoArray[i].diagnosis+"</p></div>" +viewreportbutton+ "</div>");
            }
        }
    });
}

//create patient info
function postPatientInfo() {
    //TODO: firebase UID to be get from localstorage GET and putting in 'user_id'

    //creating date
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var patientinfo = { user_id: "temporaryid1", diagnosis: $('#newDiagnosisDDL').val(), ic_number: $('#newIC').val(), date_of_birth: $('#newDOB').val(),
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
            getAllPatientInfo();
            $('#newPatientModal').modal('hide');
        }
    });
}



//GET PATIENT REPORT:
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var currentreportID; //this variable will contain the report ID that's selected


//only patients can access it based on their assigned unique ID
function getPatientReport() {
    console.log("retrieving all patient info...")

    //TODO: need a localstorage to get unique ID
    $.ajax({
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            reportArray = data;
            console.log(reportArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#reportContent').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < reportArray.length; i++) {
                //TODO: need code an if else statement to match firebase ID

                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                $('#reportContent').append("<div class = 'centerText'>" +
                    "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"+
                     "<div class='centerTitle'></p><b>" + reportArray[i].report_id + //TODO: get username from the user table 
                     "</b></p><div class='centerContent'><p>FT4: "+reportArray[i].FT4 +"</p><p>TSH: "+reportArray[i].TSH +
                     "</p><p>Drug Dose: "+reportArray[i].drug_dose +"</p><p>Last updated: "+reportArray[i].timestamp +"</p></div></div>");
            }
        }
    });
}


getAllPatientInfo();
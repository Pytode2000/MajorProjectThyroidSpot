var patientURI = 'https://localhost:44395/api/patientInfo';
var userURI = 'https://localhost:44395/api/user';
var reportURI = 'https://localhost:44395/api/report';
var reportArray = [];
var patientInformationArray = [];
var userInfoArray = [];
var patientName;
var valueFT4;
var valueTSH;
var latestUpdate;
var doctorID = sessionStorage.getItem("user_unique_id");
var patientUnderClinician = [];


function getPatientName() {
    console.log("retrieving patient name...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            userInfoArray = data;
        }
    });
}



function getAllPatientUnderClinician() {
    $.ajax({
        type: 'GET',
        url: patientURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            patientInformationArray = data;
            $.ajax({
                type: 'GET',
                url: userURI,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    userInfoArray = data;
                    $('#patientCard').html('');
                    for (i = 0; i < patientInformationArray.length; i++) { 
                        if(patientInformationArray[i].doctor_id == doctorID){
                            for (j = 0; j < userInfoArray.length; j++){
                                if(patientInformationArray[i].user_id == userInfoArray[j].user_id){
                                    $('#patientCard').append("<article class='patient-card'> <div class='text'><h3>"+userInfoArray[j].full_name+"</h3><p>"+patientInformationArray[i].ic_number+"</p>"+
                                    "<p><b>Details</b></p><p>Gender:"+patientInformationArray[i].gender+"</p><p>Blood Type: "+patientInformationArray[i].blood_type+"</p>"+
                                    "<button id='patientDetailsBtn' num='"+ patientInformationArray[i].patient_id + "' index='"+ patientInformationArray[i].user_id + "' class='patient-details-btn' >More Details</button><br>"+
                                    "<button id='openGraphModalBtn' class='patient-details-btn' >Graph</button><br>"+
                                    "<button id='abandonPatientBtn' index = '"+i+"'num='"+ patientInformationArray[i].patient_id +"' index='"+ patientInformationArray[i].user_id + "' class='patient-details-btn' data-toggle='modal' data-target='#exampleModal'>Abandon Patient</button></div></article>");
                                }   
                            }
  
                        }
                      
                    }

                }
            });
            
        }
    });
}

$(document).on("click", "#abandonPatientBtn", function (){
    var currentPatient = $(this).attr('index')
    document.getElementById("confirmAbandonPatientBtn").val = currentPatient
});

function adoptPatient(){
    console.log(patientInformationArray)
    for(i=0; i < patientInformationArray.length;i++){
        if ($('#patientICInput').val() == patientInformationArray[i].ic_number){
            var patientInformation = { patient_id: patientInformationArray[i].patient_id, user_id: patientInformationArray[i].user_id,
                diagnosis: patientInformationArray[i].diagnosis, ic_number: patientInformationArray[i].ic_number, date_of_birth: patientInformationArray[i].date_of_birth,
                gender: patientInformationArray[i].gender, blood_type: patientInformationArray[i].blood_type, timestamp: patientInformationArray[i].timestamp,
                doctor_id: doctorID};
            $.ajax({
                type: 'PUT',
                url: patientURI +'/'+ patientInformationArray[i].patient_id,
                data: JSON.stringify(patientInformation),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("success")
                }
            });


        }
    }

}

$(document).on("click", "#transferPatientBtn", function (){
    var currentPatientId = $(this).attr('num')
    var currentPatient = document.getElementById("confirmAbandonPatientBtn").val
    console.log(userInfoArray)
    newClinicianID = $('#newClinicianID').val()
    for(i=0; i < userInfoArray.length;i++){
        if (userInfoArray[i].account_type != "clinician"){
            document.getElementById("wrongIDPrompt").style.display = "";
            document.getElementById("wrongIDPrompt").innerHTML= "This user is not a clinician"
        }
        if (newClinicianID == userInfoArray[i].user_id){
            var patientInformation = { patient_id: patientInformationArray[currentPatient].patient_id, user_id: patientInformationArray[currentPatient].user_id,
                diagnosis: patientInformationArray[currentPatient].diagnosis, ic_number: patientInformationArray[currentPatient].ic_number, date_of_birth: patientInformationArray[currentPatient].date_of_birth,
                gender: patientInformationArray[currentPatient].gender, blood_type: patientInformationArray[currentPatient].blood_type, timestamp: patientInformationArray[currentPatient].timestamp,
                doctor_id: newClinicianID};
            $.ajax({
                type: 'PUT',
                url: patientURI +'/'+ patientInformationArray[currentPatientId].patient_id,
                data: JSON.stringify(patientInformation),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("success")
                }
            });


        }
        else{
            document.getElementById("wrongIDPrompt").style.display = "";
            document.getElementById("wrongIDPrompt").innerHTML= "Wrong ID";
        }
    }

});

$(document).on("click", "#confirmAbandonPatientBtn", function (){
    var currentPatient = document.getElementById("confirmAbandonPatientBtn").val
    console.log(currentPatient)
    var patientInformation = { patient_id: patientInformationArray[currentPatient].patient_id, user_id: patientInformationArray[currentPatient].user_id,
        diagnosis: patientInformationArray[currentPatient].diagnosis, ic_number: patientInformationArray[currentPatient].ic_number, date_of_birth: patientInformationArray[currentPatient].date_of_birth,
        gender: patientInformationArray[currentPatient].gender, blood_type: patientInformationArray[currentPatient].blood_type, timestamp: patientInformationArray[currentPatient].timestamp,
        doctor_id: ""};
    $.ajax({
        type: 'PUT',
        url: patientURI +'/'+ patientInformationArray[currentPatient].patient_id,
        data: JSON.stringify(patientInformation),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("success")
        }
    });
    
    

});

$("#adoptPatientForm").submit(function(e) {
    e.preventDefault();
});


$(document).on("click", "#patientDetailsBtn", function () {
    var currentPatientUserId = $(this).attr('index');
    var currentPatientId = $(this).attr('num')
    localStorage.setItem("currentPatientUserId",currentPatientUserId)
    localStorage.setItem("currentPatientId",currentPatientId)
    window.location.href = "patient-info-doctor.html"

});

//$(document).on("click","#abandonPatientBtn", function (){
    //document.getElementById('abandonPatientModal').style.display='block';
//})

$(document).on("click","#openGraphModalBtn", function () {
    document.getElementById('graphModal').style.display='block'
    var ctx = document.getElementById('displayGraph').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ft4', 'TSH', 'ABC'],
                datasets: [{
                    label: 'value xx',
                    data: [12, 19, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
})


//This function will get the full name of the patient
function getPatientReport() {
    console.log("Retrieving Patient Report...")
    $.ajax({
        aSync: false,
        type: 'GET',
        url: reportURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            reportArray = data;
            return reportArray;
        }
    });
}





getAllPatientUnderClinician();



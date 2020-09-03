//disease functions
var diseaseURI = 'https://localhost:44395/api/Disease';
var diseaseInfoArray = [];
var secondInfoArray = [];
var currentDiseaseID; //this variable will contain the disease name that's selected
var storage = []; //this array will define the search


// PROFILE click diagnosis -> open disease modal
function viewDiagnosisDisease() {
    disease_diagnosis = sessionStorage.getItem("view_disease");
    if (disease_diagnosis != null) {
        disease_diagnosis_remove_quotes = disease_diagnosis.replace('"', '')
        $.ajax({
            type: 'GET',
            url: encodeURI(diseaseURI + "/" + disease_diagnosis_remove_quotes),
            dataType: 'json',
            contentType: 'application/json',
            success: function (disease_data) {
                console.log(disease_data)
                document.getElementById('diseaseModal').style.display = 'block'
                $('#diseaseName').text(disease_data.disease)
                $('#diseaseShortDescription').text(disease_data.description)
                $('#diseaseContent').text(disease_data.disease_content)
                $('#diseaseSymptoms').text(disease_data.symptom)
                $('#diseaseCause').text(disease_data.cause)
                $('#diseaseTreatment').text(disease_data.treatment)

            }
        });


        setTimeout(function () {
            sessionStorage.removeItem("view_disease");
        }, 5000);

    }
    else {
        console.log("Not from profile")
    }
}
// sessionStorage.removeItem("view_disease");

// JC ADMIN CREATE DISEASE
function createNewDisease() {

    diseaseInstance = {
        disease: $('#newDiseaseName').val(),
        thumbnail: null,
        description: $('#newDiseaseDesc').val(),
        disease_content: $('#newDiseaseContent').val(),
        symptom: $('#newDiseaseSymptom').val(),
        cause: $('#newDiseaseCause').val(),
        treatment: $('#newDiseaseTreatment').val(),
        timestamp: "-"
    }
    $.ajax({
        type: 'POST',
        url: diseaseURI,
        data: JSON.stringify(diseaseInstance),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Disease instance created.");
            $('#newDiseaseModal').modal('hide');
            window.location.reload();
        }
    });
}

function updateDisease() {

    disease_data = {
        thumbnail: null,
        description: $('#editDiseaseDesc').val(),
        disease_content: $('#editDiseaseContent').val(),
        symptom: $('#editDiseaseSymptom').val(),
        cause: $('#editDiseaseCause').val(),
        treatment: $('#editDiseaseTreatment').val(),
        timestamp: "-"
    }

    $.ajax({
        type: 'PUT',
        url: diseaseURI + '/' + localStorage.getItem("diseasename"),
        data: JSON.stringify(disease_data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Updated Disease");
            window.location.reload();
        }
    });
}

function deleteDisease() {
    $.ajax({
        type: 'DELETE',
        url: diseaseURI + "/" + localStorage.getItem("diseasename"),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Disease instance deleted.")
            window.location.reload();
        }
    });
}

//This function will consume the disease GET API
function getAllDiseaseInfo() {
    console.log("retrieving all disease info...")
    $.ajax({
        type: 'GET',
        url: diseaseURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diseaseInfoArray = data;
            secondInfoArray = data;
            // console.log(diseaseInfoArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diseaseCard').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < diseaseInfoArray.length; i++) {
                coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + diseaseInfoArray[i].thumbnail + "'/>";
                def = { id: i, disease: diseaseInfoArray[i].disease }
                updateDeleteButtons = "<button>TEST</button>"
                storage.push(def)
                //use sample image for now:
                coverImage = "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"
                // viewmorebutton = "document.getElementById('diseaseModal').style.display='block'"
                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                $('#diseaseCard').append("<div id='viewmore' num=" + i + "  class = 'centerText'>" +
                    coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
            }
        }
    });
}


//This function will get one disease info
function getOneDiseaseInfo(id) {
    console.log(id);
    $.ajax({
        type: 'GET',
        url: diseaseURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diseaseInfoArray = data;
            //Iterate through the bookArray to generate rows to populate the table

            for (i = 0; i < diseaseInfoArray.length; i++) {
                if (id == i) {
                    localStorage.setItem("diseasename", diseaseInfoArray[i].disease);
                    //generate the buttons html with information hidden into its attributes (index)
                    //num attribute is used to store the array index so that in can be used later to retrieve information from the bookArray
                    //coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + disinfoArray[i].thumbnail + "'/>";
                    $('#diseaseName').text(diseaseInfoArray[i].disease)
                    $('#diseaseShortDescription').text(diseaseInfoArray[i].description)
                    $('#diseaseContent').text(diseaseInfoArray[i].disease_content)
                    $('#diseaseSymptoms').text(diseaseInfoArray[i].symptom)
                    $('#diseaseCause').text(diseaseInfoArray[i].cause)
                    $('#diseaseTreatment').text(diseaseInfoArray[i].treatment)


                    // Preset value in edit disease modal.
                    $('#editDiseaseName').text(diseaseInfoArray[i].disease);
                    $('#editDiseaseDesc').val(diseaseInfoArray[i].description);
                    $('#editDiseaseContent').val(diseaseInfoArray[i].disease_content);
                    $('#editDiseaseSymptom').val(diseaseInfoArray[i].symptom);
                    $('#editDiseaseCause').val(diseaseInfoArray[i].cause);
                    $('#editDiseaseTreatment').val(diseaseInfoArray[i].treatment);

                    // $("#editBloodType").val(currentPatientArray.blood_type);
                }
            };
        }
    });
}

var stonks
//disease search function
function diseaseSearch() {
    const searchTerm = document.getElementById("diseaseSearch").value;

    if (searchTerm.length == 0) {
        storage = []
        secondInfoArray = []
        getAllDiseaseInfo();
        stonks = ""
        return false;
    }

    if (!searchTerm) {
        return;
    }

    secondInfoArray = storage.filter(currentGoal => {
        if (currentGoal.disease && searchTerm) {
            if (currentGoal.disease.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                stonks = currentGoal.disease
                console.log(currentGoal.disease)
                return true;
            }
            return false;
        }
    });

    console.log(secondInfoArray)
    $('#diseaseCard').html('');
    for (i = 0; i < secondInfoArray.length; i++) {
        $('#diseaseCard').append("<div id='viewmore' num=" + secondInfoArray[i].id + "  class = 'centerText'>" +
            coverImage + "<div class='centerTitle'><b>" + secondInfoArray[i].disease + "</b></div></div>");
    }

}

function call() {
    //console.log(stonksid)

    $('#diseaseCard').html('');
    // //Iterate through the diseaseInfoArray to generate rows to populate the table
    // for (i = 0; i < diseaseInfoArray.length; i++) {
    //     coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + diseaseInfoArray[i].thumbnail + "'/>";

    //     //use sample image for now:
    //     coverImage= "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"
    //     // viewmorebutton = "document.getElementById('diseaseModal').style.display='block'"
    // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
    //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
    //     $('#diseaseCard').append("<div id='viewmore' num="+stonksid+"  class = 'centerText'>" +
    //         coverImage + "<div class='centerTitle'><b>" + stonks + "</b></div></div>");
    //  }

}


$(document).on("click", "#viewmore", function () {
    currentDiseaseID = $(this).attr('num');
    console.log(currentDiseaseID);
    getOneDiseaseInfo(currentDiseaseID);
    document.getElementById('diseaseModal').style.display = 'block'
});

getAllDiseaseInfo();
call();
//disease functions
var diseaseURI = 'https://localhost:44395/api/Disease';
var diseaseInfoArray = [];
var currentDiseaseID; //this variable will contain the disease name that's selected

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
            console.log(diseaseInfoArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diseaseCard').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < diseaseInfoArray.length; i++) {
                coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + diseaseInfoArray[i].thumbnail + "'/>";

                //use sample image for now:
                coverImage= "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"
                // viewmorebutton = "document.getElementById('diseaseModal').style.display='block'"
                // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
                //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
                $('#diseaseCard').append("<div id='viewmore' num="+i+"  class = 'centerText'>" +
                    coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
            }
        }
    });
}


//This function will get one disease info
function getOneDiseaseInfo(id) {
    id
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
                }
            };
        }
    });
}

$(document).on("click", "#viewmore", function () {
    currentDiseaseID = $(this).attr('num');
    console.log(currentDiseaseID);
    getOneDiseaseInfo(currentDiseaseID);
    document.getElementById('diseaseModal').style.display='block'
});

getAllDiseaseInfo();
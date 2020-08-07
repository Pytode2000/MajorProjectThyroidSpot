//disease info functions
var diseaseURI = 'https://localhost:44395/api/Disease';
var disinfoArray = [];
var currentDiseaseID; //this variable will contain the disease name that's selected

//This function will consume the disease GET API
function getAllDiseaseInfo() {
    $.ajax({
        type: 'GET',
        url: diseaseURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            diseaseInfoArray = data;
            //clear the tbody of the table so that it will be refreshed everytime
            $('#diseaseCard').html('');
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            for (i = 0; i < disinfoArray.length; i++) { 
                coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + disinfoArray[i].thumbnail + "'/>";
                $('#diseaseCard').append("<div onclick='document.getElementById('diseaseModal').style.display='block'' class = 'centerText'><img  src='"+
                coverImage+"><div class='centerTitle'><b>"+diseaseInfoArray[i].disease+"</b></div></div>");
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
            for (i = 0; i < disinfoArray.length; i++) {
                if (id == disinfoArray[i].disease){
                localStorage.setItem("diseasename", id);
                //generate the buttons html with information hidden into its attributes (index)
                //num attribute is used to store the array index so that in can be used later to retrieve information from the bookArray
                //coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + disinfoArray[i].thumbnail + "'/>";
                $('#diseaseName').text(diseaseInfoArray[i].disease)
                $('#diseaseShortDescription').text(diseaseInfoArray[i].description)
                $('#diseaseContent').text(diseaseInfoArray[i].disease_content)
                $('#diseaseSymtoms').text(diseaseInfoArray[i].symtom)
                $('#diseaseCause').text(diseaseInfoArray[i].cause)
                $('#diseaseTreatment').text(diseaseInfoArray[i].treatment)
            }
        };
        }
});
}
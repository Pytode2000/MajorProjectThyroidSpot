//disease functions
var diseaseURI = 'https://localhost:44395/api/Disease';
var diseaseInfoArray = [];
var secondInfoArray = [];
var currentDiseaseID; //this variable will contain the disease name that's selected
var storage = []; //this array will define the search

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
            console.log(diseaseInfoArray)
            displayAllInfo()
            for (i = 0; i < diseaseInfoArray.length; i++) {
                def = {id: i, disease: diseaseInfoArray[i].disease}
                storage.push(def)
            }
        }
    });
}

function displayAllInfo(){
    //clear the tbody of the table so that it will be refreshed everytime
    $('#diseaseCard').html('');
    //Iterate through the diseaseInfoArray to generate rows to populate the table
    for (i = 0; i < diseaseInfoArray.length; i++) {
        coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + diseaseInfoArray[i].thumbnail + "'/>";
        def = {id: i, disease: diseaseInfoArray[i].disease}
        storage.push(def)
        //use sample image for now:
        coverImage= "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"
        // viewmorebutton = "document.getElementById('diseaseModal').style.display='block'"
        // $('#diseaseCard').append("<div onclick="+viewmorebutton+"  class = 'centerText'>" +
        //     coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
        $('#diseaseCard').append("<div id='viewmore' num="+i+"  class = 'centerText'>" +
            coverImage + "<div class='centerTitle'><b>" + diseaseInfoArray[i].disease + "</b></div></div>");
    }

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
                }
            };
        }
    });
}





function binarySearch(items, value){
    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);
 
    while(items[middle] != value && startIndex < stopIndex){
 
        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }
        
        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }
 
    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
}

//disease search function
function diseaseSearch() {
    const searchTerm = document.getElementById("diseaseSearch").value;

    if (searchTerm.length == 0)
    { 
       getAllDiseaseInfo();	
       return false; 
    }  	

    // console.log(storage)
    console.log(searchTerm)
    testfucntion = binarySearch(storage, searchTerm)
    console.log(testfucntion)
    // if (!searchTerm) {
    //     return;
    // }

    // secondInfoArray = storage.filter(currentGoal => {
    //     if (currentGoal.disease && searchTerm) {
    //         if (currentGoal.disease.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
    //             console.log(currentGoal.disease)
    //             console.log("input: "+searchTerm)
    //             return true;
    //         }
    //     return false
    //     }
    // });

    // $('#diseaseCard').html('');
    // if (secondInfoArray.length > 0){
    //     console.log(secondInfoArray.length)
    //     for (i = 0; i < secondInfoArray.length; i++) {
    //         var previous= secondInfoArray[i==0?secondInfoArray.length-1:i-1].disease;
    //         var current = secondInfoArray[i].disease
    //         coverImage= "<img src='https://www.mei.edu/sites/default/files/2019-01/Virus.jpg'>"
            
            
    //         if (secondInfoArray[i].disease == previous){
    //             return secondInfoArray.pop()
    //         }
    //         $('#diseaseCard').append("<div id='viewmore' num="+secondInfoArray[i].id+"  class = 'centerText'>" +
    //             coverImage + "<div class='centerTitle'><b>" + secondInfoArray[i].disease + "</b></div></div>");
    //             console.log("current: " + current);
    //             console.log("previous " + previous);
    //     }
    // }

}



$(document).on("click", "#viewmore", function () {
    currentDiseaseID = $(this).attr('num');
    console.log(currentDiseaseID);
    getOneDiseaseInfo(currentDiseaseID);
    document.getElementById('diseaseModal').style.display='block'
});

getAllDiseaseInfo();
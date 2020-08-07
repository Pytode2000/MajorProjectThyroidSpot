// homepage + other functions go here

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
            disinfoArray = data;
            //clear the tbody of the table so that it will be refreshed everytime
            $('#tableBody').html('');
            //Iterate through the bookArray to generate rows to populate the table
            for (i = 0; i < disinfoArray.length; i++) {
                //generate the buttons html with information hidden into its attributes (index)
                //num attribute is used to store the array index so that in can be used later to retrieve information from the bookArray
                // feedbackButton = "<button class='feedbackBtn btn btn-info btn-sm' data-toggle='modal' data-target='#feedbackModal' index='" + bookArray[i].BookID + "'>Feedback</button>";
                updateButton = "<button num='" + i + "' class='updateBtn btn-sm btn btn-warning' data-toggle='modal' data-target='#updateBookModal' index='" + disinfoArray[i].disease + "' >Update</button> ";
                deletebutton = "<button class='deleteBtn btn btn-danger btn-sm delete-btn' data-toggle='modal' data-target='#updateBookModal' num='" + i + "' index='" + disinfoArray[i].disease + "'>Delete</button>"
                coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + disinfoArray[i].thumbnail + "'/>";

                //TO KAILONG: You can change the design here as well if you don't want it to display a table
                $('#tableBody').append("<tr><td>" + disinfoArray[i].disease + "</td><td>" + disinfoArray[i].description + "</td><td>" + disinfoArray[i].disease_content + "</td><td>" + disinfoArray[i].symptom + "</td><td>" + disinfoArray[i].cause + "</td><td>" + disinfoArray[i].treatment + "</td><td>" + coverImage + "</td><td>" + updateButton + "</td><td>" + deletebutton + "</td><td>" + disinfoArray[i].timestamp + "</td></tr>");
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
            disinfoArray = data;
            //clear the tbody of the table so that it willbe refreshed everytime
            $('#tableBody2').html('');
            //Iterate through the bookArray to generate rows to populate the table
            for (i = 0; i < disinfoArray.length; i++) {
                if (id == disinfoArray[i].disease){
                localStorage.setItem("diseasename", id);
                //generate the buttons html with information hidden into its attributes (index)
                //num attribute is used to store the array index so that in can be used later to retrieve information from the bookArray
                updateButton = "<button num='" + i + "' class='updateBtn btn-sm btn btn-warning' data-toggle='modal' data-target='#updateBookModal' index='" + disinfoArray[i].disease + "' >Update</button> ";
                deletebutton = "<button class='deleteBtn btn btn-danger btn-sm delete-btn' data-toggle='modal' data-target='#updateBookModal' num='" + i + "' index='" + disinfoArray[i].disease + "'>Delete</button>"
                coverImage = "<img style='width:100px' src='data:image/jpeg;base64," + disinfoArray[i].thumbnail + "'/>";

                //TO KAILONG: You can change the design here as well if you don't want it to display a table
                $('#tableBody').append("<tr><td>" + disinfoArray[i].disease + "</td><td>" + disinfoArray[i].description + "</td><td>" + disinfoArray[i].disease_content + "</td><td>" + disinfoArray[i].symptom + "</td><td>" + disinfoArray[i].cause + "</td><td>" + disinfoArray[i].treatment + "</td><td>" + coverImage + "</td><td>" + updateButton + "</td><td>" + deletebutton + "</td><td>" + disinfoArray[i].timestamp + "</td></tr>");
                }
            }
        }
    });
}

//Update disease info (ONLY ADMINS CAN DO)
function updateDiseaseInfo() {
    var f = $("#updateImage")[0].files[0]; // get image object
    var reader = new FileReader();
    //This function will be triggered after the code executes reader.readAsBinaryString(f);
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            
            //creating date
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

            //prepare for update
            var product = { disease: currentDiseaseID, description: $('#updateDiseaseDesc').val(), disease_content: $('#updateDiseaseContent').val(), symptom: $('#updateDiseaseSymptom').val(), cause: $('#updateDiseaseCause').val(), treatment: $('#updateDiseaseTreatment').val(), timestamp: date, CoverImage: window.btoa(binaryData) }

            //updating
            $.ajax({
                type: 'PUT',
                url: diseaseURI + "/" + currentDiseaseID,
                data: JSON.stringify(product),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    //calling the function again so that the books information are updated
                    getAllDiseaseInfo();
                    $('#updateBookModal').modal('hide');
                }
            });
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}

//Post disease info (ONYL ADMINS CAN DO)
function postDiseaseInfo() {
    var f = $("#newImage")[0].files[0]; // Get image
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            //composing the json object which is to be sent to the Post endpoint
            var product = { disease: currentDiseaseID, description: $('#newDiseaseDesc').val(), disease_content: $('#newDiseaseContent').val(), symptom: $('#newDiseaseSymptom').val(), cause: $('#newDiseaseCause').val(), treatment: $('#newDiseaseTreatment').val(), timestamp: date, CoverImage: window.btoa(binaryData) }
            console.log(product);
            $.ajax({
                type: 'POST',
                url: diseaseURI,
                data: JSON.stringify(product),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    //calling the function again so that the new books are updated
                    getAllProducts();
                    $('#newBookModal').modal('hide');
                }
            });

        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}

//delete disease info (ONLY ADMINS CAN DO)
function deleteDiseaseInfo() {
    var currentName = localStorage.getItem("diseasename")
    $.ajax({
        type: 'DELETE',
        url: productsURI + "/" + currentName,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again as one book had been deleted
            getAllProducts();
            $('#updateBookModal').modal('hide');
        }
    });
};


//only the new data button will respond to click
$(document).on("click", "#newDiseaseInfoBtn", function () {

    postProduct();

});

//all the update buttons will respond to this
$(document).on("click", ".updateBtn", function () {
    currentDiseaseID = $(this).attr('index');
    $('#updateDiseaseDesc').val(bookArray[$(this).attr('num')].description);
    $('#updateDiseaseContent').val(bookArray[$(this).attr('num')].disease_content);
    $('#updateDiseaseSymptom').val(bookArray[$(this).attr('num')].symptom);
    $('#updateDiseaseCause').val(bookArray[$(this).attr('num')].cause);
    $('#updateDiseaseTreatment').val(bookArray[$(this).attr('num')].treatment);
});

//all the delete buttons will respond to this
$(document).on("click", ".deleteBtn", function () {
    
    currentDiseaseID = $(this).attr('index');
    $('#updateDiseaseDesc').val(bookArray[$(this).attr('num')].description);
    $('#updateDiseaseContent').val(bookArray[$(this).attr('num')].disease_content);
    $('#updateDiseaseSymptom').val(bookArray[$(this).attr('num')].symptom);
    $('#updateDiseaseCause').val(bookArray[$(this).attr('num')].cause);
    $('#updateDiseaseTreatment').val(bookArray[$(this).attr('num')].treatment);

});

//ADDITIONAL FUNCTION TO BE DONE AT PHASE 4
// $(document).on("click", ".feedbackBtn", function () {
//     //set this variable to hold the BookID of the selected Book
//     currentBookID = $(this).attr("index");
//     getFeedback();
// });

// $(document).on("click", "#newFeedBackBtn", function () {
//     $('#newComment').val('');
//     $('#newFeedbackModal').modal('show');
// });


//  $(document).on("click", "#submitFeedbackBtn", function () {
//      postFeedback();
// });


//consume the web api at startup so that the table will be filled with data
getAllDiseaseInfo();

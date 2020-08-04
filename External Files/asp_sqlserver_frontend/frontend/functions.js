var productsURI = 'https://localhost:44348/api/Students';
// var feedbackURI = 'https://localhost:59723/api/Feedbacks';
//change the url according to your project
var bookArray = [];
var feedbackArray = [];
var currentBookID; //this variable will contain the BookID for the book that the user had selected

//This function will consume the Products Get API
function getAllProducts() {
    $.ajax({
        type: 'GET',
        url: productsURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            bookArray = data;
            //clear the tbody of the table so that it will be refreshed everytime
            $('#tableBody').html('');
            //Iterate through the bookArray to generate rows to populate the table
            for (i = 0; i < bookArray.length; i++) {
                //generate the buttons html with information hidden into its attributes (index)
                //num attribute is used to store the array index so that in can be used later to retrieve information from the bookArray
                // feedbackButton = "<button class='feedbackBtn btn btn-info btn-sm' data-toggle='modal' data-target='#feedbackModal' index='" + bookArray[i].BookID + "'>Feedback</button>";
                updateButton = "<button num='" + i + "' class='updateBtn btn-sm btn btn-warning' data-toggle='modal' data-target='#updateBookModal' index='" + bookArray[i].id + "' >Update</button> ";
                deletebutton = "<button class='deleteBtn btn btn-danger btn-sm delete-btn' data-toggle='modal' data-target='#updateBookModal' num='" + i + "' index='" + bookArray[i].id + "'>Delete</button>"
                
                //add "<td>" + feedbackButton + "</td>" if adding in a feedback button
                $('#tableBody').append("<tr><td>" + bookArray[i].id + "</td><td>" + bookArray[i].studentName + "</td><td>" + bookArray[i].studentClass + "</td><td>" + bookArray[i].studentCourse + "</td><td>" + updateButton + "</td><td>" + deletebutton + "</td></tr>");
            }
        }
    });
}
//This function is to consume the PUT endpoint to make changes to the selected Book record
function updateProduct() {

    // // var f = $("#updateImage")[0].files[0]; // get image object
    // var reader = new FileReader();
    // //This function will be triggered after the code executes reader.readAsBinaryString(f);
    // reader.onload = (function (theFile) {
            
            //composing the json object which is to be sent to the Update endpoint
            var product = { id: currentBookID, studentName: $('#updateStudentName').val(), studentClass: $('#updateStudentClass').val(), studentCourse: $('#updateStudentCourse').val()}
            $.ajax({
                type: 'PUT',
                url: productsURI + "/" + currentBookID + "/",
                data: JSON.stringify(product),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    //calling the function again so that the books information are updated
                    getAllProducts();
                    $('#updateBookModal').modal('hide');
                }
            });
        
    // })
    // })(f);
    // // Read in the image file as a data URL.
    // reader.readAsBinaryString(f);
}


function postProduct() {

   
    var product = { studentName: $('#newName').val(), studentClass: $('#newClass').val(), studentCourse: $('#newCourse').val()}
    console.log(product);
    $.ajax({
        type: 'POST',
        url: productsURI,
        data: JSON.stringify(product),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again so that the new books are updated
            getAllProducts();
            $('#newBookModal').modal('hide');
        }
    });

}
function deleteProduct() {

    $.ajax({
        type: 'DELETE',
        url: productsURI + "/" + currentBookID,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //calling the function again as one book had been deleted
            getAllProducts();
            $('#updateBookModal').modal('hide');
        }
    });
};

// function getFeedback() {
//     $.ajax({
//         type: 'GET',
//         url: feedbackURI,
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function (data) {
//             //put json data into feedbackArray
//             feedbackArray = data;
//             //clear the tbody of the table
//             $('#feedbackBody').html('');
//             //Iterate through the bookArray to generate rows to populate the table
//             for (i = 0; i < feedbackArray.length; i++) {

//           //The if condition is to only show feedback that has the same BookID as the selected Book
//                 if (feedbackArray[i].BookID == currentBookID) {
//                     card = "<div class='card'><div class='card-body'>" + feedbackArray[i].Comments + "</div></div>";
//                     $('#feedbackBody').append(card);
//                 }

//             }
//         }
//     });
// }

// function postFeedback() {
//      //composing the json object which is to be sent to the Post endpoint of the Feedback Web API
//     var feedback = { BookID: currentBookID, Comments: $('#newComment').val() };
//      $.ajax({
//                 type: 'POST',
//                 url: feedbackURI,
//                 data: JSON.stringify(feedback),
//                 dataType: 'json',
//                 contentType: 'application/json',
//                 success: function (data) {
//                     getFeedback();
//                      $('#newFeedbackModal').modal('hide');
//                 }
//             });
// }



//only the new data button will respond to click
$(document).on("click", "#newProductBtn", function () {

    postProduct();

});

//all the update buttons will respond to this
$(document).on("click", ".updateBtn", function () {
    //set this variable to hold the BookID of the selected Book
    currentBookID = $(this).attr('index');
    console.log("student id: " + currentBookID)
    $('#updateStudentName').val(bookArray[$(this).attr('num')].studentName);
    $('#updateStudentClass').val(bookArray[$(this).attr('num')].studentClass);
    $('#updateStudentCourse').val(bookArray[$(this).attr('num')].studentCourse);

});

//all the delete buttons will respond to this
$(document).on("click", ".deleteBtn", function () {
    //set this variable to hold the BookID of the selected Book
    currentBookID = $(this).attr('index');
    $('#updateBookTitle').val(bookArray[$(this).attr('num')].Title);
    $('#updateBookAuthor').val(bookArray[$(this).attr('num')].Authors);

});


$(document).on("click", ".feedbackBtn", function () {
    //set this variable to hold the BookID of the selected Book
    currentBookID = $(this).attr("index");
    getFeedback();
});

// $(document).on("click", "#newFeedBackBtn", function () {
//     $('#newComment').val('');
//     $('#newFeedbackModal').modal('show');
// });


//  $(document).on("click", "#submitFeedbackBtn", function () {
//      postFeedback();
// });


//consume the web api at startup so that the table will be filled with data
getAllProducts();

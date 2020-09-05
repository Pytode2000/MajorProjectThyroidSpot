//ALL FORUM COMMENT FUNCTIONS GO HERE:
var forumcommentURI = 'https://localhost:44395/api/forumcomments';
var commentArray = []; //store all comments


//FORUM COMMENT FUNCTIONS:

//TODO: display post based on sessionStorage ID


//TODO: get comment based on post id
function getCommentByID(id) {

    id = sessionStorage.getItem("forID")
    console.log(id);
    $.ajax({
        type: 'GET',
        url: forumcommentURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            commentArray = data;
            //Iterate through the bookArray to generate rows to populate the table

            for (i = 0; i < commentArray.length; i++) {
                if (id == i) {
                   console.log(commentArray[i])
                   //TODO: display comment (sort by latest)
                }
            };
        }
    });
}


//TODO: add comment
function addComment() {

    //TODO: check if user exist in the database or not
}



//TODO: update comment (user can only update their own comment)
function updateComment() {
}




//TODO: delete comment itself
function deleteCommentByUser() {
}




$(document).on("click", "#redirectBack", function () {
    sessionStorage.removeItem("forID");
    window.location.href = "disease-forum.html";
});

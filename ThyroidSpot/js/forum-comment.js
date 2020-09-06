//ALL FORUM COMMENT FUNCTIONS GO HERE:
var forumcommentURI = 'https://localhost:44395/api/forumcomments';
var forumpostURI = 'https://localhost:44395/api/forumpost';
var commentArray = []; //store all comments
var commentArray2 = [];; //display only one comment in the update modal
var currentCommentID
var forumId

//FORUM COMMENT FUNCTIONS:

//display post details based on sessionStorage ID
function showPostDetails(){

    forumId = sessionStorage.getItem("forID")
    var postDetails = []
    console.log(forumId)
    $.ajax({
        type: 'GET',
        url: forumpostURI + "/" + forumId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            postDetails = data;
            console.log(postDetails)
            //Iterate through the bookArray to generate rows to populate the table
            $('#tableBody').html('');
            $('#tableBody').append("<p>Posted by: "+postDetails.user_name+"</p><h4>"+postDetails.post_title+"</h4>"+
                 "<br/><p>"+postDetails.post_description+"</p>");


            //TODO: check if username still exists in database, else insert [deleteduser]
            
           getCommentByID(postDetails.idForum);
        }
    });

}

var userInfoArray = [];
var matchingname;
//QUERY FOR USERNAME FIRST BEFORE ADD COMMENT
var userURI = 'https://localhost:44395/api/user';
function queryName(){
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI +"/"+getuid,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            userInfoArray = data;
            
            matchingname = userInfoArray.full_name
        }
       
    });
}



//get comment based on post id
function getCommentByID(id) {
    console.log("username: "+matchingname)
    console.log(id);
    $.ajax({
        type: 'GET',
        url: forumcommentURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            commentArray = data;
            commentArray2 = data;
            //Iterate through the bookArray to generate rows to populate the table
            $('#allComments').html('');
            if (commentArray == ""){
                $('#commentSection').html('');
                $('#commentSection').append("<div id='noCommentDesign'><p>No comments yet, would you like to add a new one?</p>"+
                "<button class='btn btn-sm btn-info custom-class' id='addNewComment' data-toggle='modal' data-target='#newCommentModal'>Add Comment</button></div>")
            }
            else{
                
                //sort by latest
                commentArray.sort(function(a,b){
                    console.log(dateToNum(a.timestamp))
                    return dateToNum(b.timestamp) - dateToNum(a.timestamp);
                });
                function dateToNum(d) {
                    d = d.split("-"); return Number(d[2]+d[1]+d[0]);
                }

                for (i = 0; i < commentArray.length; i++) {
                    if (id == commentArray[i].forum_id) {
                    console.log(commentArray[i])
                        
                        updateCommentBtn = "<button id='updComt' class='dropdown-item' num="+commentArray[i].idForumComment+" type='button'>Update</button>";
                        deleteCommentBtn = "<button id='delComt' class='dropdown-item' num="+commentArray[i].idForumComment+" type='button'>Delete</button>"
                        
                        if (matchingname == commentArray[i].username){
                            $('#allComments').append("<div class='list-group'><div class='list-group-item list-group-item-action flex-column align-items-start'><div>"+
                            "<small id='comUsname'>"+commentArray[i].username+"</small><small> · "+commentArray[i].timestamp+"</small><div class='dropdown' style='float:right'>"+
                            "<button class='btn btn-sm btn-secondary' style='background-color:transparent; border-style: none; ' type='button'"+
                            " id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"+
                            "<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-three-dots-vertical' fill='dark-grey' xmlns='http://www.w3.org/2000/svg'>"+
                            "<path fill-rule='evenodd' d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>"+
                            "</svg></button><div class='dropdown-menu' aria-labelledby='dropdownMenu2'>"+updateCommentBtn+""+
                            ""+deleteCommentBtn+"</div></div></div><p class='mb-1'>"+commentArray[i].comment+"</p></div></div>");
                        }
                        else{
                            $('#allComments').append("<div class='list-group'><div class='list-group-item list-group-item-action flex-column align-items-start'><div>"+
                            "<small id='comUsname'>"+commentArray[i].username+"</small><small> · "+commentArray[i].timestamp+"</small>"+
                            "</div><p class='mb-1'>"+commentArray[i].comment+"</p></div></div>");
                            document.getElementById("addNewComment").style.visibility = "hidden";
                        }

                        //TODO: check if username still exists in database, else insert [deleteduser]

                    }
                    if (id != commentArray[i].forum_id && i == commentArray.length-1){
                        
                        $('#commentSection').html('');
                        return $('#commentSection').append("<div id='noCommentDesign'><p>No comments yet, would you like to add a new one?</p>"+
                        "<button class='btn btn-sm btn-info custom-class' id='addNewComment' data-toggle='modal' data-target='#newCommentModal'>Add Comment</button></div>")
                    }
                };
            }
        }
    });
}



var userInfoArray = [];
var captureusername;
//QUERY FOR USERNAME FIRST BEFORE ADD/UPDATE COMMENT
var userURI = 'https://localhost:44395/api/user';
function getUserName(){
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI +"/"+getuid,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            userInfoArray = data;
            
            addComment(userInfoArray.full_name)
        }
       
    });
}
//LINKED: add comment function
function addComment(getname) {
    //check if user exist in the database or not
    var uname = getname
    
    var inputC = $('#newComment').val()

    var date =  moment(new Date()).format("DD-MM-YYYY")


    var submitComment = {forum_id: forumId, comment: inputC, timestamp: date, username: uname}
    console.log(submitComment)

    $.ajax({
        type: 'POST',
        url: forumcommentURI,
        data: JSON.stringify(submitComment),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#newCommentModal').modal('hide');
            return window.location.reload();
        }
    });
}


var dateOfComment
var usename
//TODO: update comment (user can only update their own comment)
function updateComment() {

    //TODO: get timestamp and forumId info
    comment_data = {
        username: usename,
        comment: $('#updateComment').val(),
        timestamp: dateOfComment,
        forum_id: forumId,
    }

    console.log(comment_data)

    var t = confirm("Save changes?")
    if (t == true){
        $.ajax({
            type: 'PUT',
            url: forumcommentURI + "/" + currentCommentID,
            data: JSON.stringify(comment_data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $('#updateThreadModal').modal('hide');
                return window.location.reload();
            }
        });
    }
    else{
        console.log("function was not run")
    }
}

//delete comment itself
function deleteComment(comtid) {
    var deletingPost = comtid
    console.log(deletingPost)
    $.ajax({
        type: 'DELETE',
        url: forumcommentURI + "/" + deletingPost,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            alert("Your comment has been deleted.")
            window.location.reload();
        }
    });
}



$(document).on("click", "#viewComments", function () {
    currentForumID = $(this).attr('num');
    sessionStorage.setItem("forID", currentForumID)
    window.location.href = "disease-comment.html";
});

$(document).on("click", "#redirectBack", function () {
    sessionStorage.removeItem("forID");
    window.location.href = "disease-forum.html";
});

//onclick call update function when update btn is clicked
$(document).on("click", "#updComt", function () {
    currentCommentID = $(this).attr('num');

     for (y = 0; y < commentArray2.length; y++){
        if (currentCommentID == commentArray2[y].idForumComment){
            console.log(commentArray2[y])
            $('#updateCommentModal').modal('show');
            $('#updateComment').val(commentArray2[y].comment)
            dateOfComment = commentArray2[y].timestamp
            usename = commentArray2[y].username
            console.log(dateOfComment + " and " + forumId)
            console.log(usename)
        }
    }
});

//onclick call delete function when delete btn is clicked
$(document).on("click", "#delComt", function () {
    currentCommentID = $(this).attr('num');
    var check = confirm("Are you sure you want to delete your comment?")
    if (check == true){
        deleteComment(currentCommentID)
    }
    else{
        console.log("donuts")
    }
});


queryName();
showPostDetails()

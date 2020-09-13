//ALL FORUM COMMENT FUNCTIONS GO HERE:
var forumcommentURI = 'https://localhost:44395/api/forumcomments';
var forumpostURI = 'https://localhost:44395/api/forumpost';
var commentArray = []; //store all comments
var commentArray2 = [];; //display only one comment in the update modal
var currentCommentID
var forumId

//FORUM COMMENT FUNCTIONS:

//display post details based on sessionStorage ID
function showPostDetails() {

    forumId = sessionStorage.getItem("forID")
    //console.log("forum id" + forumId)

    var postDetails = []
    //console.log(forumId)
    $.ajax({
        type: 'GET',
        url: forumpostURI + "/" + forumId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            postDetails = data;
            //console.log(postDetails)
            //Iterate through the bookArray to generate rows to populate the table
            $('#headPostedBy').html('');
            $('#headPostedBy').append("<small>" + postDetails.user_name + " · " + postDetails.timestamp + "" + "</small>");
            console.log(postDetails)

            $('#descriptionBody').html('');
            $('#descriptionBody').append("<p>" + postDetails.post_description + "</p>");

            $('#headDisease').html('');
            $('#headDisease').append("<small>Back to " + postDetails.disease_name + " threads</small>");

            $('#headTitle').html('');
            $('#headTitle').append("<h5>" + postDetails.post_title + "</h5>");
            // headDescription

            // + "<br/><p>" + postDetails.post_description + "</p>"


            //TODO: check if username still exists in database, else insert [deleteduser]

            getCommentByID(postDetails.idForum);
        }
    });

}

var userInfoArray = [];
var matchingname;
//QUERY FOR USERNAME FIRST BEFORE ADD COMMENT
var userURI = 'https://localhost:44395/api/user';
function queryName() {
    var getuid = sessionStorage.getItem("user_unique_id");

    $.ajax({
        type: 'GET',
        url: userURI + "/" + getuid,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

            userInfoArray = data;
            try {
                matchingname = userInfoArray.full_name
            }
            catch (err) {
                matchingname = ""
            }
        }

    });
}

var userInfoArray = [];
var captureusername;
//LINKED: get number of comments based on post ID
var getUsernames = [];
var c = 0;
function checkIfUserExist(checkname) {
    $.ajax({
        type: 'GET',
        async: false,
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            getUsernames = data;
            for (x = 0; x < getUsernames.length; x++){
                console.log("db name: " + getUsernames[x].full_name)
                console.log("input name: " +checkname)
                if (checkname == getUsernames[x].full_name){
                   checkdeleteduser = getUsernames[x].full_name
                    console.log(getUsernames[x].full_name)
                    if (checkname != getUsernames[x].full_name && x == getUsernames.length-1){
                        checkdeleteduser = "[deleted user]"
                        return console.log("no more")
                    }

                    return checkdeleteduser = getUsernames[x].full_name
                    // c = 1
                    // console.log(checkname)
                    // return console.log(c)
                }
                else{
                    console.log(getUsernames[x].full_name)
                    checkdeleteduser = "[deleted user]"
                }
            }
        }
    });
}


var checkdeleteduser;
//get comment based on post id
function getCommentByID(id) {
    //console.log("username: " + matchingname)
    //console.log(id);
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
            if (commentArray == "") {
                $('#commentSection').html('');
                $('#commentSection').append("<div id='noCommentDesign'><p>No comments yet, would you like to add a new one?</p>" +
                    "<button class='btn btn-sm btn-info custom-class' id='addNewComment' data-toggle='modal' data-target='#newCommentModal'>Add Comment</button></div>")
            }
            else {

                //sort by latest
                commentArray.sort(function (a, b) {
                    //console.log(dateToNum(a.timestamp))
                    return dateToNum(b.timestamp) - dateToNum(a.timestamp);
                });
                function dateToNum(d) {
                    d = d.split(/[- :]/);
                    console.log(d) 
                    return Number(d[5] + d[4] + d[3] + d[2] + d[1] + d[0]);
                }

                for (i = 0; i < commentArray.length; i++) {
                    if (id == commentArray[i].forum_id) {
                        //console.log(commentArray[i])

                        // Allow update if current user is creator of comment.
                        if (matchingname == commentArray[i].username) {
                            updateCommentBtn = "<button id='updComt' class='dropdown-item' num=" + commentArray[i].idForumComment + " type='button'>Update</button>";
                        }
                        else {
                            updateCommentBtn = ""
                        }


                        var stringDate =  commentArray[i].timestamp;
                        var length = 10;
                        var trimmedDate= stringDate.substring(0, length);

                        // Allow deletion if current user is creator of comment OR admin.
                        if (matchingname == commentArray[i].username || sessionStorage.getItem("user_account_type") == "admin") {
                            deleteCommentBtn = "<button id='delComt' class='dropdown-item' num=" + commentArray[i].idForumComment + " type='button'>Delete</button>"
                            dropdown = "<div class='dropdown' style='float:right'>" +
                                "<button class='btn btn-sm btn-secondary' style='background-color:transparent; border-style: none; ' type='button'" +
                                " id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                                "<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-three-dots-vertical' fill='dark-grey' xmlns='http://www.w3.org/2000/svg'>" +
                                "<path fill-rule='evenodd' d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>" +
                                "</svg></button><div class='dropdown-menu' aria-labelledby='dropdownMenu2'>" + updateCommentBtn + "" +
                                "" + deleteCommentBtn + "</div></div>"
                        }
                        else {
                            deleteCommentBtn = "";
                            dropdown = "";
                        }

                        checkIfUserExist(commentArray[i].username)
                        console.log("user result: "+checkdeleteduser)
                        //set deleted user from "undefined" to [deleted user]
                        // if (checkdeleteduser == undefined){
                        //     checkdeleteduser = "[deleted user]"
                        // }
                        // else{
                        //     console.log(checkdeleteduser)
                        // }

                        // if (matchingname == commentArray[i].username) {
                        $('#allComments').append("<div class='list-group'><div class='list-group-item mt-1 flex-column align-items-start'><div>" +
                            "<small id='comUsname'>" + checkdeleteduser + "</small><small> · " + trimmedDate + "</small>" + dropdown + "</div><p class='mb-1'>" + commentArray[i].comment + "</p></div></div>");
                        // }
                        // else {
                        //     $('#allComments').append("<div class='list-group'><div class='list-group-item list-group-item-action flex-column align-items-start'><div>" +
                        //         "<small id='comUsname'>" + commentArray[i].username + "</small><small> · " + commentArray[i].timestamp + "</small>" +
                        //         "</div><p class='mb-1'>" + commentArray[i].comment + "</p></div></div>");
                        //     // document.getElementById("addNewComment").style.visibility = "hidden";
                        // }

                        
                    }
                    // if (id != commentArray[i].forum_id && i == commentArray.length - 1) {

                    //     $('#commentSection').html('');
                    //     return $('#commentSection').append("<div id='noCommentDesign'><p>No comments yet, would you like to add a new one?</p>" +
                    //         "<button class='btn btn-sm btn-info custom-class' id='addNewComment' data-toggle='modal' data-target='#newCommentModal'>Add Comment</button></div>")
                    // }
                };
            }
        }
    });
}



//QUERY FOR USERNAME FIRST BEFORE ADD/UPDATE COMMENT
var userURI = 'https://localhost:44395/api/user';
function getUserName() {
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI + "/" + getuid,
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

    var date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")


    var submitComment = { forum_id: forumId, comment: inputC, timestamp: date, username: uname }
    //console.log(submitComment)

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
//update comment (user can only update their own comment)
function updateComment() {

    //get timestamp and forumId info
    comment_data = {
        username: usename,
        comment: $('#updateComment').val(),
        timestamp: dateOfComment,
        forum_id: forumId,
    }

    //console.log(comment_data)

    // var t = confirm("Save changes?")
    // if (t == true) {
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
    // }
    // else {
    //     //console.log("function was not run")
    // }
}

//delete comment itself
function deleteComment(comtid) {
    var deletingPost = comtid
    //console.log(deletingPost)
    $.ajax({
        type: 'DELETE',
        url: forumcommentURI + "/" + deletingPost,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            // alert("Your comment has been deleted.")
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

$(document).on("click", "#headDisease", function () {
    sessionStorage.removeItem("forID");
    window.location.href = "disease-forum.html";
});



//onclick call update function when update btn is clicked
$(document).on("click", "#updComt", function () {
    currentCommentID = $(this).attr('num');

    for (y = 0; y < commentArray2.length; y++) {
        if (currentCommentID == commentArray2[y].idForumComment) {
            //console.log(commentArray2[y])
            $('#updateCommentModal').modal('show');
            $('#updateComment').val(commentArray2[y].comment)
            dateOfComment = commentArray2[y].timestamp
            usename = commentArray2[y].username
            //console.log(dateOfComment + " and " + forumId)
            //console.log(usename)
        }
    }
});

//onclick call delete function when delete btn is clicked
$(document).on("click", "#delComt", function () {
    currentCommentID = $(this).attr('num');
    $('#deleteCommentModal').modal('show');

    // var check = confirm("Are you sure you want to delete your comment?")
    // if (check == true) {
    // deleteComment(currentCommentID)
    // }
    // else {
    //console.log("donuts")
    // }
});


queryName();
showPostDetails()

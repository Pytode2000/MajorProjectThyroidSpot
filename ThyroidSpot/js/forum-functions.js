//FORUM POST + COMMENT FUNCTIONS


//QUERY FOR USERNAME
var userURI = 'https://localhost:44395/api/user';
var userInfoArray = [];
var uname;
function getUserName(){
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            
            userInfoArray = data;

            for (i = 0; i < userInfoArray.length; i++) {
                if (getuid == userInfoArray[i].user_id){
                    uname = userInfoArray[i].full_name;
                    return checkDiseaseName();
                }
            }
        }
    });
}

//FORUM POST FUNCTIONS:
var diseaseURI = 'https://localhost:44395/api/Disease';
var forumpostURI = 'https://localhost:44395/api/forumpost';
var forumcommentURI = 'https://localhost:44395/api/forumcomments';
var diseaseInfoArray = [];
//this variable will contain the disease name that's selected
var storage = []; //this array will define the search
var diseasename;

//QUERY DISEASE NAME
function checkDiseaseName() {
    disease_id = sessionStorage.getItem("disID");

     $.ajax({
        type: 'GET',
        url: encodeURI(diseaseURI),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            diseaseInfoArray = data

            for (x=0; x< diseaseInfoArray.length; x++){
                if (disease_id == x){
                    console.log(diseaseInfoArray[x].disease)
                    diseasename = diseaseInfoArray[x].disease
                    $('#getDiseaseName').text("Showing Forum Posts for: " + diseasename)
                    getAllForumByDisease(diseasename); //call all forum posts by disease name
                }
            }
        }
    });
}   


var postArray = []
var postArray1 = []
var secondPostArray = [];
var currentForumID; 
var getPostId;
var commentNumber;


function getAllForumByDisease() {
    console.log("retrieving all disease info...")

    
    var dname = diseasename;
    console.log(dname)
    

    $.ajax({
        type: 'GET',
        url: forumpostURI ,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            postArray = data;
            postArray1 = data;
            secondPostArray = data;
            // console.log(diseaseInfoArray)
            //clear the tbody of the table so that it will be refreshed everytime
            $('#tableBody').html('');
             
            //Iterate through the diseaseInfoArray to generate rows to populate the table
            if (postArray == ""){
                
                $('#allPosts').html('')
                return $('#allPosts').append("<div style='text-align: center'><p>No forum post created yet!</p><button>Create Forum Post</button></div>")
            }
            else{
                for (i = 0; i < postArray.length; i++) {
                    if (dname == postArray[i].disease_name){

                        getPostId = postArray[i].idForum
                        getNumberOfComments(getPostId);
                        console.log("num of comments: " + commentNumber)

                        updateButton = ""
                        if (uname == postArray[i].user_name){
                            updateButton = "<button num='" + postArray[i].idForum + "' id='updateForumbtn' class=' btn-sm btn btn-warning' data-toggle='modal'>Update</button> ";
                        }

                        $('#tableBody').append("<tr num="+ postArray[i].idForum +"><td ><a href='#' id='viewComments' num="+ postArray[i].idForum +">" + postArray[i].post_title + "</a> "+updateButton+"</td><td>" + postArray[i].user_name + "</td>"+
                        "<td>" + postArray[i].timestamp + "</td><td>" + commentNumber + "</td></tr>");

                        if (dname != postArray[i].disease_name && i == postArray.length-1){
                            
                            $('#allPosts').html('')
                            $('#allPosts').append("<div style='text-align: center'><p>No forum post created yet!</p><button>Create Forum Post</button></div>")
                            return console.log("no forum post")
                        }
                    }
                }
            }
        }
    });
}
//LINKED: get number of comments based on post ID
var getComments = [];
function getNumberOfComments(forum_id) {
    var sid = forum_id
    console.log(sid)
    $.ajax({
        type: 'GET',
        url: forumcommentURI +"?forumid="+ sid,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            getComments = data;
        }
    });
    commentNumber = getComments.length
}


//create forum 
function createNewThread() {
    
    //creating date
    var date =  moment(new Date()).format("DD-MM-YYYY")
    console.log(date);

    
    var postInstance = {
        disease_name: diseasename,
        post_title: $('#newThreadName').val(),
        post_description: $('#newThreadDesc').val(),
        user_name: uname,
        post_img : "",
        timestamp: date
    }

    console.log(postInstance)
    
     $.ajax({
        type: 'POST',
        url: forumpostURI,
        data: JSON.stringify(postInstance),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#newThreadModal').modal('hide');
            return window.location.reload();
        }
    });
}



//update forum details(only user who posted it can do so)
function updateThread() {
    console.log(currentForumID)

    //creating date
    var date =  moment(new Date()).format("DD-MM-YYYY")
    console.log(date);
     
    thread_data = {
        user_name: uname,
        disease_name: diseasename,
        post_title: $('#updateThreadName').val(),
        post_description: $('#updateThreadDesc').val(),
    }

    console.log(thread_data)

    var t = confirm("Save changes?")
    if (t == true){
        $.ajax({
            type: 'PUT',
            url: forumpostURI + "/" + currentForumID,
            data: JSON.stringify(thread_data),
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


//delete forum + all comments related to post id (YET TO TEST, DO NOT TOUCH)
var deletingPost
function deleteThread() {
    
    deletingPost = currentForumID
    console.log(currentForumID)

    var cfm = confirm("Are you sure you want to delete thread? All comments will be deleted as well...")
    if (cfm == true){
        $.ajax({
            type: 'DELETE',
            url: forumpostURI + "/" + deletingPost,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deleteAllComments();
            }
        });
    }
    else{
        console.log("Delete function was not executed")
    }
}
function deleteAllComments() {
    $.ajax({
        type: 'DELETE',
        url: forumcommentURI + "?forumid=" + deletingPost,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log("Post and all comments deleted.")
            window.location.reload();
        }
    });
}


//FORUM FILTER + SEARCH FUNCTIONS:

var stonks
//search function for posts
$(document).ready(function(){
    $('#postSearch').on("keyup", function(){
        var v = $(this).val().toLowerCase();

        $('#tableBody tr').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1)
        })
    })
})

//TODO: filter posts by recent date
function filterByActivity(value){
    console.log("test")
    console.log(secondPostArray.timestamp)
    
    //Sort by latest
    if (value == "Latest"){
        console.log("showing most recent posts...")
        secondPostArray.sort(function(a,b){
            console.log(dateToNum(a.timestamp))
            return dateToNum(b.timestamp) - dateToNum(a.timestamp);
        });
        function dateToNum(d) {
            d = d.split("-"); return Number(d[2]+d[1]+d[0]);
        }

        console.log(secondPostArray)


        $('#tableBody').html('');
        for (i = 0; i < secondPostArray.length; i++) {
            if (diseasename == secondPostArray[i].disease_name){

                getPostId = secondPostArray[i].idForum
                getNumberOfComments(getPostId);
                console.log("num of comments: " + commentNumber)

                updateButton = ""
                if (uname == secondPostArray[i].user_name){
                    updateButton = "<button num='" + secondPostArray[i].idForum + "' id='updateForumbtn' class=' btn-sm btn btn-warning' data-toggle='modal'>Update</button> ";
                }

                $('#tableBody').append("<tr num="+ secondPostArray[i].idForum +"><td ><a href='#' id='viewComments' num="+ secondPostArray[i].idForum +">" + secondPostArray[i].post_title + "</a> "+updateButton+"</td><td>" + secondPostArray[i].user_name + "</td>"+
                "<td>" + secondPostArray[i].timestamp + "</td><td>" + commentNumber + "</td></tr>");

                if (diseasename != secondPostArray[i].disease_name && i == secondPostArray.length-1){
                    
                    $('#allPosts').html('')
                    $('#allPosts').append("<div style='text-align: center'><p>No forum post created yet!</p><button>Create Forum Post</button></div>")
                    return console.log("no forum post")
                }
            }
        }

    }

    //Sort by oldest
    else{
        console.log("showing oldest posts...")

        secondPostArray.sort(function(a,b){
            return  dateToNum(a.timestamp) - dateToNum(b.timestamp);
        });
        function dateToNum(d) {
            d = d.split("-"); return Number(d[2]+d[1]+d[0]);
        }


        $('#tableBody').html('');
        for (i = 0; i < secondPostArray.length; i++) {
            if (diseasename == secondPostArray[i].disease_name){

                getPostId = secondPostArray[i].idForum
                getNumberOfComments(getPostId);

                updateButton = ""
                if (uname == secondPostArray[i].user_name){
                    updateButton = "<button num='" + secondPostArray[i].idForum + "' id='updateForumbtn' class=' btn-sm btn btn-warning' data-toggle='modal'>Update</button> ";
                }

                $('#tableBody').append("<tr num="+ secondPostArray[i].idForum +"><td ><a href='#' id='viewComments' num="+ secondPostArray[i].idForum +">" + secondPostArray[i].post_title + "</a> "+updateButton+"</td><td>" + secondPostArray[i].user_name + "</td>"+
                "<td>" + secondPostArray[i].timestamp + "</td><td>" + commentNumber + "</td></tr>");

                if (diseasename != secondPostArray[i].disease_name && i == secondPostArray.length-1){
                    
                    $('#allPosts').html('')
                    $('#allPosts').append("<div style='text-align: center'><p>No forum post created yet!</p><button>Create Forum Post</button></div>")
                    return console.log("no forum post")
                }
            }
        }

    }
}


$(document).on("click", "#addNewThread", function () {
     $('#newThreadModal').modal('show');
});

$(document).on("click", "#updateForumbtn", function () {
    currentForumID = $(this).attr('num');

    for (y = 0; y < postArray1.length; y++){
        if (currentForumID == postArray1[y].idForum){
            console.log(postArray1[y])
            $('#updateThreadModal').modal('show');
            $('#updateThreadName').val(postArray1[y].post_title)
            $('#updateThreadDesc').val(postArray1[y].post_description)
            
           
        }
    }
});

$(document).on("click", "#viewComments", function () {
    currentForumID = $(this).attr('num');
    sessionStorage.setItem("forID", currentForumID)
    window.location.href = "disease-comment.html";
});


$(document).on("click", "#redirect", function () {
    window.location.href = "disease.html";
});

getUserName();
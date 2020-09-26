//FORUM POST + COMMENT FUNCTIONS


//QUERY FOR USERNAME
var userURI = 'https://localhost:44395/api/user';
var userInfoArray = [];
var uname;
function getUserName() {
    var getuid = sessionStorage.getItem("user_unique_id");
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

            userInfoArray = data;

            for (i = 0; i < userInfoArray.length; i++) {
                if (getuid == userInfoArray[i].user_id) {
                    uname = userInfoArray[i].full_name;
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

            for (x = 0; x < diseaseInfoArray.length; x++) {
                if (disease_id == x) {

                    diseasename = diseaseInfoArray[x].disease
                    $('#getDiseaseName').append("<h4>" + diseasename+"</h4>")
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



    var dname = diseasename;


    $.ajax({
        type: 'GET',
        url: forumpostURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            //put json data into bookArray
            postArray = data;
            postArray1 = data; // for update
            secondPostArray = data;
           
            filterByActivity("Latest")
        }
    });
}


//filter posts by recent date
function filterByActivity(value) {

    //Sort by latest
    if (value == "Latest") {
        
        secondPostArray.sort(function (a, b) {

            return dateToNum(b.timestamp) - dateToNum(a.timestamp);
        });
        function dateToNum(d) {
            d = d.split("-"); 
         
            return Number(d[2] + d[1] + d[0]);
        }

        $('#newFilterRepDDL').prop('selectedIndex',0);
        $('#newFilterRepDDLMobile').prop('selectedIndex',0);
        return appendThreads()



    }

    //Sort by oldest
    else {
        

        secondPostArray.sort(function (a, b) {
            return dateToNum(a.timestamp) - dateToNum(b.timestamp);
        });
        function dateToNum(d) {
            d = d.split("-"); return Number(d[2] + d[1] + d[0]);
        }

        $('#newFilterRepDDL').prop('selectedIndex',0);
        $('#newFilterRepDDLMobile').prop('selectedIndex',0);
        return appendThreads()


    }
}


var thirdPostArray = []
function appendThreads() {
    thirdPostArray = []
    $('#tableBody').html(''); //clear desktop view of anything
    $('#allPostsMobile').html(''); //clear mobile view as well
    for (i = 0; i < secondPostArray.length; i++) {
        if (diseasename == secondPostArray[i].disease_name) {

            getPostId = secondPostArray[i].idForum
            getNumberOfComments(getPostId);
            

            thirdPostArray.push({idForum: secondPostArray[i].idForum, disease_name: secondPostArray[i].disease_name,
                post_title: secondPostArray[i].post_title, post_description: secondPostArray[i].post_description,
                user_name: secondPostArray[i].user_name, timestamp: secondPostArray[i].timestamp, repliescount: commentNumber})
            
            // Only creator can update thread.
            if (uname == secondPostArray[i].user_name) {
                updateButton = "<button num='" + secondPostArray[i].idForum + "' id='updateForumbtn' class='dropdown-item' data-toggle='modal'>Update</button> ";
            }
            else {
                updateButton = ""
            }

            // Only admin and creator can delete the thread.
            if (uname == secondPostArray[i].user_name || sessionStorage.getItem("user_account_type") == "admin") {
                deleteButton = "<button num='" + secondPostArray[i].idForum + "'  id='deleteForumbtn' class='dropdown-item' data-target='#deleteThreadModal' data-toggle='modal'>Delete</button> ";

                dropdown = "<div class='dropdown' style='float:right'>" +
                    "<button class='btn btn-sm btn-secondary' style='background-color:transparent; border-style: none; ' type='button'" +
                    " id='dropdownMenu2' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                    "<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-three-dots-vertical' fill='dark-grey' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill-rule='evenodd' d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>" +
                    "</svg></button><div class='dropdown-menu' aria-labelledby='dropdownMenu2'>" + updateButton + "" +
                    "" + deleteButton + "</div></div>"
            }
            else {
                deleteButton = ""
                dropdown = ""
            }



            //for desktop view
            $('#tableBody').append("<tr num=" + secondPostArray[i].idForum + "><td ><a href='#' id='viewComments' num=" + secondPostArray[i].idForum + ">" + secondPostArray[i].post_title + "</a></td><td>" + secondPostArray[i].user_name + "</td>" +
                "<td>" + secondPostArray[i].timestamp + "</td><td>" + commentNumber + "</td><td> " + dropdown + "</td></tr>");

            //for mobile view
            $('#allPostsMobile').append("<div num=" + secondPostArray[i].idForum + " class='list-group-item list-group-item-action flex-column align-items-start'>"+
            "<div><small id='comUsname'>" + secondPostArray[i].user_name + "</small><small> · " + secondPostArray[i].timestamp + "</small>" +dropdown+ 
            "</div><h5 class='mb-1'><a href='#' id='viewComments' num=" + secondPostArray[i].idForum + 
            ">" + secondPostArray[i].post_title + "</a></h5><p class='mb-1'>"+commentNumber+" Replies</p></div><br/>");

        
            if (diseasename != secondPostArray[i].disease_name && i == secondPostArray.length - 1) {

                $('#allPosts').html('')
                $('#allPosts').append("<div style='text-align: center'><p>No forum post created yet!</p><button>Create Forum Post</button></div>")
                return 
            }
        }
    }
}

function filterRepliesByActivity(val){
   
    if (val == "Reset"){
        //TODO: ensure filter does not reload
        location.reload()
    }
    else if (val == "Latest"){
  

        thirdPostArray.sort(function(a, b){
            return b.repliescount-a.repliescount;
        });
        secondPostArray = []
       

        for(var i = 0; i < thirdPostArray.length; i++) {
            secondPostArray.push(thirdPostArray[i]);
            thirdPostArray.splice(i, 1);
            i--; //decrement i IF we remove an item
        }

       
        appendThreads()

    }
    else if (val == "Least"){
       

        thirdPostArray.sort(function(a, b){
            return a.repliescount-b.repliescount;
        });
        secondPostArray = []
        // secondPostArray = thirdPostArray
       

        for(var i = 0; i < thirdPostArray.length; i++) {
            secondPostArray.push(thirdPostArray[i]);
            thirdPostArray.splice(i, 1);
            i--; //decrement i IF we remove an item
        }


        appendThreads()

    }
}



//LINKED: get number of comments based on post ID
var getComments = [];
function getNumberOfComments(forum_id) {
    var sid = forum_id
   
    $.ajax({
        type: 'GET',
        async: false,
        url: forumcommentURI + "/" + sid,
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
    var date = moment(new Date()).format("DD-MM-YYYY")
  


    var postInstance = {
        disease_name: diseasename,
        post_title: $('#newThreadName').val(),
        post_description: $('#newThreadDesc').val(),
        user_name: uname,
        post_img: "",
        timestamp: date
    }

 

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
  

    //creating date
    var date = moment(new Date()).format("DD-MM-YYYY")


    thread_data = {
        user_name: uname,
        disease_name: diseasename,
        post_title: $('#updateThreadName').val(),
        post_description: $('#updateThreadDesc').val(),
    }



    // var t = confirm("Save changes?")
    //     if (t == true) {
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


//delete forum + all comments related to post id (YET TO TEST, DO NOT TOUCH)
var deletingPost
function deleteThread() {

    deletingPost = currentForumID
  
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
function deleteAllComments() {
    $.ajax({
        type: 'DELETE',
        url: forumcommentURI + "?forumid=" + deletingPost,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          
            window.location.reload();
        }
    });
}


//FORUM FILTER + SEARCH FUNCTIONS:

var stonks
//search function for posts
$(document).ready(function () {
    $('#postSearch').on("keyup", function () {
        var v = $(this).val().toLowerCase();

        $('#tableBody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1)
        })
    })
})



$(document).on("click", "#addNewThread", function () {
    $('#newThreadModal').modal('show');
});

$(document).on("click", "#updateForumbtn", function () {
    currentForumID = $(this).attr('num');


    for (y = 0; y < postArray1.length; y++) {
        if (currentForumID == postArray1[y].idForum) {
            $('#updateThreadModal').modal('show');
            $('#updateThreadName').val(postArray1[y].post_title)
            $('#updateThreadDesc').val(postArray1[y].post_description)
        }
    }
    $('#updateThreadModal').modal('show');

});

$(document).on("click", "#deleteForumbtn", function () {
    currentForumID = $(this).attr('num');
});


$(document).on("click", "#viewComments", function () {
    currentForumID = $(this).attr('num');
    sessionStorage.setItem("forID", currentForumID)
    window.location.href = "disease-comment.html";
});


$(document).on("click", "#redirect", function () {
    window.location.href = "disease.html";
});

$(document).on("click", "#redirectBackText", function () {
    window.location.href = "disease.html";
});




getUserName();
checkDiseaseName();

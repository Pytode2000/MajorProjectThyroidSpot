var userURI = "https://localhost:44395/api/User";

var usersArray = [];

//// This variable will contain the Affair_Id for the affair that the user had selected
// var currentAffairId;


function getAllUsers() {
    $.ajax({
        type: 'GET',
        url: userURI,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            usersArray = data;
            $("#usersUL").html("");
            for (iteration = 0; iteration < usersArray.length; iteration++) {
                // <!-- <li><a href="#">Adele | patient</a></li>
                userListItem = "<li><a>" + usersArray[iteration].full_name + "<b style='float: right; margin-right: 2em;'>" + usersArray[iteration].account_type + "</b></a></li>"
                $('#usersUL').append(userListItem)
            }

        }
    });
}


function searchFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("usersUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function filterByAccountType() {
    var filter = document.getElementById("filterSearch");
    var filterSelected = filter.options[filterSearch.selectedIndex].value;
    // var input = document.getElementById('searchInput');
    $('input[type=text]#searchInput').val(filterSelected);

    // Call the search function.
    searchFunction();
    // Empty textbox.
    $('input[type=text]#searchInput').val("");


}


getAllUsers()
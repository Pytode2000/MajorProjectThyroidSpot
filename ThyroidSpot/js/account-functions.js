function showSignUpForm(){
    document.getElementById('signUpForm').style.display = "";
    document.getElementById('signUpFormBtn').style.display = "none";
    document.getElementById('signInFormBtn').style.display = "";
}

function showSignInForm(){
    document.getElementById('signUpForm').style.display = "none";
    document.getElementById('signUpFormBtn').style.display = "";
    document.getElementById('signInFormBtn').style.display = "none";
}

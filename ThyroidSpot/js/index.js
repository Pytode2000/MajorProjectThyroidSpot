/* Toggle between Login and Register Tab */

// GET DOM
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleLoginBtn = document.getElementById("toggleLoginBtn");
const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");

// SHOW REGISTER FORM, HIDE LOGIN FORM.
function toggleRegister() {
    loginForm.classList.add("hide");
    registerForm.classList.remove("hide");

    toggleRegisterBtn.classList.add("active");
    toggleLoginBtn.classList.remove("active");
}

// SHOW LOGIN FORM, HIDE REGISTER FORM. 
function toggleLogin() {
    registerForm.classList.add("hide");
    loginForm.classList.remove("hide");

    toggleLoginBtn.classList.add("active");
    toggleRegisterBtn.classList.remove("active");
}


/* Firebase Login and Register function */
function login() {
    const txtEmail = document.getElementById("loginEmail");
    const txtPassword = document.getElementById("loginPassword");

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.then(user => {
        sessionStorage.setItem("user_logged_in", "y")
        window.location.href = "profile.html";
    })
    promise.catch(e => console.log(e.message));
}

function register() {
    const txtEmail = document.getElementById("registerEmail");
    const txtPassword = document.getElementById("registerPassword");

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(user => {
        user.sendEmailVerification().then(function () {
            alert("A verification email has been sent to: " + user.email);
        }).catch(function (error) {
        });

        console.log(user)
    });
    promise.catch(e => console.log(e.message));
}















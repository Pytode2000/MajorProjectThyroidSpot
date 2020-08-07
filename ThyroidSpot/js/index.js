/* Toggle between Login and Register Tab */
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleLoginBtn = document.getElementById("toggleLoginBtn");
const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");

function toggleRegister() {
    loginForm.classList.add("hide");
    registerForm.classList.remove("hide");

    toggleRegisterBtn.classList.add("active");
    toggleLoginBtn.classList.remove("active");
}
function toggleLogin() {
    registerForm.classList.add("hide");
    loginForm.classList.remove("hide");

    toggleLoginBtn.classList.add("active");
    toggleRegisterBtn.classList.remove("active");
}


/* Firebase Login and Register function */

// GET DOM
const txtEmail = document.getElementById("email");
const txtPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
// const btnLogout = document.getElementById("btnLogout");


btnLogin.addEventListener("click", e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.then(user => {
        console.log(user);
        // TEST
        sessionStorage.setItem("user_logged_in", "y")
        window.location.href = "profile.html";

    })
    promise.catch(e => console.log(e.message));
});

btnRegister.addEventListener("click", e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(user => console.log(user));
    promise.catch(e => console.log(e.message));


});










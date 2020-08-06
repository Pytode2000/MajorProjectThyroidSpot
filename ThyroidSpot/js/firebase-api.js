
// sessionStorage.setItem("lastname", "Smith");
// sessionStorage.removeItem("key");
// sessionStorage.clear();
// var lastname = sessionStorage.getItem("key");



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
        window.location.href = 'profile.html';

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










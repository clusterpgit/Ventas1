//constante para login
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    console.log(email, password);
    //alert('asd');
    //console.log(email, password);

    auth2
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {

            alert('Usuario correcto');
        });
});
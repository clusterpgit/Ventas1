/*const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //alert('vamos a loguearnos');
    window.location.replace("login.html");
});*/

//constante para login
const loginForm = document.querySelector('#login-form');
//logout min35
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

            alert('Bienvenido Administrador');
            if (email == "admin@gmail.com") {
                window.location.replace("admin.html");
            } else {
                window.location.replace("vendedor.html");
            }

        });
});
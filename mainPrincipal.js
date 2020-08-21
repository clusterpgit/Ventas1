const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //alert('vamos a loguearnos');
    window.location.replace("login.html");
});
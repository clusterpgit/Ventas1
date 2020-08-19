// constante para registro
const singupForm = document.querySelector('#singup-form');

singupForm.addEventListener('submit', (e) => {
    //alert("enviando");
    e.preventDefault();

    const email = document.querySelector('#singup-email').value;
    const password = document.querySelector('#singup-password').value;

    //metodo para crear el usuario

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('registrado');
            //alert('Vendedor Registrado');
        });

});
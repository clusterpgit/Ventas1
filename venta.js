const productTable = document.querySelector('#tblProductos');
const formRegistrarV = document.getElementById('form-registrarVendedor');

const getVentas = () => fs.collection('venta').orderBy("Fecha", "asc").get();
const getVendedores = () => fs.collection('vendedores').orderBy("Nombre", "asc").get();

//hacer registro 
formRegistrarV.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log('registrando vendedor');
    const nombre = formRegistrarV['txt-nombre'].value;
    const apellido = formRegistrarV['txt-apellido'].value;
    const telefono = formRegistrarV['txt-telefono'].value;
    const email = formRegistrarV['txt-email'].value;
    const clave = formRegistrarV['txt-clave'].value;

    // metiendo el vendedor a la tabla Vendedores
    const response = await fs.collection('vendedores').doc().set({
        Nombre: nombre,
        Apellido: apellido,
        Telefono: telefono,
        Email: email,
        Clave: clave
    });


    //ahora registrandolo en sesion

    auth2
        .createUserWithEmailAndPassword(email, clave)
        .then(userCredential => {
            console.log('registrado');
            //alert('Vendedor Registrado');
        });

    location.reload();
});


window.addEventListener('DOMContentLoaded', async(e) => {

    const querySnapshot = await getVendedores();

    querySnapshot.forEach(doc => {

        const prod = doc.data();
        prod.id = doc.id;
        //console.log(prod);
        productTable.innerHTML += ` 
        <tr>
            <th scope="row">${prod.Nombre}</th> 
            <td>${prod.Apellido}</td> 
            <td>${prod.Telefono}</td>
            <td>${prod.Email}</td>
            <td>${prod.Clave}</td>
           
        </tr>
        `;


    });

    const filterInput = document.getElementById('filter');
    filterInput.addEventListener('keyup', function() {
        // var x = document.getElementById("filter");
        //x.value = x.value.toUpperCase();
        let filterValue = document.getElementById('filter').value;
        let tr = productTable.querySelectorAll('tr');
        for (let index = 0; index < tr.length; index++) {
            let val = tr[index].getElementsByTagName('td')[0];
            if (val.innerHTML.indexOf(filterValue) > -1) {
                tr[index].style.display = '';
            } else {
                tr[index].style.display = 'none';
            }

        }
        /*let tr = productTable.querySelectorAll('tr')
        }
        }*/
    });

});


//este metodo es para ver si esta iniciada la sesion para mostrar datos
//si no esta iniciada la sesion, entonces no va a mostrar datos


auth2.onAuthStateChanged(user => { // este metodo es para jalar datos de la BD si y solo si esta la sesion creada
    if (user) {
        //cargarDatos();

    } else {
        window.location.replace("index.html");
    }
});

//cerrar sesion
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
    e.preventDefault();

    auth2.signOut().then(() => {
        console.log('Sesion Cerrada');
        window.location.replace("login.html");
    });

});
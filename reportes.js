const productTable = document.querySelector('#tblProductos');

const getVentas = () => fs.collection('venta').orderBy("Fecha", "asc").get();

window.addEventListener('DOMContentLoaded', async(e) => {

    const querySnapshot = await getVentas();

    querySnapshot.forEach(doc => {

        const prod = doc.data();
        prod.id = doc.id;
        //console.log(prod);
        productTable.innerHTML += ` 
        <tr>
            <th scope="row">${prod.Fecha}</th> 
            <td>${prod.Producto}</td> 
            <td>${prod.Descripcion}</td>
            <td>${prod.PrecioU}</td>
            <td>${prod.CantidadV}</td>
            <td>${prod.Total}</td>
           
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
const productTable = document.querySelector('#tblProductos');
//llenar categorias en el select o listbox
const listaCat = document.querySelector('#lista-categorias');

const getProductos = () => fs.collection('producto').orderBy("NombreP", "asc").get();


const getCategorias = () => fs.collection('categoria').orderBy("Categoria", "asc").get();


const getProducto = (id) => fs.collection('producto').doc(id).get(); // esto es para el editar

const updateProducto = (id, productoEditado) => fs.collection('producto').doc(id).update(productoEditado);


const consultaCodigo = () => fs.collection('producto').orderBy('Codigo', 'desc').limit(1).get(); //consulta para el ultimo codigo ingresado


/////////////////CONSULTAS NUEVAS

const getProd = (codigo) => fs.collection('producto').where('Codigo', '==', codigo).get();
///////////////FIN CONSULTAS NUEVAS

let editStatus = false;
let varId = '';
let codigoU = 100;

const btnCancelar = document.querySelector('#btn-Cerrar');


btnCancelar.addEventListener('click', e => {
    e.preventDefault();
    console.log('cancelando');
    location.reload();
});

/////////////////////////////// NUEVO CODIGO PARA ARREGLARLO

const btnEliminar = document.querySelector('#btnEliminarProducto');
const formCRUD = document.getElementById('formCRUD');

//nuevo eliminar
btnEliminar.addEventListener('click', async(e) => {
    e.preventDefault();
    const codigo = formCRUD['txt-CodigoProducto'].value;
    console.log(codigo);
    const querySnapshot = await getProductos();
    querySnapshot.forEach(doc => {
        //que quede la barra de busqueda y un input text para meter el codigo
        //botones al lado que recogen el codigo y hacen el CRUD 
        const prod = doc.data();
        prod.id = doc.id;
        // console.log(prod.id);
        const cod = prod.Codigo;
        if (cod == codigo) {
            console.log('codigos iguales');
            console.log(prod.id);
            // AQUI HACER EL CRUD
            deleteProducto(prod.id);
        } else {
            console.log('codigos NO iguales');
        }
    });
});

// nuevo editar
const btnEditar = document.querySelector('#btnEditarProducto');
btnEditar.addEventListener('click', async(e) => {
    e.preventDefault();
    const codigo = formCRUD['txt-CodigoProducto'].value;
    const querySnapshot = await getProductos();
    querySnapshot.forEach(doc => {
        const prod = doc.data();
        prod.id = doc.id;
        // console.log(prod.id);
        const cod = prod.Codigo;
        if (cod == codigo) {
            console.log('codigos iguales');
            console.log(prod.id);
            // AQUI HACER EL CRUD
            // const productoE = prod.data();
            editStatus = true;
            varId = prod.id;
            formInsertar['txt-producto'].value = prod.NombreP;
            formInsertar['txt-descripcion'].value = prod.Descripcion;
            formInsertar['lista-categorias'].value = prod.Categoria;
            formInsertar['txt-cantidad'].value = prod.Cantidad;
            formInsertar['txt-precio'].value = prod.Precio;

            formInsertar['btn-Producto'].innerText = 'Update';

        } else {
            // console.log('codigos NO iguales');
        }
    });
});


//nuevo vender
const btnVender = document.querySelector('#btnVenderProducto');
btnVender.addEventListener('click', async(e) => {
    e.preventDefault();
    const codigo = formCRUD['txt-CodigoProducto'].value;
    const querySnapshot = await getProductos();
    querySnapshot.forEach(doc => {
        const prod = doc.data();
        prod.id = doc.id;
        // console.log(prod.id);
        const cod = prod.Codigo;
        if (cod == codigo) {
            console.log('codigos iguales');
            console.log(prod.id);
            // AQUI HACER EL CRUD
            // const productoE = prod.data();
            varId = prod.id;
            formVender['txt-Id'].value = prod.id;
            formVender['txt-Prod'].value = prod.NombreP;
            formVender['txt-Descripcion'].value = prod.Descripcion;
            formVender['txt-Precio'].value = prod.Precio;
            formVender['txt-Cantidad'].value = prod.Cantidad;
        } else {
            // console.log('codigos NO iguales');
        }
    });
});
//DELETE

const deleteProducto = id => fs.collection("producto").doc(id).delete();

const formVender = document.getElementById('form-vender');

window.addEventListener('DOMContentLoaded', async(e) => {

    const querySnapshot = await getProductos();
    let htmlTablaProducto = "";
    htmlTablaProducto += '<thead> <tr>  <th>Codigo</th>   <th>Producto</th> <th>Descripcion</th> <th>Categoria</th> <th>Cantidad</th> <th>Precio</th> </tr> </thead>';
    querySnapshot.forEach(doc => {
        //que quede la barra de busqueda y un input text para meter el codigo
        //botones al lado que recogen el codigo y hacen el CRUD 
        const prod = doc.data();
        prod.id = doc.id;

        //console.log(prod.id);
        productTable.innerHTML += ` 
        <tr>
            <th scope="row">${prod.Codigo}</th> 
            <td>${prod.NombreP}</td> 
            <td>${prod.Descripcion}</td>
            <td>${prod.Categoria}</td>
            <td>${prod.Cantidad}</td>
            <td>${prod.Precio}</td>
            <td>

            </td>
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

    //ahora cargar categorias categorias
    const categ = await getCategorias();
    let htmlCat = "";
    categ.forEach(doc => {
        //console.log(doc.data());
        const categoria = doc.data();
        const contenido = ` 
                    <option >${categoria.Categoria}</option>
            `;
        htmlCat += contenido;
    });
    listaCat.innerHTML = htmlCat;
});


//INSERTAR PRODUCTO
const formInsertar = document.getElementById('form-insertarProducto');
formInsertar.addEventListener('submit', async(e) => {
    e.preventDefault();
    const producto = formInsertar['txt-producto'].value;
    const descripcion = formInsertar['txt-descripcion'].value;
    const categoria = formInsertar['lista-categorias'].value;
    const cantidad = formInsertar['txt-cantidad'].value;
    const precio = formInsertar['txt-precio'].value;

    // ahora vamos a enviar datos a la BD con la variable creada en el admin.html 
    //const fs = firebase.firestore(); -> Esta variable se creo en el admin.html 
    if (!editStatus) { //aqui agregamos

        const querySnapshot = await consultaCodigo(); //solicitamos la consulta
        // si hay productoss
        if (querySnapshot.size == 0) { // vemos si hay productos
            console.log('no hay datos en Producto');

        } else {
            console.log('si hay datos en Producto');
            querySnapshot.forEach(doc => {
                const resultado = doc.data();
                console.log('ultimo codigo:');
                console.log(resultado.Codigo);
                // alert(resultado.Codigo);
                codigoU = resultado.Codigo + 1; // al ultimo codigo le sumamos uno para que se cumpla el correlativo
            });
        }

        const response = await fs.collection('producto').doc().set({
            NombreP: producto,
            Descripcion: descripcion,
            Categoria: categoria,
            Cantidad: cantidad,
            Precio: precio,
            Codigo: codigoU // si de arriba cayo en el else, ahi le suma 1 al codigoU

        });

    } else { // aqui editamos
        await updateProducto(varId, {
            NombreP: producto,
            Descripcion: descripcion,
            Categoria: categoria,
            Cantidad: cantidad,
            Precio: precio
        });
    }

    location.reload();
});

//insertar nueva categoria
const formInsertarCategoria = document.getElementById('form-registrarCategoria');

formInsertarCategoria.addEventListener('submit', async(e) => {
    e.preventDefault();
    const nuevaCat = formInsertarCategoria['txt-nuevaCategoria'].value;

    const response = await fs.collection('categoria').doc().set({
        Categoria: nuevaCat
    });
    location.reload();
});

//vender
const formVenta = document.getElementById('form-vender');

formVenta.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log('vendiendo');
    const id = formVender['txt-Id'].value;
    const cantidadDisp = formVender['txt-Cantidad'].value;
    const cantidadVender = formVender['txt-CantidadVender'].value;
    const producto = formVender['txt-Prod'].value;
    const descripcion = formVender['txt-Descripcion'].value;
    const precioUnitario = formVender['txt-Precio'].value;
    const conteoProducto = cantidadDisp - cantidadVender;

    if (conteoProducto < 0) {
        alert('Cantidad a vender excede la cantidad en inventario');
        console.log(cantidadDisp, ' < ', cantidadVender);
    } else { // hace la venta y actualizacion
        const precioTotal = precioUnitario * cantidadVender;
        var correoV = '';
        var user = firebase.auth().currentUser;
        if (user != null) {
            correoV = user.email;
        }
        // ahora vamos a obtener fecha actual
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = dd + '/' + mm + '/' + yyyy;
        alert(correoV);
        const response = await fs.collection('venta').doc().set({
            Producto: producto,
            Descripcion: descripcion,
            PrecioU: precioUnitario,
            CantidadV: cantidadVender,
            Total: precioTotal,
            Fecha: today,
            Correo: correoV
        });
        const nuevaCantidad = cantidadDisp - cantidadVender;
        // ahora editar la cantidad
        fs.collection('producto').doc(id).update({
            Cantidad: nuevaCantidad
        });
        //alert('Producto Vendido');
        location.reload();
    }


    /*
    const response = await fs.collection('categoria').doc().set({
        Categoria: nuevaCat
    });


    location.reload();*/
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



//eliminar producto
function delete_f(id) {

    console.log(id);
    //location.reload();
    let collectionRef = fs.collection('producto');
    collectionRef.where("Codigo", "==", id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            });
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });

}
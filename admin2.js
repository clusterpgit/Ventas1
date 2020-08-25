const productTable = document.querySelector('#tblProductos');
//llenar categorias en el select o listbox
const listaCat = document.querySelector('#lista-categorias');

const getProductos = () => fs.collection('producto').get();
const getCategorias = () => fs.collection('categoria').get();

const getProducto = (id) => fs.collection('producto').doc(id).get(); // esto es para el editar

const updateProducto = (id, productoEditado) =>
    fs.collection('producto').doc(id).update(productoEditado);

let editStatus = false;
let varId = '';


const btnCancelar = document.querySelector('#btn-Cerrar');

btnCancelar.addEventListener('click', e => {
    e.preventDefault();
    console.log('cancelando');
    location.reload();
});

//DELETE

const deleteProducto = id => fs.collection("producto").doc(id).delete();

window.addEventListener('DOMContentLoaded', async(e) => {

    const querySnapshot = await getProductos();
    let htmlTablaProducto = "";
    htmlTablaProducto += '<thead> <tr>  <th>Codigo</th>   <th>Producto</th> <th>Descripcion</th> <th>Categoria</th> <th>Cantidad</th> <th>Precio</th> </tr> </thead>';
    querySnapshot.forEach(doc => {

        const prod = doc.data();
        prod.id = doc.id;
        //console.log(prod);
        productTable.innerHTML += ` 
        <tr>
            <th scope="row">${prod.Codigo}</th> 
            <td>${prod.NombreP}</td> 
            <td>${prod.Descripcion}</td>
            <td>${prod.Categoria}</td>
            <td>${prod.Cantidad}</td>
            <td>${prod.Precio}</td>
            <td><button class="btn btn-primary btn-delete" data-id="${prod.id}"  >Eliminar</button> 
            <button class="btn btn-secondary btn-edit" data-id="${prod.id}"  data-toggle="modal" data-target="#exampleModal">Editar</button></td>
        </tr>
        `;
        const btnsDelete = document.querySelectorAll('.btn-delete');
        //console.log(btnsDelete);
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                //console.log(e.target.dataset.id);
                await deleteProducto(e.target.dataset.id);
                location.reload();
            });
        });

        const btnsEdit = document.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                console.log('editando');
                const productoE = await getProducto(e.target.dataset.id);

                editStatus = true;
                varId = productoE.id;
                formInsertar['txt-producto'].value = productoE.data().NombreP;
                formInsertar['txt-descripcion'].value = productoE.data().Descripcion;
                formInsertar['lista-categorias'].value = productoE.data().Categoria;
                formInsertar['txt-cantidad'].value = productoE.data().Cantidad;
                formInsertar['txt-precio'].value = productoE.data().Precio;

                formInsertar['btn-Producto'].innerText = 'Update';
            });
        });


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
    //alert('insertara');

    // ahora vamos a enviar datos a la BD con la variable creada en el admin.html 
    //const fs = firebase.firestore(); -> Esta variable se creo en el admin.html 
    if (!editStatus) {
        const response = await fs.collection('producto').doc().set({
            NombreP: producto,
            Descripcion: descripcion,
            Categoria: categoria,
            Cantidad: cantidad,
            Precio: precio

        });
    } else {
        await updateProducto(varId, {
            NombreP: producto,
            Descripcion: descripcion,
            Categoria: categoria,
            Cantidad: cantidad,
            Precio: precio
        });
    }

    console.log(producto, descripcion, categoria, cantidad, precio);
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
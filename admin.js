const productTable = document.querySelector('#tblProductos');

const eliminarP = cod => {
    alert('estamos aqui');
    console.log('Codigo que vamos a eliminar:');
    fs.collection('producto').doc(cod).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};

const setUpProductos = data => {
    if (data.length) { //.lenght para ver si hay datos en la BD
        let html = ''; //doc.NOMBRE CAMPO EN LA TABLA
        html += '<thead> <tr>  <th>Codigo</th>   <th>Producto</th> <th>Descripcion</th> <th>Categoria</th> <th>Cantidad</th> <th>Precio</th> </tr> </thead>';
        data.forEach(doc => {
            const post = doc.data(); // post es el registro completo de lo que obtiene de la bd
            //console.log(post);
            const contenido = `
                <tr>
                    <th scope="row">${post.Codigo}</th> 
                    <td>${post.NombreP}</td> 
                    <td>${post.Descripcion}</td>
                    <td>${post.Categoria}</td>
                    <td>${post.Cantidad}</td>
                    <td>${post.Precio}</td>
                    <td><button class="btn btn-danger btn-delete" >Eliminar</button>
                    <button class="btn btn-info btnEditar">Editar</button></td>
                </tr>
            `;
            html += contenido;



        });
        productTable.innerHTML = html;
        const botonesEliminar = document.querySelectorAll('.btn-delete');
        console.log(botonesEliminar);
        botonesEliminar.forEach(btn => {
            btn.addEventListener("click", () => {
                alert('Click');
                console.log('Clicked');
            });
        });
    } else {

        alert('No hay datos en BD');
    }
};

//llenar categorias en el select o listbox
const listaCat = document.querySelector('#lista-categorias');
const setCategorias = data => {
    if (data.length) {
        let html = "";
        data.forEach(doc => {
            const post = doc.data();
            // console.log(post);
            const contenido = ` 
                    <option >${post.Categoria}</option>
            `;
            html += contenido;
        });
        listaCat.innerHTML = html;
    } else {

        alert('No hay datos en BD');
    }
};


//este metodo es para ver si esta iniciada la sesion para mostrar datos
//si no esta iniciada la sesion, entonces no va a mostrar datos
auth2.onAuthStateChanged(user => { // este metodo es para jalar datos de la BD si y solo si esta la sesion creada
    if (user) {
        console.log('sesion iniciada');
        fs.collection('producto')
            .get()
            .then((snapshot) => {
                //console.log(snapshot.docs); // este snapshot.docs me devuelve los datos que estan en la BD en array
                setUpProductos(snapshot.docs);
                setCategorias(snapshot.docs);
            });
        fs.collection('categoria')
            .get()
            .then((snapshot) => {
                //console.log(snapshot.docs); // este snapshot.docs me devuelve los datos que estan en la BD en array
                setCategorias(snapshot.docs);
            });

    } else {
        console.log('sesion cerrada');
        //alert('Debe iniciar sesion');
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

    const response = await fs.collection('producto').doc().set({
        NombreP: producto,
        Descripcion: descripcion,
        Categoria: categoria,
        Cantidad: cantidad,
        Precio: precio

    });
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
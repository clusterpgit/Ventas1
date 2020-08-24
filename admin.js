const productTable = document.querySelector('#tblProductos');
const setUpProductos = data => {
    if (data.length) { //.lenght para ver si hay datos en la BD
        let html = ''; //doc.NOMBRE CAMPO EN LA TABLA
        html += '<thead> <tr>  <th>Codigo</th>   <th>Producto</th> <th>Descripcion</th> <th>Categoria</th> <th>Cantidad</th> <th>Precio</th> </tr> </thead>';
        data.forEach(doc => {
            const post = doc.data();
            //console.log(post);
            const contenido = `
                <tr>
                    <td>${post.Codigo}</td> 
                    <td>${post.NombreP}</td> 
                    <td>${post.Descripcion}</td>
                    <td>${post.Categoria}</td>
                    <td>${post.Cantidad}</td>
                    <td>${post.Precio}</td>
                    <td><h4>Hola</h4></td>
                </tr>
            `;
            html += contenido;
        });
        productTable.innerHTML = html;
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
auth2.onAuthStateChanged(user => { // este metodo es para jalar datos de la BD
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
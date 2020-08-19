const productTable = document.querySelector('#tblProductos');
const setUpProductos = data => {
    if (data.length) { //.lenght para ver si hay datos en la BD
        let html = ''; //doc.NOMBRE CAMPO EN LA TABLA
        html += '<thead> <tr> <th>Producto</th> <th>Descripcion</th> <th>Categoria</th> <th>Cantidad</th> <th>Precio</th> </tr> </thead>';
        data.forEach(doc => {
            const post = doc.data();
            console.log(post);
            const contenido = `
                <tr>
                    <td>${post.NombreP}</td> 
                    <td>${post.Descripcion}</td>
                    <td>${post.Categoria}</td>
                    <td>${post.Cantidad}</td>
                    <td>${post.Precio}</td>
                </tr>
            `;
            html += contenido;
        });
        productTable.innerHTML = html;
    } else {

        alert('No hay datos en BD');
    }
};

//este metodo es para ver si esta iniciada la sesion para mostrar datos
//si no esta iniciada la sesion, entonces no va a mostrar datos
auth2.onAuthStateChanged(user => {
    if (user) {
        console.log('sesion iniciada');
        fs.collection('producto')
            .get()
            .then((snapshot) => {
                console.log(snapshot.docs); // este snapshot.docs me devuelve los datos que estan en la BD en array
                setUpProductos(snapshot.docs);
            });
    } else {
        console.log('sesion cerrada');
    }
});
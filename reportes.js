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
            <td>${prod.Correo}</td> 
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


//REPORTE CSV
const btnDescargarReporte = document.querySelector('#btnDescargarReporte');
// Id Tabla= tblProductos 
// productTable
btnDescargarReporte.addEventListener('click', (e) => {
    e.preventDefault();
    var rows = productTable.querySelectorAll('tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(';'));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + 'REPORTE' + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //alert('clickeado');
});
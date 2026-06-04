// Variable global compartida (puedes usar localStorage para persistencia)
let productos = JSON.parse(localStorage.getItem('productos')) || [];

document.getElementById('form-nuevo-producto').addEventListener('submit', function(e) {
    e.preventDefault();

    const archivo = document.getElementById('input-imagen').files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const nuevoProducto = {
            id: Date.now(),
            nombre: document.getElementById('input-nombre').value,
            precio: parseFloat(document.getElementById('input-precio').value),
            descripcion: document.getElementById('input-descripcion').value,
            stock: parseInt(document.getElementById('input-stock').value),
            imagen: event.target.result // Base64
        };

        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));
        
        alert('Producto agregado');
        this.reset();
        
        // Refrescar la tienda si existe la función
        if (typeof cargarTienda === 'function') cargarTienda();
    };

    if (archivo) reader.readAsDataURL(archivo);
});
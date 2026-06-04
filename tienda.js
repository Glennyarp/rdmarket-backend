function cargarTienda() {
    const contenedor = document.getElementById('contenedor-tienda');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-tarjeta';
        tarjeta.innerHTML = `
            <div class="producto-imagen-contenedor">
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-meta">
                    <span class="producto-precio">$${producto.precio.toLocaleString()}</span>
                    <span class="producto-stock">Stock: ${producto.stock}</span>
                </div>
                <button class="btn-agregar-carrito">Agregar al Carrito</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener('DOMContentLoaded', cargarTienda);
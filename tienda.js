// Base de datos de productos con soporte para imágenes y stock
const productos = [
    {
        id: 1,
        nombre: "Zapatillas Urban Pro",
        precio: 4500,
        descripcion: "Comodidad máxima y diseño vanguardista para el día a día.",
        stock: 12,
        imagen: "images/zapatillas.jpg" // Cambia por tus imágenes reales o URLs de internet
    },
    {
        id: 2,
        nombre: "Mochila Tech Waterproof",
        precio: 2900,
        descripcion: "Compartimento acolchado para laptop y material impermeable.",
        stock: 5,
        imagen: "images/mochila.jpg"
    },
    {
        id: 3,
        nombre: "Reloj Minimalist Black",
        precio: 7200,
        descripcion: "Carcasa de acero inoxidable y correa de cuero legítimo.",
        stock: 8,
        imagen: "images/reloj.jpg"
    }
];

// Capturamos el contenedor usando la clase que definiste en tu CSS para la rejilla
const gridProductos = document.querySelector('.productos-grid');

function cargarTienda() {
    if (!gridProductos) return;
    gridProductos.innerHTML = "";

    productos.forEach(producto => {
        // Creamos el elemento tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('producto-tarjeta');

        // Renderizamos usando exactamente tus clases CSS
        tarjeta.innerHTML = `
            <div class="producto-imagen-contenedor">
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://placehold.co/400x300/f1f5f9/64748b?text=Sin+Foto'">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-meta">
                    <span class="producto-precio">$${producto.precio.toLocaleString()}</span>
                    <span class="producto-stock">Stock: ${producto.stock}</span>
                </div>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;

        gridProductos.appendChild(tarjeta);
    });
}

// Función para interactuar con el botón
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        console.log(`Producto añadido: ${producto.nombre}`);
        // Aquí puedes vincular la lógica existente que abre tu carrito modal
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarTienda);
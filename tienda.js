const API_URL = 'https://rdmarket-backend-production.up.railway.app/api/productos';
const TELEFONO_NEGOCIO = '18095555555'; // Tu número de WhatsApp aquí

let productosCatalogo = [];
let carrito = [];

// 1. OBTENER PRODUCTOS DESDE EL BACKEND EN RAILWAY
async function obtenerProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');
        productosCatalogo = await respuesta.json();
        renderizarCatalogo();
    } catch (error) {
        console.error('❌ Error al conectar con Railway:', error);
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">
                <h3>❌ Error de Conexión</h3>
                <p>No se pudo sincronizar el catálogo con la base de datos.</p>
            </div>
        `;
    }
}

// 2. DIBUJAR LOS PRODUCTOS EN LA PÁGINA
function renderizarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    productosCatalogo.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-tarjeta';
        const sinStock = prod.stock <= 0;

        tarjeta.innerHTML = `
            <div class="producto-info">
                <h3 style="text-transform: capitalize;">${prod.nombre}</h3>
                <p class="producto-descripcion">${prod.descripcion || 'Sin descripción disponible'}</p>
                <div class="producto-meta">
                    <span class="producto-precio">RD$ ${Number(prod.precio).toLocaleString()}</span>
                    <span class="producto-stock">Stock: ${prod.stock} u.</span>
                </div>
            </div>
            <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${prod.id})" ${sinStock ? 'disabled style="background:#cbd5e0; cursor:not-allowed;"' : ''}>
                ${sinStock ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// 3. AÑADIR ELEMENTOS AL CARRITO
function agregarAlCarrito(id) {
    const producto = productosCatalogo.find(p => p.id === id);
    if (!producto || producto.stock <= 0) return;

    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert(`Límite alcanzado. Solo hay ${producto.stock} unidades en existencia.`);
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarInterfazCarrito();
}

// 4. ACTUALIZAR PANEL VISUAL DEL CARRITO
function actualizarInterfazCarrito() {
    const contenedorElementos = document.getElementById('elementos-carrito');
    const contadorArticulos = document.getElementById('contador-articulos');
    const precioTotalTxt = document.getElementById('precio-total');

    contadorArticulos.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contenedorElementos.innerHTML = '';

    if (carrito.length === 0) {
        contenedorElementos.innerHTML = '<p style="color: #a0aec0; text-align: center; margin-top: 20px;">El carrito está vacío.</p>';
        precioTotalTxt.textContent = 'RD$ 0';
        return;
    }

    let totalDinero = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalDinero += subtotal;

        const filaItem = document.createElement('div');
        filaItem.className = 'carrito-item';
        filaItem.innerHTML = `
            <div>
                <span class="carrito-item-titulo"><strong>${item.nombre}</strong></span><br>
                <small style="color:#718096">RD$ ${item.precio} x ${item.cantidad}</small>
            </div>
            <div class="carrito-item-controles">
                <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span style="margin: 0 10px; font-weight:600;">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
        `;
        contenedorElementos.appendChild(filaItem);
    });

    precioTotalTxt.textContent = `RD$ ${totalDinero.toLocaleString()}`;
}

// 5. MODIFICAR CANTIDADES EN EL CARRITO
function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    const prodOriginal = productosCatalogo.find(p => p.id === id);
    if (!item || !prodOriginal) return;

    if (item.cantidad + cambio <= 0) {
        carrito = carrito.filter(i => i.id !== id);
    } else if (item.cantidad + cambio <= prodOriginal.stock) {
        item.cantidad += cambio;
    } else {
        alert('No hay suficiente stock en el inventario.');
    }
    actualizarInterfazCarrito();
}

// 6. VACIAR CARRITO
function vaciarCarrito() {
    if (carrito.length === 0) return;
    carrito = [];
    actualizarInterfazCarrito();
}

// 7. FLUJO DE VENTANA MODAL (CHECKOUT)
function abrirModalPedido() {
    if (carrito.length === 0) return alert('Agrega un producto para continuar.');
    
    document.getElementById('modal-resumen-productos').innerHTML = carrito.map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span style="text-transform:capitalize;">${i.nombre} (x${i.cantidad})</span>
            <span>RD$ ${(i.precio * i.cantidad).toLocaleString()}</span>
        </div>
    `).join('');
    
    document.getElementById('modal-total-pago').textContent = document.getElementById('precio-total').textContent;
    document.getElementById('modal-checkout').style.display = 'flex';
}

function cerrarModalPedido() {
    document.getElementById('modal-checkout').style.display = 'none';
}

// 8. ENVIAR FORMULARIO, DESCONTAR STOCK Y ENTRAR A WHATSAPP
async function enviarPedidoWhatsApp(event) {
    event.preventDefault();

    const nombre = document.getElementById('usr-nombre').value;
    const telefono = document.getElementById('usr-telefono').value;
    const direccion = document.getElementById('usr-direccion').value;

    // Actualización directa de stock en Railway
    try {
        for (const item of carrito) {
            const nuevoStock = item.stock - item.cantidad;
            await fetch(`${API_URL}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    precio: item.precio,
                    stock: nuevoStock
                })
            });
        }
    } catch (error) {
        console.warn('⚠️ Falló la rebaja de stock, procesando mensaje de WhatsApp de igual modo.', error);
    }

    // Armar mensaje estructurado
    let txt = `*🛒 NUEVA ORDEN - RDMARKET*\n\n`;
    txt += `*Cliente:* ${nombre}\n`;
    txt += `*Teléfono:* ${telefono}\n`;
    txt += `*Dirección:* ${direccion}\n\n`;
    txt += `*Pedido:*\n`;
    carrito.forEach(i => txt += `- ${i.nombre} (x${i.cantidad})\n`);
    txt += `\n*Total General: ${document.getElementById('precio-total').textContent}*`;

    // Abrir WhatsApp en nueva pestaña
    window.open(`https://wa.me/${TELEFONO_NEGOCIO}?text=${encodeURIComponent(txt)}`, '_blank');

    // Limpieza e inicialización postventa
    carrito = [];
    actualizarInterfazCarrito();
    cerrarModalPedido();
    document.getElementById('form-checkout').reset();
    obtenerProductos();
}

document.addEventListener('DOMContentLoaded', obtenerProductos);
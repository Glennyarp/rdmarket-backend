
// Validar de inmediato si el usuario pasó por la pantalla de login
if (sessionStorage.getItem('adminAutenticado') !== 'true') {
    window.location.href = "login.html";
}


const API_URL = 'https://rdmarket-backend-production.up.railway.app/api/productos';

let inventario = [];

async function obtenerInventario() {
    const tbody = document.getElementById('tabla-cuerpo-productos');
    if (!tbody) return;

    try {
        const res = await fetch(API_URL);
        inventario = await res.json();
        renderizarTabla();
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión con Railway</td></tr>`;
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('tabla-cuerpo-productos');
    tbody.innerHTML = '';

    if (inventario.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay productos registrados.</td></tr>`;
        return;
    }

    inventario.forEach(prod => {
        const tr = document.createElement('tr');
        const stockClase = prod.stock <= 5 ? 'stock-bajo' : 'stock-alto';

        tr.innerHTML = `
            <td>#${prod.id}</td>
            <td>
                <strong style="text-transform:capitalize;">${prod.nombre}</strong><br>
                <small style="color:#718096;">${prod.descripcion || 'Sin descripción'}</small>
            </td>
            <td>RD$ ${Number(prod.precio).toLocaleString()}</td>
            <td><span class="badge-stock ${stockClase}">${prod.stock} u.</span></td>
            <td>
                <button class="btn-tabla-eliminar" onclick="eliminarProducto(${prod.id})">🗑️ Borrar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function guardarProducto(event) {
    event.preventDefault();

    const nuevoProd = {
        nombre: document.getElementById('prod-nombre').value,
        descripcion: document.getElementById('prod-descripcion').value,
        precio: parseFloat(document.getElementById('prod-precio').value),
        stock: parseInt(document.getElementById('prod-stock').value)
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProd)
        });

        if (res.ok) {
            document.getElementById('form-agregar-producto').reset();
            obtenerInventario();
        }
    } catch (err) {
        alert('Error al guardar.');
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Deseas eliminar este artículo?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) obtenerInventario();
    } catch (err) {
        alert('Error al eliminar.');
    }
}

document.addEventListener('DOMContentLoaded', obtenerInventario);
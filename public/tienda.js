document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/productos')
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById('lista-productos');
            if (!data || data.length === 0) {
                contenedor.innerHTML = '<p>No hay productos cargados todavía.</p>';
                return;
            }
            contenedor.innerHTML = '';
            data.forEach(prod => {
                const div = document.createElement('div');
                div.className = 'producto-card';
                div.innerHTML = `<h3>${prod.nombre}</h3><p>Precio: $${prod.precio}</p><button>Comprar</button>`;
                contenedor.appendChild(div);
            });
        })
        .catch(err => console.error('Error al conectar:', err));
});
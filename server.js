// 1. CARGA DE VARIABLES DE ENTORNO (Esencial para leer el archivo .env en desarrollo local)
require('dotenv').config();

// 2. IMPORTACIÓN DE MÓDULOS
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 3. INICIALIZACIÓN DE LA APP Y MIDDLEWARES
const app = express();
app.use(cors());
app.use(express.json());

// 4. CONFIGURACIÓN HÍBRIDA DE LA BASE DE DATOS (MySQL)
// Busca primero las variables nativas de Railway; si no existen, usa las de tu .env local.
const db = mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306
});

// 5. CONEXIÓN A LA BASE DE DATOS
db.connect((err) => {
    if (err) {
        console.error('❌ Error crítico al conectar a la base de datos:', err.message);
        return;
    }
    console.log('✅ ¡Conectado exitosamente a la base de datos MySQL!');
});

// =========================================================================
// 6. SECCIÓN DE RUTAS
// =========================================================================

// Ruta raíz para verificar que el backend responda en internet
app.get('/', (req, res) => {
    res.send('El backend de RDMARKET está funcionando correctamente.');
});

// RUTA POST: Recibe los datos de admin.html y los guarda en la base de datos
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;

    // Consulta SQL para insertar los datos en tu tabla productos
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, descripcion, precio, stock], (err, result) => {
        if (err) {
            console.error('❌ Error al insertar producto:', err.message);
            return res.status(500).json({ message: 'Hubo un error al guardar el producto en la base de datos.' });
        }
        
        // Respuesta exitosa que activará el alert() en tu frontend
        res.status(201).json({ message: '¡Producto guardado exitosamente en RDMARKET!' });
    });
});

// NUEVA RUTA GET: Consulta la base de datos y devuelve todos los productos para index.html
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener productos:', err.message);
            return res.status(500).json({ message: 'Hubo un error al consultar los productos de la base de datos.' });
        }

        // Devuelve la lista completa de productos en formato JSON
        res.status(200).json(results);
    });
});

// =========================================================================
// 7. INICIO DEL SERVIDOR (Configuración crítica para el binding de Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo y escuchando en el puerto ${PORT}`);
});
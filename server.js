// 1. CARGA DE VARIABLES DE ENTORNO
require('dotenv').config();

// 2. IMPORTACIÓN DE MÓDULOS
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Módulo necesario para manejar rutas de archivos

// 3. INICIALIZACIÓN DE LA APP Y MIDDLEWARES
const app = express();
app.use(cors());
app.use(express.json());

// 3.5. SERVIR ARCHIVOS ESTÁTICOS
// Esto le dice a Express que busque tus archivos HTML, CSS y JS en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 4. CONFIGURACIÓN HÍBRIDA DE LA BASE DE DATOS (MySQL)
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

// Ruta raíz: Sirve tu archivo index.html automáticamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// RUTA POST: Guardar productos
app.post('/productos', (req, res) => {
    const { nombre, text, precio, stock } = req.body;
    const descripcionFinal = text || req.body.descripcion;

    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, descripcionFinal, precio, stock], (err, result) => {
        if (err) {
            console.error('❌ Error al insertar producto:', err.message);
            return res.status(500).json({ message: 'Hubo un error al guardar el producto.' });
        }
        res.status(201).json({ message: '¡Producto guardado exitosamente en RDMARKET!' });
    });
});

// RUTA GET: Obtener productos
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener productos:', err.message);
            return res.status(500).json({ message: 'Hubo un error al consultar la base de datos.' });
        }
        res.status(200).json(results);
    });
});

// 7. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
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
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
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
// 6. AQUÍ VAN TUS RUTAS (GET /productos, POST /agregar, etc.)
// =========================================================================

app.get('/', (req, res) => {
    res.send('El backend de RDMARKET está funcionando correctamente.');
});


// =========================================================================
// 7. INICIO DEL SERVIDOR (Configuración crítica para el binding de Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo y escuchando en el puerto ${PORT}`);
});
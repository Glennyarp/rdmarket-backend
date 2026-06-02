// Asegúrate de que las variables de entorno se carguen
require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN QUE FUNCIONARÁ EN LA NUBE Y EN LOCAL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar: ' + err.stack);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});

// ... tus rutas (GET /productos y POST /agregar-producto) ...

// ESTA PARTE ES CRÍTICA:
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
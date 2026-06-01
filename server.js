const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // ¡Es vital que esta línea esté aquí!

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'rd_emarket'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

// RUTA PARA LEER (GET)
app.get('/productos', (req, res) => {
    db.query("SELECT * FROM productos", (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// RUTA PARA AGREGAR (POST) - ¡ASEGÚRATE DE QUE ESTO ESTÉ EN TU ARCHIVO!
app.post('/agregar-producto', (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const sql = "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, descripcion, precio, stock], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Producto guardado con éxito" });
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
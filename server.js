const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicializar la base de datos
db.createTables();

app.post('/registrar', async (req, res) => {
  const { nombre, dni, descriptor, photoData } = req.body;
  if (!nombre || !dni || !descriptor || !photoData) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  // Decodificar la imagen Base64 y guardarla
  const base64Data = photoData.replace(/^data:image\/png;base64,/, "");
  const rutaFoto = `uploads/${dni}_${Date.now()}.png`;
  
  fs.writeFile(rutaFoto, base64Data, 'base64', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar la foto.' });
    }
  });

  try {
    const query = 'INSERT INTO estudiantes (nombre, dni, photo_descriptor, ruta_foto) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [nombre, dni, descriptor, rutaFoto];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el estudiante.' });
  }
});

//Endpoint de estudiantes para incluir la ruta de la foto ***
app.get('/estudiantes', async (req, res) => {
  try {
    // Ahora también seleccionamos ruta_foto
    const result = await db.query('SELECT id, nombre, dni, photo_descriptor, ruta_foto FROM estudiantes');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los estudiantes.' });
  }
});

// Endpoint para registrar un acceso a la biblioteca
app.post('/logs-acceso', async (req, res) => {
  const { estudiante_id } = req.body;
  if (!estudiante_id) {
    return res.status(400).json({ error: 'Falta el ID del estudiante.' });
  }
  try {
    const query = 'INSERT INTO logs_acceso (estudiante_id) VALUES ($1)';
    await db.query(query, [estudiante_id]);
    res.status(201).json({ message: 'Acceso registrado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el acceso.' });
  }
});

app.get('/logs', async (req, res) => {
    try {
        const query = `
            SELECT s.nombre, s.dni, a.timestamp 
            FROM logs_acceso a
            JOIN estudiantes s ON a.estudiante_id = s.id
            ORDER BY a.timestamp DESC;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros de acceso.' });
    }
});

app.get('/', (req, res) => {
    res.redirect('/idex.html');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
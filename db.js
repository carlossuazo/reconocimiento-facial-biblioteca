const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'biblioteca_db',
  password: '123456',
  port: 5432,
});

// Crear las tablas si no existen
const createTables = async () => {
  const studentTable = `
    CREATE TABLE IF NOT EXISTS estudiantes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      dni VARCHAR(50) UNIQUE NOT NULL,
      photo_descriptor REAL[] NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ruta_foto VARCHAR(255)
    );
  `;
  const logTable = `
    CREATE TABLE IF NOT EXISTS logs_acceso (
      id SERIAL PRIMARY KEY,
      estudiante_id INTEGER REFERENCES estudiantes(id),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(studentTable);
    await pool.query(logTable);
    console.log('Tablas aseguradas en la base de datos.');
  } catch (err) {
    console.error('Error creando las tablas', err.stack);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables,
};
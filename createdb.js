const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null, 
});

const dbName = 'imagine3';

const createUsuariosTableSQL = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL
  )
`;

const createTareasTableSQL = `
  CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_vencimiento DATE,
    estado VARCHAR(50)
  )
`;

connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
  if (err) {
    console.error('Error al crear la base de datos:', err);
  } else {
    console.log('Base de datos creada exitosamente');
    
    connection.changeUser({ database: dbName }, (err) => {
      if (err) {
        console.error('Error al cambiar a la base de datos:', err);
      } else {
        console.log('Conexión a la base de datos exitosa');
        
        connection.query(createUsuariosTableSQL, (err) => {
          if (err) {
            console.error('Error al crear la tabla de usuarios:', err);
          } else {
            console.log('Tabla de usuarios creada exitosamente');
          }
        });

        connection.query(createTareasTableSQL, (err) => {
          if (err) {
            console.error('Error al crear la tabla de tareas:', err);
          } else {
            console.log('Tabla de tareas creada exitosamente');
          }

          connection.end();
        });
      }
    });
  }
});



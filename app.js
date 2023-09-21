const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(bodyParser.json());

// Endpoint de registro
app.post('/registro', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  // Hashear la contraseña antes de guardarla en la base de datos
 const hashedContrasena = await bcrypt.hash(contrasena, 10);


  const sql = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
  const values = [nombre, email, hashedContrasena];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      res.status(500).json({ error: 'Error al registrar el usuario' });
    } else {
      console.log('Usuario registrado con éxito');
      res.status(201).json({nombre, email , mensaje: 'Usuario registrado con éxito' });
    }
  });
});

// Endpoint de inicio de sesión
app.post('/inicio-sesion', (req, res) => {
  const { email, contrasena } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      res.status(500).json({ error: 'Error al buscar el usuario' });
    } else {
      if (results.length > 0) {
        const usuario = results[0];

        // Verificar la contraseña almacenada con la contraseña proporcionada
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (contrasenaValida) {
          // Generar un token JWT
          const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secreto', { expiresIn: '1h' });

          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: 'Credenciales incorrectas' });
        }
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    }
  });
});

// Agregar una tarea
app.post('/tareas', (req, res) => {
  const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

  // Insertar la tarea en la base de datos
  db.query(
    'INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, estado) VALUES (?, ?, ?, ?)',
    [titulo, descripcion, fecha_vencimiento, estado],
    (err, results) => {
      if (err) {
        console.error('Error al agregar la tarea:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(201).json({ message: 'Tarea agregada exitosamente' });
      }
    }
  );
});

// Editar una tarea por ID
app.put('/tareas/:id', (req, res) => {
  const taskId = req.params.id;
  const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

  // Actualizar la tarea en la base de datos
  db.query(
    'UPDATE tareas SET titulo=?, descripcion=?, fecha_vencimiento=?, estado=? WHERE id=?',
    [titulo, descripcion, fecha_vencimiento, estado, taskId],
    (err, results) => {
      if (err) {
        console.error('Error al editar la tarea:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.json({ message: 'Tarea editada exitosamente' });
      }
    }
  );
});

// Eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {
  const taskId = req.params.id;

  // Eliminar la tarea de la base de datos
  db.query('DELETE FROM tareas WHERE id=?', [taskId], (err, results) => {
    if (err) {
      console.error('Error al eliminar la tarea:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Tarea eliminada exitosamente' });
    }
  });
});

// Listar todas las tareas
app.get('/tareas', (req, res) => {
  // Consultar todas las tareas en la base de datos
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) {
      console.error('Error al obtener las tareas:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(results); // Enviar las tareas como respuesta
    }
  });
});



// Iniciar el servidor
const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

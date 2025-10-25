const express = require('express');
const app = express();

// Puerto de escucha
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON (opcional)
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

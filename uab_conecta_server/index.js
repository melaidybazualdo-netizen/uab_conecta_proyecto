global.crypto = require('crypto'); // <-- Agregar al inicio absoluto
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentación Swagger (Vínculo directo sin caché)
app.use('/api-docs', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocument, { swaggerOptions: { url: '/api-docs/swagger.json' } }));

// Endpoint JSON explícito para Swagger UI
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Conexión MongoDB y Servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uab_conecta';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Conectado exitosamente');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📄 Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });
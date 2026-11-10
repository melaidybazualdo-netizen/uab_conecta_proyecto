const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Obtener token desde la cabecera 'Authorization' o 'x-auth-token'
  let token = req.header('Authorization') || req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
  }

  // Si contiene la palabra 'Bearer', removerla limpiamente
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  try {
    // Usar la misma clave por defecto ('secreto') que en authController.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    
    // Asignar a ambas propiedades para evitar errores de undefined en los controladores
    req.usuario = decoded;
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token no válido o expirado' });
  }
};
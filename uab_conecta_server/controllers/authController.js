const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Encriptar contraseña limpiando espacios
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    user = new User({
      nombre: (nombre || 'Usuario').trim(),
      email: cleanEmail,
      password: hashedPassword,
      rol: rol || 'estudiante'
    });

    await user.save();

    const payload = { id: user._id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', { expiresIn: '1d' });

    res.status(201).json({
      token,
      usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    // 1. Buscar usuario
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña ingresada con el hash de MongoDB
    const esPasswordValida = await bcrypt.compare(cleanPassword, user.password);
    if (!esPasswordValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // 3. Generar token
    const payload = { id: user._id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', { expiresIn: '1d' });

    res.json({
      token,
      usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

const getPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};

module.exports = { register, login, getPerfil };
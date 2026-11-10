const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['estudiante', 'docente', 'admin'], default: 'estudiante' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
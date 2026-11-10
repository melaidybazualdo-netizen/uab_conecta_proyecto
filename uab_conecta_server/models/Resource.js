const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true,
    trim: true
  },
  descripcion: { 
    type: String, 
    required: true 
  },
  categoria: { 
    type: String, 
    required: true,
    default: 'Secretaría Académica'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_revision', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  autor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
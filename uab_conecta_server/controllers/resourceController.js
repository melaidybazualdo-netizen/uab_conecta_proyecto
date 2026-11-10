const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('autor', 'nombre email rol');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener trámites', error: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;

    // Obtiene los datos del usuario autenticado de forma segura (soporta req.user y req.usuario)
    const usuarioAuth = req.user || req.usuario;

    if (!usuarioAuth || !usuarioAuth.id) {
      return res.status(401).json({ mensaje: 'No autorizado: Falta información de usuario en la solicitud' });
    }

    const newResource = new Resource({
      titulo,
      descripcion,
      categoria: categoria || 'Secretaría Académica',
      autor: usuarioAuth.id
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al solicitar trámite', error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ mensaje: 'Trámite no encontrado' });
    }

    const usuarioAuth = req.user || req.usuario;
    if (!usuarioAuth) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const autorId = (resource.autor._id || resource.autor).toString();
    const usuarioActualId = (usuarioAuth.id || usuarioAuth._id).toString();

    if (autorId !== usuarioActualId && usuarioAuth.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este trámite' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Trámite eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar trámite', error: error.message });
  }
};
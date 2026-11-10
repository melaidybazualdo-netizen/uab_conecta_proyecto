const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Obtener todos los trámites
 *     tags: [Trámites]
 *     responses:
 *       200:
 *         description: Lista de trámites devuelta
 *   post:
 *     summary: Crear un nuevo trámite
 *     tags: [Trámites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trámite creado exitosamente
 */
router.get('/', resourceController.getResources);
router.post('/', authMiddleware, resourceController.createResource);

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Eliminar un trámite por ID
 *     tags: [Trámites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trámite eliminado exitosamente
 */
router.delete('/:id', authMiddleware, resourceController.deleteResource);

module.exports = router;
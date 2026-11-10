const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API REST UAB Conecta',
    version: '1.0.0',
    description: 'Documentación técnica e interactiva de endpoints para la Segunda Entrega del Proyecto Integrador',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Servidor Local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Registrar un nuevo usuario',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Mel Bazualdo' },
                  email: { type: 'string', example: 'mel.bazualdo@uab.edu' },
                  password: { type: 'string', example: '1234567' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario registrado exitosamente' },
          400: { description: 'El usuario ya existe' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión de usuario',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'mel.bazualdo@uab.edu' },
                  password: { type: 'string', example: '1234567' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Inicio de sesión exitoso' },
          400: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/resources': {
      get: {
        summary: 'Obtener todos los trámites',
        tags: ['Trámites'],
        responses: {
          200: { description: 'Lista de trámites devuelta exitosamente' },
        },
      },
      post: {
        summary: 'Crear un nuevo trámite',
        tags: ['Trámites'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string', example: 'Certificado de Notas' },
                  descripcion: { type: 'string', example: 'Solicitud de notas de la carrera' },
                  categoria: { type: 'string', example: 'Secretaría Académica' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Trámite creado exitosamente' },
        },
      },
    },
    '/resources/{id}': {
      delete: {
        summary: 'Eliminar un trámite por ID',
        tags: ['Trámites'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID del trámite a eliminar',
          },
        ],
        responses: {
          200: { description: 'Trámite eliminado correctamente' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
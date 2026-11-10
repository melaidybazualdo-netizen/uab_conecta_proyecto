UAB Conecta - Sistema de Gestión de Recursos Académicos
Proyecto Integrador Fullstack desarrollado para la Universidad Adventista de Bolivia (UAB). La plataforma permite a docentes y estudiantes compartir, consultar y gestionar recursos educativos en tiempo real.

🛠️ Tecnologías Utilizadas
Frontend: React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React.

Backend: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Swagger (OpenAPI 3.0).

🚀 Instrucciones de Instalación y Ejecución
Prerrequisitos
Node.js (v18 o superior)

MongoDB (Servidor local o MongoDB Atlas corriendo)

1. Iniciar el Backend (Servidor)
Abre la terminal en VS Code.

Navega a la carpeta del servidor:

Bash
cd uab_conecta_server
Instala las dependencias:

Bash
npm install
Inicia el servidor:

Bash
node index.js
El backend responderá en: http://localhost:5000

Documentación Swagger disponible en: http://localhost:5000/api-docs

2. Iniciar el Frontend (Cliente)
Abre una segunda pestaña de terminal en VS Code.

Navega a la carpeta del cliente:

Bash
cd uab_conecta_client
Instala las dependencias:

Bash
npm install
Inicia el servidor de desarrollo Vite:

Bash
npm run dev
Abre en tu navegador: http://localhost:5173

📑 Funcionalidades Principales
Autenticación: Registro e Inicio de sesión con contraseñas encriptadas y autenticación mediante Tokens JWT.

Roles de Usuario: Estudiantes, Docentes y Administradores.

Gestión de Recursos (CRUD):

Creación y publicación de publicaciones académicas.

Visualización pública de recursos en tiempo real.

Eliminación de publicaciones con control de autoría/rol.

Filtro de búsqueda en vivo por título o categoría.

Guarda el archivo con Ctrl + S tras pegar el texto. ¡Con esto tu proyecto quedará completamente documentado y listo para la entrega!
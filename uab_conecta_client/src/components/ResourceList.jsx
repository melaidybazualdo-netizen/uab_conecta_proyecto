import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, FileText, Trash2, Search } from 'lucide-react';

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [titulo, setTitulo] = useState('Certificado de Notas');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Secretaría Académica');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const fetchResources = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resources');
      setResources(res.data);
    } catch (err) {
      console.error('Error al cargar trámites:', err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/resources',
        { titulo, descripcion, categoria },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDescripcion('');
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al enviar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta solicitud de trámite?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  const filteredResources = resources.filter((res) =>
    res.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      {/* Encabezado y Barra de Búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-blue-600" /> Trámites Académicos UAB
        </h1>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar solicitud o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>
      </div>

      {/* Formulario de Nueva Solicitud */}
      {user && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" /> Registrar Nueva Solicitud de Trámite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Trámite</label>
              <select 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Certificado de Notas">Certificado de Notas</option>
                <option value="Constancia de Estudios">Constancia de Estudios</option>
                <option value="Diplomado / Título">Diplomado / Título</option>
                <option value="Otro Trámite">Otro Trámite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Área / Categoría</label>
              <input 
                type="text" 
                placeholder="Ej. Secretaría Académica" 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Motivo / Descripción de la Solicitud</label>
            <textarea 
              placeholder="Describa el motivo de su trámite..." 
              required 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition cursor-pointer">
            Enviar Solicitud
          </button>
        </form>
      )}

      {/* Tarjetas de Solicitudes en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => (
          <div key={res._id} className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold">
                  {res.categoria}
                </span>
                {user && (user.rol === 'admin' || user._id === res.autor?._id || user.id === res.autor?._id) && (
                  <button 
                    onClick={() => handleDelete(res._id)} 
                    className="text-red-500 hover:text-red-700 p-1 transition"
                    title="Cancelar solicitud"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="text-lg font-bold mt-2 text-gray-800">{res.titulo}</h3>
              <p className="text-gray-600 mt-1 text-sm">{res.descripcion}</p>
              <p className="text-xs text-yellow-600 font-semibold mt-2">
                Estado: <span className="capitalize">{res.estado || 'pendiente'}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-2 border-t">
              Solicitado por: {res.autor?.nombre || 'Estudiante'} ({res.autor?.email})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
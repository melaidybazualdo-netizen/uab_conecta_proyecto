import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6" /> UAB Conecta
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full text-sm">
              <UserIcon className="w-4 h-4" /> {user.nombre} ({user.rol})
            </span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-gray-100 transition">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
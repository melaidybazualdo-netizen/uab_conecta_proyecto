import React, { useState, useEffect } from 'react';

export default function App() {
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario Auth
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Formulario Trámite
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Secretaría Académica');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error al parsear usuario:', e);
      }
    }
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resources');
      const data = await res.json();
      if (Array.isArray(data)) {
        setResources(data);
      }
    } catch (err) {
      console.error('Error al obtener trámites:', err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    const payload = isRegistering 
      ? { nombre, email: email.toLowerCase().trim(), password }
      : { email: email.toLowerCase().trim(), password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        setUser(data.usuario);
        setShowAuthModal(false);
        alert(isRegistering ? `¡Cuenta creada con éxito!` : `¡Bienvenido/a, ${data.usuario.nombre}!`);
        fetchResources();
      } else {
        alert(data.mensaje || 'Error en la solicitud');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Debes iniciar sesión');

    try {
      const res = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ titulo, descripcion, categoria })
      });

      if (res.ok) {
        alert('Trámite creado con éxito');
        setTitulo('');
        setDescripcion('');
        setShowCreateModal(false);
        fetchResources();
      } else {
        const errData = await res.json();
        alert(errData.mensaje || 'Error al crear trámite');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Sesión cerrada');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este trámite?')) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });

      if (response.ok) {
        setResources(prev => prev.filter(item => item._id !== id));
        alert('Trámite eliminado correctamente');
      } else {
        const data = await response.json();
        alert(`Error: ${data.mensaje}`);
      }
    } catch (error) {
      alert('Error de conexión al eliminar');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', margin: 0, paddingBottom: '40px' }}>
      
      {/* NAVBAR */}
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>📖 UAB Conecta</div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px' }}>Hola, <strong>{user.nombre}</strong></span>
              <button 
                onClick={() => setShowCreateModal(true)}
                style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                + Nuevo Trámite
              </button>
              <button 
                onClick={handleLogout}
                style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}
              style={{ backgroundColor: 'white', color: '#2563eb', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Iniciar Sesión / Registro
            </button>
          )}
        </div>
      </nav>

      {/* MODAL NUEVO TRÁMITE */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '350px' }}>
            <h3 style={{ marginTop: 0 }}>Nuevo Trámite</h3>
            <form onSubmit={handleCreateResource}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Título</label>
                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Categoría</label>
                <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '80px' }} />
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Trámite</button>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ width: '100%', backgroundColor: 'transparent', border: 'none', padding: '8px', marginTop: '5px', cursor: 'pointer', color: '#64748b' }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AUTH */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '320px' }}>
            <h3 style={{ marginTop: 0 }}>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h3>
            <form onSubmit={handleAuthSubmit}>
              {isRegistering && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Nombre Completo</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isRegistering ? 'Registrarse' : 'Ingresar'}
              </button>
            </form>
            <button type="button" onClick={() => setShowAuthModal(false)} style={{ width: '100%', backgroundColor: 'transparent', border: 'none', padding: '8px', marginTop: '5px', cursor: 'pointer', color: '#64748b' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* LISTADO DE TRÁMITES */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Trámites Registrados</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {resources.map((item) => {
            const autorId = (item.autor?._id || item.autor || '').toString();
            const autorEmail = (item.autor?.email || '').toLowerCase();
            const userId = (user?.id || user?._id || '').toString();
            const userEmail = (user?.email || '').toLowerCase();

            // Permite borrar si el ID o Email coincide, o si el usuario es admin
            const esDuenio = Boolean(
              user && (
                (autorId && userId && autorId === userId) ||
                (autorEmail && userEmail && autorEmail === userEmail) ||
                user.rol === 'admin'
              )
            );

            return (
              <div key={item._id} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                      {item.categoria || 'Secretaría Académica'}
                    </span>
                    {esDuenio && (
                      <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>
                        🗑️
                      </button>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.titulo}</h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.4', margin: '0 0 15px 0' }}>{item.descripcion}</p>
                </div>
                <div>
                  <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '10px 0' }} />
                  <small style={{ color: '#94a3b8', fontSize: '12px' }}>
                    Solicitado por: {item.autor?.nombre || 'Usuario'} ({item.autor?.email || 'N/A'})
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
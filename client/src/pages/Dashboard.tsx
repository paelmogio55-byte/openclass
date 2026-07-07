import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type ClassType = {
  id: number;
  name: string;
  code: string;
  description?: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API}/classes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load classes');
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      setError('Could not load classes');
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newClassName.trim(),
          description: newClassDesc.trim()
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create class');
      }
      await fetchClasses();
      setShowModal(false);
      setNewClassName('');
      setNewClassDesc('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navbar */}
      <header style={{ backgroundColor: '#1e40af', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>OpenClass</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user && <span>Welcome, {user.name} ({user.role})</span>}
          <button onClick={handleLogout} style={{ background: 'white', color: '#1e40af', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>My Classes</h2>
          {user?.role === 'teacher' && (
            <button onClick={() => setShowModal(true)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
              + Create Class
            </button>
          )}
        </div>

        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            No classes yet. Create your first class!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {classes.map((cls) => (
              <div key={cls.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>{cls.name}</h3>
                <p style={{ color: '#475569', margin: '0.25rem 0' }}><strong>Code:</strong> {cls.code}</p>
                {cls.description && <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0' }}>{cls.description}</p>}
                <button onClick={() => navigate(`/class/${cls.id}`)} style={{ marginTop: '1rem', background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                  Enter Class
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Class Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.3rem', color: '#1e293b' }}>Create New Class</h3>
            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155' }}>Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#334155' }}>Description</label>
                <textarea
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white' }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
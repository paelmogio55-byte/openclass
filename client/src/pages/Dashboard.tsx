import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#111827'
    }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px',
        borderRight: '1px solid #e5e7eb',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 2rem 0' }}>OpenClass</h2>

        {[
          { name: 'Home', icon: '🏠' },
          { name: 'Chat', icon: '💬' },
          { name: 'To Do', icon: '📝' },
          { name: 'Calendar', icon: '📅' },
          { name: 'Drive', icon: '📁' },
          { name: 'Blackboard', icon: '🧾' },
          { name: 'Mirroring', icon: '🖥️' }
        ].map(item => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeNav === item.name ? '#f3f4f6' : 'transparent',
              textAlign: 'left',
              fontSize: '0.95rem',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
          <button style={{ padding: '0.4rem 1rem', border: '1px solid #d1d5db', borderRadius: '20px', background: 'white', cursor: 'pointer' }}>No lessons</button>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
        </div>

        <div style={{
          background: 'linear-gradient(90deg, #fcd34d 0%, #ec4899 50%, #8b5cf6 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Your first classroom is ready</h2>
            <p style={{ opacity: '0.9', margin: '0 0 1.25rem 0' }}>Three demo students are inside. Try the blackboard, courseware, and tools.</p>
            <button style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: 'white', color: '#111827', fontWeight: '600', cursor: 'pointer' }}>▶ Try Now</button>
          </div>
          <div style={{ width: '280px', height: '140px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: '#3b82f6', borderRadius: '12px', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>+ New Class</h3>
              <p style={{ opacity: '0.9', margin: 0, fontSize: '0.95rem' }}>Versatile learning modes available</p>
            </div>
            <div style={{ width: '120px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>+ New Public Lesson</h3>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>Anyone with a link can join</p>
            </div>
            <div style={{ width: '120px', height: '60px', background: '#e5e7eb', borderRadius: '4px' }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            {['All Classes', 'As Teacher', 'As Student', 'Pending', 'Ended'].map(tab => (
              <button
                key={tab}
                style={{
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: tab === 'All Classes' ? '2px solid #111827' : '2px solid transparent',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  fontWeight: tab === 'All Classes' ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '280px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ height: '140px', background: 'url(https://picsum.photos/id/10/400/200) center/cover' }}></div>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📄</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>maasim</h4>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>paelmog
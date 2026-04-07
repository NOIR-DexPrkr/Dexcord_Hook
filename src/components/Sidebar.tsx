import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const items: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'webhooks', label: 'Webhooks', icon: '🔗' },
    { id: 'composer', label: 'Composer', icon: '✍️' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  return (
    <aside className="glass" style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderRight: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--accent-color)', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '1.5rem', boxShadow: '0 0 20px var(--glow-color)' }}>
          ⚓
        </div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Dexcord Hook</h2>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`btn ${currentView === item.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              justifyContent: 'flex-start',
              padding: '0.75rem 1rem',
              width: '100%',
              backgroundColor: currentView === item.id ? 'var(--accent-color)' : 'transparent',
              borderColor: currentView === item.id ? 'transparent' : 'var(--border-color)',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <p>Local Environment</p>
        <p>v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

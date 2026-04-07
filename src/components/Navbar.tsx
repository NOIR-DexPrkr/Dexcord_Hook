import React from 'react';
import type { View } from '../types';
import { translations } from '../translations';
import type { Language } from '../translations';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  language: Language;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, language }) => {
  const t = translations[language];

  const items: { id: View; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: t.dashboard, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    { 
      id: 'webhooks', 
      label: t.webhooks, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      )
    },
    { 
      id: 'composer', 
      label: t.composer, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
      )
    },
    { 
      id: 'history', 
      label: t.history, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
      )
    },
  ];

  return (
    <header style={{ 
      height: '64px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '28px', 
          height: '28px', 
          background: 'var(--text-primary)', 
          borderRadius: 'var(--radius-sm)', 
          display: 'grid', 
          placeItems: 'center'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 9 2-9-18-9 18 9-2ZM12 19v-9"/></svg>
        </div>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>Dexcord Hook</h2>
      </div>
      
      <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`btn ${currentView === item.id ? 'active' : ''}`}
            style={{ 
              background: currentView === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: currentView === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
              border: currentView === item.id ? '1px solid var(--border-color)' : '1px solid transparent',
              padding: '0.4rem 0.8rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {item.icon}
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
          {t.operational}
          <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
          <span>v1.2.5</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

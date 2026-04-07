import React from 'react';
import { translations } from '../translations';
import type { Language } from '../translations';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Footer: React.FC<FooterProps> = ({ language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      padding: '3rem 2rem', 
      marginTop: 'auto',
      background: 'rgba(2, 6, 23, 0.4)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '2rem' 
      }}>
        
        {/* Attribution */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            {t.foot_created_by} <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Dex Parker</span>
          </p>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#" title={t.foot_website} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </a>
          <a href="#" title={t.foot_discord} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6l-1.4 1.4c-.2.2-.5.2-.7 0L14.5 6l-1.4 1.4c-.2.2-.2.5 0 .7L14.5 10l-1.4 1.4c-.2.2-.2.5 0 .7L14.5 13l-1.4 1.4c-.2.2-.2.5 0 .7l1.4 1.4c.2.2.5.2.7 0L16.6 15l1.4 1.4c.2.2.5.2.7 0l1.4-1.4c.2-.2.2-.5 0-.7L18.7 13l1.4-1.4c.2-.2.2-.5 0-.7l-1.4-1.4c-.2-.2-.2-.5 0-.7l1.4-1.4c.2-.2.2-.5 0-.7l-1.4-1.4c-.2-.2-.5-.2-.7 0L18 6z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 13.5c-.5.5-1.5.5-2.5 0s-1.5-1.5-1-2.5 1.5-.5 2.5 0 1.5 1.5 1 2.5z"/></svg>
          </a>
          <a href="#" title={t.foot_donations} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </a>
        </div>

        {/* Language Toggle in Footer */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => onLanguageChange('es')}
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.75rem', 
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              background: language === 'es' ? 'var(--accent-color)' : 'transparent',
              color: language === 'es' ? 'white' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'var(--transition)'
            }}
          >
            ES
          </button>
          <button 
            onClick={() => onLanguageChange('en')}
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.75rem', 
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              background: language === 'en' ? 'var(--accent-color)' : 'transparent',
              color: language === 'en' ? 'white' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'var(--transition)'
            }}
          >
            EN
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Dexcord Hook. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;

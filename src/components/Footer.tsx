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
      padding: '1.5rem 2rem', 
      marginTop: 'auto',
      background: 'rgba(2, 6, 23, 0.4)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        
        {/* Left: Attribution & Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {t.foot_created_by} <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Dex Parker</span>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', opacity: 0.7 }}>
            © {new Date().getFullYear()} {t.foot_copyright}
          </p>
        </div>

        {/* Right: Socials & Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#" title={t.foot_website} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </a>
            <a href="#" title={t.foot_discord} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
              <svg width="20" height="20" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill-rule="nonzero"></path></svg>
            </a>
            <a href="#" title={t.foot_donations} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z"></path></svg>
            </a>
          </div>

          {/* Language Toggle in Footer */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => onLanguageChange('es')}
              style={{ 
                padding: '0.3rem 0.75rem', 
                fontSize: '0.7rem', 
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: language === 'es' ? 'var(--text-primary)' : 'transparent',
                color: language === 'es' ? 'var(--bg-color)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              ESPAÑOL
            </button>
            <button 
              onClick={() => onLanguageChange('en')}
              style={{ 
                padding: '0.3rem 0.75rem', 
                fontSize: '0.7rem', 
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: language === 'en' ? 'var(--text-primary)' : 'transparent',
                color: language === 'en' ? 'var(--bg-color)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              ENGLISH
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

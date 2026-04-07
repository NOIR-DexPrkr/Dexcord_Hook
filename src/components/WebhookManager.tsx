import React, { useState } from 'react';
import type { Webhook } from '../types';
import type { ModalProps } from './Modal';
import { translations } from '../translations';
import type { Language } from '../translations';

interface WebhookManagerProps {
  webhooks: Webhook[];
  onAdd: (webhook: Webhook) => void;
  onDelete: (id: string) => void;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
  language: Language;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ webhooks, onAdd, onDelete, showModal, language }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    
    // Simple URL validation
    if (!url.startsWith('https://discord.com/api/webhooks/')) {
       showModal({
         title: t.wm_invalid_url,
         message: t.wm_invalid_url_desc,
         onConfirm: () => {},
         onCancel: () => {},
         type: 'warning'
       });
       return;
    }

    onAdd({ id: crypto.randomUUID(), name, url });
    setName('');
    setUrl('');
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.wm_title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Add and manage your Discord webhook endpoints.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{t.wm_add_title}</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem' }}>{t.wm_name_label}</label>
            <input 
              type="text" 
              placeholder={t.wm_name_placeholder} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem' }}>{t.wm_url_label}</label>
            <input 
              type="text" 
              placeholder="https://discord.com/api/webhooks/..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          {t.wm_connect}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.wm_registered_title}</h3>
        {webhooks.length === 0 && (
          <div style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.wm_no_webhooks}</p>
          </div>
        )}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="glass glass-hover" style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)' }}>
               <div style={{ minWidth: 0 }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', fontWeight: 600 }}>{webhook.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px', opacity: 0.7 }}>
                     {webhook.url}
                  </p>
               </div>
               <button 
                 onClick={() => onDelete(webhook.id)}
                 className="btn" 
                 style={{ 
                   background: 'transparent', 
                   border: '1px solid var(--border-color)', 
                   color: '#ef4444',
                   padding: '0.375rem 0.75rem',
                   fontSize: '0.75rem',
                   borderRadius: 'var(--radius-md)'
                 }}
               >
                 {t.wm_delete_btn}
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhookManager;

import React, { useState, useEffect } from 'react';
import type { Webhook } from '../types';
import type { ModalProps } from './Modal';

interface WebhookManagerProps {
  webhooks: Webhook[];
  onAdd: (webhook: Webhook) => void;
  onDelete: (id: string) => void;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ webhooks, onAdd, onDelete, showModal }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    
    // Simple URL validation
    if (!url.startsWith('https://discord.com/api/webhooks/')) {
       showModal({
         title: 'Invalid Webhook URL',
         message: 'The URL provided does not appear to be a valid Discord Webhook URL. It should start with https://discord.com/api/webhooks/',
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
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Webhook Management</h1>
      
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ color: 'var(--accent-color)' }}>Add New Webhook</h3>
        <div>
          <label>Friendly Name</label>
          <input 
            type="text" 
            placeholder="e.g. My Bot Server" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label>Webhook URL</label>
          <input 
            type="text" 
            placeholder="https://discord.com/api/webhooks/..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Connect Webhook
        </button>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Registered Webhooks</h3>
        {webhooks.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No webhooks registered yet. Add one above to get started.</p>
        )}
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="glass glass-hover" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)' }}>
             <div>
                <h4 style={{ color: 'var(--text-primary)' }}>{webhook.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                  {webhook.url}
                </p>
             </div>
             <button 
               onClick={() => onDelete(webhook.id)}
               className="btn btn-outline" 
               style={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
             >
               Delete
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebhookManager;

import React, { useState } from 'react';
import type { SentMessage } from '../types';
import type { ModalProps } from './Modal';
import { translations } from '../translations';
import type { Language } from '../translations';

interface HistoryProps {
  messages: SentMessage[];
  onTriggerEdit: (msg: SentMessage) => void;
  onDeleteMessage: (msg: SentMessage, discordDelete: boolean) => Promise<boolean>;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
  language: Language;
}

const History: React.FC<HistoryProps> = ({ messages, onTriggerEdit, onDeleteMessage, showModal, language }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const t = translations[language];

  const handleDeleteLocal = (msg: SentMessage) => {
    showModal({
      title: t.modal_remove_local_title,
      message: t.modal_remove_local_desc,
      confirmLabel: t.modal_remove_local_confirm,
      onConfirm: async () => {
        setDeletingId(msg.id);
        await onDeleteMessage(msg, false);
        setDeletingId(null);
      },
      onCancel: () => {},
      type: 'info'
    });
  };

  const handleDeleteDiscord = (msg: SentMessage) => {
    showModal({
      title: t.modal_delete_discord_title,
      message: t.modal_delete_discord_desc,
      confirmLabel: t.modal_delete_discord_confirm,
      onConfirm: async () => {
        setDeletingId(msg.id);
        const success = await onDeleteMessage(msg, true);
        if (!success) {
           showModal({
             title: t.modal_delete_fail_title,
             message: t.modal_delete_fail_desc,
             onConfirm: () => {},
             onCancel: () => {},
             type: 'danger'
           });
        }
        setDeletingId(null);
      },
      onCancel: () => {},
      type: 'danger'
    });
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.hist_title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View and manage your recent webhook deliveries.</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.hist_no_messages}</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    background: '#1e293b',
                    color: 'var(--text-primary)', 
                    padding: '0.15rem 0.5rem',
                    borderRadius: '100px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {msg.webhookName}
                  </span>
                  {msg.payload.username && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>via {msg.payload.username}</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(msg.timestamp).toLocaleString()} • <code style={{ color: 'var(--text-primary)' }}>{msg.messageId}</code>
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => onTriggerEdit(msg)}
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 0.75rem', height: '32px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                  <span style={{ marginLeft: '4px' }}>{t.hist_edit}</span>
                </button>
                <div style={{ display: 'flex', background: '#1e293b', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => handleDeleteLocal(msg)}
                    className="btn" 
                    title={t.hist_delete_local}
                    style={{ 
                      padding: '0 0.5rem', 
                      height: '26px', 
                      background: 'transparent', 
                      color: 'var(--text-muted)',
                      border: 'none',
                      borderRadius: 'calc(var(--radius-md) - 2px)'
                    }}
                    disabled={deletingId === msg.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteDiscord(msg)}
                    className="btn" 
                    title={t.hist_delete_discord}
                    style={{ 
                      padding: '0 0.5rem', 
                      height: '26px', 
                      background: 'transparent', 
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: 'calc(var(--radius-md) - 2px)'
                    }}
                    disabled={deletingId === msg.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {msg.payload.content && (
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--border-color)' }}>
                  {msg.payload.content}
                </p>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {msg.payload.embeds?.map((embed, idx) => (
                  <div key={idx} style={{ 
                    background: '#020617', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.875rem', 
                    border: '1px solid var(--border-color)',
                    borderLeft: `3px solid #${(embed.color || 5814783).toString(16).padStart(6, '0')}`,
                  }}>
                    {embed.author?.name && <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{embed.author.name}</div>}
                    {embed.title && <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.2rem', fontSize: '0.875rem' }}>{embed.title}</div>}
                    {embed.description && <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>{embed.description}</div>}
                    {embed.fields && embed.fields.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {embed.fields.map((f, fi) => (
                          <div key={fi} style={{ gridColumn: f.inline ? 'auto' : 'span 2' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.75rem' }}>{f.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {embed.footer && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{embed.footer.text}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

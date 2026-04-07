import React, { useState } from 'react';
import type { SentMessage } from '../types';
import type { ModalProps } from './Modal';

interface HistoryProps {
  messages: SentMessage[];
  onTriggerEdit: (msg: SentMessage) => void;
  onDeleteMessage: (msg: SentMessage, discordDelete: boolean) => Promise<boolean>;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
}

const History: React.FC<HistoryProps> = ({ messages, onTriggerEdit, onDeleteMessage, showModal }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteLocal = (msg: SentMessage) => {
    showModal({
      title: 'Remove from History?',
      message: 'This will remove the message from Dexcord Hook history, but it will still remain visible in Discord.',
      confirmLabel: 'Remove Local',
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
      title: 'Delete from Discord?',
      message: 'This will permanently delete the message from the Discord channel and remove it from your Dexcord Hook history. This action cannot be undone.',
      confirmLabel: 'Delete Everywhere',
      onConfirm: async () => {
        setDeletingId(msg.id);
        const success = await onDeleteMessage(msg, true);
        if (!success) {
           showModal({
             title: 'Deletion Failed',
             message: 'Could not delete the message from Discord. It might have already been deleted or the webhook URL is invalid.',
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
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Message History</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No messages sent yet.</p>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {msg.webhookName} {msg.payload.username ? `(${msg.payload.username})` : ''}
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(msg.timestamp).toLocaleString()} • ID: {msg.messageId}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => onTriggerEdit(msg)}
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                  Edit
                </button>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button 
                    onClick={() => handleDeleteLocal(msg)}
                    className="btn btn-outline" 
                    title="Remove from Local History"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem', borderRight: 'none', borderRadius: '4px 0 0 4px' }}
                    disabled={deletingId === msg.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteDiscord(msg)}
                    className="btn btn-outline" 
                    title="Delete from Discord Server"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem', borderRadius: '0 4px 4px 0', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                    disabled={deletingId === msg.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {msg.payload.content && (
                <p style={{ whiteSpace: 'pre-wrap', color: '#dcddde', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.93rem' }}>
                  {msg.payload.content}
                </p>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                {msg.payload.embeds?.map((embed, idx) => (
                  <div key={idx} style={{ 
                    background: '#2f3136', 
                    borderRadius: '4px', 
                    padding: '1rem', 
                    borderLeft: `4px solid #${(embed.color || 5814783).toString(16).padStart(6, '0')}`,
                  }}>
                    {embed.author?.name && <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>{embed.author.name}</div>}
                    {embed.title && <div style={{ fontWeight: 600, color: '#00aff4', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{embed.title}</div>}
                    {embed.description && <div style={{ color: '#dcddde', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{embed.description}</div>}
                    {embed.fields && embed.fields.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {embed.fields.map((f, fi) => (
                          <div key={fi} style={{ gridColumn: f.inline ? 'auto' : 'span 2' }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.8rem' }}>{f.name}</div>
                            <div style={{ color: '#dcddde', fontSize: '0.8rem' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {embed.footer && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>{embed.footer.text}</div>}
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

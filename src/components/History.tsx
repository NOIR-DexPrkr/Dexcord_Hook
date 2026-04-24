import React, { useState } from 'react';
import type { SentMessage } from '../types';
import type { ModalProps } from './Modal';
import { translations } from '../translations';
import type { Language } from '../translations';
import Markdown from './Markdown';

interface HistoryProps {
  messages: SentMessage[];
  onTriggerEdit: (msg: SentMessage) => void;
  onDeleteMessage: (msg: SentMessage, discordDelete: boolean) => Promise<boolean>;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
  closeModal: () => void;
  language: Language;
}

const History: React.FC<HistoryProps> = ({ messages, onTriggerEdit, onDeleteMessage, showModal, closeModal, language }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<Record<string, boolean>>({});
  const t = translations[language];

  const toggleExpand = (id: string) => {
    setExpandedContent(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteLocal = (msg: SentMessage) => {
    showModal({
      title: t.modal_remove_local_title,
      message: t.modal_remove_local_desc,
      confirmLabel: t.modal_remove_local_confirm,
      onConfirm: async () => {
        closeModal();
        setDeletingId(msg.id);
        await onDeleteMessage(msg, false);
        setDeletingId(null);
      },
      onCancel: () => closeModal(),
      type: 'info'
    });
  };

  const handleDeleteDiscord = (msg: SentMessage) => {
    showModal({
      title: t.modal_delete_discord_title,
      message: t.modal_delete_discord_desc,
      confirmLabel: t.modal_delete_discord_confirm,
      onConfirm: async () => {
        closeModal();
        setDeletingId(msg.id);
        const success = await onDeleteMessage(msg, true);
        if (!success) {
           showModal({
             title: t.modal_delete_fail_title,
             message: t.modal_delete_fail_desc,
             onConfirm: () => closeModal(),
             onCancel: () => closeModal(),
             type: 'danger'
           });
        }
        setDeletingId(null);
      },
      onCancel: () => closeModal(),
      type: 'danger'
    });
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.hist_title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View and manage your recent webhook deliveries.</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.length === 0 && (
          <div style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.hist_no_messages}</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isExpanded = expandedContent[msg.id];
          const content = msg.payload.content || '';
          const needsExpansion = content.length > 500;
          const displayContent = isExpanded ? content : content.slice(0, 500);

          return (
            <div key={msg.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              {/* Header: Meta Info & Actions */}
              <div className="history-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)', 
                      padding: '0.15rem 0.6rem',
                      borderRadius: '100px',
                      border: '1px solid var(--border-color)'
                    }}>
                      {msg.webhookName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.8 }}>ID: {msg.messageId}</code>
                </div>
                
                <div className="history-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onTriggerEdit(msg)}
                    className="btn btn-outline" 
                    style={{ padding: '0.4rem 0.75rem', height: '32px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                    <span style={{ marginLeft: '4px' }} className="hide-mobile">{t.hist_edit}</span>
                  </button>
                  <div style={{ display: 'flex', background: '#1e293b', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <button 
                      onClick={() => handleDeleteLocal(msg)}
                      className="btn" 
                      title={t.hist_delete_local}
                      style={{ padding: '0 0.5rem', height: '26px', background: 'transparent', color: 'var(--text-muted)', border: 'none' }}
                      disabled={deletingId === msg.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteDiscord(msg)}
                      className="btn" 
                      title={t.hist_delete_discord}
                      style={{ padding: '0 0.5rem', height: '26px', background: 'transparent', color: '#ef4444', border: 'none' }}
                      disabled={deletingId === msg.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Discord-style Rendering */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', background: '#1e1f22' }}>
                  <img src={msg.payload.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{msg.payload.username || 'Dexcord Hook Bot'}</span>
                    <span style={{ background: '#5865f2', color: '#fff', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>BOT</span>
                  </div>

                  {content && (
                    <Markdown content={displayContent} />
                  )}
                  {needsExpansion && (
                    <button 
                      onClick={() => toggleExpand(msg.id)}
                      style={{ background: 'none', border: 'none', color: '#00a8fc', cursor: 'pointer', padding: 0, marginTop: '4px', fontSize: '0.875rem', display: 'block' }}
                    >
                      {isExpanded ? '...show less' : '...show more'}
                    </button>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {msg.payload.embeds?.map((embed, idx) => (
                      <div key={idx} style={{ 
                        background: '#2b2d31', 
                        borderRadius: '4px', 
                        padding: '0.75rem 1rem', 
                        borderLeft: `4px solid #${(embed.color || 5814783).toString(16).padStart(6, '0')}`,
                        maxWidth: '520px',
                        position: 'relative'
                      }}>
                        {embed.author?.name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {embed.author.icon_url && <img src={embed.author.icon_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="" />}
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{embed.author.name}</span>
                          </div>
                        )}
                        
                        {embed.title && <div style={{ fontWeight: 600, color: '#00a8fc', marginBottom: '0.5rem', fontSize: '1rem' }}><Markdown content={embed.title} /></div>}
                        {embed.description && <Markdown content={embed.description} />}
                        
                        {embed.fields && embed.fields.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
                            {embed.fields.map((f, fi) => (
                              <div key={fi} style={{ gridColumn: f.inline ? 'span 1' : 'span 3' }}>
                                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', marginBottom: '0.125rem' }}><Markdown content={f.name} /></div>
                                <div style={{ color: '#dbdee1', fontSize: '0.875rem' }}><Markdown content={f.value} /></div>
                              </div>
                            ))}
                          </div>
                        )}

                        {embed.image?.url && <div style={{ marginTop: '1rem', borderRadius: '4px', overflow: 'hidden' }}><img src={embed.image.url} style={{ maxWidth: '100%', display: 'block' }} alt="" /></div>}
                        
                        {embed.footer?.text && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                            {embed.footer.icon_url && <img src={embed.footer.icon_url} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="" />}
                            <span style={{ fontSize: '0.75rem', color: '#dbdee1' }}>{embed.footer.text}</span>
                          </div>
                        )}

                        {embed.thumbnail?.url && (
                          <div className="embed-thumbnail" style={{ position: 'absolute', top: '1rem', right: '1rem', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                            <img src={embed.thumbnail.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .history-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .history-actions {
            width: 100%;
            justify-content: space-between;
          }
          .embed-thumbnail {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default History;

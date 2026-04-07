import React, { useState, useEffect } from 'react';
import type { Webhook, WebhookPayload, DiscordEmbed, SentMessage } from '../types';
import type { ModalProps } from './Modal';
import { translations } from '../translations';
import type { Language } from '../translations';

interface MessageComposerProps {
  webhooks: Webhook[];
  onSendMessage: (webhookId: string, payload: WebhookPayload) => Promise<string | null | 'BLOCKED'>;
  onEditMessage: (messageId: string, webhookId: string, payload: WebhookPayload) => Promise<boolean | 'BLOCKED'>;
  editingMessage: SentMessage | null;
  onCancelEdit: () => void;
  showModal: (config: Omit<ModalProps, 'isOpen'>) => void;
  language: Language;
}

type Tab = 'form' | 'json';

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  webhooks, 
  onSendMessage, 
  onEditMessage,
  editingMessage,
  onCancelEdit,
  showModal,
  language
}) => {
  const [selectedWebhookId, setSelectedWebhookId] = useState(editingMessage?.webhookId || webhooks[0]?.id || '');
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const t = translations[language];

  // Payload State
  const [payload, setPayload] = useState<WebhookPayload>(() => {
    if (editingMessage) return editingMessage.payload;
    const savedDraft = localStorage.getItem('Dexcord Hook_draft');
    return savedDraft ? JSON.parse(savedDraft) : { content: '', embeds: [] };
  });

  const [jsonValue, setJsonValue] = useState(JSON.stringify(payload, null, 2));
  const [expandedEmbeds, setExpandedEmbeds] = useState<number[]>([0]);

  // Sync JSON and draft
  useEffect(() => {
    setJsonValue(JSON.stringify(payload, null, 2));
    if (!editingMessage) {
      localStorage.setItem('Dexcord Hook_draft', JSON.stringify(payload));
    }
  }, [payload, editingMessage]);

  const handleJsonChange = (val: string) => {
    setJsonValue(val);
    try {
      const parsed = JSON.parse(val);
      setPayload(parsed);
    } catch (e) {
      // Invalid JSON
    }
  };

  const handleAction = async () => {
    if (!selectedWebhookId) return;
    setSending(true);
    setStatus(null);
    
    let result: string | boolean | 'BLOCKED' | null = false;
    
    if (editingMessage) {
      result = await onEditMessage(editingMessage.messageId, editingMessage.webhookId, payload);
      if (result === true) {
        setStatus({ type: 'success', message: t.comp_success_update });
        setTimeout(() => onCancelEdit(), 1500);
      }
    } else {
      result = await onSendMessage(selectedWebhookId, payload);
      if (result && result !== 'BLOCKED') {
        setStatus({ type: 'success', message: t.comp_success_send });
        setPayload({ content: '', embeds: [] });
      }
    }

    if (result === 'BLOCKED') {
      showModal({
        title: t.comp_blocked_title,
        message: t.comp_blocked_desc,
        confirmLabel: t.modal_got_it,
        cancelLabel: t.modal_close,
        onConfirm: () => {},
        onCancel: () => {},
        type: 'warning'
      });
    } else if (result === false || result === null) {
      setStatus({ type: 'error', message: editingMessage ? t.comp_fail_update : t.comp_fail_send });
    }
    
    setSending(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const addEmbed = () => {
    const newEmbeds = [...(payload.embeds || []), { title: 'New Embed', color: 5814783 }];
    setPayload({ ...payload, embeds: newEmbeds });
    setExpandedEmbeds([newEmbeds.length - 1]);
  };

  const removeEmbed = (index: number) => {
    const newEmbeds = [...(payload.embeds || [])];
    newEmbeds.splice(index, 1);
    setPayload({ ...payload, embeds: newEmbeds });
  };

  const updateEmbed = (index: number, data: Partial<DiscordEmbed>) => {
    const newEmbeds = [...(payload.embeds || [])];
    newEmbeds[index] = { ...newEmbeds[index], ...data };
    setPayload({ ...payload, embeds: newEmbeds });
  };

  const addField = (embedIdx: number) => {
    const embeds = [...(payload.embeds || [])];
    const fields = [...(embeds[embedIdx].fields || []), { name: '', value: '', inline: false }];
    embeds[embedIdx] = { ...embeds[embedIdx], fields };
    setPayload({ ...payload, embeds });
  };

  const removeField = (embedIdx: number, fieldIdx: number) => {
    const embeds = [...(payload.embeds || [])];
    const fields = [...(embeds[embedIdx].fields || [])];
    fields.splice(fieldIdx, 1);
    embeds[embedIdx] = { ...embeds[embedIdx], fields };
    setPayload({ ...payload, embeds });
  };

  const updateField = (embedIdx: number, fieldIdx: number, data: any) => {
    const embeds = [...(payload.embeds || [])];
    const fields = [...(embeds[embedIdx].fields || [])];
    fields[fieldIdx] = { ...fields[fieldIdx], ...data };
    embeds[embedIdx] = { ...embeds[embedIdx], fields };
    setPayload({ ...payload, embeds });
  };

  if (webhooks.length === 0) {
    return (
       <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', margin: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>{t.comp_no_webhooks}</p>
       </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Editor Side */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
             <h2 style={{ fontSize: '1.5rem' }}>{editingMessage ? t.comp_edit_title : t.comp_title}</h2>
             {editingMessage && <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>{t.comp_editing_msg} {editingMessage.messageId}</p>}
          </div>
          <div className="tabs" style={{ marginBottom: 0, border: 'none' }}>
            <div className={`tab ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>{t.comp_tab_form}</div>
            <div className={`tab ${activeTab === 'json' ? 'active' : ''}`} onClick={() => setActiveTab('json')}>{t.comp_tab_json}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label>{t.comp_dest_label}</label>
            <select value={selectedWebhookId} onChange={(e) => setSelectedWebhookId(e.target.value)} disabled={!!editingMessage}>
              {webhooks.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>

          {activeTab === 'form' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label>{t.comp_content_label}</label>
                <textarea 
                  rows={3} 
                  placeholder={t.comp_content_placeholder} 
                  value={payload.content} 
                  onChange={(e) => setPayload({ ...payload, content: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>{t.comp_username_label}</label>
                  <input 
                    type="text" 
                    placeholder="Dexcord Hook Bot" 
                    value={payload.username || ''} 
                    onChange={(e) => setPayload({ ...payload, username: e.target.value })} 
                  />
                </div>
                <div>
                  <label>{t.comp_avatar_label}</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={payload.avatar_url || ''} 
                    onChange={(e) => setPayload({ ...payload, avatar_url: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{t.comp_embeds_title} ({payload.embeds?.length || 0}/10)</h3>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={addEmbed} disabled={(payload.embeds?.length || 0) >= 10}>
                    {t.comp_add_embed}
                  </button>
                </div>

                {payload.embeds?.map((embed, idx) => (
                  <div key={idx} className="accordion">
                    <div className="accordion-header" onClick={() => setExpandedEmbeds(expandedEmbeds.includes(idx) ? expandedEmbeds.filter(i => i !== idx) : [...expandedEmbeds, idx])}>
                      <h4>{t.comp_embed_prefix} {idx + 1} — {embed.title || t.comp_untitled}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); removeEmbed(idx); }}>✕</button>
                        <span>{expandedEmbeds.includes(idx) ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expandedEmbeds.includes(idx) && (
                      <div className="accordion-content">
                        {/* Author */}
                        <div>
                          <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)' }}>{t.embed_author}</label>
                          <div style={{ display: 'grid', gap: '0.75rem' }}>
                             <input type="text" placeholder={t.txt_name} value={embed.author?.name || ''} onChange={(e) => updateEmbed(idx, { author: { ...embed.author, name: e.target.value } })} />
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <input type="text" placeholder="URL" value={embed.author?.url || ''} onChange={(e) => updateEmbed(idx, { author: { ...embed.author, name: embed.author?.name || '', url: e.target.value } })} />
                                <input type="text" placeholder={t.txt_icon_url} value={embed.author?.icon_url || ''} onChange={(e) => updateEmbed(idx, { author: { ...embed.author, name: embed.author?.name || '', icon_url: e.target.value } })} />
                             </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div>
                          <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)' }}>{t.embed_body}</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                             <input type="text" placeholder={t.txt_title} value={embed.title || ''} onChange={(e) => updateEmbed(idx, { title: e.target.value })} />
                             <textarea rows={3} placeholder={t.txt_desc} value={embed.description || ''} onChange={(e) => updateEmbed(idx, { description: e.target.value })} />
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem' }}>
                                <input type="text" placeholder="URL" value={embed.url || ''} onChange={(e) => updateEmbed(idx, { url: e.target.value })} />
                                <input type="color" value={`#${(embed.color || 5814783).toString(16).padStart(6, '0')}`} onChange={(e) => updateEmbed(idx, { color: parseInt(e.target.value.replace('#', ''), 16) })} style={{ height: '42px', padding: '2px' }} />
                             </div>
                          </div>
                        </div>

                        {/* Fields */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)' }}>{t.embed_fields}</label>
                            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => addField(idx)}>{t.comp_add_field}</button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {embed.fields?.map((f, fIdx) => (
                              <div key={fIdx} className="field-row">
                                <input type="text" placeholder={t.txt_name} value={f.name} onChange={(e) => updateField(idx, fIdx, { name: e.target.value })} />
                                <input type="text" placeholder={t.txt_value} value={f.value} onChange={(e) => updateField(idx, fIdx, { value: e.target.value })} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', paddingBottom: '0.75rem', minWidth: '80px' }}>
                                  <input type="checkbox" checked={f.inline} onChange={(e) => updateField(idx, fIdx, { inline: e.target.checked })} style={{ width: 'auto' }} />
                                  <span style={{ fontSize: '0.7rem' }}>{t.txt_inline}</span>
                                </div>
                                <button style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', paddingBottom: '0.75rem' }} onClick={() => removeField(idx, fIdx)}>✕</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Images */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ fontSize: '0.7rem' }}>{t.txt_image_url}</label>
                            <input type="text" placeholder="https://..." value={embed.image?.url || ''} onChange={(e) => updateEmbed(idx, { image: { url: e.target.value } })} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem' }}>{t.txt_thumbnail_url}</label>
                            <input type="text" placeholder="https://..." value={embed.thumbnail?.url || ''} onChange={(e) => updateEmbed(idx, { thumbnail: { url: e.target.value } })} />
                          </div>
                        </div>

                        {/* Footer */}
                        <div>
                          <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)' }}>{t.embed_footer}</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <input type="text" placeholder={t.txt_footer_text} value={embed.footer?.text || ''} onChange={(e) => updateEmbed(idx, { footer: { ...embed.footer, text: e.target.value } })} />
                            <input type="text" placeholder={t.txt_icon_url} value={embed.footer?.icon_url || ''} onChange={(e) => updateEmbed(idx, { footer: { text: embed.footer?.text || '', icon_url: e.target.value } })} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <textarea 
                 className="json-editor"
                 value={jsonValue}
                 onChange={(e) => handleJsonChange(e.target.value)}
                 spellCheck={false}
               />
               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                 {t.comp_json_hint}
               </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleAction} className="btn btn-primary" disabled={sending}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {!sending && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
                {sending ? (editingMessage ? t.comp_updating : t.comp_sending) : (editingMessage ? t.comp_update_btn : t.comp_send_btn)}
              </span>
            </button>
            {editingMessage ? (
              <button className="btn btn-outline" onClick={onCancelEdit}>{t.comp_cancel}</button>
            ) : (
              <button className="btn btn-outline" onClick={() => { 
                showModal({
                  title: t.modal_clear_title,
                  message: t.modal_clear_desc,
                  onConfirm: () => setPayload({ content: '', embeds: [] }),
                  onCancel: () => {},
                  type: 'warning'
                })
              }}>{t.comp_clear}</button>
            )}
          </div>
          
          {status && (
            <span style={{ color: status.type === 'success' ? '#10b981' : '#ef4444', fontWeight: 500 }}>
              {status.message}
            </span>
          )}
        </div>
      </div>

      {/* Preview Side */}
      <div style={{ height: 'calc(100vh - 100px)', position: 'sticky', top: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{t.comp_preview_title}</h3>
        <div style={{ background: '#36393f', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <img src={payload.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="Avatar" />
             <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ fontWeight: 500, color: '#fff' }}>{payload.username || 'Dexcord Hook Bot'}</span>
                   <span style={{ background: '#5865f2', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 500 }}>{t.comp_bot_tag}</span>
                   <span style={{ color: '#72767d', fontSize: '0.75rem' }}>{t.comp_today_at} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {payload.content && <div style={{ color: '#dcddde', fontSize: '0.93rem', whiteSpace: 'pre-wrap', marginTop: '0.2rem' }}>{payload.content}</div>}
                
                {payload.embeds?.map((embed, idx) => (
                  <div key={idx} style={{ 
                    marginTop: '0.5rem',
                    background: '#2f3136', 
                    borderRadius: '4px', 
                    padding: '0.75rem 1rem 1rem', 
                    borderLeft: `4px solid #${(embed.color || 5814783).toString(16).padStart(6, '0')}`,
                    maxWidth: '432px',
                    position: 'relative'
                  }}>
                    {embed.author?.name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {embed.author.icon_url && <img src={embed.author.icon_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="" />}
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{embed.author.name}</span>
                      </div>
                    )}
                    
                    {embed.title && <div style={{ fontWeight: 600, color: '#00aff4', marginBottom: '0.5rem', fontSize: '1rem' }}>{embed.title}</div>}
                    {embed.description && <div style={{ color: '#dcddde', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{embed.description}</div>}
                    
                    {embed.fields && embed.fields.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {embed.fields.map((f, fi) => (
                          <div key={fi} style={{ gridColumn: f.inline ? 'span 1' : 'span 3' }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem' }}>{f.name}</div>
                            <div style={{ color: '#dcddde', fontSize: '0.875rem' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {embed.image?.url && <img src={embed.image.url} style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '0.75rem' }} alt="" />}
                    
                    {embed.footer?.text && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                        {embed.footer.icon_url && <img src={embed.footer.icon_url} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="" />}
                        <span style={{ fontSize: '0.75rem', color: '#dcddde' }}>{embed.footer.text}</span>
                      </div>
                    )}

                    {embed.thumbnail?.url && (
                      <img src={embed.thumbnail.url} style={{ position: 'absolute', top: '1rem', right: '1rem', width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MessageComposer;

import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import WebhookManager from './components/WebhookManager'
import MessageComposer from './components/MessageComposer'
import History from './components/History'
import Modal from './components/Modal'
import type { ModalProps } from './components/Modal'
import type { Webhook, SentMessage, View, WebhookPayload } from './types'
import { translations } from './translations'
import type { Language } from './translations'

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('Dexcord Hook_language') as Language) || 'es'
  })

  const [view, setView] = useState<View>(() => {
    return (localStorage.getItem('Dexcord Hook_current_view') as View) || 'dashboard'
  })

  const [webhooks, setWebhooks] = useState<Webhook[]>(() => {
    const saved = localStorage.getItem('Dexcord Hook_webhooks')
    return saved ? JSON.parse(saved) : []
  })

  const [history, setHistory] = useState<SentMessage[]>(() => {
    const saved = localStorage.getItem('Dexcord Hook_history')
    return saved ? JSON.parse(saved) : []
  })

  // Translation helper
  const t = translations[language];

  // Edit Mode State
  const [editingMessage, setEditingMessage] = useState<SentMessage | null>(null);

  // Modal State
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showModal = (config: Omit<ModalProps, 'isOpen'>) => {
    setModal({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Save current view and language
  useEffect(() => {
    localStorage.setItem('Dexcord Hook_current_view', view)
  }, [view])

  useEffect(() => {
    localStorage.setItem('Dexcord Hook_language', language)
  }, [language])

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('Dexcord Hook_webhooks', JSON.stringify(webhooks))
  }, [webhooks])

  useEffect(() => {
    localStorage.setItem('Dexcord Hook_history', JSON.stringify(history))
  }, [history])

  const addWebhook = (w: Webhook) => setWebhooks([...webhooks, w])
  const deleteWebhook = (id: string) => setWebhooks(webhooks.filter(w => w.id !== id))

  const sendMessage = async (webhookId: string, payload: WebhookPayload): Promise<string | null | 'BLOCKED'> => {
    const webhook = webhooks.find(w => w.id === webhookId)
    if (!webhook) return null

    try {
      const response = await fetch(`${webhook.url}?wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const newMessage: SentMessage = {
        id: crypto.randomUUID(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        payload: payload,
        timestamp: Date.now(),
        messageId: data.id
      }

      setHistory([newMessage, ...history])
      return data.id
    } catch (error) {
      console.error('Failed to send message:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return 'BLOCKED';
      }
      return null
    }
  }

  const editMessage = async (messageId: string, webhookId: string, payload: WebhookPayload): Promise<boolean | 'BLOCKED'> => {
    const webhook = webhooks.find(w => w.id === webhookId)
    if (!webhook) return false

    try {
      const response = await fetch(`${webhook.url}/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      // Update local history
      setHistory(history.map(m => 
        (m.messageId === messageId) ? { ...m, payload: payload } : m
      ))
      
      return true
    } catch (error) {
      console.error('Failed to edit message:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return 'BLOCKED';
      }
      return false
    }
  }

  const deleteMessage = async (msg: SentMessage, discordDelete: boolean): Promise<boolean> => {
    if (discordDelete) {
      const webhook = webhooks.find(w => w.id === msg.webhookId)
      if (webhook) {
        try {
          const response = await fetch(`${webhook.url}/messages/${msg.messageId}`, {
            method: 'DELETE'
          });
          if (!response.ok && response.status !== 404) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.error('Discord deletion failed:', error);
          // We still want to remove from local if it's failed/not found
        }
      }
    }

    setHistory(history.filter(m => m.id !== msg.id));
    return true;
  }

  const triggerEdit = (msg: SentMessage) => {
    setEditingMessage(msg);
    setView('composer');
  }

  const cancelEdit = () => {
    setEditingMessage(null);
    setView('history');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar 
        currentView={view} 
        setCurrentView={setView} 
        language={language} 
        setLanguage={setLanguage} 
      />
      
      <main style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.1)' }}>
        {view === 'dashboard' && (
          <div className="fade-in" style={{ padding: '3rem' }}>
             <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.welcome}</h1>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px' }}>
                {t.dashboard_desc}
             </p>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                   <div style={{ color: 'var(--accent-color)', fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>{webhooks.length}</div>
                   <p style={{ color: 'var(--text-muted)' }}>{t.stats_webhooks}</p>
                </div>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                   <div style={{ color: '#10b981', fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>{history.length}</div>
                   <p style={{ color: 'var(--text-muted)' }}>{t.stats_messages}</p>
                </div>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }} onClick={() => setView('composer')}>
                   <div style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                   </div>
                   <p style={{ color: 'var(--text-muted)' }}>{t.send_new}</p>
                </div>
             </div>
          </div>
        )}

        {view === 'webhooks' && (
          <WebhookManager 
            webhooks={webhooks} 
            onAdd={addWebhook} 
            onDelete={deleteWebhook} 
            showModal={showModal}
            language={language}
          />
        )}

        {view === 'composer' && (
          <MessageComposer 
            webhooks={webhooks} 
            onSendMessage={sendMessage} 
            onEditMessage={editMessage}
            editingMessage={editingMessage}
            onCancelEdit={cancelEdit}
            showModal={showModal}
            language={language}
          />
        )}

        {view === 'history' && (
          <History 
            messages={history} 
            onTriggerEdit={triggerEdit}
            onDeleteMessage={deleteMessage}
            showModal={showModal}
            language={language}
          />
        )}
      </main>

      <Modal {...modal} onCancel={modal.onCancel || closeModal} />
    </div>
  )
}

export default App

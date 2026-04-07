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
import Footer from './components/Footer'

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
      />
      
      <main style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.1)' }}>
        {view === 'dashboard' && (
          <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
             <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: 800 }}>{t.welcome}</h1>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px' }}>
                {t.dashboard_desc}
             </p>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                   <div style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>{webhooks.length}</div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.stats_webhooks}</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                   <div style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>{history.length}</div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.stats_messages}</p>
                </div>
                <div className="glass glass-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }} onClick={() => setView('composer')}>
                   <div style={{ color: 'var(--text-primary)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                   </div>
                   <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{t.send_new}</p>
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
            closeModal={closeModal}
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
            closeModal={closeModal}
            language={language}
          />
        )}

        {view === 'history' && (
          <History 
            messages={history} 
            onTriggerEdit={triggerEdit}
            onDeleteMessage={deleteMessage}
            showModal={showModal}
            closeModal={closeModal}
            language={language}
          />
        )}
      </main>

      <Footer language={language} onLanguageChange={setLanguage} />

      <Modal {...modal} onCancel={modal.onCancel || closeModal} language={language} />
    </div>
  )
}

export default App

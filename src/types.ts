export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

export interface WebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
}

export interface SentMessage {
  id: string;
  webhookId: string;
  webhookName: string;
  payload: WebhookPayload; // Now stores the full payload
  timestamp: number;
  messageId: string; 
}

export type View = 'dashboard' | 'webhooks' | 'history' | 'composer';

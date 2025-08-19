export interface TicketAuthor {
  role: 'requester' | 'agent' | 'agent (internal)';
  name: string;
  email?: string;
}

export interface TicketComment {
  author: TicketAuthor;
  public: boolean;
  body: string;
  created_at: string;
  attachments: Array<{
    file_name: string;
  }>;
}

export interface Ticket {
  subject: string;
  requester: {
    name: string;
    email: string;
  };
  created_at: string;
  comment: {
    body: string;
    public: boolean;
  };
  comments: TicketComment[];
}

export interface TicketData {
  tickets: Ticket[];
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  color: string;
}

export interface CategorizedTicket extends Ticket {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment: 'positive' | 'neutral' | 'negative';
  responseTime?: number; // in hours
  isEscalated: boolean;
}

export interface TicketStats {
  totalTickets: number;
  categories: Record<string, number>;
  priorities: Record<string, number>;
  sentiments: Record<string, number>;
  averageResponseTime: number;
  escalatedCount: number;
  topRequesters: Array<{
    name: string;
    email: string;
    ticketCount: number;
  }>;
  topAgents: Array<{
    name: string;
    ticketCount: number;
  }>;
} 
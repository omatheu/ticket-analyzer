import { Ticket, CategorizedTicket, TicketStats, TicketCategory } from '../types/ticket';

// Define ticket categories with keywords for automatic classification
export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'account-access',
    name: 'Account Access Issues',
    description: 'Login problems, password resets, 2FA issues, account locks',
    keywords: ['locked', 'password', 'login', '2fa', 'reset', 'account', 'unlock'],
    color: '#ef4444'
  },
  {
    id: 'returns-refunds',
    name: 'Returns & Refunds',
    description: 'Return requests, refund processing, RMA labels',
    keywords: ['return', 'refund', 'rma', 'exchange', 'swap', 'size', 'fit'],
    color: '#f59e0b'
  },
  {
    id: 'shipping-delivery',
    name: 'Shipping & Delivery',
    description: 'Tracking issues, delivery delays, missing packages',
    keywords: ['tracking', 'delivery', 'shipped', 'eta', 'carrier', 'package', 'label'],
    color: '#3b82f6'
  },
  {
    id: 'product-issues',
    name: 'Product Issues',
    description: 'Damaged items, wrong items, missing parts',
    keywords: ['damaged', 'scratched', 'wrong', 'missing', 'parts', 'condition'],
    color: '#8b5cf6'
  },
  {
    id: 'payment-billing',
    name: 'Payment & Billing',
    description: 'Payment failures, duplicate charges, store credit issues',
    keywords: ['payment', 'charge', 'billing', 'gift card', 'store credit', 'failed'],
    color: '#10b981'
  },
  {
    id: 'order-modifications',
    name: 'Order Modifications',
    description: 'Address changes, order cancellations, item additions',
    keywords: ['address', 'cancel', 'add item', 'modify', 'change'],
    color: '#06b6d4'
  },
  {
    id: 'promo-codes',
    name: 'Promo Code Issues',
    description: 'Promo code rejections, price adjustments, discounts',
    keywords: ['promo', 'code', 'discount', 'price match', 'adjustment', 'vip'],
    color: '#ec4899'
  },
  {
    id: 'general-inquiry',
    name: 'General Inquiries',
    description: 'General questions, information requests',
    keywords: ['question', 'inquiry', 'help', 'information'],
    color: '#6b7280'
  }
];

// Priority keywords for automatic priority assignment
const PRIORITY_KEYWORDS = {
  urgent: ['asap', 'urgent', 'emergency', 'critical'],
  high: ['important', 'priority', 'escalate', 'stuck'],
  medium: ['help', 'issue', 'problem'],
  low: ['question', 'inquiry', 'general']
};

// Sentiment analysis keywords
const SENTIMENT_KEYWORDS = {
  positive: ['thanks', 'thank you', 'appreciate', 'great', 'awesome', 'perfect', 'works', 'resolved'],
  negative: ['problem', 'issue', 'stuck', 'failed', 'wrong', 'damaged', 'missing', 'urgent', 'asap'],
  neutral: ['question', 'inquiry', 'help', 'information', 'update']
};

export function categorizeTicket(ticket: Ticket): CategorizedTicket {
  const subject = ticket.subject.toLowerCase();
  const body = ticket.comment.body.toLowerCase();
  const fullText = `${subject} ${body}`;
  
  // Determine category
  let category = 'general-inquiry';
  let maxScore = 0;
  
  for (const cat of TICKET_CATEGORIES) {
    let score = 0;
    for (const keyword of cat.keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      category = cat.id;
    }
  }
  
  // Determine priority
  let priority: 'low' | 'medium' | 'high' | 'urgent' = 'low';
  for (const [level, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some(keyword => fullText.includes(keyword))) {
      priority = level as 'low' | 'medium' | 'high' | 'urgent';
      break;
    }
  }
  
  // Determine sentiment
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let sentimentScore = 0;
  for (const [level, keywords] of Object.entries(SENTIMENT_KEYWORDS)) {
    const score = keywords.filter(keyword => fullText.includes(keyword)).length;
    if (score > sentimentScore) {
      sentimentScore = score;
      sentiment = level as 'positive' | 'neutral' | 'negative';
    }
  }
  
  // Calculate response time
  let responseTime: number | undefined;
  if (ticket.comments.length > 1) {
    const firstComment = new Date(ticket.created_at);
    const firstAgentResponse = ticket.comments.find(c => c.author.role === 'agent');
    if (firstAgentResponse) {
      const responseDate = new Date(firstAgentResponse.created_at);
      responseTime = (responseDate.getTime() - firstComment.getTime()) / (1000 * 60 * 60); // hours
    }
  }
  
  // Determine if escalated (has internal comments or multiple agent responses)
  const isEscalated = ticket.comments.some(c => 
    c.author.role === 'agent (internal)' || 
    c.public === false
  ) || ticket.comments.filter(c => c.author.role === 'agent').length > 1;
  
  return {
    ...ticket,
    category,
    priority,
    sentiment,
    responseTime,
    isEscalated
  };
}

export function analyzeTickets(tickets: Ticket[]): TicketStats {
  const categorizedTickets = tickets.map(categorizeTicket);
  
  // Calculate statistics
  const categories: Record<string, number> = {};
  const priorities: Record<string, number> = {};
  const sentiments: Record<string, number> = {};
  const requesterCounts: Record<string, number> = {};
  const agentCounts: Record<string, number> = {};
  
  let totalResponseTime = 0;
  let responseTimeCount = 0;
  let escalatedCount = 0;
  
  categorizedTickets.forEach(ticket => {
    // Category counts
    categories[ticket.category] = (categories[ticket.category] || 0) + 1;
    
    // Priority counts
    priorities[ticket.priority] = (priorities[ticket.priority] || 0) + 1;
    
    // Sentiment counts
    sentiments[ticket.sentiment] = (sentiments[ticket.sentiment] || 0) + 1;
    
    // Requester counts
    requesterCounts[ticket.requester.email] = (requesterCounts[ticket.requester.email] || 0) + 1;
    
    // Response time
    if (ticket.responseTime !== undefined) {
      totalResponseTime += ticket.responseTime;
      responseTimeCount++;
    }
    
    // Escalated count
    if (ticket.isEscalated) {
      escalatedCount++;
    }
    
    // Agent counts
    ticket.comments.forEach(comment => {
      if (comment.author.role === 'agent' || comment.author.role === 'agent (internal)') {
        agentCounts[comment.author.name] = (agentCounts[comment.author.name] || 0) + 1;
      }
    });
  });
  
  // Get top requesters
  const topRequesters = Object.entries(requesterCounts)
    .map(([email, count]) => {
      const ticket = categorizedTickets.find(t => t.requester.email === email);
      return {
        name: ticket?.requester.name || 'Unknown',
        email,
        ticketCount: count
      };
    })
    .sort((a, b) => b.ticketCount - a.ticketCount)
    .slice(0, 10);
  
  // Get top agents
  const topAgents = Object.entries(agentCounts)
    .map(([name, count]) => ({
      name,
      ticketCount: count
    }))
    .sort((a, b) => b.ticketCount - a.ticketCount)
    .slice(0, 10);
  
  return {
    totalTickets: tickets.length,
    categories,
    priorities,
    sentiments,
    averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
    escalatedCount,
    topRequesters,
    topAgents
  };
}

export function getCategoryById(id: string): TicketCategory | undefined {
  return TICKET_CATEGORIES.find(cat => cat.id === id);
}

export function filterTickets(
  tickets: CategorizedTicket[],
  filters: {
    category?: string;
    priority?: string;
    sentiment?: string;
    escalated?: boolean;
    search?: string;
  }
): CategorizedTicket[] {
  return tickets.filter(ticket => {
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.sentiment && ticket.sentiment !== filters.sentiment) return false;
    if (filters.escalated !== undefined && ticket.isEscalated !== filters.escalated) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSubject = ticket.subject.toLowerCase().includes(searchLower);
      const matchesBody = ticket.comment.body.toLowerCase().includes(searchLower);
      const matchesRequester = ticket.requester.name.toLowerCase().includes(searchLower) ||
                              ticket.requester.email.toLowerCase().includes(searchLower);
      
      if (!matchesSubject && !matchesBody && !matchesRequester) return false;
    }
    
    return true;
  });
} 
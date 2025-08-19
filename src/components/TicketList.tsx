import { useState } from 'react';
import { CategorizedTicket } from '../types/ticket';
import { getCategoryById } from '../utils/ticketAnalyzer';

interface TicketListProps {
  tickets: CategorizedTicket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());

  const toggleTicket = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (hours: number | undefined) => {
    if (hours === undefined) return 'N/A';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  if (tickets.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {tickets.map((ticket, index) => {
        const category = getCategoryById(ticket.category);
        const isExpanded = expandedTickets.has(`${ticket.requester.email}-${index}`);
        const ticketId = `${ticket.requester.email}-${index}`;

        return (
          <div key={ticketId} className="p-6 hover:bg-gray-50 transition-colors">
            {/* Ticket Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSentimentColor(ticket.sentiment)}`}>
                    {ticket.sentiment.charAt(0).toUpperCase() + ticket.sentiment.slice(1)}
                  </span>
                  {category && (
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                  {ticket.isEscalated && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      ⚠️ Escalated
                    </span>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {ticket.subject}
                </h4>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span>👤 {ticket.requester.name}</span>
                  <span>📧 {ticket.requester.email}</span>
                  <span>📅 {formatDate(ticket.created_at)}</span>
                  <span>⏱️ Response: {formatTime(ticket.responseTime)}</span>
                  <span>💬 {ticket.comments.length} comments</span>
                </div>
              </div>
              
              <button
                onClick={() => toggleTicket(ticketId)}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Ticket Body */}
            <div className="text-gray-700 mb-4">
              <p className="whitespace-pre-wrap">{ticket.comment.body}</p>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Comments */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Conversation History</h5>
                  <div className="space-y-3">
                    {ticket.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              comment.author.role === 'requester' 
                                ? 'bg-blue-100 text-blue-800' 
                                : comment.author.role === 'agent (internal)'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {comment.author.role === 'requester' ? '👤 Customer' : 
                               comment.author.role === 'agent (internal)' ? '🔒 Internal' : '👨‍💼 Agent'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
                        {comment.attachments.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">📎 Attachments: </span>
                            {comment.attachments.map((attachment, attIndex) => (
                              <span key={attIndex} className="text-xs text-blue-600 hover:underline">
                                {attachment.file_name}{attIndex < comment.attachments.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">AI Analysis</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Category: </span>
                      <span className="text-blue-600">{category?.name || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Priority: </span>
                      <span className="text-blue-600">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Sentiment: </span>
                      <span className="text-blue-600">{ticket.sentiment.charAt(0).toUpperCase() + ticket.sentiment.slice(1)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Response Time: </span>
                      <span className="text-blue-600">{formatTime(ticket.responseTime)}</span>
                    </div>
                  </div>
                  {ticket.isEscalated && (
                    <div className="mt-2 p-2 bg-red-100 rounded border border-red-200">
                      <span className="text-sm text-red-800 font-medium">⚠️ This ticket has been escalated and may require engineering attention.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 
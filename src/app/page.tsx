'use client';

import { useState, useEffect } from 'react';
import { CategorizedTicket, TicketStats, TicketCategory } from '../types/ticket';
import { TICKET_CATEGORIES, getCategoryById } from '../utils/ticketAnalyzer';
import TicketList from '../components/TicketList';
import DashboardStats from '../components/DashboardStats';
import FilterPanel from '../components/FilterPanel';
import PriorityChart from '../components/PriorityChart';
import CategoryChart from '../components/CategoryChart';

export default function Home() {
  const [tickets, setTickets] = useState<CategorizedTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    sentiment: '',
    escalated: undefined as boolean | undefined,
    search: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.sentiment) params.append('sentiment', filters.sentiment);
      if (filters.escalated !== undefined) params.append('escalated', filters.escalated.toString());
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/tickets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tickets');
      
      const data = await response.json();
      setTickets(data.tickets);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Ticket Analyzer</h1>
              <p className="text-gray-600 mt-1">Analyze and categorize support tickets for better decision making</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalTickets || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Escalated</p>
                <p className="text-2xl font-bold text-red-600">{stats?.escalatedCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        {stats && <DashboardStats stats={stats} />}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <PriorityChart priorities={stats?.priorities || {}} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
            <CategoryChart categories={stats?.categories || {}} />
          </div>
        </div>

        {/* Filters and Ticket List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange}
              categories={TICKET_CATEGORIES}
            />
          </div>

          {/* Ticket List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tickets ({tickets.length})
                  </h3>
                  <div className="flex space-x-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryById(filters.category)?.name}
                      </span>
                    )}
                    {filters.priority && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(filters.priority)}`}>
                        {filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1)}
                      </span>
                    )}
                    {filters.sentiment && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(filters.sentiment)}`}>
                        {filters.sentiment.charAt(0).toUpperCase() + filters.sentiment.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <TicketList tickets={tickets} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { TicketData } from '../../../types/ticket';
import { analyzeTickets, categorizeTicket, filterTickets } from '../../../utils/ticketAnalyzer';

export async function GET(request: NextRequest) {
  try {
    // Read the ticket data from the public file
    const ticketData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/zendesk_mock_tickets_llm_flavor.json`);
    const tickets: TicketData = await ticketData.json();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const sentiment = searchParams.get('sentiment');
    const escalated = searchParams.get('escalated');
    const search = searchParams.get('search');
    
    // Categorize all tickets
    const categorizedTickets = tickets.tickets.map(categorizeTicket);
    
    // Apply filters if provided
    const filteredTickets = filterTickets(categorizedTickets, {
      category: category || undefined,
      priority: priority || undefined,
      sentiment: sentiment || undefined,
      escalated: escalated === 'true' ? true : escalated === 'false' ? false : undefined,
      search: search || undefined
    });
    
    // Analyze tickets for statistics
    const stats = analyzeTickets(tickets.tickets);
    
    return NextResponse.json({
      tickets: filteredTickets,
      stats,
      total: filteredTickets.length,
      unfilteredTotal: tickets.tickets.length
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
} 
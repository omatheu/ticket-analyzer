# Support Ticket Analyzer

An AI-powered full-stack application for categorizing and analyzing support tickets to help support managers make better decisions about which issues to escalate to engineering.

## 🐳 Quick Start with Docker

### **Option 1: Docker Compose (Recommended)**
```bash
# Build and start the application
docker-compose up --build

# Access at: http://localhost:3000
```

### **Option 2: Direct Docker Commands**
```bash
# Build the image
docker build -t support-ticket-analyzer:latest .

# Run the container
docker run --rm -p 3000:3000 support-ticket-analyzer:latest

# Access at: http://localhost:3000
```

📖 **For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)**

## Features

### 🎯 **Automatic Ticket Categorization**
- **8 predefined categories** with intelligent keyword-based classification
- **Priority assessment** (urgent, high, medium, low) based on ticket content
- **Sentiment analysis** (positive, neutral, negative) for customer satisfaction insights
- **Response time calculation** to identify slow-response tickets

### 📊 **Comprehensive Analytics Dashboard**
- **Real-time statistics** showing total tickets, escalated count, and average response time
- **Interactive charts** using Recharts for data visualization
- **Top performers tracking** for both customers and support agents
- **Category and priority breakdowns** with percentage distributions

### 🔍 **Advanced Filtering & Search**
- **Multi-criteria filtering** by category, priority, sentiment, and escalation status
- **Full-text search** across ticket subjects, bodies, and customer information
- **Real-time filtering** with instant results
- **Filter combination** for precise ticket discovery

### 📋 **Detailed Ticket Management**
- **Expandable ticket view** with full conversation history
- **AI analysis insights** for each ticket
- **Attachment tracking** and comment threading
- **Escalation indicators** for tickets requiring engineering attention

## Categories

The system automatically categorizes tickets into these areas:

1. **Account Access Issues** - Login problems, 2FA, password resets
2. **Returns & Refunds** - Return requests, exchanges, RMA labels
3. **Shipping & Delivery** - Tracking issues, delivery delays
4. **Product Issues** - Damaged items, wrong items, missing parts
5. **Payment & Billing** - Payment failures, store credit issues
6. **Order Modifications** - Address changes, cancellations, item additions
7. **Promo Code Issues** - Code rejections, price adjustments
8. **General Inquiries** - General questions and information requests

## Technology Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Charts**: Recharts for interactive data visualization
- **Backend**: Next.js API routes with server-side processing
- **Data Processing**: Intelligent keyword-based categorization algorithms
- **UI/UX**: Modern, responsive design with accessibility features
- **Containerization**: Docker with multi-stage builds and Alpine Linux

## Getting Started

### Prerequisites
- Node.js 18+ (for local development)
- Docker (for containerized deployment)
- npm or yarn

### Option 1: Docker Deployment (Recommended)
```bash
# Clone and run with Docker
git clone <repository-url>
cd support-ticket-analyzer
docker-compose up --build
```

### Option 2: Local Development
```bash
# Clone the repository
git clone <repository-url>
cd support-ticket-analyzer

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser
# Navigate to [http://localhost:3000](http://localhost:3000)
```

### Data Setup

The application uses the `zendesk_mock_tickets_llm_flavor.json` file located in the `public/` directory. This file contains 50 sample support tickets for demonstration purposes.

## Usage

### Dashboard Overview
- **Key Metrics**: View total tickets, escalated count, average response time, and active users
- **Priority Breakdown**: See distribution of urgent, high, medium, and low priority tickets
- **Sentiment Analysis**: Understand customer satisfaction levels
- **Top Performers**: Identify most active customers and agents

### Ticket Analysis
- **Automatic Categorization**: Each ticket is automatically classified based on content analysis
- **Priority Assessment**: Urgency is determined by keywords like "ASAP", "urgent", "stuck"
- **Sentiment Detection**: Positive/negative language is identified for customer satisfaction tracking
- **Escalation Detection**: Internal comments and multiple agent responses trigger escalation flags

### Filtering & Search
- **Category Filter**: Filter by specific ticket categories
- **Priority Filter**: Focus on high-priority or urgent tickets
- **Sentiment Filter**: Analyze positive or negative customer experiences
- **Escalation Filter**: Identify tickets requiring engineering attention
- **Text Search**: Search across all ticket content and customer information

### Ticket Details
- **Expandable View**: Click on any ticket to see full conversation history
- **Comment Threading**: View all customer and agent interactions
- **Attachment Tracking**: See files and images associated with tickets
- **AI Insights**: Get automated analysis of ticket characteristics

## Business Value

### For Support Managers
- **Identify Critical Issues**: Quickly spot urgent tickets requiring immediate attention
- **Resource Allocation**: Understand which categories need more support resources
- **Performance Metrics**: Track response times and customer satisfaction
- **Escalation Decisions**: Make informed decisions about when to involve engineering

### For Engineering Teams
- **Prioritized Bug Reports**: Focus on high-priority technical issues
- **Pattern Recognition**: Identify recurring problems across multiple tickets
- **Customer Impact Assessment**: Understand which issues affect the most customers
- **Resource Planning**: Plan engineering work based on support ticket trends

### For Customer Success
- **Proactive Support**: Identify and address issues before they escalate
- **Customer Satisfaction**: Track sentiment trends and response quality
- **Efficiency Improvements**: Optimize support processes based on data insights
- **Training Opportunities**: Identify areas where agents need additional training

## API Endpoints

### GET `/api/tickets`
Returns categorized and filtered ticket data with statistics.

**Query Parameters:**
- `category`: Filter by ticket category
- `priority`: Filter by priority level
- `sentiment`: Filter by sentiment analysis
- `escalated`: Filter by escalation status
- `search`: Full-text search across tickets

**Response:**
```json
{
  "tickets": [...],
  "stats": {...},
  "total": 25,
  "unfilteredTotal": 50
}
```

## Deployment

### Docker Production
```bash
# Build production image
docker build -t support-ticket-analyzer:latest .

# Run with restart policy
docker run -d --restart=unless-stopped -p 3000:3000 support-ticket-analyzer:latest
```

### Docker Compose Production
```bash
# Start with restart policy
docker-compose -f docker-compose.yml up -d

# Scale if needed
docker-compose up --scale support-ticket-analyzer=3
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, Docker, and modern web technologies**

**🐳 Ready to deploy?** Start with `docker-compose up --build` and access your application at http://localhost:3000!

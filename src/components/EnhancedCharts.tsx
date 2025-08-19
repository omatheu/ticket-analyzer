import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getCategoryById } from '../utils/ticketAnalyzer';

interface EnhancedChartsProps {
  categories: Record<string, number>;
  priorities: Record<string, number>;
  sentiments: Record<string, number>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export function CategoryPieChart({ categories }: { categories: Record<string, number> }) {
  const data = Object.entries(categories).map(([categoryId, value]) => {
    const category = getCategoryById(categoryId);
    return {
      name: category?.name || categoryId,
      value,
      color: category?.color || '#6b7280'
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PriorityBarChart({ priorities }: { priorities: Record<string, number> }) {
  const data = Object.entries(priorities).map(([priority, value]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count: value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priority" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SentimentBarChart({ sentiments }: { sentiments: Record<string, number> }) {
  const data = Object.entries(sentiments).map(([sentiment, value]) => ({
    sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count: value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sentiment" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function EnhancedCharts({ categories, priorities, sentiments }: EnhancedChartsProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
        <CategoryPieChart categories={categories} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <PriorityBarChart priorities={priorities} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <SentimentBarChart sentiments={sentiments} />
        </div>
      </div>
    </div>
  );
} 
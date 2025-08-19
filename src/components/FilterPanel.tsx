import { TicketCategory } from '../types/ticket';

interface Filters {
  category: string;
  priority: string;
  sentiment: string;
  escalated: boolean | undefined;
  search: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  categories: TicketCategory[];
}

export default function FilterPanel({ filters, onFilterChange, categories }: FilterPanelProps) {
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const sentiments = ['positive', 'neutral', 'negative'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sentiment Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sentiment
        </label>
        <select
          value={filters.sentiment}
          onChange={(e) => onFilterChange({ sentiment: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Sentiments</option>
          {sentiments.map((sentiment) => (
            <option key={sentiment} value={sentiment}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Escalated Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escalation Status
        </label>
        <select
          value={filters.escalated === undefined ? '' : filters.escalated.toString()}
          onChange={(e) => {
            const value = e.target.value;
            onFilterChange({ 
              escalated: value === '' ? undefined : value === 'true' 
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Tickets</option>
          <option value="true">Escalated Only</option>
          <option value="false">Not Escalated</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({
          category: '',
          priority: '',
          sentiment: '',
          escalated: undefined,
          search: ''
        })}
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Clear All Filters
      </button>
    </div>
  );
} 
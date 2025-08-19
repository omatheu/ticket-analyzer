import { getCategoryById } from '../utils/ticketAnalyzer';

interface CategoryChartProps {
  categories: Record<string, number>;
}

export default function CategoryChart({ categories }: CategoryChartProps) {
  const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No category data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .map(([categoryId, count]) => {
          const category = getCategoryById(categoryId);
          const percentage = ((count / total) * 100).toFixed(1);
          const width = `${percentage}%`;
          
          return (
            <div key={categoryId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category?.color || '#6b7280' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {category?.name || categoryId}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {count} ({percentage}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width,
                    backgroundColor: category?.color || '#6b7280'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
    </div>
  );
} 
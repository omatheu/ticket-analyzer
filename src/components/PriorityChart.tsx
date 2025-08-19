interface PriorityChartProps {
  priorities: Record<string, number>;
}

export default function PriorityChart({ priorities }: PriorityChartProps) {
  const total = Object.values(priorities).reduce((sum, count) => sum + count, 0);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No priority data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(priorities)
        .sort(([, a], [, b]) => b - a)
        .map(([priority, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          const width = `${percentage}%`;
          
          return (
            <div key={priority} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {getPriorityLabel(priority)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {count} ({percentage}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getPriorityColor(priority)} transition-all duration-300`}
                  style={{ width }}
                ></div>
              </div>
            </div>
          );
        })}
    </div>
  );
} 
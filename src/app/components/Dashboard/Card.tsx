// components/dashboard/Card.tsx

interface CardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    className?: string;
    trend?: {
      value: string;
      isPositive: boolean;
    };
    subtitle?: string;
  }
  
  const Card = ({ title, value, icon, className = "", trend, subtitle }: CardProps) => (
    <div className={`p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {trend && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend.isPositive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="text-sky-500 bg-gradient-to-br from-sky-100 to-blue-100 p-4 rounded-2xl group-hover:from-sky-200 group-hover:to-blue-200 transition-all duration-200">
          {icon}
        </div>
      </div>
    </div>
  );
  
  export default Card;
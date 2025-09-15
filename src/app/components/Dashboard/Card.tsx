// components/dashboard/Card.tsx

interface CardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    className?: string;
  }
  
  const Card = ({ title, value, icon, className = "" }: CardProps) => (
    <div className={`p-6 bg-white rounded-2xl shadow-md flex items-center justify-between ${className}`}>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="text-sky-500 bg-sky-100 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
  
  export default Card;
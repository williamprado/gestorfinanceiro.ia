
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const colorVariants = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
  indigo: "bg-indigo-100 text-indigo-600",
  orange: "bg-orange-100 text-orange-600"
};

export const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  const colorClass = colorVariants[color as keyof typeof colorVariants] || colorVariants.blue;
  
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

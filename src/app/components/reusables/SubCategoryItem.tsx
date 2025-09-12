import React, { ComponentType } from 'react'

interface SubCategoryItemProps {
    label: string;
    icon: ComponentType<{ className?: string }>;
    bgColor: string;
}

const SubCategoryItem = ({ label, icon: Icon, bgColor }: SubCategoryItemProps) => {
    return (
        <div className="flex flex-col items-center p-4 rounded-xl transition-colors duration-200">
            <div className={`w-24 h-24 ${bgColor} rounded-2xl flex items-center justify-center mb-2 shadow-inner`}>
                <Icon className="w-16 h-16 text-gray-800" />
            </div>
            <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
    );
};

export default SubCategoryItem
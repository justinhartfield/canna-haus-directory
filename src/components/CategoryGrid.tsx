
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  categories: {
    id: number;
    name: string;
    imageUrl: string;
    count: number;
  }[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          to={`/category/${category.id}`}
          className="group relative overflow-hidden rounded-xl aspect-[4/3]"
        >
          <img 
            src={category.imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
            <p className="text-gray-300 text-sm">{category.count} images</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;

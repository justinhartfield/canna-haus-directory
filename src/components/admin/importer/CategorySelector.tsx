
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectorProps {
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  setCategory,
  categories
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Category</Label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;

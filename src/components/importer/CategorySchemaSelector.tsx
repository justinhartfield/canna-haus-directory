
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySchemaSelectorProps {
  selectedCategory: string;
  schemaType: string;
  onCategoryChange: (value: string) => void;
  onSchemaTypeChange: (value: string) => void;
  isProcessing: boolean;
  categories: string[];
  schemaTypes: string[];
}

const CategorySchemaSelector: React.FC<CategorySchemaSelectorProps> = ({
  selectedCategory,
  schemaType,
  onCategoryChange,
  onSchemaTypeChange,
  isProcessing,
  categories,
  schemaTypes
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={selectedCategory} 
          onValueChange={onCategoryChange}
          disabled={isProcessing}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="schemaType">Schema Type</Label>
        <Select 
          value={schemaType} 
          onValueChange={onSchemaTypeChange}
          disabled={isProcessing}
        >
          <SelectTrigger id="schemaType">
            <SelectValue placeholder="Select schema type" />
          </SelectTrigger>
          <SelectContent>
            {schemaTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategorySchemaSelector;

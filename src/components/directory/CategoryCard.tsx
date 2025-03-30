
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: string;
  count: number;
  description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, count, description }) => {
  const navigate = useNavigate();

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      'Genetics': 'Cannabis strains and genetic information, including lineage, effects, and characteristics.',
      'Medical': 'Research and information about medical applications of cannabis for various conditions.',
      'Lab Data': 'Analysis results, terpene profiles, cannabinoid content, and testing methodologies.',
      'Cultivation': 'Techniques, guides, and best practices for cannabis cultivation and growing.',
      'Compliance': 'Regulatory information, legal requirements, and compliance guides for cannabis businesses.',
      'Consumer': 'Information for cannabis consumers, including consumption methods and product guides.'
    };
    
    return description || descriptions[category] || `Browse all ${category} entries in our directory.`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{category}</CardTitle>
        <CardDescription>{getCategoryDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-lg">{count}</span> {count === 1 ? 'entry' : 'entries'}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/directory/category/${encodeURIComponent(category.toLowerCase())}`)}
          variant="outline"
          className="w-full"
        >
          Browse {category}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;

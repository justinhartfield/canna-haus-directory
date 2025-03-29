
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { DirectoryCardFooter } from './directory/DirectoryCardFooter';

interface DirectoryCardProps {
  id: string; // Change from number to string to match the UUID in the database
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  jsonLd?: Record<string, any>;
  hasExamples?: boolean;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
  id,
  title,
  description,
  category,
  subcategory,
  jsonLd,
  hasExamples
}) => {
  // Truncate description if it's too long
  const truncatedDescription = description && description.length > 120
    ? `${description.substring(0, 120)}...`
    : description;

  // Apply proper capitalization to category
  const formattedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : '';

  // Apply proper capitalization to subcategory
  const formattedSubcategory = subcategory
    ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
    : '';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {formattedCategory}
            </Badge>
            {subcategory && (
              <Badge variant="outline" className="ml-2 bg-secondary/10 text-secondary border-secondary/20">
                {formattedSubcategory}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-xl mt-3 line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3 mt-1">
          {truncatedDescription || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {jsonLd && (
          <div className="text-xs rounded-md bg-muted p-3 font-mono">
            <pre className="overflow-x-auto">{JSON.stringify(jsonLd, null, 2).substring(0, 200)}...</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <DirectoryCardFooter hasExamples={hasExamples} />
          <Button asChild variant="ghost" size="sm">
            <Link to={`/directory/${id}`} className="flex items-center">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DirectoryCard;

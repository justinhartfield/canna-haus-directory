
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { Button } from '@/components/ui/button';
import { getDirectoryItemsByCategory } from '@/api/services/directoryItem/crudOperations';

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL parameter to proper category name
  const formattedCategory = category ? 
    category.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') : '';
  
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['directoryItemsByCategory', formattedCategory],
    queryFn: () => getDirectoryItemsByCategory(formattedCategory),
    enabled: !!formattedCategory
  });

  // If category doesn't exist, navigate back to directory
  useEffect(() => {
    if (!isLoading && !error && items.length === 0) {
      navigate('/directory');
    }
  }, [isLoading, error, items, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/directory')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Categories
            </Button>
            
            <div className="max-w-4xl mx-auto mb-8">
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/directory')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Categories
            </Button>
            
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">Error Loading Category</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An unknown error occurred"}
              </p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/directory')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Categories
          </Button>
          
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-2">{formattedCategory}</h1>
            <p className="text-muted-foreground">
              Browse {items.length} {items.length === 1 ? 'item' : 'items'} in the {formattedCategory} category.
            </p>
          </div>
          
          <DirectoryResults 
            items={items} 
            onClearFilters={() => navigate('/directory')} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryView;

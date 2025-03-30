
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import DispensaryExamples from '@/components/directory/examples/DispensaryExamples';
import ConsumptionMethodsExamples from '@/components/directory/examples/ConsumptionMethodsExamples';
import ExtractionTechniquesExamples from '@/components/directory/examples/ExtractionTechniquesExamples';
import DefaultExamples from '@/components/directory/examples/DefaultExamples';
import JsonLdDisplay from '@/components/directory/JsonLdDisplay';
import ImplementationGuide from '@/components/directory/ImplementationGuide';
import { getDirectoryItemById } from '@/api/services/directoryItem/crudOperations';

const DirectoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['directoryItem', id],
    queryFn: () => id ? getDirectoryItemById(id) : null,
    enabled: !!id
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-6"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The directory item you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/directory')}>
                Back to Directory
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasExamples = !!item.additionalFields && Object.keys(item.additionalFields).length > 0;

  const renderExamples = () => {
    if (!hasExamples) return null;

    switch (item.category) {
      case 'Dispensaries':
        return <DispensaryExamples />;
      case 'Consumption Methods':
        return <ConsumptionMethodsExamples />;
      case 'Extraction Techniques':
        return <ExtractionTechniquesExamples />;
      default:
        return <DefaultExamples jsonLd={item.jsonLd} />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
              Back to Directory
            </Button>
            
            <div className="mb-4">
              <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
                {item.category}
              </span>
              <h1 className="text-3xl font-bold">{item.title}</h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              {item.description}
            </p>

            {renderExamples()}

            <JsonLdDisplay jsonLd={item.jsonLd} />
            
            <ImplementationGuide jsonLd={item.jsonLd} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DirectoryDetail;

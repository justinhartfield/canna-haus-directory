import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MOCK_DIRECTORY_DATA } from '@/data/directory';
import DispensaryExamples from '@/components/directory/examples/DispensaryExamples';
import ConsumptionMethodsExamples from '@/components/directory/examples/ConsumptionMethodsExamples';
import ExtractionTechniquesExamples from '@/components/directory/examples/ExtractionTechniquesExamples';
import DefaultExamples from '@/components/directory/examples/DefaultExamples';

const DirectoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    if (id) {
      const numId = parseInt(id, 10);
      const found = MOCK_DIRECTORY_DATA.find(item => item.id === numId);
      
      if (found) {
        setItem(found);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
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

  if (!item) {
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

  const renderExamples = () => {
    if (!item.hasExamples) return null;

    switch (item.category) {
      case 'Dispensaries':
        return <DispensaryExamples />;
      case 'Consumption Methods':
        return <ConsumptionMethodsExamples />;
      case 'Extraction Techniques':
        return <ExtractionTechniquesExamples />;
      default:
        return item.hasExamples ? <DefaultExamples jsonLd={item.jsonLd} /> : null;
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

            <div className="glass-card p-6 mb-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">JSON-LD Structured Data</h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-slate-800 dark:text-slate-200">
                    {JSON.stringify(item.jsonLd, null, 2)}
                  </code>
                </pre>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
              <p className="mb-4">
                You can integrate this structured data into your website by including the following script in your HTML:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto mb-6">
                <pre className="text-sm">
                  <code className="text-slate-800 dark:text-slate-200">
{`<script type="application/ld+json">
${JSON.stringify(item.jsonLd, null, 2)}
</script>`}
                  </code>
                </pre>
              </div>
              <Button onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(item.jsonLd, null, 2));
              }}>
                Copy JSON-LD
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DirectoryDetail;

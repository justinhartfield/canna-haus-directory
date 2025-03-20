
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MOCK_DIRECTORY_DATA } from '@/data/directory';

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
    switch (item.category) {
      case 'Dispensaries':
        return (
          <div className="glass-card p-6 mb-8 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Location Search</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dispensary location search
fetch('https://api.cannabis-data.org/dispensaries?lat=40.0150&lon=-105.2705&radius=10')
  .then(response => response.json())
  .then(data => {
    console.log('Nearby dispensaries:', data);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Inventory Check</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dispensary inventory check
fetch('https://api.cannabis-data.org/dispensaries/inventory?id=9&product=blue-dream')
  .then(response => response.json())
  .then(data => {
    console.log('Product availability:', data);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Delivery Estimation</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for delivery time estimation
fetch('https://api.cannabis-data.org/dispensaries/delivery?id=9&address=123+Main+St+Boulder+CO')
  .then(response => response.json())
  .then(data => {
    console.log('Estimated delivery time:', data.estimatedTime);
    console.log('Delivery fee:', data.fee);
  });`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      case 'Consumption Methods':
        return (
          <div className="glass-card p-6 mb-8 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Method Comparison</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for consumption method comparison
fetch('https://api.cannabis-data.org/consumption-methods/compare?methods=vaping,smoking,edibles')
  .then(response => response.json())
  .then(data => {
    console.log('Method comparison:', data);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Dosage Calculator</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dosage calculation
fetch('https://api.cannabis-data.org/consumption-methods/dosage?method=vaping&experience=beginner&weight=70&desired_effect=relaxation')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended dosage:', data.recommendation);
    console.log('Expected onset:', data.expectedOnset);
    console.log('Expected duration:', data.expectedDuration);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Equipment Finder</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for equipment recommendations
fetch('https://api.cannabis-data.org/consumption-methods/equipment?method=vaping&budget=medium&experience=intermediate')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended equipment:', data.recommendations);
    console.log('Retailers:', data.retailers);
  });`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      case 'Extraction Techniques':
        return (
          <div className="glass-card p-6 mb-8 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Technique Comparison</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for extraction technique comparison
fetch('https://api.cannabis-data.org/extraction-techniques/compare?techniques=co2,ethanol,hydrocarbon&factors=purity,safety,cost')
  .then(response => response.json())
  .then(data => {
    console.log('Technique comparison:', data);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Equipment Suppliers</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for equipment supplier information
fetch('https://api.cannabis-data.org/extraction-techniques/suppliers?technique=co2&region=north-america')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended suppliers:', data.suppliers);
    console.log('Equipment options:', data.equipment);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Yield Calculator</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for yield estimation
fetch('https://api.cannabis-data.org/extraction-techniques/yield-calculator?technique=co2&material=high-quality-flower&amount=5000&unit=grams')
  .then(response => response.json())
  .then(data => {
    console.log('Estimated yield:', data.estimatedYield);
    console.log('Operating costs:', data.operatingCosts);
    console.log('Estimated value:', data.estimatedValue);
  });`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      default:
        if (item.hasExamples) {
          return (
            <div className="glass-card p-6 mb-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded mb-4">
                <h3 className="font-medium mb-2">API Implementation</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example API call
fetch('https://api.cannabis-data.org/${item.category.toLowerCase()}/${item.id}')
  .then(response => response.json())
  .then(data => {
    console.log('Data retrieved:', data);
  });`}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <h3 className="font-medium mb-2">Integration with ChatGPT</h3>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-slate-800 dark:text-slate-200">
{`// Example ChatGPT API call using our data
async function queryChatGPT() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are an assistant with expertise in cannabis."
        },
        {
          role: "user",
          content: \`Analyze this cannabis data and provide insights: 
            \${JSON.stringify(${JSON.stringify(item.jsonLd, null, 2)})}
          \`
        }
      ]
    })
  });
  
  const data = await response.json();
  console.log(data.choices[0].message.content);
}`}
                  </code>
                </pre>
              </div>
            </div>
          );
        }
        return null;
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

            {/* Render Examples Section (if available) */}
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

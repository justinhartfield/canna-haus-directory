
import React from 'react';

interface DefaultExamplesProps {
  jsonLd: Record<string, any>;
}

const DefaultExamples: React.FC<DefaultExamplesProps> = ({ jsonLd }) => {
  return (
    <div className="glass-card p-6 mb-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded mb-4">
        <h3 className="font-medium mb-2">API Implementation</h3>
        <pre className="text-sm overflow-x-auto">
          <code className="text-slate-800 dark:text-slate-200">
{`// Example API call
fetch('https://api.cannabis-data.org/${jsonLd.type?.toLowerCase() || 'resources'}/${jsonLd.id}')
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
            \${JSON.stringify(${JSON.stringify(jsonLd, null, 2)})}
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
};

export default DefaultExamples;

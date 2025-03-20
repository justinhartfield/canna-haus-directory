
import React from 'react';

const AuthenticationSection: React.FC = () => {
  return (
    <section id="authentication" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Authentication</h2>
      <p className="mb-6">
        Access to the CannaHaus API requires an API key. You can obtain an API key by registering for an account on our developer portal.
      </p>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
        <p className="mb-4">
          Include your API key in the request headers using the <code className="bg-secondary/50 px-1 py-0.5 rounded">X-API-Key</code> header:
        </p>
        
        <pre className="bg-secondary/50 p-3 rounded-md font-mono text-sm overflow-x-auto">
{`curl -X GET "https://api.cannahaus.io/v1/strains" \\
  -H "X-API-Key: your_api_key_here"`}
        </pre>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">Access Tiers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left font-semibold">Tier</th>
                <th className="py-2 px-4 text-left font-semibold">Rate Limit</th>
                <th className="py-2 px-4 text-left font-semibold">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Free</td>
                <td className="py-3 px-4">100 requests/day</td>
                <td className="py-3 px-4">Basic read access to public data</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Developer</td>
                <td className="py-3 px-4">1,000 requests/day</td>
                <td className="py-3 px-4">Full read access, basic write access</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Business</td>
                <td className="py-3 px-4">10,000 requests/day</td>
                <td className="py-3 px-4">Full read/write access, webhook support</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Enterprise</td>
                <td className="py-3 px-4">Custom limits</td>
                <td className="py-3 px-4">All features, dedicated support, SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AuthenticationSection;

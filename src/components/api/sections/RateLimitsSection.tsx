
import React from 'react';

const RateLimitsSection: React.FC = () => {
  return (
    <section id="rate-limits" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
      <p className="mb-6">
        To ensure availability for all users, the API employs rate limiting based on your subscription tier. Rate limit information is included in the response headers.
      </p>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">Rate Limit Headers</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Header</th>
              <th className="py-2 px-4 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>X-RateLimit-Limit</code></td>
              <td className="py-3 px-4">Maximum number of requests allowed per day</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>X-RateLimit-Remaining</code></td>
              <td className="py-3 px-4">Number of requests remaining in the current period</td>
            </tr>
            <tr>
              <td className="py-3 px-4"><code>X-RateLimit-Reset</code></td>
              <td className="py-3 px-4">Unix timestamp for when the rate limit resets</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RateLimitsSection;

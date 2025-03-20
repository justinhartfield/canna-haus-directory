
import React from 'react';
import ApiExample from '@/components/ApiExample';

const AIRecommendationsSection: React.FC = () => {
  const aiRecommendationRequestExample = `{
  "effects": ["Relaxed", "Creative", "Uplifted"],
  "medical": ["Stress", "Insomnia", "Pain"],
  "avoid": ["Paranoia", "Dry Eyes"],
  "experience": "intermediate",
  "preferredType": "hybrid",
  "count": 3
}`;

  const aiRecommendationResponseExample = `{
  "success": true,
  "recommendations": [
    {
      "name": "Blue Dream",
      "type": "Hybrid (Sativa-dominant)",
      "thcContent": "17-24%",
      "cbdContent": "0.1-0.2%",
      "effects": ["Relaxed", "Creative", "Happy", "Uplifted", "Euphoric"],
      "medicalBenefits": ["Stress", "Pain", "Depression", "Insomnia"],
      "terpenes": ["Myrcene", "Pinene", "Caryophyllene"],
      "flavorProfile": ["Berry", "Sweet", "Blueberry", "Herbal"],
      "recommendationReason": "Blue Dream offers the perfect balance for intermediate users seeking relaxation and creativity without paranoia. Its moderate THC content and hybrid nature provide pain and stress relief while maintaining functionality."
    },
    {
      "name": "Wedding Cake",
      "type": "Hybrid (Indica-dominant)",
      "thcContent": "22-25%",
      "cbdContent": "0.1%",
      "effects": ["Relaxed", "Happy", "Uplifted", "Creative"],
      "medicalBenefits": ["Pain", "Stress", "Insomnia"],
      "terpenes": ["Caryophyllene", "Limonene", "Myrcene"],
      "flavorProfile": ["Sweet", "Vanilla", "Earthy"],
      "recommendationReason": "Wedding Cake delivers powerful relaxation and pain relief while still allowing for creative thought. Its balanced effect profile is perfect for intermediate users seeking relief without the paranoia or excessive dry eyes."
    },
    {
      "name": "Jack Herer",
      "type": "Hybrid (Sativa-dominant)",
      "thcContent": "18-23%",
      "cbdContent": "0.1-0.3%",
      "effects": ["Creative", "Uplifted", "Focused", "Happy", "Energetic"],
      "medicalBenefits": ["Stress", "Depression", "Fatigue"],
      "terpenes": ["Terpinolene", "Pinene", "Caryophyllene"],
      "flavorProfile": ["Pine", "Woody", "Earthy", "Citrus"],
      "recommendationReason": "Jack Herer provides the creative uplift you're seeking without triggering paranoia. It's excellent for stress relief while maintaining mental clarity, making it ideal for creative tasks."
    }
  ]
}`;

  return (
    <section id="ai-recommendations" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">AI Strain Recommendations API</h2>
      <p className="mb-6">
        Get personalized cannabis strain recommendations based on desired effects, medical conditions, and preferences using our AI engine.
      </p>
      
      <ApiExample
        endpoint="/functions/v1/recommend-strains"
        method="POST"
        description="Get AI-powered strain recommendations based on user preferences and needs."
        requestExample={aiRecommendationRequestExample}
        responseExample={aiRecommendationResponseExample}
      />

      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Request Parameters</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Parameter</th>
              <th className="py-2 px-4 text-left font-semibold">Type</th>
              <th className="py-2 px-4 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>effects</code></td>
              <td className="py-3 px-4">Array</td>
              <td className="py-3 px-4">Desired effects (e.g., "Relaxed", "Creative", "Euphoric")</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>medical</code></td>
              <td className="py-3 px-4">Array</td>
              <td className="py-3 px-4">Medical conditions to address (e.g., "Pain", "Anxiety", "Insomnia")</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>avoid</code></td>
              <td className="py-3 px-4">Array</td>
              <td className="py-3 px-4">Effects or side effects to avoid (e.g., "Paranoia", "Dry Mouth")</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>experience</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">User experience level ("novice", "intermediate", "experienced")</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>preferredType</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Preferred strain type ("indica", "sativa", "hybrid")</td>
            </tr>
            <tr>
              <td className="py-3 px-4"><code>count</code></td>
              <td className="py-3 px-4">Integer</td>
              <td className="py-3 px-4">Number of recommendations to return (default: 3)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AIRecommendationsSection;

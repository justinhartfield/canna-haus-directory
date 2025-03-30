
import React from 'react';
import { Button } from '@/components/ui/button';

interface AnalysisResultProps {
  result: {
    recommendedCategory: string;
    explanation: string;
    mappings: Record<string, string>;
    schemaType: string;
  };
  onApplyRecommendations: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result,
  onApplyRecommendations
}) => {
  return (
    <div className="bg-secondary/20 p-4 rounded space-y-3">
      <div>
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
        <p className="text-sm text-muted-foreground">{result.explanation}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Recommended Category:</span>
          <span className="text-sm bg-primary/20 px-2 py-1 rounded">{result.recommendedCategory}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm font-medium">Recommended Schema Type:</span>
          <span className="text-sm bg-primary/20 px-2 py-1 rounded">{result.schemaType}</span>
        </div>
        
        <div>
          <span className="text-sm font-medium">Suggested Mappings:</span>
          <div className="mt-1 text-sm border border-border rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-1 px-2">Field</th>
                  <th className="text-left py-1 px-2">Source Column</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.mappings).map(([field, column]) => (
                  <tr key={field} className="border-t border-border">
                    <td className="py-1 px-2">{field}</td>
                    <td className="py-1 px-2">{column}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <Button 
          onClick={onApplyRecommendations} 
          className="w-full mt-2"
          variant="default"
        >
          Apply Recommendations
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResult;

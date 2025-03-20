
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DomainStatusResult {
  resolved: boolean;
  error?: string;
  ip?: string;
  sslValid?: boolean;
}

const DomainStatusChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DomainStatusResult | null>(null);
  const domain = "cannahausapi.com";

  const checkDomain = async () => {
    setIsChecking(true);
    setResult(null);
    
    try {
      // In a real implementation, this would be an API call to a backend
      // that performs the actual DNS lookup and SSL verification
      
      // Simulate checking domain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For the demo, we'll simulate a not-yet-configured domain
      const mockResult: DomainStatusResult = {
        resolved: false,
        error: "DNS not fully propagated or SSL certificate not properly configured",
      };
      
      setResult(mockResult);
      
      if (!mockResult.resolved) {
        toast.warning("The API domain is not properly configured yet");
      } else {
        toast.success("API domain is properly configured and accessible");
      }
    } catch (error) {
      setResult({
        resolved: false,
        error: "Error checking domain status"
      });
      toast.error("Failed to check domain status");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-3">API Domain Status</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Check if the API domain ({domain}) is properly configured and accessible.
      </p>
      
      <Button 
        onClick={checkDomain} 
        disabled={isChecking}
        className="mb-4"
      >
        {isChecking ? 'Checking...' : 'Check Domain Status'}
      </Button>
      
      {result && (
        <div className={`p-4 rounded-md ${result.resolved ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
          <h3 className="font-medium mb-2">
            {result.resolved ? 'Domain is accessible' : 'Domain issues detected'}
          </h3>
          {result.error && (
            <p className="text-sm">
              <span className="font-semibold">Issue:</span> {result.error}
            </p>
          )}
          {result.ip && (
            <p className="text-sm">
              <span className="font-semibold">IP Address:</span> {result.ip}
            </p>
          )}
          {result.resolved === false && (
            <div className="mt-3 text-sm">
              <p className="font-semibold">Possible solutions:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Wait for DNS propagation (can take 24-48 hours)</li>
                <li>Check if SSL certificate is properly installed</li>
                <li>Verify domain ownership and configuration</li>
                <li>In the meantime, you can develop using our test domain or mock server</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainStatusChecker;

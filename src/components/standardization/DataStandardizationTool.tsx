import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDirectoryItems } from '@/api/services/directoryItem/crudOperations';
import { useQuery } from '@tanstack/react-query';
import { DirectoryItem } from '@/types/directory';
import { batchProcessDirectoryItems } from '@/utils/standardization/batchProcessor';
import { analyzeDirectoryData, findPotentialDuplicates } from '@/utils/standardization/dataAnalyzer';
import { standardizeDirectoryItem } from '@/utils/standardization/standardizationFunctions';
import { AlertCircle, CheckCircle2, RefreshCw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

const DataStandardizationTool: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    processed: number;
    successful: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [batchSize, setBatchSize] = useState(10);
  const [pauseBetweenBatches, setPauseBetweenBatches] = useState(1000);
  
  // Fetch directory items
  const { data: directoryItems, isLoading, error, refetch } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: () => getDirectoryItems()
  });
  
  const handleAnalyzeData = () => {
    if (!directoryItems || directoryItems.length === 0) {
      toast.error('No data to analyze');
      return;
    }
    
    // Make sure additionalFields exists on all items
    const itemsWithDefaults = directoryItems.map(item => ({
      ...item,
      additionalFields: item.additionalFields || {}
    }));
    
    try {
      const analysis = analyzeDirectoryData(itemsWithDefaults);
      setAnalysisResult(analysis);
      toast.success(`Analysis completed on ${analysis.totalItems} items`);
    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error('Error analyzing data. Check console for details.');
    }
  };
  
  const handleStandardizeData = async () => {
    if (!directoryItems || directoryItems.length === 0) {
      toast.error('No data to standardize');
      return;
    }
    
    // Make sure additionalFields exists on all items
    const itemsWithDefaults = directoryItems.map(item => ({
      ...item,
      additionalFields: item.additionalFields || {}
    }));
    
    setIsProcessing(true);
    setProgress(0);
    setResult(null);
    
    try {
      toast.info('Starting standardization process. This may take a while...');
      
      const processingResult = await batchProcessDirectoryItems(itemsWithDefaults, {
        batchSize,
        pauseBetweenBatches,
        onProgress: (processed, total) => {
          setProgress(Math.floor((processed / total) * 100));
        },
        onComplete: (successful, failed) => {
          toast.success(`Processing complete! ${successful} items updated successfully, ${failed} failed.`);
        },
        onError: (error, item) => {
          console.error(`Error processing item ${item.id}:`, error);
        }
      });
      
      setResult({
        processed: processingResult.totalProcessed,
        successful: processingResult.successful,
        failed: processingResult.failed,
        errors: processingResult.errors
      });
      
      // Refetch the data after processing
      refetch();
      
    } catch (error) {
      console.error('Error during batch processing:', error);
      toast.error('An error occurred during processing. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFindDuplicates = () => {
    if (!directoryItems || directoryItems.length === 0) {
      toast.error('No data to analyze for duplicates');
      return;
    }
    
    try {
      const duplicates = findPotentialDuplicates(directoryItems, 0.8);
      
      toast.success(`Found ${duplicates.length} potential duplicate groups`);
      
      setAnalysisResult({
        ...analysisResult,
        duplicates
      });
    } catch (error) {
      console.error('Error finding duplicates:', error);
      toast.error('Error finding duplicates. Check console for details.');
    }
  };
  
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total Items</dt>
                  <dd className="text-2xl font-bold">{analysisResult.totalItems}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Categories</dt>
                  <dd className="text-2xl font-bold">{analysisResult.categories.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Potential Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysisResult.potentialIssues.map((issue: any, index: number) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{issue.description}</span>
                    <span className="font-bold">{issue.count}</span>
                  </li>
                ))}
                {analysisResult.potentialIssues.length === 0 && (
                  <li className="text-muted-foreground">No issues detected</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysisResult.categories.slice(0, 5).map((cat: any, index: number) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{cat.category}</span>
                    <span className="font-bold">{cat.count}</span>
                  </li>
                ))}
                {analysisResult.categories.length > 5 && (
                  <li className="text-muted-foreground text-sm">
                    +{analysisResult.categories.length - 5} more categories
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {analysisResult.duplicates && analysisResult.duplicates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Potential Duplicates</CardTitle>
              <CardDescription>
                Found {analysisResult.duplicates.length} groups with similar items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.duplicates.slice(0, 5).map((group: any, groupIndex: number) => (
                  <div key={groupIndex} className="border rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Group {groupIndex + 1}</span>
                      <span className="text-sm text-muted-foreground">
                        Similarity: {Math.round(group.similarity * 100)}%
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {group.group.map((item: DirectoryItem, itemIndex: number) => (
                        <li key={itemIndex} className="text-sm">
                          {item.title} ({item.category})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {analysisResult.duplicates.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    +{analysisResult.duplicates.length - 5} more duplicate groups
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Standardization Tool</CardTitle>
        <CardDescription>
          Analyze, standardize, and clean your directory data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analyze">
          <TabsList className="mb-4">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="standardize">Standardize</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAnalyzeData} 
                  disabled={isLoading || isProcessing}
                >
                  Analyze Data
                </Button>
                <Button 
                  onClick={handleFindDuplicates} 
                  disabled={isLoading || isProcessing || !analysisResult}
                  variant="outline"
                >
                  Find Duplicates
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Loading data...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load directory data. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {directoryItems?.length || 0} items loaded and ready for analysis
                </div>
              )}
              
              {renderAnalysisResults()}
            </div>
          </TabsContent>
          
          <TabsContent value="standardize">
            <div className="space-y-4">
              <Alert>
                <Settings2 className="h-4 w-4" />
                <AlertTitle>Standardization Process</AlertTitle>
                <AlertDescription>
                  This will apply standardization rules to all loaded directory items.
                  The process will run in batches to avoid overloading the database.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleStandardizeData} 
                disabled={isLoading || isProcessing || !directoryItems?.length}
              >
                Start Standardization
              </Button>
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Processing... {progress}% complete
                  </p>
                </div>
              )}
              
              {result && (
                <Alert variant={result.failed > 0 ? "destructive" : "default"}>
                  {result.failed > 0 ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <AlertTitle>Processing Complete</AlertTitle>
                  <AlertDescription>
                    Processed {result.processed} items. 
                    {result.successful} successful, {result.failed} failed.
                    {result.failed > 0 && (
                      <div className="mt-2">
                        <details>
                          <summary className="cursor-pointer text-sm">View errors</summary>
                          <ul className="mt-2 text-xs space-y-1 max-h-40 overflow-y-auto">
                            {result.errors.map((err, i) => (
                              <li key={i}>
                                <strong>{err.id}</strong>: {err.error}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of items to process in each batch (1-50)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pause Between Batches (ms)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="100"
                  value={pauseBetweenBatches}
                  onChange={(e) => setPauseBetweenBatches(parseInt(e.target.value) || 1000)}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pause between batches in milliseconds (0-5000)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {isProcessing ? (
            <span>Processing in progress...</span>
          ) : (
            <span>Ready to analyze and standardize directory data</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataStandardizationTool;

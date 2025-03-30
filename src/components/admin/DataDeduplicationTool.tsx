
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataDeduplication } from '@/hooks/deduplication/useDataDeduplication';
import DuplicateGroupCard from './deduplication/DuplicateGroupCard';
import PreviewDialog from './deduplication/PreviewDialog';
import ProcessingResults from './deduplication/ProcessingResults';
import DuplicateRemovalSection from './deduplication/DuplicateRemovalSection';

const DataDeduplicationTool: React.FC = () => {
  const {
    isLoading,
    duplicateGroups,
    isPreviewOpen,
    selectedGroup,
    processingResults,
    findDuplicates,
    toggleDuplicateSelection,
    setAction,
    openPreview,
    setIsPreviewOpen,
    processDuplicates,
    getPreviewMergedRecord
  } = useDataDeduplication();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Deduplication Tool</CardTitle>
        <CardDescription>
          Identify and manage duplicate records in your database
        </CardDescription>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={findDuplicates} 
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Find Potential Duplicates'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="duplicates">
          <TabsList>
            <TabsTrigger value="duplicates">Duplicate Records</TabsTrigger>
            <TabsTrigger value="removal">Auto-Remove Duplicates</TabsTrigger>
            {processingResults && (
              <TabsTrigger value="results">Processing Results</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="duplicates">
            {duplicateGroups.length > 0 ? (
              <>
                {duplicateGroups.map((group, groupIndex) => (
                  <DuplicateGroupCard
                    key={group.primaryRecord.id}
                    group={group}
                    groupIndex={groupIndex}
                    onToggleSelection={toggleDuplicateSelection}
                    onSetAction={setAction}
                    onPreview={openPreview}
                  />
                ))}
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={processDuplicates} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Process Selected Duplicates'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Click "Find Potential Duplicates" to begin the deduplication process
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="removal">
            <DuplicateRemovalSection onRemoved={findDuplicates} />
          </TabsContent>
          
          <TabsContent value="results">
            {processingResults && (
              <ProcessingResults results={processingResults} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <PreviewDialog 
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        selectedGroup={selectedGroup}
        getPreviewMergedRecord={getPreviewMergedRecord}
      />
    </Card>
  );
};

export default DataDeduplicationTool;

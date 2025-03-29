
import React from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ColumnMappingTable from './ColumnMappingTable';
import { ColumnMapping } from '@/types/directory';

interface ColumnMappingSectionProps {
  columnMappings: ColumnMapping[];
  availableColumns: string[];
  customFields: Record<string, string>;
  manualMappingMode: boolean;
  isProcessing: boolean;
  onMappingChange: (index: number, targetField: string) => void;
  onCustomFieldNameChange: (sourceColumn: string, customName: string) => void;
  onSourceColumnChange: (index: number, sourceColumn: string) => void;
  onRemoveMapping: (index: number) => void;
  onAddMapping: () => void;
}

const ColumnMappingSection: React.FC<ColumnMappingSectionProps> = ({
  columnMappings,
  availableColumns,
  customFields,
  manualMappingMode,
  isProcessing,
  onMappingChange,
  onCustomFieldNameChange,
  onSourceColumnChange,
  onRemoveMapping,
  onAddMapping
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Column Mappings</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddMapping}
          disabled={isProcessing}
        >
          Add Mapping
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {manualMappingMode 
          ? "Configure your column mappings manually" 
          : "Review AI-suggested mappings and adjust if needed"}
      </p>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Column</TableHead>
                  <TableHead>Map To</TableHead>
                  <TableHead>Custom Field Name</TableHead>
                  <TableHead>Sample Value</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <ColumnMappingTable
                columnMappings={columnMappings}
                availableColumns={availableColumns}
                customFields={customFields}
                manualMappingMode={manualMappingMode}
                isProcessing={isProcessing}
                onMappingChange={onMappingChange}
                onCustomFieldNameChange={onCustomFieldNameChange}
                onSourceColumnChange={onSourceColumnChange}
                onRemoveMapping={onRemoveMapping}
              />
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColumnMappingSection;

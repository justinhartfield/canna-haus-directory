
import React from 'react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { ColumnMapping } from '@/types/directory';

interface ColumnMappingTableProps {
  columnMappings: ColumnMapping[];
  availableColumns: string[];
  customFields: Record<string, string>;
  manualMappingMode: boolean;
  isProcessing: boolean;
  onMappingChange: (index: number, targetField: string) => void;
  onCustomFieldNameChange: (sourceColumn: string, customName: string) => void;
  onSourceColumnChange: (index: number, sourceColumn: string) => void;
  onRemoveMapping: (index: number) => void;
}

const ColumnMappingTable: React.FC<ColumnMappingTableProps> = ({
  columnMappings,
  availableColumns,
  customFields,
  manualMappingMode,
  isProcessing,
  onMappingChange,
  onCustomFieldNameChange,
  onSourceColumnChange,
  onRemoveMapping
}) => {
  // Available target fields for mapping
  const availableTargetFields = [
    { value: 'title', label: 'Title' },
    { value: 'description', label: 'Description' },
    { value: 'subcategory', label: 'Subcategory' },
    { value: 'tags', label: 'Tags' },
    { value: 'imageUrl', label: 'Image URL' },
    { value: 'thumbnailUrl', label: 'Thumbnail URL' }
  ];

  return (
    <TableBody>
      {columnMappings.map((mapping, index) => (
        <TableRow key={index}>
          <TableCell>
            {manualMappingMode ? (
              <Select
                value={mapping.sourceColumn}
                onValueChange={(value) => onSourceColumnChange(index, value)}
                disabled={isProcessing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              mapping.sourceColumn
            )}
          </TableCell>
          <TableCell>
            <Select
              value={mapping.targetField}
              onValueChange={(value) => onMappingChange(index, value)}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Ignore --</SelectItem>
                {availableTargetFields.map(field => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Field</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            {mapping.isCustomField && (
              <Input
                value={customFields[mapping.sourceColumn] || ''}
                onChange={(e) => onCustomFieldNameChange(mapping.sourceColumn, e.target.value)}
                placeholder="Field name"
                disabled={isProcessing}
              />
            )}
          </TableCell>
          <TableCell className="max-w-[200px] truncate">
            {mapping.sampleData}
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveMapping(index)}
              disabled={isProcessing}
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ColumnMappingTable;

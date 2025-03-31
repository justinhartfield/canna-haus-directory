
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  isCustomField?: boolean;
  sampleData?: any;
}

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
  // Function to find a sample value for a column across all sample rows
  const findSampleValue = (column: string): React.ReactNode => {
    // Check if the mapping itself has sample data
    if (columnMappings.find(m => m.sourceColumn === column)?.sampleData !== undefined) {
      const value = columnMappings.find(m => m.sourceColumn === column)?.sampleData;
      return value === null || value === undefined ? 
        <span className="text-gray-400 italic">No sample value</span> : 
        String(value);
    }
    
    // If no value found, return placeholder text
    return <span className="text-gray-400 italic">No sample value</span>;
  };

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
                  {availableColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              mapping.sourceColumn
            )}
          </TableCell>
          <TableCell>
            <Select
              value={mapping.targetField || "ignore"}
              onValueChange={(value) => onMappingChange(index, value)}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ignore">-- Ignore --</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="description">Description</SelectItem>
                <SelectItem value="subcategory">Subcategory</SelectItem>
                <SelectItem value="imageUrl">Image URL</SelectItem>
                <SelectItem value="thumbnailUrl">Thumbnail URL</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="custom">Custom Field</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            {mapping.isCustomField && (
              <Input
                value={customFields[mapping.sourceColumn] || ''}
                onChange={(e) => onCustomFieldNameChange(mapping.sourceColumn, e.target.value)}
                placeholder="Custom field name"
                disabled={isProcessing}
                className="w-full"
              />
            )}
          </TableCell>
          <TableCell className="max-w-[200px] truncate">
            {findSampleValue(mapping.sourceColumn)}
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveMapping(index)}
              disabled={isProcessing || columnMappings.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ColumnMappingTable;

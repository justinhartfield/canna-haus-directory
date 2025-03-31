import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  sampleData?: any;
}

interface ColumnMappingTableProps {
  columnMappings: ColumnMapping[];
  sampleData: Record<string, any>[];
  handleMappingChange: (index: number, targetField: string) => void;
  availableTargetFields: { value: string; label: string }[];
}

const ColumnMappingTable: React.FC<ColumnMappingTableProps> = ({
  columnMappings,
  sampleData,
  handleMappingChange,
  availableTargetFields
}) => {
  // Function to find a sample value for a column across all sample rows
  const findSampleValue = (column: string): React.ReactNode => {
    // First check if the mapping itself has sample data
    if (columnMappings.find(m => m.sourceColumn === column)?.sampleData !== undefined) {
      const value = columnMappings.find(m => m.sourceColumn === column)?.sampleData;
      return value === null || value === undefined ? 
        <span className="text-gray-400 italic">No sample value</span> : 
        String(value);
    }
    
    // Otherwise, look through the sample data rows
    if (sampleData && sampleData.length > 0) {
      for (const row of sampleData) {
        if (row[column] !== undefined && row[column] !== null && row[column] !== '') {
          return String(row[column]);
        }
      }
    }
    
    // If no value found, return placeholder text
    return <span className="text-gray-400 italic">No sample value</span>;
  };

  return (
    <div className="max-h-60 overflow-y-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source Column</TableHead>
            <TableHead>Target Field</TableHead>
            <TableHead>Sample Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {columnMappings.map((mapping, index) => (
            <TableRow key={index}>
              <TableCell>{mapping.sourceColumn}</TableCell>
              <TableCell>
                <Select
                  value={mapping.targetField || "ignore"}
                  onValueChange={(value) => handleMappingChange(index, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ignore">-- Ignore --</SelectItem>
                    {availableTargetFields.map(field => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {findSampleValue(mapping.sourceColumn)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ColumnMappingTable;


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
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
                {sampleData[0]?.[mapping.sourceColumn]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ColumnMappingTable;

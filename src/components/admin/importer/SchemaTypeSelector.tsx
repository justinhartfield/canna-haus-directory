
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchemaTypeSelectorProps {
  schemaType: string;
  setSchemaType: (value: string) => void;
  schemaTypeOptions: string[];
}

const SchemaTypeSelector: React.FC<SchemaTypeSelectorProps> = ({
  schemaType,
  setSchemaType,
  schemaTypeOptions
}) => {
  return (
    <div className="space-y-2">
      <Label>Schema Type</Label>
      <Select value={schemaType} onValueChange={setSchemaType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select schema type" />
        </SelectTrigger>
        <SelectContent>
          {schemaTypeOptions.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Defines the Schema.org type for the JSON-LD structure
      </p>
    </div>
  );
};

export default SchemaTypeSelector;

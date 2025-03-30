
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onEdit: (value: string) => void;
  initialEditValue?: string;
  // Optional field identifier to support different input types
  field?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  isEditing,
  onEdit,
  initialEditValue,
  field
}) => {
  // Determine if we should use a textarea (for longer text like descriptions)
  const isLongText = value && value.length > 100;
  
  // Display either the editing field or the display value
  if (isEditing) {
    if (isLongText) {
      return (
        <TableCell>
          <Textarea
            value={initialEditValue || value}
            onChange={(e) => onEdit(e.target.value)}
            className="min-h-[80px] w-full"
          />
        </TableCell>
      );
    }
    
    return (
      <TableCell>
        <Input
          value={initialEditValue || value}
          onChange={(e) => onEdit(e.target.value)}
          className="w-full"
        />
      </TableCell>
    );
  }
  
  // Normal display mode (truncate if too long)
  return (
    <TableCell>
      {isLongText ? (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      ) : (
        value
      )}
    </TableCell>
  );
};


import React from 'react';
import { DirectoryItem } from '@/types/directory';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EditableCell } from '@/components/dataManagement/EditableCell';
import { PencilIcon, MoreHorizontal, Trash2, SaveIcon } from 'lucide-react';

interface DataTableProps {
  items: DirectoryItem[];
  editingItemId: string | null;
  editedData: Partial<DirectoryItem>;
  onEdit: (item: DirectoryItem) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditField: (field: string, value: any) => void;
  additionalFieldKeys: string[];
}

const DataTable: React.FC<DataTableProps> = ({
  items,
  editingItemId,
  editedData,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteItem,
  onEditField,
  additionalFieldKeys
}) => {
  if (items.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4 + additionalFieldKeys.length} className="h-24 text-center">
          No results found.
        </TableCell>
      </TableRow>
    );
  }

  // Handle additional field updates
  const handleAdditionalFieldEdit = (key: string, value: string) => {
    onEditField('additionalFields', {
      ...(editedData.additionalFields || {}),
      [key]: value
    });
  };

  return (
    <>
      {items.map((item) => (
        <TableRow key={item.id}>
          <EditableCell
            value={item.title}
            isEditing={editingItemId === item.id}
            onEdit={(value) => onEditField('title', value)}
            initialEditValue={editedData.title}
          />
          <EditableCell
            value={item.category}
            isEditing={editingItemId === item.id}
            onEdit={(value) => onEditField('category', value)}
            initialEditValue={editedData.category}
          />
          <EditableCell
            value={item.description}
            isEditing={editingItemId === item.id}
            onEdit={(value) => onEditField('description', value)}
            initialEditValue={editedData.description}
          />
          
          {/* Render all additional fields */}
          {additionalFieldKeys.map(key => (
            <EditableCell
              key={key}
              value={item.additionalFields?.[key] || ''}
              isEditing={editingItemId === item.id}
              onEdit={(value) => handleAdditionalFieldEdit(key, value)}
              initialEditValue={editedData.additionalFields?.[key]}
            />
          ))}
          
          <TableCell>
            {editingItemId === item.id ? (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onSaveEdit(item.id)}
                  className="h-8 px-2"
                >
                  <SaveIcon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onCancelEdit}
                  className="h-8 px-2"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteItem(item.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default DataTable;

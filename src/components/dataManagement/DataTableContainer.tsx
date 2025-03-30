
import React from 'react';
import { DirectoryItem } from '@/types/directory';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import DataTable from './DataTable';

interface DataTableContainerProps {
  items: DirectoryItem[];
  editingItemId: string | null;
  editedData: Partial<DirectoryItem>;
  onEdit: (item: DirectoryItem) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onDeleteItem: (item: DirectoryItem) => void;
  onEditField: (field: string, value: any) => void;
}

const DataTableContainer: React.FC<DataTableContainerProps> = ({
  items,
  editingItemId,
  editedData,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteItem,
  onEditField
}) => {
  // Find all unique additional field keys across all items
  const additionalFieldKeys = React.useMemo(() => {
    const keys = new Set<string>();
    items.forEach(item => {
      if (item.additionalFields) {
        Object.keys(item.additionalFields).forEach(key => keys.add(key));
      }
    });
    return Array.from(keys);
  }, [items]);

  return (
    <div className="rounded-md border mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              {additionalFieldKeys.map(key => (
                <TableHead key={key}>{key}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataTable
              items={items}
              editingItemId={editingItemId}
              editedData={editedData}
              onEdit={onEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onDeleteItem={onDeleteItem}
              onEditField={onEditField}
              additionalFieldKeys={additionalFieldKeys}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTableContainer;

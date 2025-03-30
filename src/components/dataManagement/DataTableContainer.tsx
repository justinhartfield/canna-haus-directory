
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
  onDeleteItem: (id: string) => void;
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
  return (
    <div className="rounded-md border mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
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
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTableContainer;

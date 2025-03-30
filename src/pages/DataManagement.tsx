
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getDirectoryItems } from '@/api/directoryService';
import { DirectoryItem } from '@/types/directory';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EditableCell } from '@/components/dataManagement/EditableCell';
import { DataFilters } from '@/components/dataManagement/DataFilters';
import { toast } from '@/hooks/use-toast';
import { PencilIcon, MoreHorizontal, Trash2, SaveIcon } from 'lucide-react';
import { deleteDirectoryItem, updateDirectoryItem } from '@/api/directoryService';

const DataManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<DirectoryItem>>({});

  // Fetch all directory items
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: getDirectoryItems
  });

  const handleEdit = (item: DirectoryItem) => {
    setEditingItemId(item.id);
    setEditedData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateDirectoryItem(id, editedData);
      toast({
        title: "Changes saved",
        description: "Item was updated successfully."
      });
      setEditingItemId(null);
      setEditedData({});
      refetch();
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDirectoryItem(id);
      toast({
        title: "Item deleted",
        description: "Item was removed successfully."
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleEditField = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter and search functionality
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory 
      ? item.category === selectedCategory 
      : true;
    
    return matchesSearch && matchesCategory;
  });

  // Extract all unique categories from data
  const categories = [...new Set(items.map(item => item.category))];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Data Management</h1>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded w-full max-w-md"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Data Management</h1>
            <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
              <p>Error loading data. Please try again later.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Data Management</h1>
          <p className="text-muted-foreground mb-8">
            View and edit your uploaded directory data
          </p>

          <DataFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

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
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <EditableCell
                          value={item.title}
                          isEditing={editingItemId === item.id}
                          onEdit={(value) => handleEditField('title', value)}
                          initialEditValue={editedData.title || item.title}
                        />
                        <EditableCell
                          value={item.category}
                          isEditing={editingItemId === item.id}
                          onEdit={(value) => handleEditField('category', value)}
                          initialEditValue={editedData.category || item.category}
                        />
                        <EditableCell
                          value={item.description}
                          isEditing={editingItemId === item.id}
                          onEdit={(value) => handleEditField('description', value)}
                          initialEditValue={editedData.description || item.description}
                        />
                        <TableCell>
                          {editingItemId === item.id ? (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveEdit(item.id)}
                                className="h-8 px-2"
                              >
                                <SaveIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleCancelEdit}
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
                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                  <PencilIcon className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteItem(item.id)}
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DataManagement;

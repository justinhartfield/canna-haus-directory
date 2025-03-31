
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DirectoryItem } from '@/types/directory';
import { getDirectoryItems, updateDirectoryItem, deleteDirectoryItem } from '@/api/services/directoryItemService';
import { toast } from '@/hooks/use-toast';

export const useDataManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<DirectoryItem>>({});

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

  const categories = [...new Set(items.map(item => item.category))];

  return {
    items,
    filteredItems,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    editingItemId,
    editedData,
    isLoading,
    error,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteItem,
    handleEditField
  };
};

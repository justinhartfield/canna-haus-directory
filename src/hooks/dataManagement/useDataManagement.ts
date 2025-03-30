
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DirectoryItem } from '@/types/directory';
import { 
  getDirectoryItems, 
  createDirectoryItem, 
  updateDirectoryItem, 
  deleteDirectoryItem 
} from '@/api/services/directoryItem/crudOperations';

export const useDataManagement = () => {
  const [selectedItem, setSelectedItem] = useState<DirectoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<Partial<DirectoryItem>>({});
  const queryClient = useQueryClient();

  // Fetch data
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: () => getDirectoryItems()
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDirectoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directoryItems'] });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DirectoryItem> }) => 
      updateDirectoryItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directoryItems'] });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setEditedData({});
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDirectoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directoryItems'] });
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  });

  const openEditModal = (item: DirectoryItem) => {
    setSelectedItem(item);
    setEditedData({});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setEditedData({});
  };

  const openDeleteModal = (item: DirectoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (id: string) => {
    if (selectedItem && Object.keys(editedData).length > 0) {
      updateMutation.mutate({ id, updates: editedData });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleChange = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    data,
    isLoading,
    error,
    selectedItem,
    isEditModalOpen,
    isDeleteModalOpen,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleSave,
    handleDelete,
    handleChange,
    createMutation,
    updateMutation,
    deleteMutation,
    editedData
  };
};

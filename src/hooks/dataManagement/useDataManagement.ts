
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
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDirectoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directoryItems'] });
      setIsDeleteModalOpen(false);
    }
  });

  const openEditModal = (item: DirectoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const openDeleteModal = (item: DirectoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
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
    confirmDelete,
    createMutation,
    updateMutation,
    deleteMutation
  };
};

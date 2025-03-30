
import React, { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDataManagement } from '@/hooks/dataManagement/useDataManagement';
import { DataFilters } from '@/components/dataManagement/DataFilters';
import DataTableContainer from '@/components/dataManagement/DataTableContainer';
import LoadingState from '@/components/dataManagement/LoadingState';
import ErrorState from '@/components/dataManagement/ErrorState';

const DataManagement: React.FC = () => {
  const {
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
    editedData
  } = useDataManagement();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories from data
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    data.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [data]);
  
  // Filter items based on search term and category
  const filteredItems = useMemo(() => {
    return data.filter(item => {
      // Filter by search term
      const matchesSearchTerm = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      return matchesSearchTerm && matchesCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Data Management</h1>
          <p className="text-muted-foreground mb-8">
            View and edit your uploaded directory data
          </p>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : (
            <>
              <DataFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <DataTableContainer
                items={filteredItems}
                editingItemId={selectedItem?.id || null}
                editedData={editedData}
                onEdit={openEditModal}
                onCancelEdit={closeEditModal}
                onSaveEdit={handleSave}
                onDeleteItem={openDeleteModal}
                onEditField={handleChange}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DataManagement;

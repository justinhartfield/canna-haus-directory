
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDataManagement } from '@/hooks/dataManagement/useDataManagement';
import { DataFilters } from '@/components/dataManagement/DataFilters';
import DataTableContainer from '@/components/dataManagement/DataTableContainer';
import LoadingState from '@/components/dataManagement/LoadingState';
import ErrorState from '@/components/dataManagement/ErrorState';

const DataManagement: React.FC = () => {
  const {
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
  } = useDataManagement();

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
                editingItemId={editingItemId}
                editedData={editedData}
                onEdit={handleEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onDeleteItem={handleDeleteItem}
                onEditField={handleEditField}
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

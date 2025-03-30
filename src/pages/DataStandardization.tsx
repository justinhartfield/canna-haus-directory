
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataStandardizationTool from '@/components/standardization/DataStandardizationTool';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const DataStandardization: React.FC = () => {
  const auth = useAuth();
  
  if (auth.loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                <div className="h-64 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!auth.user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Data Standardization</h1>
            <p className="text-muted-foreground mb-8">
              Analyze, standardize, and clean your directory data to improve quality and consistency
            </p>
            
            <DataStandardizationTool />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DataStandardization;

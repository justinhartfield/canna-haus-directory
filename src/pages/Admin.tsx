
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataImporter from '@/components/admin/DataImporter';
import DataImporterAdvanced from '@/components/admin/DataImporterAdvanced';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Admin: React.FC = () => {
  const auth = useAuth();
  
  if (auth.loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Manage your data and content
            </p>
            
            <Tabs defaultValue="simple">
              <TabsList className="mb-6">
                <TabsTrigger value="simple">Simple Import</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple">
                <DataImporter />
              </TabsContent>
              
              <TabsContent value="advanced">
                <DataImporterAdvanced />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Admin;

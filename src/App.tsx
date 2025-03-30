
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner'; // Shadcn toast provider
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import ApiDocs from '@/pages/ApiDocs';
import NotFound from '@/pages/NotFound';
import Directory from '@/pages/Directory';
import DirectoryDetail from '@/pages/DirectoryDetail';
import CategoryView from '@/pages/CategoryView';
import Analytics from '@/pages/Analytics';
import Admin from '@/pages/Admin';
import DataManagement from '@/pages/DataManagement';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="cannahaus-theme">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/api-docs/*" element={<ApiDocs />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/directory/detail/:id" element={<DirectoryDetail />} />
              <Route path="/directory/category/:category" element={<CategoryView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

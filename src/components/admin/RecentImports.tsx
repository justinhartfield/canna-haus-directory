
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDirectoryItems } from '@/api/directoryService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Database } from 'lucide-react';
import { DirectoryItem } from '@/types/directory';

const RecentImports: React.FC = () => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['directory-items-recent'],
    queryFn: getDirectoryItems,
  });

  // Sort items by creation date (newest first) and limit to most recent 10
  const recentItems = items
    ? [...items].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 10)
    : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Recent Imports</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Recent Imports</h2>
        </div>
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          Error loading recent imports: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Recent Imports</h2>
      </div>
      
      {recentItems.length === 0 ? (
        <div className="p-4 border border-muted bg-muted/20 rounded-md text-center">
          No recently imported data found.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Imported</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title || 'Untitled'}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RecentImports;

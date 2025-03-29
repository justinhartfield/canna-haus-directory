
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDirectoryItems, deleteDirectoryItem } from '@/api/directoryService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

const RecentImports: React.FC = () => {
  const queryClient = useQueryClient();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['directory-items-recent'],
    queryFn: getDirectoryItems,
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => deleteDirectoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directory-items-recent'] });
      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Sort items by creation date (newest first) and limit to most recent 10
  const recentItems = items
    ? [...items].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 20)
    : [];

  const handleDelete = (id: string) => {
    deleteItemMutation.mutate(id);
    setItemToDelete(null);
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Recent Imports</h2>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Showing most recent {recentItems.length} items
          </p>
        </div>
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
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title === "Untitled Item" ? (
                      <span className="text-orange-500">{item.title}</span>
                    ) : (
                      item.title
                    )}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setItemToDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the item "{item.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
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

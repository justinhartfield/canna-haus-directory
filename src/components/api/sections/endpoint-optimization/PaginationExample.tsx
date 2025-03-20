
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const PaginationExample: React.FC = () => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-3">Pagination Example</h3>
      <div className="glass-card rounded-xl p-6">
        <p className="mb-4">The API supports pagination for all collection endpoints. Here's an example of the navigation controls you can build:</p>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        
        <p className="mt-4 text-sm text-muted-foreground">
          Pagination metadata is included in all list responses, allowing you to easily implement pagination controls in your application.
        </p>
      </div>
    </div>
  );
};

export default PaginationExample;

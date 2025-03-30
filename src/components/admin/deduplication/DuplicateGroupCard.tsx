
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CardTitle } from '@/components/ui/card';
import { DirectoryItem } from '@/types/directory';
import { DuplicateGroup } from '@/types/deduplication';

interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  groupIndex: number;
  onToggleSelection: (groupIndex: number, duplicateId: string) => void;
  onSetAction: (groupIndex: number, action: 'merge' | 'variant' | 'keep') => void;
  onPreview: (group: DuplicateGroup) => void;
}

const DuplicateGroupCard: React.FC<DuplicateGroupCardProps> = ({
  group,
  groupIndex,
  onToggleSelection,
  onSetAction,
  onPreview
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {group.primaryRecord.title}
            <Badge className="ml-2">{group.primaryRecord.category}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={group.action === 'merge' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onSetAction(groupIndex, 'merge')}
            >
              Merge
            </Button>
            <Button 
              variant={group.action === 'variant' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onSetAction(groupIndex, 'variant')}
            >
              Variant
            </Button>
            <Button 
              variant={group.action === 'keep' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onSetAction(groupIndex, 'keep')}
            >
              Keep All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Breeder/Source</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={`primary-${group.primaryRecord.id}`}>
              <TableCell>
                <Badge variant="secondary">Primary</Badge>
              </TableCell>
              <TableCell>{group.primaryRecord.title}</TableCell>
              <TableCell>{group.primaryRecord.category}</TableCell>
              <TableCell>
                {group.primaryRecord.additionalFields?.breeder || 
                group.primaryRecord.additionalFields?.source || '-'}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            {group.duplicates.map(duplicate => (
              <TableRow key={duplicate.id}>
                <TableCell>
                  <Checkbox 
                    checked={group.selectedDuplicates.includes(duplicate.id)} 
                    onCheckedChange={() => onToggleSelection(groupIndex, duplicate.id)}
                  />
                </TableCell>
                <TableCell>{duplicate.title}</TableCell>
                <TableCell>{duplicate.category}</TableCell>
                <TableCell>
                  {duplicate.additionalFields?.breeder || 
                  duplicate.additionalFields?.source || '-'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onPreview({
                      ...group,
                      primaryRecord: group.primaryRecord,
                      duplicates: [duplicate],
                      selectedDuplicates: [duplicate.id],
                    })}
                  >
                    Preview
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="default" 
          onClick={() => onPreview(group)}
        >
          Preview Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DuplicateGroupCard;

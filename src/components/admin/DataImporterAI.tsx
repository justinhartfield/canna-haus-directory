import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { processFileContent, DataMappingConfig, sampleFileContent, createMappingConfigFromSample } from '@/utils/dataProcessingUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Switch } from "@/components/ui/switch"
import { useSearchParams } from 'react-router-dom';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

const DataImporterAI: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mappingConfig, setMappingConfig] = useState<DataMappingConfig | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [ignoredColumns, setIgnoredColumns] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [showMappingUI, setShowMappingUI] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = React.useState(false)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setCategory(searchParams.get('category') || '');
    
    // Sample the file to get a preview of the data
    const sampled = await sampleFileContent(acceptedFiles[0], 5);
    setSampleData(sampled);
    
    // Extract column names from the sample data
    if (sampled.length > 0) {
      setColumns(Object.keys(sampled[0]));
    } else {
      setColumns([]);
    }
    
    // Create a mapping configuration from the sample data
    const detectedConfig = createMappingConfigFromSample(sampled, searchParams.get('category') || '');
    setMappingConfig(detectedConfig);
    setColumnMappings(detectedConfig.columnMappings);
    
    // Show the mapping UI
    setShowMappingUI(true);
  }, [sampleFileContent, createMappingConfigFromSample]);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  const handleMapColumn = (column: string, targetField: string) => {
    setColumnMappings(prev => ({ ...prev, [column]: targetField }));
  };
  
  const handleIgnoreColumn = (column: string) => {
    if (ignoredColumns.includes(column)) {
      setIgnoredColumns(prev => prev.filter(c => c !== column));
    } else {
      setIgnoredColumns(prev => [...prev, column]);
    }
  };
  
  const handleSubmitMapping = async () => {
    if (!files.length || !mappingConfig) {
      toast({
        title: "Error",
        description: "No files or mapping configuration found.",
      });
      return;
    }
    
    // Update mapping config with current mappings
    const updatedConfig: DataMappingConfig = {
      ...mappingConfig,
      columnMappings: columnMappings,
    };
    
    // Set processing state
    setIsProcessing(true);
    
    try {
      // Process the file
      const file = files[0];
      const result = await processFileContent(file, updatedConfig);
      
      // Handle result
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully processed ${result.processedRows} rows from ${file.name}.`,
        });
      } else {
        toast({
          title: "Error",
          description: `Error processing ${file.name}: ${result.errors.length} errors found.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    // Check if there are unmapped columns
    const unmappedColumns = columns
      .filter(col => !columnMappings[col] && !ignoredColumns.includes(col))
      .map(col => col);
      
    if (unmappedColumns.length > 0) {
      toast({
        title: "Warning: Unmapped Columns",
        description: `${unmappedColumns.length} columns are not mapped: ${unmappedColumns.join(", ")}`,
        variant: "destructive"
      });
    }
    
    handleSubmitMapping();
  };
  
  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Data Importer</h1>
      
      <div {...getRootProps()} className="dropzone border-2 border-dashed rounded-md p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected File:</h2>
          <p>{files[0].name}</p>
          <p>Category: {category}</p>
        </div>
      )}
      
      {showMappingUI && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Column Mapping</h2>
          
          <Table>
            <TableCaption>A list of your tasks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Column</TableHead>
                <TableHead>Target Field</TableHead>
                <TableHead>Ignore</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map(column => (
                <TableRow key={column}>
                  <TableCell className="font-medium">{column}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => handleMapColumn(column, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Map to Field" defaultValue={columnMappings[column]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="imageUrl">Image URL</SelectItem>
                        <SelectItem value="subcategory">Subcategory</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch id="airplane-mode" onCheckedChange={() => handleIgnoreColumn(column)} defaultChecked={ignoredColumns.includes(column)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Button onClick={handleContinue} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Continue"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImporterAI;

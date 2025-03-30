
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface FileUploadSectionProps {
  onDrop: (acceptedFiles: File[]) => void;
  isImporting: boolean;
  category: string;
  isDragActive: boolean;
  getRootProps: any;
  getInputProps: any;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onDrop,
  isImporting,
  category,
  isDragActive,
  getRootProps,
  getInputProps
}) => {
  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
      } ${isImporting || !category ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-2">
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-300">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop CSV or Excel files here, or click to select files'}
        </p>
        <p className="text-xs text-gray-400">
          Supported formats: .csv, .xlsx, .xls
        </p>
      </div>
    </div>
  );
};

export default FileUploadSection;

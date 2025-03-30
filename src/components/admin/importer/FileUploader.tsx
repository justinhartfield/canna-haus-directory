
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  isImporting: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect,
  isAnalyzing,
  isImporting
}) => {
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Take the first file for analysis
    const file = acceptedFiles[0];
    onFileSelect(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isAnalyzing || isImporting,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
      } ${isAnalyzing || isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-gray-300">
          {isDragActive
            ? 'Drop the file here...'
            : 'Drag & drop a CSV or Excel file for AI analysis, or click to select a file'}
        </p>
        <p className="text-xs text-gray-400">
          The AI will analyze the file and recommend the appropriate category and field mappings
        </p>
      </div>
    </div>
  );
};

export default FileUploader;

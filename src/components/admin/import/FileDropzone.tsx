
import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isDisabled: boolean;
  isDragActive: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  onDrop, 
  isDisabled, 
  isDragActive 
}) => {
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    disabled: isDisabled,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default FileDropzone;

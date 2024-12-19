import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { ExcelService } from '../../services/excel/excelService';
import { Button } from '../ui/Button';

interface ExcelImportProps {
  onImport: (accounts: Account[]) => void;
}

export function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!ExcelService.validateExcelFile(file)) {
        toast.error('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }

      await ExcelService.saveExcelFile(file);
      toast.success('Excel file uploaded successfully');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handling Excel file:', error);
      toast.error('Failed to process Excel file');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant="primary"
      >
        Import Excel File
      </Button>
      <p className="text-sm text-gray-500">
        Excel format: email | account status | Upassword
      </p>
    </div>
  );
}
import React, { useRef } from 'react';
import { read, utils } from 'xlsx';
import { Account } from '../../types/account';
import { Button } from '../ui/Button';

interface ExcelImportProps {
  onImport: (accounts: Account[]) => void;
}

export function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json<any>(worksheet);

        const accounts: Account[] = data.map((row: any) => ({
          email: row.email,
          status: row['account status']?.toLowerCase() === 'main' ? 'main' : 'sub',
          password: row.Upassword
        }));

        onImport(accounts);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
      }
    };
    reader.readAsBinaryString(file);
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
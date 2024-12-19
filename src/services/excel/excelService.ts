import { saveAs } from 'file-saver';
import type { Account } from '../../types/account';
import * as XLSX from 'xlsx';

export class ExcelService {
  static async saveExcelFile(file: File): Promise<Account[]> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      const accounts: Account[] = data.map(row => ({
        email: row.email,
        status: row['account status']?.toLowerCase() === 'main' ? 'main' : 'sub',
        password: row.Upassword
      }));

      // Save to project root as Opt1.xlsx
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Opt1.xlsx');

      return accounts;
    } catch (error) {
      console.error('Error saving Excel file:', error);
      throw error;
    }
  }

  static validateExcelFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    return validTypes.includes(file.type);
  }
}
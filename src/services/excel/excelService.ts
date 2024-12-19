import { saveAs } from 'file-saver';
import { Account } from '../../types/account';

export class ExcelService {
  static async saveExcelFile(file: File): Promise<void> {
    try {
      // Save to project root as Opt1.xlsx
      const blob = new Blob([await file.arrayBuffer()], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Opt1.xlsx');
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
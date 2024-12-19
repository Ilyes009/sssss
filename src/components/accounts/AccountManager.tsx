import { useState } from 'react';
import type { Account, AccountFormData } from '../../types/account';
import { AccountList } from './AccountList';
import { AccountForm } from './AccountForm';
import { ExcelImport } from './ExcelImport';
import { Card } from '../ui/Card';
import { toast } from 'react-hot-toast';

const AccountManager = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleAddAccount = (data: AccountFormData) => {
    if (accounts.some(acc => acc.email === data.email)) {
      toast.error('Account with this email already exists');
      return;
    }
    setAccounts([...accounts, data]);
    toast.success('Account added successfully');
  };

  const handleImportAccounts = (importedAccounts: Account[]) => {
    const newAccounts = importedAccounts.filter(
      imported => !accounts.some(existing => existing.email === imported.email)
    );
    
    if (newAccounts.length === 0) {
      toast.error('No new accounts to import');
      return;
    }

    setAccounts([...accounts, ...newAccounts]);
    toast.success(`Imported ${newAccounts.length} accounts successfully`);
  };

  const handleDeleteAccount = (email: string) => {
    setAccounts(accounts.filter(acc => acc.email !== email));
    toast.success('Account removed successfully');
  };

  return (
    <Card className="mt-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Account Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add accounts manually or import from Excel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Add Account Manually</h4>
            <AccountForm onSubmit={handleAddAccount} />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Import from Excel</h4>
            <ExcelImport onImport={handleImportAccounts} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Account List</h4>
          <AccountList 
            accounts={accounts} 
            onDelete={handleDeleteAccount}
          />
        </div>
      </div>
    </Card>
  );
};

export { AccountManager };
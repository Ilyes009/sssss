import { TrashIcon } from '@heroicons/react/24/outline';
import type { Account } from '../../types/account';

interface AccountListProps {
  accounts: Account[];
  onDelete: (email: string) => void;
}

const AccountList = ({ accounts, onDelete }: AccountListProps) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No accounts added yet
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.email}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`capitalize ${account.status === 'main' ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete(account.email)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { AccountList };
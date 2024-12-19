import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { MarketplaceManager } from '../services/marketplace/MarketplaceManager';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';

export function MarketplacePanel() {
  const [itemCode, setItemCode] = useState('');
  const [subPurchase, setSubPurchase] = useState(0);
  const [mainPurchase, setMainPurchase] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleProcess = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const marketplaceManager = MarketplaceManager.getInstance();
      const accounts = []; // Load accounts from your Excel file
      
      const response = await marketplaceManager.processPurchase(accounts, {
        itemCode,
        subPurchase,
        mainPurchase
      });

      setResults(response);
      toast.success('Process completed successfully');
    } catch (error) {
      toast.error('Failed to process request');
      console.error('Process error:', error);
    } finally {
      setProcessing(false);
    }
  }, [itemCode, subPurchase, mainPurchase]);

  const handleExecutePurchase = useCallback(async () => {
    try {
      const marketplaceManager = MarketplaceManager.getInstance();
      const results = await marketplaceManager.executePurchases();
      toast.success('Purchases executed successfully');
    } catch (error) {
      toast.error('Failed to execute purchases');
      console.error('Purchase error:', error);
    }
  }, []);

  return (
    <Card>
      <form onSubmit={handleProcess} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketplace Buy Tool</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700">
                Item Code
              </label>
              <Input
                id="itemCode"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="Enter item code..."
                required
                disabled={processing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subPurchase" className="block text-sm font-medium text-gray-700">
                  Sub Account Max Purchase
                </label>
                <Input
                  id="subPurchase"
                  type="number"
                  min="0"
                  value={subPurchase}
                  onChange={(e) => setSubPurchase(Number(e.target.value))}
                  disabled={processing}
                />
              </div>

              <div>
                <label htmlFor="mainPurchase" className="block text-sm font-medium text-gray-700">
                  Main Account Max Purchase
                </label>
                <Input
                  id="mainPurchase"
                  type="number"
                  min="0"
                  value={mainPurchase}
                  onChange={(e) => setMainPurchase(Number(e.target.value))}
                  disabled={processing}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={processing}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner className="mr-2" />
              Processing...
            </span>
          ) : (
            'Start Process'
          )}
        </Button>
      </form>

      {results && (
        <div className="mt-8 space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            
            <div className="space-y-3">
              <p>Current Amount Of Sale Orders: {results.saleOrders}</p>
              
              <div>
                <p className="font-medium">
                  Accounts that may already own the item: {results.ownedAccounts.length}
                </p>
                <p className="text-sm text-gray-600">
                  {results.ownedAccounts.join(', ')}
                </p>
              </div>

              <div>
                <p className="font-medium">
                  Accounts ready for purchase: {results.confirmedAccounts.length}
                </p>
                <p className="text-sm text-gray-600">
                  {results.confirmedAccounts.join(', ')}
                </p>
              </div>
            </div>

            {results.confirmedAccounts.length > 0 && (
              <Button
                onClick={handleExecutePurchase}
                className="w-full mt-6"
                variant="success"
              >
                Execute Purchase
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
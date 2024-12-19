import { cn } from '../utils/cn';

const Header = () => {
  return (
    <header className={cn(
      "bg-gradient-to-r from-blue-600 to-blue-800",
      "border-b border-blue-700/50 shadow-xl"
    )}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              MarketplaceBeta
              <span className="ml-2 text-sm font-medium px-2 py-1 bg-blue-500 rounded-full">
                Beta
              </span>
            </h1>
            <p className="mt-1 text-blue-200 text-sm font-medium">
              Secure Trading Platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-blue-200 text-sm">
              @chipolata141 on discord
            </div>
            <button 
              onClick={() => {
                fetch('/api/auth/logout', { method: 'POST' })
                  .then(() => window.location.href = '/');
              }} 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
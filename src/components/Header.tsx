import { cn } from '../utils/cn';

const Header = () => {
  return (
    <header className={cn(
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
      "border-b border-indigo-700/50 shadow-xl"
    )}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Hydra Marketplace
              <span className="ml-2 text-sm font-medium px-2 py-1 bg-indigo-700 rounded-full">
                Beta
              </span>
            </h1>
            <p className="mt-1 text-indigo-200 text-sm font-medium">
              Secure Trading Platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-indigo-200 text-sm">
              @planoea on discord
            </div>
            <button 
              onClick={() => {/* Add logout handler */}} 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-600 transition-colors"
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
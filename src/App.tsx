import { Toaster } from 'react-hot-toast';
import { MarketplacePanel } from './components/MarketplacePanel';
import { Header } from './components/Header';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MarketplacePanel />
      </main>
    </div>
  );
};

export default App;
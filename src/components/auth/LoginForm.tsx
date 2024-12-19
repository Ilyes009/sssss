import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const LoginForm = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Successfully authenticated!');
        window.location.href = '/dashboard';
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            MarketplaceBeta
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your password to access the panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your password"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Need help? Contact @chipolata141 on discord
        </div>
      </div>
    </div>
  );
};

export { LoginForm };
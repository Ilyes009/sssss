import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { KeyAuthManager } from '../../utils/keyauth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const LoginForm = () => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const keyauth = KeyAuthManager.getInstance();
      await keyauth.initialize();
      
      const isValid = await keyauth.validateLicense(key);
      
      if (isValid) {
        toast.success('Successfully authenticated!');
        // Handle successful login
      } else {
        toast.error('Invalid license key');
      }
    } catch (error) {
      toast.error('Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to Hydra HQ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your authorization key to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-700">
              Authorization Key
            </label>
            <Input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your key"
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
      </div>
    </div>
  );
};

export { LoginForm };
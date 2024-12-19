import React, { useState } from 'react';
import { AccountFormData } from '../../types/account';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => void;
}

export function AccountForm({ onSubmit }: AccountFormProps) {
  const [formData, setFormData] = useState<AccountFormData>({
    email: '',
    password: '',
    status: 'main'
  });

  const [errors, setErrors] = useState<Partial<AccountFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<AccountFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        email: '',
        password: '',
        status: 'main'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AccountFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Account Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="main">Main</option>
          <option value="sub">Sub</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Add Account
      </Button>
    </form>
  );
}
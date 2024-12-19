import axios from 'axios';
import { API_CONFIG } from './config';
import { Account } from '../types/account';

export const accountsApi = {
  import: async (accounts: Account[]) => {
    const response = await axios.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.accounts}/import`,
      { accounts }
    );
    return response.data;
  },

  sync: async () => {
    const response = await axios.get<Account[]>(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.accounts}`
    );
    return response.data;
  }
};
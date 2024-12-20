export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  endpoints: {
    auth: '/auth',
    marketplace: '/api/marketplace',
    accounts: '/api/accounts'
  }
};
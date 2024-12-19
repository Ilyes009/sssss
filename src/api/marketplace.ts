import axios from 'axios';
import { API_CONFIG } from './config';

export interface MarketplaceRequest {
  itemCode: string;
  subPurchase: number;
  mainPurchase: number;
}

export interface MarketplaceResponse {
  saleOrders: number;
  confirmedAccounts: string[];
  ownedAccounts: string[];
  success: boolean;
  message: string;
}

export const marketplaceApi = {
  process: async (data: MarketplaceRequest): Promise<MarketplaceResponse> => {
    try {
      const response = await axios.post<MarketplaceResponse>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.marketplace}/process`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Marketplace process error:', error);
      throw error;
    }
  },

  executePurchase: async () => {
    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.marketplace}/execute`
      );
      return response.data;
    } catch (error) {
      console.error('Purchase execution error:', error);
      throw error;
    }
  }
};
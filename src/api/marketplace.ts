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
}

export const marketplaceApi = {
  process: async (data: MarketplaceRequest) => {
    const response = await axios.post<MarketplaceResponse>(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.marketplace}/process`,
      data
    );
    return response.data;
  },

  executePurchase: async () => {
    const response = await axios.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.marketplace}/execute`
    );
    return response.data;
  }
};
export interface Account {
  email: string;
  status: 'main' | 'sub';
  password?: string;
}

export interface AccountFormData {
  email: string;
  status: 'main' | 'sub';
  password: string;
}
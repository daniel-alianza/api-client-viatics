import { api } from './api';

export interface WholesaleAccount {
  Code: string;
  Name: string;
}

export interface WholesaleAccountsResponse {
  empresa: string;
  accounts: WholesaleAccount[];
}

export async function getWholesaleAccounts(
  company: string,
): Promise<WholesaleAccount[]> {
  const res = await api.get<WholesaleAccountsResponse>(
    `/wholesale-accounts?empresa=${company}`,
  );
  return res.data.accounts;
}

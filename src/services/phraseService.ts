import { apiFetch } from './api';

export interface InspirationQuote {
  id: number;
  content: string;
  author: string;
  createdAt: Date;
}

export interface QuotesResponse {
  success: boolean;
  data: InspirationQuote[];
  message: string;
}

export const getInspirationQuotes = () =>
  apiFetch<QuotesResponse>('/inspiration-quotes');

export const getInspirationQuoteById = (id: number) =>
  apiFetch<{ success: boolean; data: InspirationQuote; message: string }>(
    `/inspiration-quotes/${id}`,
  );

export const deleteInspirationQuote = (id: number) =>
  apiFetch<{ success: boolean; message: string }>(`/inspiration-quotes/${id}`, {
    method: 'DELETE',
  });

export const createInspirationQuote = (
  quote: Omit<InspirationQuote, 'id' | 'createdAt'>,
) =>
  apiFetch<{ success: boolean; data: InspirationQuote; message: string }>(
    '/inspiration-quotes',
    {
      method: 'POST',
      body: JSON.stringify(quote),
    },
  );

import { api } from './api';
import { InspirationQuote, QuotesResponse } from '@/interfaces/phraseInterfece';

export const getInspirationQuotes = async () => {
  const res = await api.get<QuotesResponse>('/inspiration-quotes');
  return res.data;
};

export const getInspirationQuoteById = async (id: number) => {
  const res = await api.get<{
    success: boolean;
    data: InspirationQuote;
    message: string;
  }>(`/inspiration-quotes/${id}`);
  return res.data;
};

export const deleteInspirationQuote = async (id: number) => {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/inspiration-quotes/${id}`,
  );
  return res.data;
};

export const createInspirationQuote = async (
  quote: Omit<InspirationQuote, 'id' | 'createdAt'>,
) => {
  const res = await api.post<{
    success: boolean;
    data: InspirationQuote;
    message: string;
  }>('/inspiration-quotes', quote);
  return res.data;
};

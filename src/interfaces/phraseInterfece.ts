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

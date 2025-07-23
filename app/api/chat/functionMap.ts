import {
  getCompanyProfile,
  getTranscripts,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlowStatement,
  getFinancialEstimates,
  getRatingsSnapshot,
  getHistoricalPrice,
  getCommoditiesQuote,
  getNews,
} from "@/lib/fmp-fns";

// This maps the OpenAI function name (string) to the actual implementation
export const functionMap = {
  getCompanyProfile: ({ symbol }: { symbol: string }) => getCompanyProfile(symbol),
  getTranscripts: ({ symbol }: { symbol: string }) => getTranscripts(symbol),
  getIncomeStatement: ({ symbol }: { symbol: string }) => getIncomeStatement(symbol),
  getBalanceSheet: ({ symbol }: { symbol: string }) => getBalanceSheet(symbol),
  getCashFlowStatement: ({ symbol }: { symbol: string }) => getCashFlowStatement(symbol),
  getFinancialEstimates: ({ symbol }: { symbol: string }) => getFinancialEstimates(symbol),
  getRatingsSnapshot: ({ symbol }: { symbol: string }) => getRatingsSnapshot(symbol),
  getHistoricalPrice: ({ symbol }: { symbol: string; period?: string }) => getHistoricalPrice(symbol, '1y'),
  getCommoditiesQuote: ({ symbol }: { symbol: string }) => getCommoditiesQuote(symbol),
  getNews: ({ symbol }: { symbol: string }) => getNews(symbol),
};

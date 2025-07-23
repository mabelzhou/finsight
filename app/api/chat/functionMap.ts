import {
  getCompanyProfile,
  getTranscripts,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlowStatement,
  getKeyMetrics,
  getFinancialEstimates,
  getRatingsSnapshot,
  getHistoricalRatings,
  getHistoricalPrice,
  getCommoditiesQuote,
  getNews,
  getPressReleases
} from "@/lib/fmp-fns";

// This maps the OpenAI function name (string) to the actual implementation
export const functionMap = {
  getCompanyProfile: ({ symbol }: { symbol: string }) => getCompanyProfile(symbol),
  getTranscripts: ({ symbol }: { symbol: string }) => getTranscripts(symbol),
  getIncomeStatement: ({ symbol }: { symbol: string }) => getIncomeStatement(symbol),
  getBalanceSheet: ({ symbol }: { symbol: string }) => getBalanceSheet(symbol),
  getCashFlowStatement: ({ symbol }: { symbol: string }) => getCashFlowStatement(symbol),
  getFinancialEstimates: ({ symbol }: { symbol: string }) => getFinancialEstimates(symbol),
  getKeyMetrics: ({ symbol }: { symbol: string }) => getKeyMetrics(symbol),
  getRatingsSnapshot: ({ symbol }: { symbol: string }) => getRatingsSnapshot(symbol),
  getHistoricalRatings: ({ symbol }: { symbol: string }) => getHistoricalRatings(symbol),
  getHistoricalPrice: ({ symbol }: { symbol: string; period?: string }) => getHistoricalPrice(symbol, '1y'),
  getCommoditiesQuote: ({ symbol }: { symbol: string }) => getCommoditiesQuote(symbol),
  getNews: ({ symbol }: { symbol: string }) => getNews(symbol),
  getPressReleases: ({ symbol }: { symbol: string }) => getPressReleases(symbol),
};

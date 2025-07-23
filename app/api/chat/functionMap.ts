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
  getTranscripts: ({ symbol, year, quarter }: { symbol: string; year: string; quarter: string }) => getTranscripts(symbol, year, quarter),
  getIncomeStatement: ({ symbol }: { symbol: string }) => getIncomeStatement(symbol),
  getBalanceSheet: ({ symbol }: { symbol: string }) => getBalanceSheet(symbol),
  getCashFlowStatement: ({ symbol }: { symbol: string }) => getCashFlowStatement(symbol),
  getFinancialEstimates: ({ symbol }: { symbol: string }) => getFinancialEstimates(symbol),
  getKeyMetrics: ({ symbol }: { symbol: string }) => getKeyMetrics(symbol),
  getRatingsSnapshot: ({ symbol }: { symbol: string }) => getRatingsSnapshot(symbol),
  getHistoricalRatings: ({ symbol }: { symbol: string }) => getHistoricalRatings(symbol),
  getHistoricalPrice: ({ symbol }: { symbol: string; period?: string }) => getHistoricalPrice(symbol, '1y'),
  getCommoditiesQuote: () => getCommoditiesQuote(),
  getNews: ({ symbol }: { symbol: string }) => getNews(symbol),
  getPressReleases: () => getPressReleases(),
};

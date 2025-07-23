const FMP_API_KEY = process.env.FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

// FMP API endpoints

// Company
export async function getCompanyProfile(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/profile?symbol=${symbol}?apikey=${FMP_API_KEY}`);
  return res.json();
}

// Earnings Transcripts
export async function getTranscripts(symbol: string, year = "2025", quarter = "1") {
  const res = await fetch(`${FMP_BASE_URL}/earning-call-transcript?symbol=${symbol}&year=${year}&quarter=${quarter}&apikey=${FMP_API_KEY}`);
  return res.json();
}

// Statements
export async function getIncomeStatement(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/income-statement?symbol=${symbol}?apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getBalanceSheet(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/balance-sheet-statement?symbol=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getCashFlowStatement(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/cash-flow-statement?symbol=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getKeyMetrics(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/key-metrics?symbol=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

// Analyst
export async function getFinancialEstimates(symbol: string, period = 'quarterly') {
  const res = await fetch(`${FMP_BASE_URL}/analyst-estimates?symbol=${symbol}&period=${period}&page=0&limit=10&apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getRatingsSnapshot(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/ratings-snapshot?symbol=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getHistoricalRatings(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/ratings-historical?symbol=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

// Chart
export async function getHistoricalPrice(symbol: string, period = '1y') {
  const res = await fetch(`${FMP_BASE_URL}/historical-price-eod/light?symbol=${symbol}&timeseries=${period}&apikey=${FMP_API_KEY}`);
  return res.json();
}

// Commodities
export async function getCommoditiesQuote() {
  const res = await fetch(`${FMP_BASE_URL}/batch-commodity-quotes?apikey=${FMP_API_KEY}`);
  return res.json();
}

// News
export async function getNews(symbol: string) {
  const res = await fetch(`${FMP_BASE_URL}/news/stock?symbols=${symbol}&apikey=${FMP_API_KEY}`);
  return res.json();
}

export async function getPressReleases() {
  const res = await fetch(`${FMP_BASE_URL}/news/press-releases-latest?page=0&limit=20&apikey=${FMP_API_KEY}`);
  return res.json();
}

import axios from 'axios';
import { StockData, FactorData } from '../types';

const ALPHA_VANTAGE_KEY = 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

export const FACTOR_ETFS = {
  market: 'SPY',
  size: 'IJR',
  value: 'IWD',
  momentum: 'MTUM',
};

function calculateReturns(data: StockData[]): StockData[] {
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sorted.map((item, index) => {
    if (index === 0) {
      return { ...item, returns: 0 };
    }
    const prevClose = sorted[index - 1].close;
    const returns = ((item.close - prevClose) / prevClose) * 100;
    return { ...item, returns };
  });
}

export async function fetchStockData(
  ticker: string,
  period: string = '1year'
): Promise<StockData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: ticker,
        apikey: ALPHA_VANTAGE_KEY,
        outputsize: period === '3year' ? 'full' : 'compact',
      },
    });

    const timeSeries = response.data['Time Series (Daily)'];

    if (!timeSeries) {
      throw new Error('No data received from API');
    }

    const data: StockData[] = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      close: parseFloat(values['4. close']),
    }));

    const periodDays = period === '1year' ? 252 : period === '3year' ? 756 : 126;
    const filteredData = data.slice(0, periodDays);

    return calculateReturns(filteredData);
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
}

export async function fetchFactorData(period: string = '1year'): Promise<FactorData> {
  const factorData: FactorData = {};

  for (const [factorName, etfTicker] of Object.entries(FACTOR_ETFS)) {
    try {
      const data = await fetchStockData(etfTicker, period);
      factorData[factorName] = data;
    } catch (error) {
      console.error(`Error fetching ${factorName} data:`, error);
      throw error;
    }
  }

  return factorData;
}

export async function fetchAllData(ticker: string, period: string = '1year') {
  const [stockData, factorData] = await Promise.all([
    fetchStockData(ticker, period),
    fetchFactorData(period),
  ]);

  return { stockData, factorData };
}

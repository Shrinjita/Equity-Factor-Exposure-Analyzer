export interface StockData {
  date: string;
  close: number;
  returns?: number;
}

export interface FactorExposure {
  factor: string;
  exposure: number;
}

export interface AnalysisResult {
  ticker: string;
  period: string;
  exposures: FactorExposure[];
  interpretation: string;
  rSquared: number;
}

export interface FactorData {
  [key: string]: StockData[];
}

import { StockData, FactorData, FactorExposure, AnalysisResult } from '../types';

interface Matrix {
  data: number[][];
  rows: number;
  cols: number;
}

function createMatrix(data: number[][]): Matrix {
  return {
    data,
    rows: data.length,
    cols: data[0]?.length || 0,
  };
}

function transpose(matrix: Matrix): Matrix {
  const result: number[][] = [];
  for (let j = 0; j < matrix.cols; j++) {
    result[j] = [];
    for (let i = 0; i < matrix.rows; i++) {
      result[j][i] = matrix.data[i][j];
    }
  }
  return createMatrix(result);
}

function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  if (a.cols !== b.rows) {
    throw new Error('Matrix dimensions do not match for multiplication');
  }

  const result: number[][] = [];
  for (let i = 0; i < a.rows; i++) {
    result[i] = [];
    for (let j = 0; j < b.cols; j++) {
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }
      result[i][j] = sum;
    }
  }
  return createMatrix(result);
}

function mean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function standardDeviation(arr: number[]): number {
  const m = mean(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function alignData(stockData: StockData[], factorData: FactorData): {
  alignedStock: number[];
  alignedFactors: { [key: string]: number[] };
  dates: string[];
} {
  const stockMap = new Map(stockData.map((d) => [d.date, d.returns || 0]));
  const factorMaps = Object.entries(factorData).reduce(
    (acc, [name, data]) => {
      acc[name] = new Map(data.map((d) => [d.date, d.returns || 0]));
      return acc;
    },
    {} as { [key: string]: Map<string, number> }
  );

  const commonDates = stockData
    .map((d) => d.date)
    .filter((date) => {
      return Object.values(factorMaps).every((map) => map.has(date));
    })
    .slice(1);

  const alignedStock = commonDates.map((date) => stockMap.get(date) || 0);
  const alignedFactors: { [key: string]: number[] } = {};

  for (const [name, map] of Object.entries(factorMaps)) {
    alignedFactors[name] = commonDates.map((date) => map.get(date) || 0);
  }

  return { alignedStock, alignedFactors, dates: commonDates };
}

function linearRegression(
  y: number[],
  X: number[][]
): { coefficients: number[]; rSquared: number } {
  const n = y.length;
  const k = X[0].length;

  const Xt = transpose(createMatrix(X));
  const XtX = multiplyMatrices(Xt, createMatrix(X));

  const XtXInv = invertMatrix(XtX);

  const Xty = multiplyMatrices(Xt, createMatrix(y.map((val) => [val])));

  const beta = multiplyMatrices(XtXInv, Xty);

  const coefficients = beta.data.map((row) => row[0]);

  const yPred = X.map((row) => {
    return row.reduce((sum, val, idx) => sum + val * coefficients[idx], 0);
  });

  const yMean = mean(y);
  const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssRes = y.reduce((sum, val, idx) => sum + Math.pow(val - yPred[idx], 2), 0);
  const rSquared = 1 - ssRes / ssTot;

  return { coefficients, rSquared };
}

function invertMatrix(matrix: Matrix): Matrix {
  const n = matrix.rows;
  const augmented: number[][] = matrix.data.map((row, i) => [
    ...row,
    ...Array(n)
      .fill(0)
      .map((_, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted');
    }

    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  const inverse = augmented.map((row) => row.slice(n));
  return createMatrix(inverse);
}

function generateInterpretation(exposures: FactorExposure[], rSquared: number): string {
  const sortedExposures = [...exposures].sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));

  const highExposures = sortedExposures.filter((e) => Math.abs(e.exposure) > 0.5);
  const lowExposures = sortedExposures.filter((e) => Math.abs(e.exposure) <= 0.3);

  let interpretation = 'This stock ';

  if (highExposures.length > 0) {
    const highFactors = highExposures.map((e) => e.factor).join(' and ');
    interpretation += `has high exposure to ${highFactors} factor${highExposures.length > 1 ? 's' : ''}`;
  } else {
    interpretation += 'has moderate exposure across factors';
  }

  if (lowExposures.length > 0) {
    const lowFactors = lowExposures.map((e) => e.factor).join(' and ');
    interpretation += `, and low exposure to ${lowFactors}`;
  }

  interpretation += `. The model explains ${(rSquared * 100).toFixed(1)}% of the stock's variance.`;

  return interpretation;
}

export function analyzeFactorExposure(
  ticker: string,
  period: string,
  stockData: StockData[],
  factorData: FactorData
): AnalysisResult {
  const { alignedStock, alignedFactors } = alignData(stockData, factorData);

  const factorNames = Object.keys(alignedFactors);
  const X = alignedStock.map((_, i) => factorNames.map((name) => alignedFactors[name][i]));

  const { coefficients, rSquared } = linearRegression(alignedStock, X);

  const exposures: FactorExposure[] = factorNames.map((name, idx) => ({
    factor: name.charAt(0).toUpperCase() + name.slice(1),
    exposure: coefficients[idx],
  }));

  const interpretation = generateInterpretation(exposures, rSquared);

  return {
    ticker,
    period,
    exposures,
    interpretation,
    rSquared,
  };
}

import { AnalysisResult } from '../types';
import { TrendingUp, Info } from 'lucide-react';
import FactorChart from './FactorChart';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Analysis for {result.ticker}
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.interpretation}</p>
          </div>
        </div>
      </div>

      <FactorChart exposures={result.exposures} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">About Factor Exposures</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Market:</strong> Sensitivity to overall market movements (SPY)
              </p>
              <p>
                <strong>Size:</strong> Exposure to small-cap stocks (IJR)
              </p>
              <p>
                <strong>Value:</strong> Preference for value vs. growth stocks (IWD)
              </p>
              <p>
                <strong>Momentum:</strong> Tendency to follow recent price trends (MTUM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import AnalysisForm from './components/AnalysisForm';
import ResultsDisplay from './components/ResultsDisplay';
import { fetchAllData } from './utils/dataFetcher';
import { analyzeFactorExposure } from './utils/factorAnalysis';
import { AnalysisResult } from './types';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (ticker: string, period: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { stockData, factorData } = await fetchAllData(ticker, period);

      const analysisResult = analyzeFactorExposure(ticker, period, stockData, factorData);

      setResult(analysisResult);
    } catch (err) {
      setError(
        'Failed to analyze stock. Please check the ticker symbol and try again. Note: Using demo API key with rate limits.'
      );
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Equity Factor Exposure Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Decompose stock returns into systematic factor drivers using regression analysis
          </p>
        </header>

        <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analyzing factor exposures...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && !isLoading && <ResultsDisplay result={result} />}

        {!result && !isLoading && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Enter a stock ticker above to analyze its factor exposures
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

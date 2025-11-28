import { useState } from 'react';

interface AnalysisFormProps {
  onAnalyze: (ticker: string, period: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [ticker, setTicker] = useState('');
  const [period, setPeriod] = useState('1year');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onAnalyze(ticker.toUpperCase().trim(), period);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Ticker
          </label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="e.g., TSLA"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Period
          </label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="6month">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="3year">3 Years</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading || !ticker.trim()}
            className="w-full bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </form>
  );
}

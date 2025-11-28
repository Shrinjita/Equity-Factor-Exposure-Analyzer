import { FactorExposure } from '../types';

interface FactorChartProps {
  exposures: FactorExposure[];
}

export default function FactorChart({ exposures }: FactorChartProps) {
  const maxExposure = Math.max(...exposures.map((e) => Math.abs(e.exposure)));
  const scale = maxExposure > 0 ? 100 / maxExposure : 1;

  const getBarColor = (exposure: number) => {
    if (exposure > 0.5) return 'bg-green-600';
    if (exposure > 0) return 'bg-green-400';
    if (exposure > -0.5) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getBarWidth = (exposure: number) => {
    return Math.abs(exposure) * scale;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Factor Exposures (Beta Coefficients)</h2>

      <div className="space-y-6">
        {exposures.map((item) => (
          <div key={item.factor} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 w-24">{item.factor}</span>
              <span className="text-sm font-semibold text-gray-900">
                {item.exposure.toFixed(3)}
              </span>
            </div>

            <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-full bg-gray-400"></div>
              </div>

              <div
                className={`absolute top-0 h-full ${getBarColor(item.exposure)} transition-all duration-500 ease-out`}
                style={{
                  left: item.exposure >= 0 ? '50%' : `${50 - getBarWidth(item.exposure) / 2}%`,
                  width: `${getBarWidth(item.exposure) / 2}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Negative Exposure</span>
          <span>Positive Exposure</span>
        </div>
      </div>
    </div>
  );
}

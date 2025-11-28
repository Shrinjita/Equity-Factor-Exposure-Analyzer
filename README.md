# 📊 Equity Factor Exposure Analyzer

A powerful React application that analyzes how stocks are influenced by key market factors including market movements, size, value, and momentum. Built with modern TypeScript and styled with Tailwind CSS.

---

## ✨ Features

- **Multi-Factor Analysis** - Decompose stock returns into 4 key factors:
  - 📈 **Market** - Overall market sensitivity (SPY)
  - 🏢 **Size** - Small-cap exposure (IJR)
  - 💰 **Value** - Value vs. growth preference (IWD)
  - 🚀 **Momentum** - Price trend following (MTUM)

- **Flexible Time Periods** - Analyze over 6 months, 1 year, or 3 years
- **Visual Factor Charts** - Interactive bar charts showing positive/negative exposures
- **Regression Statistics** - R² values showing model explanatory power
- **AI-Powered Interpretation** - Natural language explanations of factor exposures

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Alpha Vantage API key (free tier available)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd equity-factor-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

Update the API key in `src/utils/dataFetcher.ts`:

```typescript
const ALPHA_VANTAGE_KEY = 'your_api_key_here';
```

Get your free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

---

## 📖 How It Works

### The Factor Model

The analyzer uses **ordinary least squares (OLS) regression** to estimate factor exposures:

```
Stock Returns = β₁(Market) + β₂(Size) + β₃(Value) + β₄(Momentum) + ε
```

Where:
- **β coefficients** represent factor exposures (sensitivities)
- **ε** is the idiosyncratic return (unexplained variance)

### Technical Implementation

1. **Data Fetching** - Retrieves daily price data for the stock and factor ETFs
2. **Return Calculation** - Computes daily percentage returns
3. **Data Alignment** - Synchronizes dates across all securities
4. **Regression Analysis** - Performs matrix-based OLS regression
5. **Interpretation** - Generates insights from coefficients and R²

---

## 🎨 User Interface

### Analysis Form
Enter any stock ticker (e.g., TSLA, AAPL, MSFT) and select your analysis period.

### Factor Exposure Chart
Visual representation of beta coefficients with:
- Green bars for positive exposures
- Red bars for negative exposures
- Centered zero line for reference

### Results Interpretation
Plain-English summary explaining:
- Which factors drive the stock's returns
- Magnitude of each exposure
- Model fit quality (R² statistic)

---

## 🛠️ Technology Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Data Source:** Alpha Vantage API

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AnalysisForm.tsx      # Input form for ticker and period
│   ├── FactorChart.tsx        # Visual factor exposure chart
│   └── ResultsDisplay.tsx     # Results layout and interpretation
├── utils/
│   ├── dataFetcher.ts         # API calls and data retrieval
│   └── factorAnalysis.ts      # Regression and statistical analysis
├── types/
│   └── index.ts               # TypeScript type definitions
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

---

## 🔬 Understanding Results

### Beta Coefficients

- **β > 1.0** - Stock is more volatile than the factor
- **β ≈ 1.0** - Stock moves in line with the factor
- **β ≈ 0.0** - Stock is neutral to the factor
- **β < 0.0** - Stock moves opposite to the factor

### R² Statistic

- **R² > 0.7** - Factors explain most of the variance (good fit)
- **R² = 0.4-0.7** - Moderate explanatory power
- **R² < 0.4** - Stock has high idiosyncratic risk

---

## 🎯 Example Use Cases

- **Portfolio Construction** - Understand factor tilts in your holdings
- **Risk Management** - Identify unintended factor exposures
- **Investment Research** - Compare stocks across factor dimensions
- **Academic Learning** - Explore factor investing concepts hands-on

---

## ⚠️ Limitations

- Uses demo API key with rate limits (5 calls/minute, 100 calls/day)
- Historical analysis only - not predictive
- Limited to 4 common factors (Fama-French models use more)
- Assumes linear relationships between factors and returns

---

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:

- Add more factors (quality, low volatility, profitability)
- Implement Fama-French 3 or 5-factor models
- Add time-varying beta analysis (rolling windows)
- Export results to CSV/PDF
- Add statistical significance tests (t-statistics, p-values)

---

## 🙏 Acknowledgments

- Factor definitions based on modern portfolio theory
- ETF proxies selected for liquidity and tracking accuracy
- Regression implementation follows standard OLS methodology

---

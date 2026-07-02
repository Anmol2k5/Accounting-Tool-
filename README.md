# IIMU Financial Analysis Tool — React Native v2

A **premium, mobile-native** double-entry bookkeeping engine with real-time analytics and AI-powered business advisory. Built with React Native 0.84 + TypeScript.

## Features

### 📊 Transaction Management
- Multi-account transaction entry with classification dropdowns
- Asset / Liability / Equity classification with sub-categories
- Line-item categorization (Inventory, Trade Receivables, Cash, PPE, etc.)
- Edit and delete existing transactions
- Accounting equation validation (Assets = Liabilities + Equity)

### 📄 Financial Statements
- **Income Statement (P&L)** — Revenue, Expenses, Profit Before/After Tax
- **Balance Sheet** — Current/Non-Current Assets, Liabilities, Capital, Retained Earnings
- Automatic equation balance checking with visual indicators

### 📈 Financial Analysis
- **SVG Ratio Gauges** — Current Ratio, Debt-to-Equity, ROA, ROE
- Health analysis cards (Liquidity, Leverage, Asset Turnover)
- Color-coded thresholds (green/yellow/red)

### 🤖 AI Business Advisor
- Chat-based financial Q&A interface
- Rule-based analysis for cash, profit, debt, assets, revenue, expenses, ratios
- Quick-action buttons: Analyze Health, Funding Options, Growth Opportunities
- Simulated AI strategic analysis

### 🎨 Premium Design
- Dark theme with gold accents
- Card-based layouts with subtle shadows
- Smooth navigation with bottom tabs
- Consistent design system (colors, spacing, typography)

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React Native 0.84 | Mobile framework |
| TypeScript | Type safety |
| React Navigation | Tab + Stack navigation |
| AsyncStorage | Local data persistence |
| react-native-svg | SVG ratio gauges |
| react-native-gesture-handler | Touch interactions |

## Project Structure

```
src/
├── context/
│   └── AppContext.tsx          # Global state (transactions CRUD)
├── navigation/
│   └── AppNavigator.tsx        # Tab + Stack navigation
├── screens/
│   ├── HomeScreen.tsx           # Dashboard + quick stats
│   ├── TransactionEntryScreen.tsx # Multi-account form
│   ├── TransactionListScreen.tsx  # View/edit/delete
│   ├── ReportsScreen.tsx         # P&L + Balance Sheet + Ratios
│   └── AiAdvisorScreen.tsx       # Chat interface
├── services/
│   └── storage.ts              # AsyncStorage persistence
├── utils/
│   ├── financial.ts            # P&L, BS, metrics calculations
│   └── advisor.ts              # AI advisor logic
├── types.ts                    # TypeScript interfaces
└── theme.ts                    # Design system tokens
```

## Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
npm install
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios
```

## Classification System

| Type | Sub-Classifications |
|------|-------------------|
| Asset | Current Assets, Non-Current Assets |
| Liability | Current Liabilities, Non-Current Liabilities |
| Equity | Capital, Retained Earnings, Incomes, Expenses |

## Related Projects

- **v0 (Python/Streamlit)** — Original desktop version
- **v1 (Vite/React Web)** — Web version with Supabase cloud sync
- **v2 (React Native)** — This mobile app

## License

Private — IIMU Internal Use

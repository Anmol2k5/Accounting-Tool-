import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransactionEntryPage } from './pages/TransactionEntryPage';
import { ReportsPage } from './pages/ReportsPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-layout">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/add-transaction" element={<TransactionEntryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/advisor" element={<AiAdvisorPage />} />
            </Routes>
          </div>
          <TabBar />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

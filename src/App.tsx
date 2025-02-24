import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { TokensView } from './components/TokensView';
import { PowerView } from './components/PowerView';
import { ThermalView } from './components/ThermalView';

export function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-48 flex-1 bg-cyber-black">
          <Routes>
            <Route path="/" element={<Navigate to="/dash" replace />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/layout" element={<Layout />} />
            <Route path="/tokens" element={<TokensView />} />
            <Route path="/power" element={<PowerView />} />
            <Route path="/thermal" element={<ThermalView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
} 
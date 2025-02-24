import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';

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
            {/* Add placeholder components for other routes */}
            <Route path="/tokens" element={<div className="p-6">Tokens View</div>} />
            <Route path="/power" element={<div className="p-6">Power View</div>} />
            <Route path="/thermal" element={<div className="p-6">Thermal View</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
} 
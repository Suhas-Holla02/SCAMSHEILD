import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Scan from './pages/Scan';
import UrlCheck from './pages/UrlCheck';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Simulator from './pages/Simulator';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/url-check" element={<UrlCheck />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </>
  );
}

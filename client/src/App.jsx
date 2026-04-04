import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoomBrowser from './pages/RoomBrowser';
import GameEntry from './pages/GameEntry';
import AuctionRoom from './pages/AuctionRoom';
import InstallPWA from './components/InstallPWA';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-slate-100 font-sans">
        <InstallPWA />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rooms" element={<RoomBrowser />} />
          <Route path="/join" element={<GameEntry />} />
          <Route path="/room/:id" element={<AuctionRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

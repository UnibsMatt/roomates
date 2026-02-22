import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { CookieBanner } from './components/Laws';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CreateRoomPage from './pages/CreateRoomPage';
import EditRoomPage from './pages/EditRoomPage';
import LoginPage from './pages/LoginPage';
import MyRoomsPage from './pages/MyRoomsPage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailPage from './pages/RoomDetailPage';
import RoomsPage from './pages/RoomsPage';
import LegalPage from './pages/LegalPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/rooms/new" element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
          <Route path="/rooms/:id/edit" element={<ProtectedRoute><EditRoomPage /></ProtectedRoute>} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-rooms" element={<ProtectedRoute><MyRoomsPage /></ProtectedRoute>} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Roomates - Tutti i diritti riservati ·{' '}
        <a href="mailto:masdmasd92@gmail.com" className="underline hover:text-slate-300">
          masdmasd92@gmail.com
        </a>
        {' · '}
        <Link to="/legal" className="underline hover:text-slate-300">
          Note legali
        </Link>
        <CookieBanner />
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;


import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, User } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImageTool from './pages/tools/ImageTool';
import VideoTool from './pages/tools/VideoTool';
import PdfTool from './pages/tools/PdfTool';
import AiTool from './pages/tools/AiTool';
import SecurityTool from './pages/tools/SecurityTool';
import DevTool from './pages/tools/DevTool';
import HistoryTool from './pages/tools/HistoryTool';
import ConverterTool from './pages/tools/ConverterTool';
import UrlTool from './pages/tools/UrlTool';
import SourceTool from './pages/tools/SourceTool';
import Navigation from './components/Navigation';

interface AppContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('omnitool_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('omnitool_theme');
    if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('omnitool_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('omnitool_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navigation onLogout={logout} />
        <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
          {children}
        </main>
      </div>
    );
  };

  return (
    <AppContext.Provider value={{ ...auth, login, logout, theme, toggleTheme }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={auth.isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tools/image" element={<ProtectedRoute><ImageTool /></ProtectedRoute>} />
          <Route path="/tools/video" element={<ProtectedRoute><VideoTool /></ProtectedRoute>} />
          <Route path="/tools/pdf" element={<ProtectedRoute><PdfTool /></ProtectedRoute>} />
          <Route path="/tools/ai" element={<ProtectedRoute><AiTool /></ProtectedRoute>} />
          <Route path="/tools/security" element={<ProtectedRoute><SecurityTool /></ProtectedRoute>} />
          <Route path="/tools/dev" element={<ProtectedRoute><DevTool /></ProtectedRoute>} />
          <Route path="/tools/history" element={<ProtectedRoute><HistoryTool /></ProtectedRoute>} />
          <Route path="/tools/converter" element={<ProtectedRoute><ConverterTool /></ProtectedRoute>} />
          <Route path="/tools/url" element={<ProtectedRoute><UrlTool /></ProtectedRoute>} />
          <Route path="/tools/source" element={<ProtectedRoute><SourceTool /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;

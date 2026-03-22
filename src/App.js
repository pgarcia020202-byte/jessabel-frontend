import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load components for better performance
const Nav = lazy(() => import('./components/Nav'));
const Footer = lazy(() => import('./components/Footer'));
const SplashScreen = lazy(() => import('./pages/SplashPage'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Posts = lazy(() => import('./pages/Posts'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.2rem',
    color: '#6C63FF'
  }}>
    Loading...
  </div>
);

// Layout component for pages with header and footer
const PageLayout = ({ children }) => (
  <>
    <Suspense fallback={<LoadingFallback />}>
      <Nav />
    </Suspense>
    <main>{children}</main>
    <Suspense fallback={<LoadingFallback />}>
      <Footer />
    </Suspense>
  </>
);

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? (() => {
    try {
      return JSON.parse(userRaw);
    } catch (_) {
      return null;
    }
  })() : null;

  const isAuthenticated = !!token && !!user;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <PostsProvider>
            <Router>
              <div className="App">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Default route - loading screen that redirects to home */}
                    <Route path="/" element={<SplashScreen />} />
                    
                    {/* Public routes */}
                    <Route path="/home" element={
                      <PageLayout>
                        <Home />
                      </PageLayout>
                    } />
                    
                    <Route path="/about" element={
                      <PageLayout>
                        <About />
                      </PageLayout>
                    } />
                    
                    <Route path="/contact" element={
                      <PageLayout>
                        <Contact />
                      </PageLayout>
                    } />
                    
                    <Route path="/register" element={
                      <PageLayout>
                        <Register />
                      </PageLayout>
                    } />
                    
                    <Route path="/login" element={<Login />} />

                    <Route path="/posts" element={
                      <PageLayout>
                        <Posts />
                      </PageLayout>
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Profile />
                        </PageLayout>
                      </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <PageLayout>
                          <Admin />
                        </PageLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route - redirect to home */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </PostsProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
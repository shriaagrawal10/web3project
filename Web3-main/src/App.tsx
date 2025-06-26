import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3Store } from './store/web3Store';
import { useCertificateStore } from './store/certificateStore';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ConnectWallet from './components/wallet/ConnectWallet';

// Pages
import Landing from './pages/Landing';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import VerificationPortal from './pages/VerificationPortal';
import CertificateDetails from './pages/CertificateDetails';
import NotFound from './pages/NotFound';

// Types and utilities
import { UserRole } from './types';

function App() {
  const { address, connectWallet, checkConnection } = useWeb3Store();
  const { loadCertificates } = useCertificateStore();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await checkConnection();
      
      if (address) {
        // Determine user role (instructor or student)
        // In a real app, this would come from the blockchain or a backend
        const mockInstructors = ['0x123', '0x456', '0x789']; // Mock instructor addresses
        const isInstructor = mockInstructors.includes(address);
        setRole(isInstructor ? 'instructor' : 'student');
        
        // Load certificates from blockchain (mock)
        await loadCertificates(address);
      } else {
        setRole(null);
      }
      
      setIsLoading(false);
    };
    
    initialize();
  }, [address, checkConnection, loadCertificates]);

  // Protect routes that require authentication
  const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: UserRole }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    if (!address) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
          <h2 className="text-2xl font-bold text-center">Connect Your Wallet</h2>
          <p className="text-center text-gray-400 max-w-md">
            You need to connect your wallet to access this page.
          </p>
          <ConnectWallet onConnect={connectWallet} />
        </div>
      );
    }
    
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/instructor" 
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/verify" element={<VerificationPortal />} />
          <Route path="/certificate/:id" element={<CertificateDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
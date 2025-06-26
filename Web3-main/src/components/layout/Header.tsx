import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3Store } from '../../store/web3Store';
import ConnectWallet from '../wallet/ConnectWallet';
import { Menu, X, Award, GraduationCap, ShieldCheck, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected, connectWallet, disconnectWallet } = useWeb3Store();

  // Determine if user is instructor based on address (mock implementation)
  const mockInstructors = ['0x123', '0x456', '0x789']; // Mock instructor addresses
  const isInstructor = address ? mockInstructors.includes(address) : false;
  const role = isInstructor ? 'instructor' : 'student';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links based on connection status and role
  const getNavLinks = () => {
    const links = [
      { name: 'Home', path: '/', icon: <Home size={18} /> },
      { name: 'Verify Certificates', path: '/verify', icon: <ShieldCheck size={18} /> },
    ];

    if (isConnected) {
      if (isInstructor) {
        links.push({ name: 'Instructor Dashboard', path: '/instructor', icon: <Award size={18} /> });
      } else {
        links.push({ name: 'My Certificates', path: '/student', icon: <GraduationCap size={18} /> });
      }
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? 'bg-gray-900/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-accent-500" />
            <span className="text-xl font-display font-bold gradient-text">BlockCertify</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-primary-300'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {/* Wallet Connection */}
            <ConnectWallet 
              onConnect={connectWallet} 
              onDisconnect={disconnectWallet} 
              address={address} 
              isConnected={isConnected}
            />
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ConnectWallet 
              onConnect={connectWallet} 
              onDisconnect={disconnectWallet} 
              address={address} 
              isConnected={isConnected}
              mobileVersion
            />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-900/95 backdrop-blur-md py-4 px-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-primary-300'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
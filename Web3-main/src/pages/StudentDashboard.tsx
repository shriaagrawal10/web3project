import { useState, useEffect } from 'react';
import { useCertificateStore } from '../store/certificateStore';
import { useWeb3Store } from '../store/web3Store';
import CertificateCard from '../components/certificate/CertificateCard';
import { GraduationCap, Search, Filter, AlertCircle, Share2 } from 'lucide-react';
import { Certificate } from '../types';
import CertificateTemplate from '../components/certificate/CertificateTemplate';

const StudentDashboard = () => {
  const { address } = useWeb3Store();
  const { certificates, loadCertificates, isLoading } = useCertificateStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Load certificates on mount
  useEffect(() => {
    if (address) {
      loadCertificates(address);
    }
  }, [address, loadCertificates]);
  
  // Filter and search certificates
  const filteredCertificates = certificates.filter(cert => {
    // Apply search query
    const matchesSearch = 
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cert.issuerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply filter
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'verified') return matchesSearch && cert.isVerified;
    
    return matchesSearch;
  });
  
  // Handle certificate click
  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };
  
  // Close certificate preview
  const closePreview = () => {
    setSelectedCertificate(null);
  };
  
  // Share certificate
  const shareCertificate = () => {
    if (selectedCertificate) {
      const shareUrl = `${window.location.origin}/certificate/${selectedCertificate.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="section">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white mb-2 flex items-center gap-2">
            <GraduationCap className="text-primary-500" size={28} />
            My Certificates
          </h1>
          <p className="text-gray-400">
            View and manage your blockchain-verified certificates
          </p>
        </div>
        
        {/* Certificate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Total Certificates</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{certificates.length}</span>
              <GraduationCap className="text-primary-500" size={24} />
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Verified Certificates</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">
                {certificates.filter(cert => cert.isVerified).length}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-500">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Issuers</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">
                {new Set(certificates.map(cert => cert.issuerName)).size}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Certificates Gallery */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white">Certificate Collection</h2>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search certificates..."
                  className="input pl-10 w-full md:w-auto"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
              </div>
              
              {/* Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input pl-10 appearance-none w-full md:w-auto"
                >
                  <option value="all">All Certificates</option>
                  <option value="verified">Verified Only</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate: Certificate) => (
                <div 
                  key={certificate.id}
                  onClick={() => handleCertificateClick(certificate)}
                  className="cursor-pointer hover:scale-102 transition-transform"
                >
                  <CertificateCard certificate={certificate} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-xl text-center">
              <AlertCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Certificates Found</h3>
              <p className="text-gray-400">
                {searchQuery || filterType !== 'all'
                  ? "No certificates match your search or filter criteria."
                  : "You don't have any certificates yet. Certificates will appear here when they're issued to your wallet."}
              </p>
            </div>
          )}
        </div>
        
        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Certificate Preview</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={shareCertificate}
                    className="btn btn-outline btn-sm flex items-center gap-1"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <button 
                    onClick={closePreview}
                    className="btn btn-outline btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <CertificateTemplate certificate={selectedCertificate} size="large" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCertificateStore } from '../store/certificateStore';
import { Certificate } from '../types';
import { mockGetCertificateById } from '../utils/mockBlockchain';
import CertificateTemplate from '../components/certificate/CertificateTemplate';
import { ArrowLeft, Clock, Calendar, User, Award, Building, Shield, ExternalLink } from 'lucide-react';
import Confetti from 'react-confetti';

const CertificateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getCertificate, verifyCertificate } = useCertificateStore();
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    const loadCertificate = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to get from store
        let cert = getCertificate(id);
        
        // If not in store, fetch from mock API
        if (!cert) {
          cert = await mockGetCertificateById(id);
        }
        
        if (cert) {
          setCertificate(cert);
          setShowConfetti(true);
          
          // Hide confetti after 5 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        } else {
          setError('Certificate not found. Please check the ID and try again.');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load certificate');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCertificate();
  }, [id, getCertificate]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handle verification
  const handleVerify = async () => {
    if (!certificate) return;
    
    try {
      await verifyCertificate(certificate.id);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="pt-20 pb-16">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="section">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error-500 mx-auto mb-4">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">Certificate Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Link to="/verify" className="btn btn-primary">
                Try Another Certificate
              </Link>
              <Link to="/" className="btn btn-outline">
                Go to Home
              </Link>
            </div>
          </div>
        ) : certificate ? (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold font-display text-white mb-2">Certificate Details</h1>
              <p className="text-gray-400">
                Viewing the blockchain-verified certificate for {certificate.studentName}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Certificate Metadata */}
              <div className="lg:col-span-1 glass-card rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Certificate Information</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Certificate ID</p>
                      <p className="font-mono text-white bg-gray-800 p-2 rounded overflow-x-auto">
                        {certificate.tokenId}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 items-start">
                      <User className="text-primary-500 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Recipient</p>
                        <p className="font-medium text-white">{certificate.studentName}</p>
                        <p className="text-xs font-mono text-gray-400 truncate">
                          {certificate.studentAddress}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-start">
                      <Award className="text-accent-500 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Course</p>
                        <p className="font-medium text-white">{certificate.courseName}</p>
                        {certificate.courseDescription && (
                          <p className="text-xs text-gray-400">
                            {certificate.courseDescription}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-start">
                      <Building className="text-secondary-500 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Issuer</p>
                        <p className="font-medium text-white">{certificate.issuerName}</p>
                        <p className="text-xs font-mono text-gray-400 truncate">
                          {certificate.issuerAddress}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-start">
                      <Calendar className="text-primary-500 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Issue Date</p>
                        <p className="font-medium text-white">{formatDate(certificate.issueDate)}</p>
                      </div>
                    </div>
                    
                    {certificate.expirationDate && (
                      <div className="flex gap-2 items-start">
                        <Clock className="text-warning-500 shrink-0 mt-1" size={18} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Expiration Date</p>
                          <p className="font-medium text-white">{formatDate(certificate.expirationDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex gap-2 items-start">
                      <Shield className={`${certificate.isVerified ? 'text-success-500' : 'text-error-500'} shrink-0 mt-1`} size={18} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Verification Status</p>
                        <p className={`font-medium ${certificate.isVerified ? 'text-success-500' : 'text-error-500'}`}>
                          {certificate.isVerified ? 'Verified' : 'Not Verified'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleVerify}
                      className="btn btn-primary w-full mt-4"
                    >
                      <Shield size={16} />
                      Verify on Blockchain
                    </button>
                  </div>
                  
                  {certificate.transactionHash && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <p className="text-sm text-gray-400 mb-2">Blockchain Transaction</p>
                      <a
                        href={`https://etherscan.io/tx/${certificate.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm"
                      >
                        <ExternalLink size={14} />
                        View on Etherscan
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Certificate Preview */}
              <div className="lg:col-span-2">
                <CertificateTemplate certificate={certificate} size="large" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CertificateDetails;
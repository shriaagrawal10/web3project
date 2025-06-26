import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCertificateStore } from '../../store/certificateStore';
import { Search, Shield, AlertCircle } from 'lucide-react';
import { mockGetCertificateById } from '../../utils/mockBlockchain';
import toast from 'react-hot-toast';

const VerificationForm = () => {
  const navigate = useNavigate();
  const { verifyCertificate } = useCertificateStore();
  const [certificateId, setCertificateId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    certificateId?: string;
  } | null>(null);
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateId(e.target.value);
    // Reset verification result when input changes
    if (verificationResult) {
      setVerificationResult(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID or token ID');
      return;
    }
    
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      // First check if certificate exists
      const certificate = await mockGetCertificateById(certificateId);
      
      if (!certificate) {
        setVerificationResult({
          success: false,
          message: 'Certificate not found. Please check the ID and try again.',
        });
        return;
      }
      
      // Then verify the certificate
      const isVerified = await verifyCertificate(certificate.id);
      
      setVerificationResult({
        success: isVerified,
        message: isVerified
          ? 'Certificate verified successfully! This is an authentic blockchain certificate.'
          : 'Verification failed. This certificate could not be verified on the blockchain.',
        certificateId: certificate.id,
      });
    } catch (error: any) {
      setVerificationResult({
        success: false,
        message: error.message || 'An error occurred during verification.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle viewing the certificate
  const handleViewCertificate = () => {
    if (verificationResult?.certificateId) {
      navigate(`/certificate/${verificationResult.certificateId}`);
    }
  };

  return (
    <div className="glass-card rounded-xl">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          Verify Certificate
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Enter a certificate ID or token ID to verify its authenticity on the blockchain
        </p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="certificateId" className="block text-sm font-medium text-gray-300 mb-1">
              Certificate ID or Token ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={handleChange}
                className="input w-full pl-10"
                placeholder="Enter certificate ID or token ID"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner w-4 h-4"></div>
                Verifying...
              </>
            ) : (
              <>
                <Shield size={16} />
                Verify Certificate
              </>
            )}
          </button>
        </form>
        
        {/* Verification Result */}
        {verificationResult && (
          <div 
            className={`p-4 rounded-lg border ${
              verificationResult.success
                ? 'bg-success-500/10 border-success-500/30 text-success-400'
                : 'bg-error-500/10 border-error-500/30 text-error-400'
            }`}
          >
            <div className="flex items-start gap-3">
              {verificationResult.success ? (
                <Shield size={20} className="shrink-0 mt-1" />
              ) : (
                <AlertCircle size={20} className="shrink-0 mt-1" />
              )}
              <div>
                <p className="font-medium mb-2">{verificationResult.message}</p>
                
                {verificationResult.success && verificationResult.certificateId && (
                  <button
                    onClick={handleViewCertificate}
                    className="text-sm underline hover:text-white transition-colors"
                  >
                    View Certificate Details
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Verification Info */}
        <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">About Verification</h3>
          <p className="text-sm text-gray-400 mb-3">
            BlockCertify uses blockchain technology to ensure certificate authenticity.
            Each certificate is issued as an NFT on the blockchain with a unique token ID.
          </p>
          <p className="text-sm text-gray-400">
            You can verify certificates using either:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 mt-1">
            <li>Certificate ID (shown on the certificate)</li>
            <li>Token ID (the NFT's unique identifier)</li>
            <li>Student's wallet address (to find all their certificates)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Certificate } from '../../types';
import { Shield, Calendar, FileCheck, ExternalLink, Share2 } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
}

const CertificateCard = ({ certificate, showActions = true }: CertificateCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="card glass-card relative transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Certificate Preview Background */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div 
          className="absolute inset-0 bg-certificate-bg"
        ></div>
        
        {/* Verification Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`badge ${certificate.isVerified ? 'badge-verified' : 'badge-error'} flex items-center gap-1`}>
            <Shield size={12} />
            {certificate.isVerified ? 'Verified' : 'Unverified'}
          </div>
        </div>
        
        {/* Certificate Content Preview */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
          <div className="mb-4">
            <Award className="w-12 h-12 text-accent-500 mb-2" />
            <h3 className="text-lg font-bold text-white">Certificate of Completion</h3>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-200 font-medium">{certificate.studentName}</p>
            <p className="text-xs text-gray-300">{certificate.courseName}</p>
          </div>
        </div>
        
        {/* Hover Overlay */}
        {showActions && (
          <div 
            className={`absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Link 
              to={`/certificate/${certificate.id}`}
              className="btn btn-primary"
            >
              View Certificate
            </Link>
          </div>
        )}
      </div>
      
      {/* Certificate Info */}
      <div className="p-4">
        <h3 className="font-medium text-base text-white mb-1 truncate">
          {certificate.courseName}
        </h3>
        <p className="text-sm text-gray-400 mb-3 truncate">
          Issued by {certificate.issuerName}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={14} />
            <span>{formatDate(certificate.issueDate)}</span>
          </div>
          
          {certificate.expirationDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FileCheck size={14} />
              <span>Expires: {formatDate(certificate.expirationDate)}</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex justify-between items-center mt-4">
            <Link 
              to={`/certificate/${certificate.id}`}
              className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={14} />
              Details
            </Link>
            
            <button 
              className="text-gray-400 hover:text-gray-300 text-sm flex items-center gap-1 transition-colors"
              onClick={() => {
                // Share functionality would go here
                // For now just copy the URL
                const shareUrl = `${window.location.origin}/certificate/${certificate.id}`;
                navigator.clipboard.writeText(shareUrl);
                alert('Certificate link copied to clipboard!');
              }}
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add missing Award icon
const Award = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
};

export default CertificateCard;
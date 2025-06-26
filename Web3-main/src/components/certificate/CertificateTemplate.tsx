import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, Shield, Award } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateTemplateProps {
  certificate: Certificate;
  size?: 'small' | 'medium' | 'large';
}

const CertificateTemplate = ({ certificate, size = 'medium' }: CertificateTemplateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Download certificate as image
  const downloadCertificate = async () => {
    if (certificateRef.current) {
      try {
        const dataUrl = await toPng(certificateRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `certificate-${certificate.id}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating certificate image:', error);
      }
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} w-full mx-auto`}>
      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="certificate-container bg-certificate-bg animate-gradient"
      >
        {/* Certificate Header */}
        <div className="certificate-header">
          <Award className="w-16 h-16 text-accent-500 mx-auto mb-2" />
          <h1 className="certificate-title">Certificate of Completion</h1>
          <p className="text-gray-200">This certifies that</p>
        </div>
        
        {/* Student Name */}
        <div className="my-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-400 font-display">
            {certificate.studentName}
          </h2>
          <div className="h-0.5 w-48 bg-accent-500/50 mx-auto mt-2"></div>
        </div>
        
        {/* Certificate Content */}
        <div className="certificate-content">
          <p className="text-center mb-4">
            has successfully completed the course
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
            {certificate.courseName}
          </h3>
          
          {certificate.courseDescription && (
            <p className="text-gray-300 text-center text-sm mb-4">
              {certificate.courseDescription}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Issued On</p>
              <p className="font-medium">{formatDate(certificate.issueDate)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Issued By</p>
              <p className="font-medium">{certificate.issuerName}</p>
            </div>
          </div>
        </div>
        
        {/* Certificate Footer */}
        <div className="certificate-footer">
          {/* QR Code */}
          <div className="certificate-verification">
            <QRCodeSVG 
              value={`https://blockcertify.example/verify/${certificate.id}`}
              size={80}
              bgColor="rgba(255, 255, 255, 0.1)"
              fgColor="#ffffff"
              level="H"
              includeMargin={false}
            />
            <div className="ml-3">
              <p className="text-xs text-gray-300">Verify Certificate</p>
              <p className="text-xs font-mono text-gray-400">ID: {certificate.tokenId}</p>
            </div>
          </div>
          
          {/* Verification Badge */}
          <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
            <Shield className={certificate.isVerified ? 'text-success-500' : 'text-error-500'} size={24} />
            <div>
              <p className="text-xs text-gray-300">Blockchain Verified</p>
              <p className="text-xs font-medium text-gray-200">
                {certificate.isVerified ? 'Authentic Certificate' : 'Verification Failed'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={downloadCertificate}
          className="btn btn-outline flex items-center gap-2"
        >
          <Download size={18} />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateTemplate;
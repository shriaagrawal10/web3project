import { useState } from 'react';
import VerificationForm from '../components/forms/VerificationForm';
import { Shield, Award } from 'lucide-react';

const VerificationPortal = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="pt-20 pb-16">
      <div className="section">
        {/* Verification Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 px-4 py-2 rounded-full text-primary-400 mb-4">
            <Shield size={16} />
            <span className="text-sm font-medium">Blockchain Verification</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Verify Certificate Authenticity
          </h1>
          <p className="text-gray-400">
            Enter a certificate ID, token ID, or scan a QR code to instantly verify
            the authenticity of any certificate issued through BlockCertify.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <VerificationForm />
          
          {/* Verification Info */}
          <div>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="text-accent-500" size={20} />
                  How Verification Works
                </h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  BlockCertify uses blockchain technology to ensure that certificates
                  cannot be forged, tampered with, or falsified in any way.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Enter Certificate Information</h3>
                      <p className="text-sm text-gray-400">
                        Input the certificate ID, token ID, or scan the QR code from the certificate.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Blockchain Verification</h3>
                      <p className="text-sm text-gray-400">
                        Our system queries the blockchain to verify the certificate's authenticity,
                        issuer, and integrity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">View Certificate Details</h3>
                      <p className="text-sm text-gray-400">
                        See complete certificate information including student name, course,
                        issuer, and issue date.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => setShowDemo(!showDemo)}
                    className="btn btn-outline w-full"
                  >
                    {showDemo ? 'Hide Demo' : 'View Demo Certificate'}
                  </button>
                </div>
                
                {showDemo && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="font-medium text-white mb-3">Sample Certificate IDs</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Try verifying these sample certificates:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-300">1001</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('1001');
                            alert('Certificate ID copied to clipboard!');
                          }}
                          className="text-xs text-primary-400 hover:text-primary-300"
                        >
                          Copy
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-300">1002</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('1002');
                            alert('Certificate ID copied to clipboard!');
                          }}
                          className="text-xs text-primary-400 hover:text-primary-300"
                        >
                          Copy
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-300">1003</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('1003');
                            alert('Certificate ID copied to clipboard!');
                          }}
                          className="text-xs text-primary-400 hover:text-primary-300"
                        >
                          Copy
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPortal;
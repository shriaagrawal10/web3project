import { useNavigate } from 'react-router-dom';
import { Award, Shield, GraduationCap, ChevronRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-secondary-900 z-0"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-500 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-500 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero Content */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-accent-500" size={24} />
                <span className="bg-gray-800/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Blockchain Powered Certificates
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight">
                <span className="gradient-text">Decentralized</span> Certificate Verification Platform
              </h1>
              
              <p className="text-gray-300 text-lg mb-8 max-w-lg">
                Issue, manage, and verify tamper-proof digital certificates secured by blockchain technology.
                Transform how credentials are issued and verified.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/verify')}
                  className="btn btn-primary px-8 py-3"
                >
                  Verify Certificate
                </button>
                <button 
                  onClick={() => navigate('/instructor')}
                  className="btn btn-outline px-8 py-3"
                >
                  Issue Certificate
                </button>
              </div>
            </div>
            
            {/* Hero Image/Certificate */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="certificate-container bg-certificate-bg animate-gradient">
                  <div className="certificate-header">
                    <Award className="w-12 h-12 text-accent-500 mx-auto mb-1" />
                    <h1 className="certificate-title">Certificate of Achievement</h1>
                  </div>
                  
                  <div className="my-4 text-center">
                    <h2 className="text-2xl font-bold text-accent-400 font-display">
                      John Anderson
                    </h2>
                  </div>
                  
                  <div className="certificate-content text-center">
                    <p className="mb-2">has successfully completed</p>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Blockchain Development Fundamentals
                    </h3>
                    <p className="text-gray-300 text-xs">
                      Issued on January 15, 2024
                    </p>
                  </div>
                  
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1 text-xs">
                      <Shield className="text-success-500" size={12} />
                      <span>Blockchain Verified</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-gray-400 text-sm mb-2">Learn More</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section bg-gray-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Platform <span className="gradient-text">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            BlockCertify combines blockchain security with user-friendly interfaces to
            revolutionize the way certificates are issued, managed, and verified.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-primary-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tamper-Proof Certificates</h3>
            <p className="text-gray-400">
              Certificates are stored on the blockchain as NFTs, making them impossible to forge or alter.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="text-secondary-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Easy Certificate Issuance</h3>
            <p className="text-gray-400">
              Instructors can issue certificates with a simple form, automatically minting NFTs to student wallets.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="text-accent-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Student Certificate Wallet</h3>
            <p className="text-gray-400">
              Students can access all their certificates in one place, share them, and prove ownership.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-500">
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
                <path d="m4.93 4.93 14.14 14.14"></path>
                <path d="m19.07 4.93-14.14 14.14"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Verification</h3>
            <p className="text-gray-400">
              Anyone can verify a certificate's authenticity in seconds using the public verification portal.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-warning-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning-500">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M7 7h10"></path>
                <path d="M7 12h10"></path>
                <path d="M7 17h10"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Beautiful Certificate Templates</h3>
            <p className="text-gray-400">
              Professional certificate designs with customization options for different courses and institutions.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-error-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error-500">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Share & Export</h3>
            <p className="text-gray-400">
              Share certificates on social media or export them as images and PDFs for use in portfolios.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section bg-gray-950">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            BlockCertify simplifies the certificate issuing and verification process
            while leveraging blockchain technology for maximum security.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-xl">
              1
            </div>
            <div className="flex-1 glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400 mb-4">
                Instructors and students connect their MetaMask wallets to access the platform.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Secure wallet connection using Web3 authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Role detection based on wallet address</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-500 font-bold text-xl">
              2
            </div>
            <div className="flex-1 glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Issue Certificate</h3>
              <p className="text-gray-400 mb-4">
                Instructors fill out certificate details and mint them directly to student wallets.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Complete certificate information form with student details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Certificate metadata stored on IPFS for decentralization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">NFT minted to student's wallet address</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-500 font-bold text-xl">
              3
            </div>
            <div className="flex-1 glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">View & Share Certificates</h3>
              <p className="text-gray-400 mb-4">
                Students access their certificate collection in their dashboard.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Beautiful certificate gallery with all earned credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Download certificates as images or PDFs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Share certificates via social media or direct links</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center text-success-500 font-bold text-xl">
              4
            </div>
            <div className="flex-1 glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Verify Certificate</h3>
              <p className="text-gray-400 mb-4">
                Anyone can verify certificate authenticity through the verification portal.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Enter certificate ID or scan QR code to verify</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">Blockchain verification confirms authenticity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success-500 shrink-0 mt-1" size={16} />
                  <span className="text-gray-300 text-sm">View complete certificate details and issuer information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-secondary-900/50 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Ready to <span className="gradient-text">Transform</span> Certification?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join the blockchain revolution and start issuing tamper-proof digital certificates today.
            Connect your wallet to get started or try verifying a sample certificate.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/instructor')}
              className="btn btn-primary px-8 py-3 flex items-center justify-center gap-2"
            >
              <Award size={20} />
              Start Issuing
            </button>
            <button 
              onClick={() => navigate('/verify')}
              className="btn btn-outline px-8 py-3 flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              Verify Certificates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
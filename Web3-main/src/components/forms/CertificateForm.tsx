import { useState } from 'react';
import { useCertificateStore } from '../../store/certificateStore';
import { useWeb3Store } from '../../store/web3Store';
import { CertificateFormData } from '../../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Award, Send, X, AlertTriangle } from 'lucide-react';

const CertificateForm = () => {
  const navigate = useNavigate();
  const { address } = useWeb3Store();
  const { mintCertificate, isLoading } = useCertificateStore();
  
  const [formData, setFormData] = useState<CertificateFormData>({
    studentName: '',
    studentAddress: '',
    courseName: '',
    courseDescription: '',
    issueDate: new Date().toISOString().split('T')[0],
  });
  
  const [formStep, setFormStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!formData.studentAddress.trim()) {
      newErrors.studentAddress = 'Student wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.studentAddress)) {
      newErrors.studentAddress = 'Invalid Ethereum address format';
    }
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setShowConfirm(true);
      } catch (error: any) {
        toast.error(error.message || 'Failed to prepare certificate');
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };
  
  // Handle confirmation and mint
  const handleConfirmMint = async () => {
    try {
      const certificateId = await mintCertificate(formData);
      toast.success('Certificate minted successfully!');
      navigate(`/certificate/${certificateId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to mint certificate');
    } finally {
      setShowConfirm(false);
    }
  };
  
  // Handle next/prev step
  const handleNextStep = () => {
    if (formStep === 1) {
      // Validate first page fields
      const firstPageErrors: Record<string, string> = {};
      if (!formData.studentName.trim()) {
        firstPageErrors.studentName = 'Student name is required';
      }
      if (!formData.studentAddress.trim()) {
        firstPageErrors.studentAddress = 'Student wallet address is required';
      } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.studentAddress)) {
        firstPageErrors.studentAddress = 'Invalid Ethereum address format';
      }
      
      setErrors(firstPageErrors);
      if (Object.keys(firstPageErrors).length === 0) {
        setFormStep(2);
      } else {
        toast.error('Please fix the errors before proceeding');
      }
    }
  };
  
  const handlePrevStep = () => {
    setFormStep(1);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="text-accent-500" size={20} />
          Issue New Certificate
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Create a new blockchain certificate to award course completion
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {formStep === 1 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-300 mb-1">
                Student Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={`input w-full ${errors.studentName ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Enter student's full name"
              />
              {errors.studentName && (
                <p className="mt-1 text-xs text-error-500">{errors.studentName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="studentAddress" className="block text-sm font-medium text-gray-300 mb-1">
                Student Wallet Address <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="studentAddress"
                name="studentAddress"
                value={formData.studentAddress}
                onChange={handleChange}
                className={`input w-full font-mono ${errors.studentAddress ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="0x..."
              />
              {errors.studentAddress && (
                <p className="mt-1 text-xs text-error-500">{errors.studentAddress}</p>
              )}
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                type="button" 
                onClick={handleNextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-300 mb-1">
                Course Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className={`input w-full ${errors.courseName ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Enter course name"
              />
              {errors.courseName && (
                <p className="mt-1 text-xs text-error-500">{errors.courseName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-300 mb-1">
                Course Description
              </label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleChange}
                rows={3}
                className="input w-full"
                placeholder="Enter course description"
              />
            </div>
            
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-300 mb-1">
                Issue Date <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className={`input w-full ${errors.issueDate ? 'border-error-500 focus:ring-error-500' : ''}`}
              />
              {errors.issueDate && (
                <p className="mt-1 text-xs text-error-500">{errors.issueDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-300 mb-1">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate || ''}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="btn btn-outline"
              >
                Back
              </button>
              <button 
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Issue Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">Confirm Certificate Issuance</h3>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="mb-3">
                <p className="text-sm text-gray-400">Student</p>
                <p className="font-medium text-white">{formData.studentName}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-400">Course</p>
                <p className="font-medium text-white">{formData.courseName}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-400">Wallet Address</p>
                <p className="font-mono text-xs text-gray-300">{formData.studentAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Issue Date</p>
                <p className="font-medium text-white">{new Date(formData.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-warning-500/10 rounded-lg p-3 mb-6 flex items-start gap-3">
              <AlertTriangle size={20} className="text-warning-500 shrink-0 mt-1" />
              <p className="text-sm text-gray-300">
                This action will mint an NFT certificate on the blockchain and cannot be undone.
                Gas fees will apply to this transaction.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmMint}
                className="btn btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm & Issue'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateForm;
import { useState, useEffect } from 'react';
import { useCertificateStore } from '../store/certificateStore';
import { useWeb3Store } from '../store/web3Store';
import CertificateForm from '../components/forms/CertificateForm';
import CertificateCard from '../components/certificate/CertificateCard';
import { Award, Plus, Users, Search, Filter } from 'lucide-react';
import { Certificate } from '../types';

const InstructorDashboard = () => {
  const { address } = useWeb3Store();
  const { certificates, loadCertificates, isLoading } = useCertificateStore();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
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
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply filter
    if (filterType === 'all') return matchesSearch;
    
    // Add more filter types as needed
    return matchesSearch;
  });

  return (
    <div className="pt-20 pb-16">
      <div className="section">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2 flex items-center gap-2">
              <Award className="text-accent-500" size={28} />
              Instructor Dashboard
            </h1>
            <p className="text-gray-400">
              Manage and issue blockchain certificates to your students
            </p>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            {showForm ? 'Hide Form' : (
              <>
                <Plus size={18} />
                Issue Certificate
              </>
            )}
          </button>
        </div>
        
        {/* Certificate Form */}
        {showForm && (
          <div className="mb-10">
            <CertificateForm />
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Total Certificates</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{certificates.length}</span>
              <Award className="text-accent-500" size={24} />
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Students</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">
                {/* Count unique student addresses */}
                {new Set(certificates.map(cert => cert.studentAddress)).size}
              </span>
              <Users className="text-primary-500" size={24} />
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm mb-2">Courses</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">
                {/* Count unique courses */}
                {new Set(certificates.map(cert => cert.courseName)).size}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-500">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Certificates List */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white">Issued Certificates</h2>
            
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
                  <option value="recent">Recently Issued</option>
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
                <CertificateCard 
                  key={certificate.id} 
                  certificate={certificate}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-xl text-center">
              <Award className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Certificates Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterType !== 'all'
                  ? "No certificates match your search or filter criteria."
                  : "You haven't issued any certificates yet."}
              </p>
              <button 
                onClick={() => {
                  setShowForm(true);
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Issue Your First Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
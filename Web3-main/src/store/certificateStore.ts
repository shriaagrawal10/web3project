import { create } from 'zustand';
import { Certificate, CertificateState, CertificateFormData } from '../types';
import { mockMintCertificate, mockLoadCertificates, mockVerifyCertificate } from '../utils/mockBlockchain';
import toast from 'react-hot-toast';

export const useCertificateStore = create<CertificateState>((set, get) => ({
  certificates: [],
  isLoading: false,
  error: null,

  loadCertificates: async (address: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would fetch from the blockchain
      const certificates = await mockLoadCertificates(address);
      
      set({
        certificates,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to load certificates:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to load certificates',
      });
      
      toast.error('Failed to load certificates');
    }
  },

  getCertificate: (id: string) => {
    return get().certificates.find(cert => cert.id === id);
  },

  mintCertificate: async (data: CertificateFormData) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would interact with the blockchain
      const result = await mockMintCertificate(data);
      
      // Add the new certificate to the store
      const newCertificate: Certificate = {
        id: result.id,
        tokenId: result.tokenId,
        studentName: data.studentName,
        studentAddress: data.studentAddress,
        issuerName: 'BlockCertify Academy', // Mock issuer name
        issuerAddress: '0x123456789abcdef', // Mock issuer address
        courseName: data.courseName,
        courseDescription: data.courseDescription,
        issueDate: data.issueDate,
        expirationDate: data.expirationDate,
        transactionHash: result.transactionHash,
        ipfsHash: result.ipfsHash,
        isVerified: true,
      };
      
      set(state => ({
        certificates: [...state.certificates, newCertificate],
        isLoading: false,
      }));
      
      toast.success('Certificate minted successfully!');
      return result.id;
    } catch (error: any) {
      console.error('Failed to mint certificate:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to mint certificate',
      });
      
      toast.error('Failed to mint certificate');
      throw error;
    }
  },

  verifyCertificate: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would verify on the blockchain
      const isVerified = await mockVerifyCertificate(id);
      
      // Update certificate verification status
      set(state => ({
        certificates: state.certificates.map(cert => 
          cert.id === id ? { ...cert, isVerified } : cert
        ),
        isLoading: false,
      }));
      
      if (isVerified) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate verification failed!');
      }
      
      return isVerified;
    } catch (error: any) {
      console.error('Failed to verify certificate:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to verify certificate',
      });
      
      toast.error('Failed to verify certificate');
      return false;
    }
  },
}));
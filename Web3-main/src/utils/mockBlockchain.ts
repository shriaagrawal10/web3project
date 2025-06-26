import { Certificate, CertificateFormData } from '../types';
import { v4 as uuidv4 } from 'ethers/lib/utils';

// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: '1',
    tokenId: '1001',
    studentName: 'Alex Johnson',
    studentAddress: '0xabc1',
    issuerName: 'BlockCertify Academy',
    issuerAddress: '0x123',
    courseName: 'Blockchain Development Fundamentals',
    courseDescription: 'A comprehensive course covering blockchain basics, smart contracts, and dApp development.',
    issueDate: '2023-11-15',
    expirationDate: '2025-11-15',
    ipfsHash: 'QmXZCWJh6qsMWw3hvZftmCTwVmBEfGrTgHg4YNzNocTFM1',
    transactionHash: '0xabc123def456',
    isVerified: true,
  },
  {
    id: '2',
    tokenId: '1002',
    studentName: 'Maria Garcia',
    studentAddress: '0xabc1',
    issuerName: 'BlockCertify Academy',
    issuerAddress: '0x123',
    courseName: 'Smart Contract Security',
    courseDescription: 'Advanced techniques for writing secure smart contracts and preventing vulnerabilities.',
    issueDate: '2023-12-10',
    expirationDate: '2025-12-10',
    ipfsHash: 'QmZd94NbfTrYxY6JYbvYZsGCcXKvV6Z4E3CYwUSmG1qQeM',
    transactionHash: '0xdef456ghi789',
    isVerified: true,
  },
  {
    id: '3',
    tokenId: '1003',
    studentName: 'John Smith',
    studentAddress: '0xdef2',
    issuerName: 'Crypto University',
    issuerAddress: '0x456',
    courseName: 'Web3 User Experience Design',
    courseDescription: 'Creating intuitive and engaging user experiences for decentralized applications.',
    issueDate: '2024-01-05',
    expirationDate: '2026-01-05',
    ipfsHash: 'QmS8zjBhvaM4VZJUxn4LGvGbPgzSLKPNT6xf7rGQvZhHSX',
    transactionHash: '0xghi789jkl012',
    isVerified: true,
  },
  {
    id: '4',
    tokenId: '1004',
    studentName: 'Sarah Chen',
    studentAddress: '0xdef2',
    issuerName: 'DeFi Institute',
    issuerAddress: '0x789',
    courseName: 'Decentralized Finance Protocols',
    courseDescription: 'Understanding DeFi protocols, liquidity pools, yield farming, and risk management.',
    issueDate: '2024-02-20',
    expirationDate: '2026-02-20',
    ipfsHash: 'QmTyXZCHJh6qsMs4YNzNW3hvZftmCTwVmBEocTFM1GrTg',
    transactionHash: '0xjkl012mno345',
    isVerified: true,
  },
];

// Mock function to load certificates
export const mockLoadCertificates = async (address: string): Promise<Certificate[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter certificates for the given address (in a real app, this would be from the blockchain)
  // For demo purposes:
  // - If address starts with 0x123, 0x456, 0x789, they're an instructor
  // - Otherwise they're a student
  
  const isInstructor = ['0x123', '0x456', '0x789'].includes(address);
  
  if (isInstructor) {
    // Return certificates issued by this instructor
    return mockCertificates.filter(cert => cert.issuerAddress === address);
  } else {
    // Return certificates owned by this student
    return mockCertificates.filter(cert => cert.studentAddress === address);
  }
};

// Mock function to mint a certificate
export const mockMintCertificate = async (data: CertificateFormData) => {
  // Simulate API delay and blockchain transaction
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock data for the new certificate
  const id = uuidv4().slice(0, 8);
  const tokenId = (1000 + Math.floor(Math.random() * 9000)).toString();
  const txHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const ipfsHash = 'Qm' + [...Array(44)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  
  // Return mock result
  return {
    id,
    tokenId,
    transactionHash: txHash,
    ipfsHash,
    success: true,
  };
};

// Mock function to verify a certificate
export const mockVerifyCertificate = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, most certificates will verify successfully
  // but we'll make some fail randomly to show the error state
  const randomSuccess = Math.random() > 0.2; // 80% success rate
  
  return randomSuccess;
};

// Mock function to get certificate by ID or token ID
export const mockGetCertificateById = async (id: string): Promise<Certificate | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Try to find by id or tokenId
  const certificate = mockCertificates.find(
    cert => cert.id === id || cert.tokenId === id
  );
  
  return certificate || null;
};

// Simulate uploading to IPFS
export const mockUploadToIPFS = async (data: any): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a fake IPFS hash
  const ipfsHash = 'Qm' + [...Array(44)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  
  return ipfsHash;
};
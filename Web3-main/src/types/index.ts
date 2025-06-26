// User and role types
export type UserRole = 'instructor' | 'student';

// Certificate types
export interface Certificate {
  id: string;
  tokenId: string;
  studentName: string;
  studentAddress: string;
  issuerName: string;
  issuerAddress: string;
  courseName: string;
  courseDescription?: string;
  issueDate: string;
  expirationDate?: string;
  imageUrl?: string;
  ipfsHash?: string;
  transactionHash?: string;
  isVerified: boolean;
  metadata?: Record<string, any>;
}

// Form and input types
export interface CertificateFormData {
  studentName: string;
  studentAddress: string;
  courseName: string;
  courseDescription: string;
  issueDate: string;
  expirationDate?: string;
}

// Web3 connection types
export interface Web3State {
  provider: any | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkConnection: () => Promise<void>;
}

// Certificate store types
export interface CertificateState {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  loadCertificates: (address: string) => Promise<void>;
  getCertificate: (id: string) => Certificate | undefined;
  mintCertificate: (data: CertificateFormData) => Promise<string>;
  verifyCertificate: (id: string) => Promise<boolean>;
}

// Blockchain contract types
export interface ContractFunctions {
  mintCertificate: (to: string, tokenURI: string, metadata: any) => Promise<string>;
  getCertificateDetails: (tokenId: string) => Promise<any>;
  verifyCertificate: (tokenId: string) => Promise<boolean>;
  transferCertificate: (from: string, to: string, tokenId: string) => Promise<void>;
}
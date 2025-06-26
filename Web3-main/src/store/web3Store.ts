import { create } from 'zustand';
import { ethers } from 'ethers';
import { Web3State } from '../types';
import toast from 'react-hot-toast';

export const useWeb3Store = create<Web3State>((set, get) => ({
  provider: null,
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connectWallet: async () => {
    try {
      set({ isConnecting: true, error: null });

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      // Successfully connected
      set({
        provider,
        address,
        chainId: network.chainId,
        isConnected: true,
        isConnecting: false,
      });

      // Save connection info to localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      set({
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      });
      
      toast.error(error.message || 'Failed to connect wallet');
    }
  },

  disconnectWallet: () => {
    // Clear wallet connection
    set({
      provider: null,
      address: null,
      chainId: null,
      isConnected: false,
      error: null,
    });
    
    // Remove from localStorage
    localStorage.removeItem('walletConnected');
    
    toast.success('Wallet disconnected');
  },

  checkConnection: async () => {
    try {
      // Check if previously connected
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (wasConnected && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          
          set({
            provider,
            address: accounts[0],
            chainId: network.chainId,
            isConnected: true,
          });
          
          return;
        }
      }
      
      // No active connection
      set({
        provider: null,
        address: null,
        chainId: null,
        isConnected: false,
      });
    } catch (error: any) {
      console.error('Error checking connection:', error);
      set({
        error: error.message || 'Error checking connection',
        isConnected: false,
      });
    }
  },
}));

// Add Ethereum event listeners
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      useWeb3Store.getState().disconnectWallet();
    } else {
      // Account changed, update state
      const { provider } = useWeb3Store.getState();
      if (provider) {
        useWeb3Store.setState({
          address: accounts[0],
          isConnected: true,
        });
      }
    }
  });
  
  window.ethereum.on('chainChanged', (chainId: string) => {
    // Network changed, reload the page (recommended by MetaMask)
    window.location.reload();
  });
}
import { useState, useEffect, useRef } from 'react';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, Check } from 'lucide-react';

interface ConnectWalletProps {
  onConnect: () => Promise<void>;
  onDisconnect?: () => void;
  address?: string | null;
  isConnected?: boolean;
  mobileVersion?: boolean;
}

const ConnectWallet = ({ 
  onConnect, 
  onDisconnect, 
  address, 
  isConnected = false,
  mobileVersion = false
}: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simplified button for mobile
  if (mobileVersion) {
    if (!isConnected) {
      return (
        <button
          onClick={onConnect}
          className="btn btn-sm btn-primary text-xs"
        >
          <Wallet size={16} />
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-sm btn-outline text-xs"
      >
        <Wallet size={16} />
      </button>
    );
  }

  // Full button for desktop
  if (!isConnected) {
    return (
      <button
        onClick={onConnect}
        className="btn btn-primary px-4 py-2 text-sm"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline flex items-center gap-2 text-sm"
      >
        <Wallet size={16} />
        {address && formatAddress(address)}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-lg shadow-lg bg-gray-800 border border-gray-700 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Connected as</p>
            <p className="text-sm font-medium text-white truncate">{address}</p>
          </div>
          
          <div className="p-2">
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-2"
              onClick={copyAddress}
            >
              {copied ? <Check size={16} className="text-success-500" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            
            <a 
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-2"
            >
              <ExternalLink size={16} />
              View on Explorer
            </a>
            
            <button 
              className="w-full text-left px-3 py-2 text-sm text-error-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
              onClick={onDisconnect}
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
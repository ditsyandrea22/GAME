import React, { useEffect } from 'react';
import { connectWallet, checkIfWalletIsConnected } from '../utils/web3';

const WalletConnector = ({ setAccount }) => {
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const account = await checkIfWalletIsConnected();
      if (account) {
        setAccount(account);
      }
    };
    
    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, [setAccount]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const account = await connectWallet();
      setAccount(account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="wallet-connector">
      <button onClick={handleConnect} disabled={connecting}>
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default WalletConnector;
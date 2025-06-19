import abi from '../contracts/abi.json';

const CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error("User rejected request:", error);
      throw error;
    }
  } else {
    throw new Error("MetaMask not installed");
  }
};

export const checkIfWalletIsConnected = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  }
  return null;
};

export const getContract = () => {
  if (!window.ethereum) return null;
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

export const recordScore = async (address, score) => {
  try {
    const contract = getContract();
    if (!contract) throw new Error("Contract not available");
    
    const tx = await contract.recordScore(score);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error recording score:", error);
    return false;
  }
};

export const getLeaderboard = async () => {
  try {
    const contract = getContract();
    if (!contract) throw new Error("Contract not available");
    
    const scores = await contract.getLeaderboard();
    return scores.map(score => ({
      address: score.player,
      score: score.score.toNumber()
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

export const formatAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
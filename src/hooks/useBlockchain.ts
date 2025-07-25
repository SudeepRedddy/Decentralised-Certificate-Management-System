import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { certificateContractABI, CONTRACT_ADDRESS } from '../lib/blockchain';

export const useBlockchain = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, certificateContractABI, signer);
        
        setProvider(browserProvider);
        setContract(contractInstance);
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    init();
  }, []);

  return { provider, contract };
};
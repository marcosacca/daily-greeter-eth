import { createContext, useState, useCallback, ReactNode } from "react";
import { ethers } from "ethers";
import { NetworkStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface WalletContextProps {
  account: string | null;
  setAccount: (account: string | null) => void;
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  connectWallet: () => Promise<void>;
  checkConnection: () => Promise<void>;
  getEthersProvider: () => ethers.BrowserProvider | null;
  getSigner: () => Promise<ethers.JsonRpcSigner | null>;
}

export const WalletContext = createContext<WalletContextProps>({
  account: null,
  setAccount: () => {},
  networkStatus: "disconnected",
  setNetworkStatus: () => {},
  connectWallet: async () => {},
  checkConnection: async () => {},
  getEthersProvider: () => null,
  getSigner: async () => null,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("disconnected");
  const { toast } = useToast();

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask not detected",
          description: "Please install MetaMask to continue",
          variant: "destructive",
        });
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        // Check if on the correct network (Mainnet)
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId === "0x1") {
          setNetworkStatus("connected");
        } else {
          setNetworkStatus("wrong_network");
          toast({
            title: "Wrong Network",
            description: "Please connect to Ethereum Mainnet",
            variant: "warning",
          });
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    }
  }, [toast]);

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        return;
      }

      // Check if already connected
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        // Check network
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId === "0x1") {
          setNetworkStatus("connected");
        } else {
          setNetworkStatus("wrong_network");
        }
      } else {
        setNetworkStatus("disconnected");
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }, []);

  const getEthersProvider = useCallback(() => {
    if (typeof window.ethereum === "undefined") return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const getSigner = useCallback(async () => {
    try {
      const provider = getEthersProvider();
      if (!provider || !account) return null;
      return await provider.getSigner();
    } catch (error) {
      console.error("Error getting signer:", error);
      return null;
    }
  }, [account, getEthersProvider]);

  return (
    <WalletContext.Provider
      value={{
        account,
        setAccount,
        networkStatus,
        setNetworkStatus,
        connectWallet,
        checkConnection,
        getEthersProvider,
        getSigner,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

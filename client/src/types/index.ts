// Wallet related types
export type NetworkStatus = "connected" | "disconnected" | "wrong_network";

// Transactions
export interface TransactionType {
  id: number;
  txHash: string;
  userAddress: string;
  type: "greeting" | "mint";
  status: "pending" | "confirmed" | "failed";
  amount: string;
  timestamp: string;
  metadata?: any;
}

// NFTs
export interface NFTType {
  id: number;
  tokenId: string;
  ownerAddress: string;
  title?: string;
  content: string;
  txHash: string;
  createdAt: string;
  tokenURI?: string;
}

// Web3 providers
export interface Web3Provider {
  request: (params: any) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

export interface Window {
  ethereum?: Web3Provider;
}

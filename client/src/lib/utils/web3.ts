import { ethers } from "ethers";

/**
 * Checks if MetaMask is installed
 * @returns Boolean indicating if MetaMask is available
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

/**
 * Gets the current chain ID
 * @returns Promise with the current chain ID in hex format
 */
export const getCurrentChainId = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    return await window.ethereum!.request({ method: "eth_chainId" });
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

/**
 * Converts Wei to ETH
 * @param wei Amount in Wei as a string or BigNumber
 * @returns Amount in ETH as a string with 6 decimal places
 */
export const weiToEth = (wei: string | ethers.BigNumberish): string => {
  return ethers.formatEther(wei).substring(0, 8);
};

/**
 * Creates a metadata JSON object for NFT tokens
 * @param title NFT title
 * @param content NFT content text
 * @returns JSON string with NFT metadata
 */
export const createNFTMetadata = (title: string, content: string): string => {
  const metadata = {
    name: title,
    description: content,
    attributes: [
      {
        trait_type: "Type",
        value: "Text"
      },
      {
        trait_type: "Created",
        value: new Date().toISOString()
      }
    ]
  };
  
  return JSON.stringify(metadata);
};

/**
 * Gets an ethers.js contract instance
 * @param address Contract address
 * @param abi Contract ABI
 * @param signerOrProvider Signer or provider instance
 * @returns Contract instance
 */
export const getContract = (
  address: string,
  abi: ethers.ContractInterface,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract => {
  return new ethers.Contract(address, abi, signerOrProvider);
};

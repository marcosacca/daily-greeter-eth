import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import { apiRequest } from "@/lib/queryClient";
import { NFT_CONTRACT_ADDRESS, NFT_ABI, NFT_MINTING_FEE } from "@/lib/constants";
import { TransactionType, NFTType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export const useNFT = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account, getSigner, networkStatus } = useWallet();
  const { toast } = useToast();

  // Get all NFTs for the current account
  const { data: nfts, isLoading: isLoadingNFTs } = useQuery<NFTType[]>({
    queryKey: [account ? `/api/nfts/${account}` : null],
    enabled: !!account,
  });

  const createTokenURI = useCallback((title: string, content: string) => {
    // In a real app, this would create and upload metadata to IPFS
    // For this example, we'll just use a JSON string
    return JSON.stringify({
      name: title,
      description: content,
      created: new Date().toISOString(),
      attributes: [
        {
          trait_type: "Type",
          value: "Text"
        }
      ]
    });
  }, []);

  const mintNFT = useCallback(async (title: string, content: string): Promise<TransactionType | null> => {
    if (!account || networkStatus !== "connected" || !content) {
      return null;
    }

    setIsLoading(true);

    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer");
      }

      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      // Create token URI
      const tokenURI = createTokenURI(title, content);

      // Mint the NFT with the required fee
      const tx = await contract.mintNFT(account, tokenURI, {
        value: ethers.parseEther(NFT_MINTING_FEE.toString())
      });

      // Get the token ID from the transaction receipt (after it's mined)
      // For now, we'll create a placeholder transaction
      const transaction: Omit<TransactionType, "id"> = {
        txHash: tx.hash,
        userAddress: account,
        type: "mint",
        status: "pending",
        amount: NFT_MINTING_FEE.toString(),
        timestamp: new Date().toISOString(),
        metadata: { title, content }
      };

      // Save the transaction in our database
      const response = await apiRequest("POST", "/api/transactions", transaction);
      const savedTransaction = await response.json();

      // Wait for transaction to be mined to get the token ID
      const receipt = await tx.wait();
      
      // Find the NFTMinted event and extract the token ID
      const abi = new ethers.Interface(NFT_ABI);
      const nftMintedEvent = receipt.logs.find(log => {
        try {
          const parsedLog = abi.parseLog(log);
          return parsedLog?.name === "NFTMinted";
        } catch (e) {
          return false;
        }
      });
      
      if (nftMintedEvent) {
        const parsedLog = abi.parseLog(nftMintedEvent);
        const tokenId = parsedLog.args[0].toString();
        
        // Save the NFT record
        const nftData = {
          tokenId,
          ownerAddress: account,
          title,
          content,
          txHash: tx.hash,
          createdAt: new Date().toISOString(),
          tokenURI
        };
        
        await apiRequest("POST", "/api/nfts", nftData);
      }

      // Update the transaction status to confirmed
      await apiRequest("PATCH", `/api/transactions/${tx.hash}`, { status: "confirmed" });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/transactions/${account}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/nfts/${account}`] });

      toast({
        title: "Success!",
        description: "Your NFT has been minted",
        variant: "default",
      });

      return savedTransaction;
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [account, networkStatus, getSigner, createTokenURI, toast]);

  return {
    nfts,
    mintNFT,
    isLoading: isLoading || isLoadingNFTs
  };
};

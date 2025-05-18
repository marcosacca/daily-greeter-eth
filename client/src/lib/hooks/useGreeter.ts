import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import { apiRequest } from "@/lib/queryClient";
import { GREETER_CONTRACT_ADDRESS, GREETER_ABI, GREETING_FEE } from "@/lib/constants";
import { TransactionType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export const useGreeter = () => {
  const [lastGreetingDay, setLastGreetingDay] = useState<Date | null>(null);
  const [canSendGreetingToday, setCanSendGreetingToday] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { account, getSigner, networkStatus } = useWallet();
  const { toast } = useToast();

  // Check last greeting date when account changes
  useEffect(() => {
    const checkLastGreeting = async () => {
      if (!account || networkStatus !== "connected") {
        setLastGreetingDay(null);
        setCanSendGreetingToday(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        const contract = new ethers.Contract(
          GREETER_CONTRACT_ADDRESS,
          GREETER_ABI,
          provider
        );

        // Get the last greeting day timestamp
        const lastDay = await contract.getLastGreetingDay(account);
        
        if (lastDay.toString() !== "0") {
          // Convert from days to timestamp
          const lastGreetingTimestamp = lastDay.toString() * 24 * 60 * 60 * 1000;
          const lastDate = new Date(lastGreetingTimestamp);
          setLastGreetingDay(lastDate);
          
          // Check if can send today
          const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
          const lastDayTimestamp = Math.floor(lastGreetingTimestamp / (24 * 60 * 60 * 1000));
          
          setCanSendGreetingToday(today > lastDayTimestamp);
        } else {
          setCanSendGreetingToday(true);
        }
      } catch (error) {
        console.error("Error checking last greeting:", error);
        toast({
          title: "Error",
          description: "Failed to check your last greeting",
          variant: "destructive",
        });
      }
    };

    checkLastGreeting();
  }, [account, networkStatus, toast]);

  const sendGreeting = useCallback(async (message: string): Promise<TransactionType | null> => {
    if (!account || networkStatus !== "connected" || !message) {
      return null;
    }

    setIsLoading(true);

    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer");
      }

      const contract = new ethers.Contract(
        GREETER_CONTRACT_ADDRESS,
        GREETER_ABI,
        signer
      );

      // Send the greeting with the required fee
      const tx = await contract.greet(message, {
        value: ethers.parseEther(GREETING_FEE.toString())
      });

      // Create transaction record
      const transaction: Omit<TransactionType, "id"> = {
        txHash: tx.hash,
        userAddress: account,
        type: "greeting",
        status: "pending",
        amount: GREETING_FEE.toString(),
        timestamp: new Date().toISOString(),
        metadata: { message }
      };

      // Save the transaction in our database
      const response = await apiRequest("POST", "/api/transactions", transaction);
      const savedTransaction = await response.json();

      // Wait for transaction to be mined
      await tx.wait();

      // Update the transaction status to confirmed
      await apiRequest("PATCH", `/api/transactions/${tx.hash}`, { status: "confirmed" });

      // Update the current state
      setCanSendGreetingToday(false);
      setLastGreetingDay(new Date());
      
      // Invalidate the transactions query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/transactions/${account}`] });

      toast({
        title: "Success!",
        description: "Your greeting has been sent",
        variant: "default",
      });

      return savedTransaction;
    } catch (error) {
      console.error("Error sending greeting:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send greeting",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [account, networkStatus, getSigner, toast]);

  return {
    lastGreetingDay,
    canSendGreetingToday,
    sendGreeting,
    isLoading
  };
};

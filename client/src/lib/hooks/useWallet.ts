import { useContext } from "react";
import { WalletContext } from "@/lib/context/WalletContext";

export const useWallet = () => {
  return useContext(WalletContext);
};

import { useState } from "react";
import { useWallet } from "@/lib/hooks/useWallet";
import { useNFT } from "@/lib/hooks/useNFT";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, InfoIcon } from "lucide-react";
import { TransactionType } from "@/types";
import { formatAddress } from "@/lib/utils/format";
import { NFT_MINTING_FEE, ESTIMATED_GAS } from "@/lib/constants";

interface CreateNFTProps {
  openTransactionModal: (transaction: TransactionType) => void;
}

const CreateNFT = ({ openTransactionModal }: CreateNFTProps) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { mintNFT, isLoading } = useNFT();
  
  const [nftText, setNftText] = useState("");
  const [nftTitle, setNftTitle] = useState("My Custom Text NFT");
  
  const handleNftTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNftText(e.target.value);
  };
  
  const handleMintNFT = async () => {
    if (!account || !nftText || isLoading) return;
    
    try {
      const transaction = await mintNFT(nftTitle, nftText);
      if (transaction) {
        openTransactionModal(transaction);
        setNftText("");
      }
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };
  
  // Calculate total ETH cost
  const totalCost = NFT_MINTING_FEE + ESTIMATED_GAS;
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("createTextNFT")}</h2>
          
          <div className="mb-6">
            <label htmlFor="nft-text" className="block text-sm font-medium text-gray-700 mb-1">
              {t("yourNFTText")}
            </label>
            <Textarea
              id="nft-text"
              value={nftText}
              onChange={handleNftTextChange}
              placeholder={t("enterNFTText")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("nftPreview")}
            </label>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-300 rounded-lg p-6 flex items-center justify-center h-60">
              <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h3 className="text-primary-800 font-medium mb-3">{nftTitle}</h3>
                <p className="text-gray-700">{nftText || t("nftPreviewPlaceholder")}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{t("created")}: {currentDate}</span>
                  <span className="text-xs text-gray-500">{t("owner")}: {formatAddress(account || "0x0")}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("nftMintingDetails")}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t("mintingFee")}</span>
              <span className="text-sm font-medium">{NFT_MINTING_FEE} ETH</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">{t("networkFeeEst")}</span>
              <span className="text-sm font-medium">~{ESTIMATED_GAS} ETH</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">{t("totalEst")}</span>
              <span className="text-sm font-medium">~{totalCost} ETH</span>
            </div>
          </div>
          
          <div>
            {!account ? (
              <Button disabled className="w-full bg-gray-400 text-white py-3">
                {t("connectWalletToContinue")}
              </Button>
            ) : isLoading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("minting")}
              </Button>
            ) : (
              <Button 
                onClick={handleMintNFT}
                disabled={!nftText}
                className="w-full"
              >
                {t("mintNFT")}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("aboutTextNFTs")}</h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <p>{t("textNFTDescription")}</p>
            
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">{t("whatMakesSpecial")}</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-blue-700">
                    <li>{t("immutable")}</li>
                    <li>{t("verifiable")}</li>
                    <li>{t("tradable")}</li>
                    <li>{t("unique")}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-700">{t("howToUseNFT")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">1</span>
                <span>{t("viewWallet")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">2</span>
                <span>{t("shareLink")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">3</span>
                <span>{t("tradeNFT")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">4</span>
                <span>{t("proofOwnership")}</span>
              </li>
            </ul>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">{t("contractDetails")}</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>{t("contract")}</span>
                  <a href={`https://etherscan.io/address/${import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x521b85b6F387e7A66a25C8d0A4799FC387f37D1F'}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary-700">
                    {formatAddress(import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x521b85b6F387e7A66a25C8d0A4799FC387f37D1F')}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>{t("standard")}</span>
                  <span>ERC-721</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("blockchain")}</span>
                  <span>Ethereum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;

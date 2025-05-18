import { useState } from "react";
import { useWallet } from "@/lib/hooks/useWallet";
import { useGreeter } from "@/lib/hooks/useGreeter";
import { useNFT } from "@/lib/hooks/useNFT";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CheckCircle, Clock, Sparkles } from "lucide-react";
import { TransactionType } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { GREETING_FEE, NFT_MINTING_FEE, ESTIMATED_GAS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";

interface DailyGreetingsProps {
  openTransactionModal: (transaction: TransactionType) => void;
}

const DailyGreetings = ({ openTransactionModal }: DailyGreetingsProps) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { lastGreetingDay, canSendGreetingToday, sendGreeting, isLoading: isGreetingLoading } = useGreeter();
  const { mintNFT, isLoading: isNFTLoading } = useNFT();
  
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [mintAsNFT, setMintAsNFT] = useState(false);
  const [title, setTitle] = useState("My Greeting NFT");
  
  const isLoading = isGreetingLoading || isNFTLoading;
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.length > 20) {
      setMessageError(t("messageTooLong"));
    } else {
      setMessageError("");
    }
  };
  
  const handleSendGreeting = async () => {
    if (!account || !message || message.length > 20 || isLoading) return;
    
    try {
      let transaction;
      
      if (mintAsNFT) {
        // Mint as NFT
        transaction = await mintNFT(title, message);
      } else {
        // Send as regular greeting
        transaction = await sendGreeting(message);
      }
      
      if (transaction) {
        openTransactionModal(transaction);
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send greeting:", error);
    }
  };
  
  // Calculate total ETH cost based on user choice
  const totalCost = mintAsNFT ? (NFT_MINTING_FEE + ESTIMATED_GAS) : (GREETING_FEE + ESTIMATED_GAS);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-purple-900/30 text-white">
          <h2 className="text-xl font-semibold text-white mb-4 gradient-text inline-block">{t("sendDailyGreeting")}</h2>
          
          <div className="mb-6">
            <label htmlFor="greeting-message" className="block text-sm font-medium text-gray-300 mb-1">
              {t("yourGreetingMessage")}
            </label>
            <Textarea
              id="greeting-message"
              value={message}
              onChange={handleMessageChange}
              placeholder={t("enterGreetingMessage")}
              rows={2}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
            <div className="mt-1 flex justify-between">
              <p className="text-xs text-gray-400">{message.length}/20</p>
              {messageError && <p className="text-xs text-red-400">{messageError}</p>}
            </div>
          </div>
          
          <div className="mb-4 flex items-center space-x-2">
            <Switch 
              checked={mintAsNFT} 
              onCheckedChange={setMintAsNFT} 
              className="data-[state=checked]:bg-purple-500"
            />
            <span className="text-sm font-medium text-gray-300 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
              {mintAsNFT ? "Mint as NFT" : "Mint as NFT?"} 
            </span>
          </div>
          
          <div className="mb-6 p-4 bg-gray-700 rounded-md border border-gray-600">
            <h3 className="text-sm font-medium text-gray-200 mb-2">{t("transactionDetails")}</h3>
            {mintAsNFT ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">NFT Minting Fee</span>
                  <span className="text-sm font-medium text-white">{NFT_MINTING_FEE} ETH</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-300">{t("networkFeeEst")}</span>
                  <span className="text-sm font-medium text-white">~{ESTIMATED_GAS} ETH</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{t("greetingFee")}</span>
                  <span className="text-sm font-medium text-white">{GREETING_FEE} ETH</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-300">{t("networkFeeEst")}</span>
                  <span className="text-sm font-medium text-white">~{ESTIMATED_GAS} ETH</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-500">
              <span className="text-sm font-medium text-gray-200">{t("totalEst")}</span>
              <span className="text-sm font-medium text-white">~{totalCost} ETH</span>
            </div>
          </div>
          
          <div>
            {!account ? (
              <Button disabled className="w-full bg-gray-600 text-white py-3">
                {t("connectWalletToContinue")}
              </Button>
            ) : isLoading ? (
              <Button disabled className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mintAsNFT ? "Minting..." : t("processing")}
              </Button>
            ) : (
              <Button 
                onClick={handleSendGreeting}
                disabled={!message || message.length > 20 || !canSendGreetingToday}
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-lg"
              >
                {mintAsNFT ? (
                  <span className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Mint Greeting NFT
                  </span>
                ) : (
                  t("sendGreeting")
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-purple-900/30 text-white">
          <h2 className="text-xl font-semibold text-white mb-4 gradient-text inline-block">{t("greetingStatus")}</h2>
          
          {account ? (
            <>
              {lastGreetingDay && (
                <div className="p-4 bg-indigo-900/30 rounded-md mb-4 border border-indigo-800">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-300">{t("lastGreetingSent")}</h3>
                      <p className="mt-1 text-sm text-blue-200">
                        {formatDate(lastGreetingDay)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {canSendGreetingToday ? (
                <div className="p-4 bg-green-900/30 rounded-md border border-green-800">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-300">{t("canSendGreeting")}</h3>
                      <p className="mt-1 text-sm text-green-200">{t("oneGreetingPerDay")}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-900/30 rounded-md border border-yellow-800">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-300">{t("alreadySentGreeting")}</h3>
                      <p className="mt-1 text-sm text-yellow-200">{t("canSendTomorrow")}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 text-center">{t("connectToSeeStatus")}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-200 mb-2">{t("howItWorks")}</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-900 text-indigo-200 text-xs font-medium mr-2">1</span>
                <span>{t("writeGreeting")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-900 text-indigo-200 text-xs font-medium mr-2">2</span>
                <span>{t("paySmallFee")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-900 text-indigo-200 text-xs font-medium mr-2">3</span>
                <span>{mintAsNFT ? "Create an NFT record on blockchain" : t("greetingRecorded")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-900 text-indigo-200 text-xs font-medium mr-2">4</span>
                <span>{t("oneGreetingPerDay")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGreetings;

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import NetworkBanner from "@/components/NetworkBanner";
import TabsContainer from "@/components/TabsContainer";
import DailyGreetings from "@/components/DailyGreetings";
import MyCollection from "@/components/MyCollection";
import Transactions from "@/components/Transactions";
import TransactionModal from "@/components/TransactionModal";
import Footer from "@/components/Footer";
import { useWallet } from "@/lib/hooks/useWallet";
import { TransactionType } from "@/types";

export type Tab = "daily-greetings" | "my-collection" | "transactions";

const Home = () => {
  const [activeTab, setActiveTab] = useState<Tab>("daily-greetings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<TransactionType | null>(null);
  const { account, networkStatus } = useWallet();

  const openTransactionModal = (transaction: TransactionType) => {
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMnY2aDZ2LTZoLTZ6Ii8+PHBhdGggZD0iTTEyIDM2aDZ2Nkgxen0iLz48cGF0aCBkPSJNMTggMTJoNnY2aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {networkStatus !== "connected" && <NetworkBanner networkStatus={networkStatus} />}
        
        <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === "daily-greetings" && (
          <DailyGreetings 
            openTransactionModal={openTransactionModal} 
          />
        )}
        
        {activeTab === "my-collection" && (
          <MyCollection />
        )}
        
        {activeTab === "transactions" && (
          <Transactions 
            openTransactionModal={openTransactionModal} 
          />
        )}
      </main>
      
      <Footer />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        transaction={currentTransaction} 
        closeModal={closeTransactionModal} 
      />
    </div>
  );
};

export default Home;

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
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

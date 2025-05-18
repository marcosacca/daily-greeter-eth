import { Tab } from "@/pages/Home";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { MessageSquareText, ImageIcon, ArchiveIcon, ListIcon } from "lucide-react";

interface TabsContainerProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabsContainer = ({ activeTab, setActiveTab }: TabsContainerProps) => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: "daily-greetings", label: t("dailyGreetings"), icon: <MessageSquareText className="h-4 w-4 mr-2" /> },
    { id: "create-nft", label: t("createNFT"), icon: <ImageIcon className="h-4 w-4 mr-2" /> },
    { id: "my-collection", label: t("myCollection"), icon: <ArchiveIcon className="h-4 w-4 mr-2" /> },
    { id: "transactions", label: t("transactions"), icon: <ListIcon className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-4 px-1 text-sm font-medium flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabsContainer;

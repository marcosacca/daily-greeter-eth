import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./lib/context/WalletContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </I18nextProvider>
);

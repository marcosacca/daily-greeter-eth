import { useTranslation as useI18nTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "@/lib/context/LanguageContext";

export const useTranslation = () => {
  const { t } = useI18nTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);

  return {
    t,
    language,
    changeLanguage
  };
};

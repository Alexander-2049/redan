// import { useTranslation } from "react-i18next";
import "./i18n";
import TitleBar from "./components/TitleBar";
import DebugPage from "./pages/DebugPage";

const Main = () => {
  // const { t } = useTranslation();
  /*
        The title is: {t("title")}
        Description: {t("description.part1")}
  */

  return (
    <div className="flex h-full flex-col">
      <TitleBar />
      <div className="grow">
        {/* Content START */}
        <DebugPage />
        {/* Content END */}
      </div>
    </div>
  );
};

export default Main;

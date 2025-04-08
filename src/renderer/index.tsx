// import { useTranslation } from "react-i18next";
import "./i18n";
import TitleBar from "./components/TitleBar";
import DebugPage from "./pages/DebugPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const Main = () => {
  // const { t } = useTranslation();
  /*
        The title is: {t("title")}
        Description: {t("description.part1")}
  */

  return (
    <div className="flex h-full flex-col">
      <TitleBar />
      <Header />
      <div className="flex grow flex-col">
        <div className="flex grow flex-row">
          <Sidebar />
          <div className="grow overflow-hidden">
            <DebugPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

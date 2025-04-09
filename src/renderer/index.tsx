// import { useTranslation } from "react-i18next";
import "./i18n";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomeRoute from "./routes/HomeRoute";
import DebugPage from "./routes/DebugRoute";
import PageLayout from "./components/PageLayout";
import NotFoundRoute from "./routes/NotFoundRoute";

const Main = () => {
  // const { t } = useTranslation();
  /*
        The title is: {t("title")}
        Description: {t("description.part1")}
  */

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route element={<PageLayout />}>
            <Route index element={<HomeRoute />} />
            <Route path="/debug" element={<DebugPage />} />
          </Route>
          <Route path="*" element={<PageLayout />}>
            <Route path="*" element={<NotFoundRoute />} />
          </Route>
        </Route>
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </HashRouter>
  );
};

export default Main;

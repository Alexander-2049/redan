// import { useTranslation } from "react-i18next";
import "./i18n";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardRoute from "./routes/DashboardRoute";
import DebugRoute from "./routes/DebugRoute";
import PageLayout from "./components/layout/PageLayout";
import NotFoundRoute from "./routes/NotFoundRoute";
import MyOverlaysRoute from "./routes/MyOverlaysRoute";
import MyLayoutsRoute from "./routes/MyLayoutsRoute";

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
            <Route index element={<DashboardRoute />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/debug" element={<DebugRoute />} />
            <Route path="/my-overlays" element={<MyOverlaysRoute />} />
            <Route path="/my-layouts" element={<MyLayoutsRoute />} />
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

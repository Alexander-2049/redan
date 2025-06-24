// import { useTranslation } from "react-i18next";
import "./i18n";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/app-layout";
import DashboardRoute from "./routes/dashboard-route";
import DebugRoute from "./routes/debug-route";
import PageLayout from "./components/layout/page-layout";
import NotFoundRoute from "./routes/not-found-route";
import MyLayoutsRoute from "./routes/my-layouts-route";
import { useEffect } from "react";
import { useLayouts } from "./api/layouts/get-layouts";
import BrowseWorkshopRoute from "./routes/browse-workshop-route";

const Main = () => {
  // const { t } = useTranslation();
  /*
        The title is: {t("title")}
        Description: {t("description.part1")}
  */
  const { refetch: refetchLayouts } = useLayouts();

  useEffect(() => {
    window.electron.onLayoutModified(() => {
      refetchLayouts();
    });

    return () => {
      window.electron.removeLayoutModifiedListeners();
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<>Test</>} />
        <Route path="/" element={<AppLayout />}>
          <Route element={<PageLayout />}>
            <Route index element={<DashboardRoute />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/debug" element={<DebugRoute />} />
            <Route path="/my-layouts" element={<MyLayoutsRoute />} />
            <Route path="/browse-workshop" element={<BrowseWorkshopRoute />} />
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

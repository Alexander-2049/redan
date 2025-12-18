// import { useTranslation } from "react-i18next";
// import './i18n';
// import { useEffect } from 'react';
import { Bug, Globe, Layout, Paintbrush } from 'lucide-react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { useSteamOnline } from './api/steam/is-steam-online';
import { AppLayout } from './components/main-layouts/app-layout';
import { PageLayout } from './components/main-layouts/page-layout';
import CreateOverlayRoute from './routes/create-overlay-route';
import DebugRoute from './routes/debug-route';
import LayoutsRoute from './routes/layouts-route';
import { NotFoundRoute } from './routes/not-found-route';
import SplashRoute from './routes/splash-route';
import { WorkshopRoute } from './routes/workshop-route';

// import { useLayouts } from './api/layouts/get-layouts';
// import AppLayout from './components/layout/app-layout';
// import PageLayout from './components/layout/page-layout';
// import ConfiguratorRoute from './routes/configurator-route';
// import DashboardRoute from './routes/dashboard-route';
// import DebugRoute from './routes/debug-route';
// import MyLayoutsRoute from './routes/my-layouts-route';
// import NotFoundRoute from './routes/not-found-route';
// import WorkshopRoute from './routes/workshop-route';

const Main = () => {
  // const { t } = useTranslation();
  /*
        The title is: {t("title")}
        Description: {t("description.part1")}
  */
  // const { refetch: refetchLayouts } = useLayouts();

  // useEffect(() => {
  //   window.electron.onLayoutModified(() => {
  //     refetchLayouts();
  //   });

  //   return () => {
  //     window.electron.removeLayoutModifiedListeners();
  //   };
  // }, []);

  const { data: isSteamOnline } = useSteamOnline();
  const isDebug = true; // or determine from process.env, etc.

  const sidebarLinks = [
    {
      group: 'MAIN',
      links: [
        { text: 'Layouts', path: '/layouts', icon: Layout },
        { text: 'Workshop', path: '/workshop', icon: Globe },
        { text: 'Create', path: '/create', icon: Paintbrush },
      ],
    },
    ...(isDebug
      ? [
          {
            group: 'DEVELOPER',
            links: [{ text: 'Debug', path: '/debug', icon: Bug }],
          },
        ]
      : []),
  ];

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SplashRoute />} />
        <Route path="/" element={<AppLayout />}>
          <Route element={<PageLayout sidebarLinks={sidebarLinks} />}>
            <Route
              path="/workshop"
              element={<WorkshopRoute isSteamOnline={isSteamOnline || false} />}
            />
            <Route path="/layouts" element={<LayoutsRoute />} />
            <Route path="/create" element={<CreateOverlayRoute />} />
            <Route path="/debug" element={<DebugRoute />} />
            {/* <Route index element={<DashboardRoute />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/configurator" element={<ConfiguratorRoute />} /> */}
          </Route>
          <Route path="*" element={<PageLayout sidebarLinks={sidebarLinks} />}>
            <Route path="*" element={<NotFoundRoute />} />
          </Route>
        </Route>
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </HashRouter>
  );
};

export default Main;

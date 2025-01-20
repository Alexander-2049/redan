import { useState } from "react";
import Layout from "./components/layout";
import Menu from "./components/menu";
import { PageType } from "./types/PageType";
import DashboardPage from "./components/pages/dashboard";
import OverlaysPage from "./components/pages/overlays";
import LayoutsPage from "./components/pages/layouts";
import Debug from "./components/pages/debug";

const pages: { [key in PageType]: JSX.Element } = {
  dashboard: <DashboardPage />,
  overlays: <OverlaysPage />,
  layouts: <LayoutsPage />,
  debug: <Debug />,
};

const Main = () => {
  const [selectedPage, setSelectedPage] = useState<PageType>("dashboard");

  return (
    <Layout>
      <Menu setSelectedPage={setSelectedPage} />
      {pages[selectedPage]}
    </Layout>
  );
};

export default Main;

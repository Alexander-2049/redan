/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import "./styles/globals.css";
import Main from ".";
import React from "react";
import DashboardRoute from "./routes/dashboard-route";
import { createRoot } from "react-dom/client";
import { createHashRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "./store"; // путь к твоему store.ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/fonts.css";

export const router = createHashRouter([
  {
    path: "/",
    element: <DashboardRoute />,
  },
]);

const queryClient = new QueryClient();

const app = document.getElementById("app");
if (!app) throw new Error("root element with app id was not found");

const root = createRoot(app);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Main />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);

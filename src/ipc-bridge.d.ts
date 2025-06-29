interface WindowAction {
  minimize: () => Promise<void>;
  restore: () => Promise<void>;
  close: () => Promise<void>;
}

declare global {
  interface Window {
    actions: WindowAction;
  }
}

export {};

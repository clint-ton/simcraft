interface ElectronAPI {
  minimize: () => Promise<void>;
  toggleMaximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMaximizedChange: (callback: (maximized: boolean) => void) => () => void;
  checkForUpdate: () => Promise<{ version: string } | null>;
  downloadAndInstall: () => Promise<void>;
  onUpdateAvailable: (callback: (version: string) => void) => () => void;
  onDownloadProgress: (callback: (percent: number) => void) => () => void;
}

interface Window {
  electronAPI?: ElectronAPI;
}

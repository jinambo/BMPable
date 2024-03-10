// global.d.ts
export {}; // Zajistí, že soubor je modul

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        // Přidejte další metody, které potřebujete
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: {
      loadImagePath: () => any;
    }
  }
}

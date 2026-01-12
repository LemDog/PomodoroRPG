"use strict";

// electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    getState: () => import_electron.ipcRenderer.invoke("game:getState"),
    startGame: () => import_electron.ipcRenderer.invoke("game:startGame"),
    stopGame: () => import_electron.ipcRenderer.invoke("game:stopGame"),
    debugAddXp: (amount) => import_electron.ipcRenderer.invoke("game:debugAddXp", amount),
    debugTriggerEvent: () => import_electron.ipcRenderer.invoke("game:debugTriggerEvent"),
    allocateStat: (stat) => import_electron.ipcRenderer.invoke("game:allocateStat", stat),
    useItem: (itemId) => import_electron.ipcRenderer.invoke("game:useItem", itemId),
    onStateUpdate: (callback) => {
      import_electron.ipcRenderer.on("game-state-update", callback);
      return () => import_electron.ipcRenderer.removeListener("game-state-update", callback);
    },
    onToggleDebugMode: (callback) => {
      import_electron.ipcRenderer.on("toggle-debug-mode", callback);
      return () => import_electron.ipcRenderer.removeListener("toggle-debug-mode", callback);
    }
  }
);
//# sourceMappingURL=preload.js.map
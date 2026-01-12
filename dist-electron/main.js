"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// electron/main.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"));

// electron/backend/Logger.ts
var Logger = class {
  constructor(scope) {
    __publicField(this, "scope");
    this.scope = scope;
  }
  format(level, message, meta) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return `[${timestamp}] [${level}] [${this.scope}]: ${message} ${meta ? JSON.stringify(meta) : ""}`;
  }
  info(message, meta) {
    console.log(this.format("INFO" /* INFO */, message, meta));
  }
  warn(message, meta) {
    console.warn(this.format("WARN" /* WARN */, message, meta));
  }
  error(message, meta) {
    console.error(this.format("ERROR" /* ERROR */, message, meta));
  }
  debug(message, meta) {
    console.debug(this.format("DEBUG" /* DEBUG */, message, meta));
  }
};

// electron/backend/types.ts
var INITIAL_HERO = {
  name: "Little Guy",
  level: 1,
  currentXp: 0,
  requiredXp: 100,
  stats: {
    coding: 5,
    focus: 5,
    energy: 100
  },
  equipment: {},
  inventory: []
};

// electron/backend/GameService.ts
var GameService = class {
  constructor() {
    __publicField(this, "logger");
    __publicField(this, "state");
    __publicField(this, "intervalId", null);
    __publicField(this, "onStateChange", null);
    this.logger = new Logger("GameService");
    this.state = {
      hero: { ...INITIAL_HERO },
      timer: {
        timeLeft: 25 * 60,
        isActive: false,
        mode: "WORK"
      },
      currentAction: "Idle"
    };
    this.logger.info("GameService initialized");
  }
  registerStateCallback(callback) {
    this.onStateChange = callback;
  }
  emitState() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
  getState() {
    return this.state;
  }
  startGame() {
    if (this.state.timer.isActive) return;
    this.logger.info("Starting mission");
    this.state.timer.isActive = true;
    this.state.currentAction = "Starting Mission...";
    this.emitState();
    this.intervalId = setInterval(() => this.tick(), 1e3);
  }
  stopGame() {
    if (!this.state.timer.isActive) return;
    this.logger.info("Stopping mission (Retreat)");
    this.state.timer.isActive = false;
    this.state.currentAction = "Retreated to Camp";
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitState();
  }
  tick() {
    if (this.state.timer.timeLeft <= 0) {
      this.completeSession();
      return;
    }
    this.state.timer.timeLeft -= 1;
    this.state.hero.currentXp += 1;
    this.checkLevelUp();
    if (Math.random() < 0.05) {
      const actions = ["Fighting Bug", "Optimizing", "Googling Error", "Drinking Coffee", "Refactoring"];
      this.state.currentAction = actions[Math.floor(Math.random() * actions.length)];
    }
    this.emitState();
  }
  checkLevelUp() {
    if (this.state.hero.currentXp >= this.state.hero.requiredXp) {
      this.state.hero.level += 1;
      this.state.hero.currentXp -= this.state.hero.requiredXp;
      this.state.hero.requiredXp = Math.floor(this.state.hero.requiredXp * 1.5);
      this.logger.info(`Level Up! New Level: ${this.state.hero.level}`);
    }
  }
  completeSession() {
    this.logger.info("Session Complete");
    this.state.timer.isActive = false;
    this.state.timer.timeLeft = 0;
    this.state.currentAction = "Mission Complete! Loot found.";
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitState();
  }
  // --- Debug / Test Mode Methods ---
  debugAddXp(amount) {
    this.logger.info(`[DEBUG] Adding ${amount} XP`);
    this.state.hero.currentXp += amount;
    this.checkLevelUp();
    this.emitState();
  }
  debugTriggerEvent() {
    this.logger.info("[DEBUG] Triggering Random Event");
    const actions = ["Fighting Bug", "Optimizing", "Googling Error", "Drinking Coffee", "Refactoring"];
    this.state.currentAction = actions[Math.floor(Math.random() * actions.length)];
    this.emitState();
  }
};

// electron/main.ts
var gameService = new GameService();
var createWindow = () => {
  const mainWindow = new import_electron.BrowserWindow({
    width: 1e3,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: import_path.default.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
      // Secure IPC
    }
  });
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Enable Test Mode",
          type: "checkbox",
          checked: true,
          click: (menuItem) => {
            mainWindow.webContents.send("toggle-debug-mode", menuItem.checked);
          }
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" }
  ];
  const menu = import_electron.Menu.buildFromTemplate(menuTemplate);
  import_electron.Menu.setApplicationMenu(menu);
  gameService.registerStateCallback((state) => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send("game-state-update", state);
    }
  });
  mainWindow.loadURL("http://localhost:5173").catch(() => {
    mainWindow.loadFile(import_path.default.join(__dirname, "../dist/index.html"));
  });
};
import_electron.ipcMain.handle("game:getState", () => {
  return gameService.getState();
});
import_electron.ipcMain.handle("game:startGame", () => {
  gameService.startGame();
  return gameService.getState();
});
import_electron.ipcMain.handle("game:stopGame", () => {
  gameService.stopGame();
  return gameService.getState();
});
import_electron.ipcMain.handle("game:debugAddXp", (_, amount) => {
  gameService.debugAddXp(amount);
  return gameService.getState();
});
import_electron.ipcMain.handle("game:debugTriggerEvent", () => {
  gameService.debugTriggerEvent();
  return gameService.getState();
});
import_electron.app.on("ready", createWindow);
import_electron.app.on("will-quit", () => {
  gameService.stopGame();
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (import_electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//# sourceMappingURL=main.js.map
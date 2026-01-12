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
  name: "Novice",
  job: "Novice",
  level: 1,
  currentXp: 0,
  requiredXp: 100,
  statPoints: 0,
  stats: {
    str: 1,
    agi: 1,
    vit: 1,
    int: 1,
    dex: 1,
    luk: 1
  },
  derived: {
    hp: 40,
    maxHp: 40,
    sp: 11,
    maxSp: 11,
    atk: 2,
    matk: 2,
    def: 0,
    mdef: 0,
    hit: 101,
    flee: 101,
    aspd: 150,
    crit: 1
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
    __publicField(this, "lootTable", []);
    this.logger = new Logger("GameService");
    this.state = {
      hero: { ...INITIAL_HERO },
      timer: {
        timeLeft: 25 * 60,
        isActive: false,
        mode: "WORK"
      },
      currentAction: "Idle",
      log: []
    };
    this.initializeLootTable();
    this.calculateDerivedStats();
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
  initializeLootTable() {
    this.lootTable = [
      { chance: 0.5, item: { id: "jellopy", name: "Jellopy", type: "ETC", description: "A small crystallization created by some monster.", quantity: 1, icon: "jellopy" } },
      { chance: 0.3, item: { id: "apple", name: "Apple", type: "USABLE", description: "Restores a small amount of HP.", effect: { type: "HEAL_HP", value: 10 }, quantity: 1, icon: "apple" } },
      { chance: 0.1, item: { id: "red_potion", name: "Red Potion", type: "USABLE", description: "Restores HP.", effect: { type: "HEAL_HP", value: 45 }, quantity: 1, icon: "red_potion" } },
      { chance: 0.1, item: { id: "blue_potion", name: "Blue Potion", type: "USABLE", description: "Restores SP.", effect: { type: "HEAL_SP", value: 20 }, quantity: 1, icon: "blue_potion" } }
    ];
  }
  calculateDerivedStats() {
    const stats = this.state.hero.stats;
    const derived = this.state.hero.derived;
    const baseHp = 35 + this.state.hero.level * 5;
    const baseSp = 10 + this.state.hero.level * 1;
    derived.maxHp = Math.floor(baseHp * (1 + stats.vit * 0.01));
    derived.maxSp = Math.floor(baseSp * (1 + stats.int * 0.01));
    derived.atk = stats.str + Math.floor(stats.str / 10) * Math.floor(stats.str / 10) + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5);
    derived.matk = stats.int + Math.floor(stats.int / 7) * Math.floor(stats.int / 7);
    derived.def = stats.vit;
    derived.mdef = stats.int + Math.floor(stats.vit / 2);
    derived.hit = this.state.hero.level + stats.dex;
    derived.flee = this.state.hero.level + stats.agi;
    derived.crit = 1 + stats.luk * 0.3;
    derived.aspd = 150 + Math.floor(Math.sqrt(stats.agi * 9.99 + stats.dex * 0.19));
    if (derived.hp > derived.maxHp) derived.hp = derived.maxHp;
    if (derived.sp > derived.maxSp) derived.sp = derived.maxSp;
  }
  startGame() {
    if (this.state.timer.isActive) return;
    this.logger.info("Starting mission");
    this.addLog("Mission Started!");
    this.state.timer.isActive = true;
    this.state.currentAction = "Hunting...";
    this.emitState();
    this.intervalId = setInterval(() => this.tick(), 1e3);
  }
  stopGame() {
    if (!this.state.timer.isActive) return;
    this.logger.info("Stopping mission (Retreat)");
    this.addLog("Retreated from combat!");
    this.distractionPenalty();
    this.state.timer.isActive = false;
    this.state.currentAction = "Resting";
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitState();
  }
  distractionPenalty() {
    const hpPenalty = Math.floor(this.state.hero.derived.maxHp * 0.1);
    this.state.hero.derived.hp = Math.max(0, this.state.hero.derived.hp - hpPenalty);
    this.addLog(`Distracted! Lost focus and ${hpPenalty} HP.`);
  }
  tick() {
    if (this.state.timer.timeLeft <= 0) {
      this.completeSession();
      return;
    }
    this.state.timer.timeLeft -= 1;
    if (this.state.timer.timeLeft % 6 === 0) {
      const hpRegen = Math.max(1, Math.floor(this.state.hero.stats.vit / 5) + Math.floor(this.state.hero.derived.maxHp / 200));
      this.state.hero.derived.hp = Math.min(this.state.hero.derived.maxHp, this.state.hero.derived.hp + hpRegen);
      const spRegen = Math.max(1, Math.floor(this.state.hero.stats.int / 6) + Math.floor(this.state.hero.derived.maxSp / 100));
      this.state.hero.derived.sp = Math.min(this.state.hero.derived.maxSp, this.state.hero.derived.sp + spRegen);
    }
    let xpGain = 1;
    if (Math.random() < this.state.hero.stats.str * 0.01) {
      xpGain += 1;
    }
    this.state.hero.currentXp += xpGain;
    this.checkLevelUp();
    if (Math.random() < 0.02) {
      this.triggerRandomEvent();
    }
    this.emitState();
  }
  triggerRandomEvent() {
    const events = [
      { text: "Found a bug!", hp: -5 },
      { text: "Drank a potion.", hp: 10 },
      { text: "Felt inspired!", sp: 5 },
      { text: "Confused...", sp: -5 }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    this.state.currentAction = event.text;
    if (event.hp) {
      this.state.hero.derived.hp = Math.min(this.state.hero.derived.maxHp, Math.max(0, this.state.hero.derived.hp + event.hp));
    }
    if (event.sp) {
      this.state.hero.derived.sp = Math.min(this.state.hero.derived.maxSp, Math.max(0, this.state.hero.derived.sp + event.sp));
    }
  }
  checkLevelUp() {
    if (this.state.hero.currentXp >= this.state.hero.requiredXp) {
      this.state.hero.level += 1;
      this.state.hero.currentXp -= this.state.hero.requiredXp;
      this.state.hero.requiredXp = Math.floor(this.state.hero.requiredXp * 1.5);
      this.state.hero.statPoints += 3;
      this.calculateDerivedStats();
      this.state.hero.derived.hp = this.state.hero.derived.maxHp;
      this.state.hero.derived.sp = this.state.hero.derived.maxSp;
      this.addLog(`Level Up! You are now level ${this.state.hero.level}. gained 3 stat points.`);
    }
  }
  completeSession() {
    this.logger.info("Session Complete");
    this.addLog("Mission Complete!");
    this.state.timer.isActive = false;
    this.state.timer.timeLeft = 0;
    this.state.currentAction = "Mission Complete! Checking for loot...";
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.generateLoot();
    this.emitState();
  }
  generateLoot() {
    const dropMultiplier = 1 + this.state.hero.stats.luk * 0.05;
    for (const entry of this.lootTable) {
      if (Math.random() < entry.chance * dropMultiplier) {
        this.addItemToInventory(entry.item);
        this.addLog(`Found ${entry.item.name}!`);
      }
    }
  }
  addItemToInventory(item) {
    const existingItem = this.state.hero.inventory.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.state.hero.inventory.push({ ...item });
    }
  }
  allocateStat(stat) {
    if (this.state.hero.statPoints > 0) {
      this.state.hero.stats[stat] += 1;
      this.state.hero.statPoints -= 1;
      this.calculateDerivedStats();
      this.emitState();
      this.addLog(`Increased ${stat.toUpperCase()} to ${this.state.hero.stats[stat]}`);
    }
  }
  useItem(itemId) {
    const itemIndex = this.state.hero.inventory.findIndex((i) => i.id === itemId);
    if (itemIndex > -1) {
      const item = this.state.hero.inventory[itemIndex];
      if (item.type === "USABLE" && item.effect) {
        if (item.effect.type === "HEAL_HP") {
          this.state.hero.derived.hp = Math.min(this.state.hero.derived.maxHp, this.state.hero.derived.hp + item.effect.value);
          this.addLog(`Used ${item.name}, recovered ${item.effect.value} HP`);
        } else if (item.effect.type === "HEAL_SP") {
          this.state.hero.derived.sp = Math.min(this.state.hero.derived.maxSp, this.state.hero.derived.sp + item.effect.value);
          this.addLog(`Used ${item.name}, recovered ${item.effect.value} SP`);
        }
        item.quantity -= 1;
        if (item.quantity <= 0) {
          this.state.hero.inventory.splice(itemIndex, 1);
        }
        this.emitState();
      }
    }
  }
  addLog(message) {
    this.state.log.unshift(message);
    if (this.state.log.length > 50) this.state.log.pop();
  }
  // --- Debug / Test Mode Methods ---
  debugAddXp(amount) {
    this.logger.info(`[DEBUG] Adding ${amount} XP`);
    this.state.hero.currentXp += amount;
    this.checkLevelUp();
    this.emitState();
  }
  debugTriggerEvent() {
    this.triggerRandomEvent();
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
import_electron.ipcMain.handle("game:allocateStat", (_, stat) => {
  gameService.allocateStat(stat);
  return gameService.getState();
});
import_electron.ipcMain.handle("game:useItem", (_, itemId) => {
  gameService.useItem(itemId);
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
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { GameService } from './backend/GameService'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//     app.quit()
// }

// Initialize Game Service (Backend Logic)
const gameService = new GameService();

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true, // Secure IPC
        },
    })

    // Create Application Menu
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Enable Test Mode',
                    type: 'checkbox',
                    checked: true,
                    click: (menuItem: any) => {
                        mainWindow.webContents.send('toggle-debug-mode', menuItem.checked);
                    }
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' }
    ];

    // @ts-ignore
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Register State Updates
    gameService.registerStateCallback((state) => {
        // Send to renderer
        if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send('game-state-update', state);
        }
    });

    // In dev, load valid local URL. In prod, load index.html from dist
    mainWindow.loadURL('http://localhost:5173').catch(() => {
        // If failed, maybe we are in prod builds
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    })
}

// IPC Handlers
ipcMain.handle('game:getState', () => {
    return gameService.getState();
});

ipcMain.handle('game:startGame', () => {
    gameService.startGame();
    return gameService.getState();
});

ipcMain.handle('game:stopGame', () => {
    gameService.stopGame();
    return gameService.getState();
});

// Debug Handlers
ipcMain.handle('game:debugAddXp', (_, amount) => {
    gameService.debugAddXp(amount);
    return gameService.getState();
});

ipcMain.handle('game:debugTriggerEvent', () => {
    gameService.debugTriggerEvent();
    return gameService.getState();
});

app.on('ready', createWindow)

app.on('will-quit', () => {
    gameService.stopGame();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

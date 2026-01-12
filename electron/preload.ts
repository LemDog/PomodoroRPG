import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electronAPI', {
    getState: () => ipcRenderer.invoke('game:getState'),
    startGame: () => ipcRenderer.invoke('game:startGame'),
    stopGame: () => ipcRenderer.invoke('game:stopGame'),
    debugAddXp: (amount: number) => ipcRenderer.invoke('game:debugAddXp', amount),
    debugTriggerEvent: () => ipcRenderer.invoke('game:debugTriggerEvent'),
    allocateStat: (stat: string) => ipcRenderer.invoke('game:allocateStat', stat),
    useItem: (itemId: string) => ipcRenderer.invoke('game:useItem', itemId),
    onStateUpdate: (callback: (event: any, state: any) => void) => {
        ipcRenderer.on('game-state-update', callback);
        return () => ipcRenderer.removeListener('game-state-update', callback);
    },
    onToggleDebugMode: (callback: (event: any, isEnabled: boolean) => void) => {
        ipcRenderer.on('toggle-debug-mode', callback);
        return () => ipcRenderer.removeListener('toggle-debug-mode', callback);
    }
}
);

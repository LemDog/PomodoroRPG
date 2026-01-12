export { };

declare global {
    interface Window {
        electronAPI: {
            getState: () => Promise<any>;
            startGame: () => Promise<any>;
            stopGame: () => Promise<any>;
            debugAddXp: (amount: number) => Promise<any>;
            debugTriggerEvent: () => Promise<any>;
            allocateStat: (stat: string) => Promise<any>;
            useItem: (itemId: string) => Promise<any>;
            onStateUpdate: (callback: (event: any, state: any) => void) => () => void;
            onToggleDebugMode: (callback: (event: any, isEnabled: boolean) => void) => () => void;
        };
    }
}

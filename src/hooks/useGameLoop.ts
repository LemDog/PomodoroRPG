import { useState, useEffect } from 'react';
import { GameState, INITIAL_HERO } from '../types';

export function useGameLoop() {
    const [gameState, setGameState] = useState<GameState>({
        hero: INITIAL_HERO,
        timer: {
            timeLeft: 25 * 60,
            isActive: false,
            mode: 'WORK',
        },
        currentAction: 'Waiting for connection...',
    });

    useEffect(() => {
        if (!window.electronAPI) {
            console.error("electronAPI is not available");
            return;
        }

        // Initial fetch
        window.electronAPI.getState().then((state: GameState) => {
            if (state && state.hero) {
                setGameState(state);
            }
        }).catch(err => console.error("Failed to get initial state:", err));

        // Subscribe to updates
        const removeListener = window.electronAPI.onStateUpdate((_event: any, state: GameState) => {
            if (state && state.hero) {
                setGameState(state);
            }
        });

        return () => {
            removeListener();
        };
    }, []);

    const toggleTimer = async () => {
        if (gameState.timer.isActive) {
            await window.electronAPI.stopGame();
        } else {
            await window.electronAPI.startGame();
        }
    };

    const debugActions = {
        addXp: (amount: number) => window.electronAPI?.debugAddXp(amount),
        triggerEvent: () => window.electronAPI?.debugTriggerEvent(),
    };

    return { gameState, toggleTimer, debugActions };
}

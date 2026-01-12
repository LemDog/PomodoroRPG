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
        // Initial fetch
        window.electronAPI.getState().then((state: GameState) => {
            setGameState(state);
        });

        // Subscribe to updates
        const removeListener = window.electronAPI.onStateUpdate((_event: any, state: GameState) => {
            setGameState(state);
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

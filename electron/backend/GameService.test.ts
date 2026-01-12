import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameService } from './GameService';

describe('GameService', () => {
    let gameService: GameService;

    beforeEach(() => {
        vi.useFakeTimers();
        gameService = new GameService();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with default state', () => {
        const state = gameService.getState();
        expect(state.hero.level).toBe(1);
        expect(state.timer.timeLeft).toBe(25 * 60);
        expect(state.timer.isActive).toBe(false);
    });

    it('should start timer and gain XP on tick', () => {
        gameService.startGame();

        // Fast forward 1 second
        vi.advanceTimersByTime(1000);

        const state = gameService.getState();
        expect(state.timer.timeLeft).toBe((25 * 60) - 1);
        expect(state.hero.currentXp).toBe(1);
        expect(state.timer.isActive).toBe(true);
    });

    it('should level up when reaching required XP', () => {
        gameService.startGame();
        const requiredXp = gameService.getState().hero.requiredXp;

        // Advance enough seconds to level up
        vi.advanceTimersByTime(requiredXp * 1000);

        const state = gameService.getState();
        expect(state.hero.level).toBe(2);
        expect(state.hero.currentXp).toBe(0);
    });

    it('should stop game correctly', () => {
        gameService.startGame();
        vi.advanceTimersByTime(5000);
        gameService.stopGame();

        const state = gameService.getState();
        expect(state.timer.isActive).toBe(false);

        // Ensure timer doesn't continue
        vi.advanceTimersByTime(5000);
        expect(state.timer.timeLeft).toBe((25 * 60) - 5);
    });

    it('should add XP via debug method', () => {
        gameService.debugAddXp(50);
        const state = gameService.getState();
        expect(state.hero.currentXp).toBe(50);
    });

    it('should trigger event via debug method', () => {
        const initialAction = gameService.getState().currentAction;
        gameService.debugTriggerEvent();
        const newAction = gameService.getState().currentAction;
        expect(newAction).not.toBe(initialAction); // Most of the time
    });
});

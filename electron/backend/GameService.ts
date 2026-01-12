import { Logger } from './Logger';
import { GameState, Hero, INITIAL_HERO } from './types';

export class GameService {
    private logger: Logger;
    private state: GameState;
    private intervalId: NodeJS.Timeout | null = null;
    private onStateChange: ((state: GameState) => void) | null = null;

    constructor() {
        this.logger = new Logger('GameService');
        this.state = {
            hero: { ...INITIAL_HERO },
            timer: {
                timeLeft: 25 * 60,
                isActive: false,
                mode: 'WORK',
            },
            currentAction: 'Idle'
        };
        this.logger.info('GameService initialized');
    }

    public registerStateCallback(callback: (state: GameState) => void) {
        this.onStateChange = callback;
    }

    private emitState() {
        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    public getState(): GameState {
        return this.state;
    }

    public startGame() {
        if (this.state.timer.isActive) return;

        this.logger.info('Starting mission');
        this.state.timer.isActive = true;
        this.state.currentAction = 'Starting Mission...';
        this.emitState();

        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    public stopGame() {
        if (!this.state.timer.isActive) return;

        this.logger.info('Stopping mission (Retreat)');
        this.state.timer.isActive = false;
        this.state.currentAction = 'Retreated to Camp';
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.emitState();
    }

    private tick() {
        if (this.state.timer.timeLeft <= 0) {
            this.completeSession();
            return;
        }

        this.state.timer.timeLeft -= 1;

        // RPG Logic: 1 XP per second of work
        this.state.hero.currentXp += 1;
        this.checkLevelUp();

        // Random Events
        if (Math.random() < 0.05) {
            const actions = ['Fighting Bug', 'Optimizing', 'Googling Error', 'Drinking Coffee', 'Refactoring'];
            this.state.currentAction = actions[Math.floor(Math.random() * actions.length)];
        }

        this.emitState();
    }

    private checkLevelUp() {
        if (this.state.hero.currentXp >= this.state.hero.requiredXp) {
            this.state.hero.level += 1;
            this.state.hero.currentXp -= this.state.hero.requiredXp;
            this.state.hero.requiredXp = Math.floor(this.state.hero.requiredXp * 1.5);
            this.logger.info(`Level Up! New Level: ${this.state.hero.level}`);
        }
    }

    private completeSession() {
        this.logger.info('Session Complete');
        this.state.timer.isActive = false;
        this.state.timer.timeLeft = 0;
        this.state.currentAction = 'Mission Complete! Loot found.';

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.emitState();
    }

    // --- Debug / Test Mode Methods ---
    public debugAddXp(amount: number) {
        this.logger.info(`[DEBUG] Adding ${amount} XP`);
        this.state.hero.currentXp += amount;
        this.checkLevelUp();
        this.emitState();
    }

    public debugTriggerEvent() {
        this.logger.info('[DEBUG] Triggering Random Event');
        const actions = ['Fighting Bug', 'Optimizing', 'Googling Error', 'Drinking Coffee', 'Refactoring'];
        this.state.currentAction = actions[Math.floor(Math.random() * actions.length)];
        this.emitState();
    }
}

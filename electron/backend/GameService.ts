import { Logger } from './Logger';
import { GameState, Hero, INITIAL_HERO, Stats, DerivedStats, Item } from './types';

export class GameService {
    private logger: Logger;
    private state: GameState;
    private intervalId: NodeJS.Timeout | null = null;
    private onStateChange: ((state: GameState) => void) | null = null;
    private lootTable: { chance: number; item: Item }[] = [];

    constructor() {
        this.logger = new Logger('GameService');
        this.state = {
            hero: { ...INITIAL_HERO },
            timer: {
                timeLeft: 25 * 60,
                isActive: false,
                mode: 'WORK',
            },
            currentAction: 'Idle',
            log: []
        };
        this.initializeLootTable();
        this.calculateDerivedStats();
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

    private initializeLootTable() {
        this.lootTable = [
            { chance: 0.5, item: { id: 'jellopy', name: 'Jellopy', type: 'ETC', description: 'A small crystallization created by some monster.', quantity: 1, icon: 'jellopy' } },
            { chance: 0.3, item: { id: 'apple', name: 'Apple', type: 'USABLE', description: 'Restores a small amount of HP.', effect: { type: 'HEAL_HP', value: 10 }, quantity: 1, icon: 'apple' } },
            { chance: 0.1, item: { id: 'red_potion', name: 'Red Potion', type: 'USABLE', description: 'Restores HP.', effect: { type: 'HEAL_HP', value: 45 }, quantity: 1, icon: 'red_potion' } },
            { chance: 0.1, item: { id: 'blue_potion', name: 'Blue Potion', type: 'USABLE', description: 'Restores SP.', effect: { type: 'HEAL_SP', value: 20 }, quantity: 1, icon: 'blue_potion' } },
        ];
    }

    private calculateDerivedStats() {
        const stats = this.state.hero.stats;
        const derived = this.state.hero.derived;

        // RO Formulas (Approximate)
        const baseHp = 35 + this.state.hero.level * 5;
        const baseSp = 10 + this.state.hero.level * 1;

        derived.maxHp = Math.floor(baseHp * (1 + stats.vit * 0.01));
        derived.maxSp = Math.floor(baseSp * (1 + stats.int * 0.01));

        derived.atk = stats.str + Math.floor(stats.str / 10) * Math.floor(stats.str / 10) + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5);
        derived.matk = stats.int + Math.floor(stats.int / 7) * Math.floor(stats.int / 7);

        derived.def = stats.vit; // Soft DEF
        derived.mdef = stats.int + Math.floor(stats.vit / 2); // Soft MDEF

        derived.hit = this.state.hero.level + stats.dex;
        derived.flee = this.state.hero.level + stats.agi;
        derived.crit = 1 + stats.luk * 0.3;
        derived.aspd = 150 + Math.floor(Math.sqrt(stats.agi * 9.99 + stats.dex * 0.19)); // Simplified

        // Clamp HP/SP
        if (derived.hp > derived.maxHp) derived.hp = derived.maxHp;
        if (derived.sp > derived.maxSp) derived.sp = derived.maxSp;
    }

    public startGame() {
        if (this.state.timer.isActive) return;

        this.logger.info('Starting mission');
        this.addLog('Mission Started!');
        this.state.timer.isActive = true;
        this.state.currentAction = 'Hunting...';
        this.emitState();

        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    public stopGame() {
        if (!this.state.timer.isActive) return;

        this.logger.info('Stopping mission (Retreat)');
        this.addLog('Retreated from combat!');
        this.distractionPenalty();
        this.state.timer.isActive = false;
        this.state.currentAction = 'Resting';
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.emitState();
    }

    private distractionPenalty() {
        // Penalty for stopping early
        const hpPenalty = Math.floor(this.state.hero.derived.maxHp * 0.1);
        this.state.hero.derived.hp = Math.max(0, this.state.hero.derived.hp - hpPenalty);
        this.addLog(`Distracted! Lost focus and ${hpPenalty} HP.`);
    }

    private tick() {
        if (this.state.timer.timeLeft <= 0) {
            this.completeSession();
            return;
        }

        this.state.timer.timeLeft -= 1;

        // Regen Logic (Simplified RO regen)
        if (this.state.timer.timeLeft % 6 === 0) { // Every 6 seconds
            const hpRegen = Math.max(1, Math.floor(this.state.hero.stats.vit / 5) + Math.floor(this.state.hero.derived.maxHp / 200));
            this.state.hero.derived.hp = Math.min(this.state.hero.derived.maxHp, this.state.hero.derived.hp + hpRegen);

            const spRegen = Math.max(1, Math.floor(this.state.hero.stats.int / 6) + Math.floor(this.state.hero.derived.maxSp / 100));
            this.state.hero.derived.sp = Math.min(this.state.hero.derived.maxSp, this.state.hero.derived.sp + spRegen);
        }

        // XP Gain based on stats (Intelligence gives bonus XP? Strength gives faster kills -> more XP?)
        // Let's say base is 1, STR adds chance for bonus.
        let xpGain = 1;
        if (Math.random() < (this.state.hero.stats.str * 0.01)) {
             xpGain += 1;
        }
        this.state.hero.currentXp += xpGain;
        this.checkLevelUp();

        // Random Events
        if (Math.random() < 0.02) {
            this.triggerRandomEvent();
        }

        this.emitState();
    }

    private triggerRandomEvent() {
        const events = [
             { text: 'Found a bug!', hp: -5 },
             { text: 'Drank a potion.', hp: 10 },
             { text: 'Felt inspired!', sp: 5 },
             { text: 'Confused...', sp: -5 }
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

    private checkLevelUp() {
        if (this.state.hero.currentXp >= this.state.hero.requiredXp) {
            this.state.hero.level += 1;
            this.state.hero.currentXp -= this.state.hero.requiredXp;
            this.state.hero.requiredXp = Math.floor(this.state.hero.requiredXp * 1.5);
            this.state.hero.statPoints += 3; // Standard RO stat points per level (approx)

            // Full heal on level up
            this.calculateDerivedStats();
            this.state.hero.derived.hp = this.state.hero.derived.maxHp;
            this.state.hero.derived.sp = this.state.hero.derived.maxSp;

            this.addLog(`Level Up! You are now level ${this.state.hero.level}. gained 3 stat points.`);
        }
    }

    private completeSession() {
        this.logger.info('Session Complete');
        this.addLog('Mission Complete!');
        this.state.timer.isActive = false;
        this.state.timer.timeLeft = 0;
        this.state.currentAction = 'Mission Complete! Checking for loot...';

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.generateLoot();
        this.emitState();
    }

    private generateLoot() {
        // Luck influences drop rate
        const dropMultiplier = 1 + (this.state.hero.stats.luk * 0.05);

        for (const entry of this.lootTable) {
            if (Math.random() < entry.chance * dropMultiplier) {
                this.addItemToInventory(entry.item);
                this.addLog(`Found ${entry.item.name}!`);
            }
        }
    }

    private addItemToInventory(item: Item) {
        const existingItem = this.state.hero.inventory.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.state.hero.inventory.push({ ...item });
        }
    }

    public allocateStat(stat: keyof Stats) {
        if (this.state.hero.statPoints > 0) {
            // RO stat cost scaling could be implemented here, keeping it simple for now (1 point = 1 stat)
            this.state.hero.stats[stat] += 1;
            this.state.hero.statPoints -= 1;
            this.calculateDerivedStats();
            this.emitState();
            this.addLog(`Increased ${stat.toUpperCase()} to ${this.state.hero.stats[stat]}`);
        }
    }

    public useItem(itemId: string) {
        const itemIndex = this.state.hero.inventory.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            const item = this.state.hero.inventory[itemIndex];

            if (item.type === 'USABLE' && item.effect) {
                if (item.effect.type === 'HEAL_HP') {
                    this.state.hero.derived.hp = Math.min(this.state.hero.derived.maxHp, this.state.hero.derived.hp + item.effect.value);
                    this.addLog(`Used ${item.name}, recovered ${item.effect.value} HP`);
                } else if (item.effect.type === 'HEAL_SP') {
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

    private addLog(message: string) {
        this.state.log.unshift(message);
        if (this.state.log.length > 50) this.state.log.pop();
    }

    // --- Debug / Test Mode Methods ---
    public debugAddXp(amount: number) {
        this.logger.info(`[DEBUG] Adding ${amount} XP`);
        this.state.hero.currentXp += amount;
        this.checkLevelUp();
        this.emitState();
    }

    public debugTriggerEvent() {
        this.triggerRandomEvent();
        this.emitState();
    }
}

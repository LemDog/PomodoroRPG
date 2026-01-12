export interface Stats {
    coding: number; // Attack power
    focus: number;  // Defense / Stability
    energy: number; // HP
}

export interface Equipment {
    head?: string;
    body?: string;
    weapon?: string;
}

export interface Hero {
    name: string;
    level: number;
    currentXp: number;
    requiredXp: number;
    stats: Stats;
    equipment: Equipment;
    inventory: string[];
}

export interface GameState {
    hero: Hero;
    timer: {
        timeLeft: number; // in seconds
        isActive: boolean;
        mode: 'WORK' | 'BREAK';
    };
    currentAction: string; // e.g., "Fighting bug", "Refactoring", "Coffee break"
}

export const INITIAL_HERO: Hero = {
    name: "Little Guy",
    level: 1,
    currentXp: 0,
    requiredXp: 100,
    stats: {
        coding: 5,
        focus: 5,
        energy: 100,
    },
    equipment: {},
    inventory: [],
};

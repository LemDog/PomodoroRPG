export interface Stats {
    str: number;
    agi: number;
    vit: number;
    int: number;
    dex: number;
    luk: number;
}

export interface DerivedStats {
    hp: number;
    maxHp: number;
    sp: number;
    maxSp: number;
    atk: number;
    matk: number;
    def: number;
    mdef: number;
    hit: number;
    flee: number;
    aspd: number;
    crit: number;
}

export interface Item {
    id: string;
    name: string;
    type: 'USABLE' | 'EQUIP' | 'ETC';
    description: string;
    effect?: {
        type: 'HEAL_HP' | 'HEAL_SP' | 'BUFF';
        value: number;
        duration?: number;
    };
    icon?: string;
    quantity: number;
}

export interface Equipment {
    headUpper?: string;
    headMiddle?: string;
    headLower?: string;
    body?: string;
    weapon?: string;
    shield?: string;
    garment?: string;
    shoes?: string;
    accessory1?: string;
    accessory2?: string;
}

export interface Hero {
    name: string;
    job: string; // e.g., "Novice"
    level: number;
    currentXp: number;
    requiredXp: number;
    statPoints: number;
    stats: Stats;
    derived: DerivedStats;
    equipment: Equipment;
    inventory: Item[];
}

export interface GameState {
    hero: Hero;
    timer: {
        timeLeft: number; // in seconds
        isActive: boolean;
        mode: 'WORK' | 'BREAK';
    };
    currentAction: string; // e.g., "Fighting bug", "Refactoring", "Coffee break"
    log: string[]; // Game log messages
}

export const INITIAL_HERO: Hero = {
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

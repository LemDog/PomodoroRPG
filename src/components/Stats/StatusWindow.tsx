import React from 'react';
import { Hero } from '../../types';
import { Window } from '../UI/Window';

interface StatusWindowProps {
    hero: Hero;
    onAllocateStat: (stat: string) => void;
}

export const StatusWindow: React.FC<StatusWindowProps> = ({ hero, onAllocateStat }) => {
    const stats = ['str', 'agi', 'vit', 'int', 'dex', 'luk'] as const;

    return (
        <Window title={`Status - ${hero.name}`} width="300px">
            <div style={{ marginBottom: '10px' }}>
                <div className="ro-stat-row">
                    <strong>Level:</strong> {hero.level}
                    <strong>Job:</strong> {hero.job}
                </div>
                <div className="ro-stat-row">
                    <span>HP:</span>
                    <div className="ro-bar-container" style={{ width: '150px' }}>
                        <div
                            className="ro-bar ro-hp-bar"
                            style={{ width: `${(hero.derived.hp / hero.derived.maxHp) * 100}%` }}
                        ></div>
                        <span style={{ position: 'absolute', top: '-1px', left: '4px', fontSize: '9px', color: 'black' }}>
                            {hero.derived.hp} / {hero.derived.maxHp}
                        </span>
                    </div>
                </div>
                <div className="ro-stat-row">
                    <span>SP:</span>
                    <div className="ro-bar-container" style={{ width: '150px' }}>
                        <div
                            className="ro-bar ro-sp-bar"
                            style={{ width: `${(hero.derived.sp / hero.derived.maxSp) * 100}%` }}
                        ></div>
                        <span style={{ position: 'absolute', top: '-1px', left: '4px', fontSize: '9px', color: 'black' }}>
                            {hero.derived.sp} / {hero.derived.maxSp}
                        </span>
                    </div>
                </div>
                <div className="ro-stat-row">
                   <span>XP:</span>
                   <span>{hero.currentXp} / {hero.requiredXp}</span>
                </div>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '5px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Stats (Pts: {hero.statPoints})</div>
                    {stats.map(stat => (
                        <div key={stat} className="ro-stat-row">
                            <span style={{ textTransform: 'uppercase', width: '30px' }}>{stat}</span>
                            <span style={{ width: '20px', textAlign: 'right' }}>{hero.stats[stat]}</span>
                            {hero.statPoints > 0 && (
                                <button
                                    className="ro-button"
                                    style={{ padding: '0px 2px', marginLeft: '5px' }}
                                    onClick={() => onAllocateStat(stat)}
                                >+</button>
                            )}
                        </div>
                    ))}
                </div>
                <div>
                    <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Derived</div>
                    <div className="ro-stat-row"><span>ATK</span> <span>{hero.derived.atk}</span></div>
                    <div className="ro-stat-row"><span>MATK</span> <span>{hero.derived.matk}</span></div>
                    <div className="ro-stat-row"><span>DEF</span> <span>{hero.derived.def}</span></div>
                    <div className="ro-stat-row"><span>MDEF</span> <span>{hero.derived.mdef}</span></div>
                    <div className="ro-stat-row"><span>HIT</span> <span>{hero.derived.hit}</span></div>
                    <div className="ro-stat-row"><span>FLEE</span> <span>{hero.derived.flee}</span></div>
                    <div className="ro-stat-row"><span>ASPD</span> <span>{hero.derived.aspd}</span></div>
                    <div className="ro-stat-row"><span>CRIT</span> <span>{hero.derived.crit}</span></div>
                </div>
            </div>
        </Window>
    );
};

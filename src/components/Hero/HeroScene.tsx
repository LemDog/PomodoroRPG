import React from 'react';
import './HeroScene.css';
import { Hero } from '../../types';

interface HeroSceneProps {
    hero: Hero;
    action: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ hero, action }) => {
    return (
        <div className="hero-scene card">
            <div className="scene-view">
                {/* Placeholder for character sprite/animation */}
                <div className="hero-avatar">
                    🧙‍♂️
                </div>
                <div className="action-text">
                    {action}
                </div>
            </div>
            <div className="hero-info">
                <h3>{hero.name}</h3>
                <span className="level-badge">Lvl {hero.level}</span>
            </div>
            <div className="xp-container">
                <div className="xp-label">
                    <span>XP</span>
                    <span>{hero.currentXp} / {hero.requiredXp}</span>
                </div>
                <div className="xp-track">
                    <div
                        className="xp-fill"
                        style={{ width: `${(hero.currentXp / hero.requiredXp) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

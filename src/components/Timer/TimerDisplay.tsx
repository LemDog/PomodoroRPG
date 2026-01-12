import React from 'react';
import './TimerDisplay.css';

interface TimerDisplayProps {
    timeLeft: number;
    isActive: boolean;
    onToggle: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, isActive, onToggle }) => {
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-card card">
            <h2 className="timer-time">{formatTime(timeLeft)}</h2>
            <div className="timer-controls">
                <button
                    className={`timer-btn ${isActive ? 'danger' : 'primary'}`}
                    onClick={onToggle}
                >
                    {isActive ? 'RETREAT' : 'START MISSION'}
                </button>
            </div>
            <div className="timer-status">
                {isActive ? 'Mission in Progress' : 'At Camp'}
            </div>
        </div>
    );
};

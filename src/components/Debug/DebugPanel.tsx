import React from 'react';
import './DebugPanel.css';

interface DebugPanelProps {
    onAddXp: (amount: number) => void;
    onTriggerEvent: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ onAddXp, onTriggerEvent }) => {
    return (
        <div className="debug-panel card">
            <h4>🚧 Test Mode</h4>
            <div className="debug-controls">
                <button className="debug-btn" onClick={() => onAddXp(10)}>+10 XP</button>
                <button className="debug-btn" onClick={() => onAddXp(50)}>+50 XP</button>
                <button className="debug-btn" onClick={onTriggerEvent}>Trigger Event</button>
            </div>
        </div>
    );
};

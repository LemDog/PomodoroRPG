import React, { useEffect, useRef } from 'react';
import { Window } from '../UI/Window';

interface GameLogProps {
    logs: string[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <Window title="Chat" width="100%">
            <div className="ro-log-container">
                {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '2px' }}>
                        {log}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </Window>
    );
};

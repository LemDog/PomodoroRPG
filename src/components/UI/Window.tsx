import React from 'react';
import '../../styles/ro-theme.css';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    width?: string;
    onClose?: () => void;
}

export const Window: React.FC<WindowProps> = ({ title, children, width, onClose }) => {
    return (
        <div className="ro-window" style={{ width: width || 'auto' }}>
            <div className="ro-title-bar">
                <span>{title}</span>
                {onClose && (
                    <button className="ro-button" style={{ padding: '0px 4px', fontSize: '10px' }} onClick={onClose}>
                        X
                    </button>
                )}
            </div>
            <div className="ro-content">
                {children}
            </div>
        </div>
    );
};

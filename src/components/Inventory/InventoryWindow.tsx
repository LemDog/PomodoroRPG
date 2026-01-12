import React from 'react';
import { Item } from '../../types';
import { Window } from '../UI/Window';

interface InventoryWindowProps {
    items: Item[];
    onUseItem: (itemId: string) => void;
}

export const InventoryWindow: React.FC<InventoryWindowProps> = ({ items, onUseItem }) => {
    // Fill empty slots for a grid look (e.g., 20 slots)
    const slots = [...items];
    while (slots.length < 20) {
        slots.push({ id: `empty-${slots.length}`, name: '', type: 'ETC', description: '', quantity: 0 });
    }

    return (
        <Window title="Inventory" width="250px">
            <div className="ro-grid">
                {slots.map((item, index) => (
                    <div 
                        key={item.id === `empty-${index}` ? `empty-${index}` : item.id} 
                        className="ro-item-slot"
                        title={item.quantity > 0 ? `${item.name}\n${item.description}\nQty: ${item.quantity}` : ''}
                        onClick={() => item.quantity > 0 && item.type === 'USABLE' && onUseItem(item.id)}
                        style={{ opacity: item.quantity > 0 ? 1 : 0.5, cursor: item.type === 'USABLE' ? 'pointer' : 'default' }}
                    >
                        {item.quantity > 0 && (
                            <>
                                {/* Placeholder icon if no image */}
                                <div style={{ fontSize: '10px' }}>{item.name.substring(0, 2)}</div>
                                <div style={{ position: 'absolute', bottom: '0', right: '1px', fontSize: '9px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                                    {item.quantity}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
                Right-click for details (Not impl), Click usable to use.
            </div>
        </Window>
    );
};

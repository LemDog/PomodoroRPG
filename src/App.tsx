import React from 'react'
import { useGameLoop } from './hooks/useGameLoop'
import { StatusWindow } from './components/Stats/StatusWindow'
import { InventoryWindow } from './components/Inventory/InventoryWindow'
import { GameLog } from './components/Log/GameLog'
import { DebugPanel } from './components/Debug/DebugPanel'
import { Window } from './components/UI/Window'
import './App.css'
import './index.css'
import './styles/ro-theme.css'

function App() {
    const { gameState, toggleTimer, debugActions } = useGameLoop()
    const { hero, timer, currentAction, log } = gameState
    const [showDebug, setShowDebug] = React.useState(true);

    React.useEffect(() => {
        if (window.electronAPI && window.electronAPI.onToggleDebugMode) {
            const removeListener = window.electronAPI.onToggleDebugMode((_event: any, isEnabled: boolean) => {
                setShowDebug(isEnabled);
            });
            return () => removeListener();
        }
    }, []);

    const handleAllocateStat = async (stat: string) => {
        if (window.electronAPI?.allocateStat) {
            await window.electronAPI.allocateStat(stat);
        }
    };

    const handleUseItem = async (itemId: string) => {
        if (window.electronAPI?.useItem) {
            await window.electronAPI.useItem(itemId);
        }
    };

    if (!hero) {
        return <div style={{ padding: '20px' }}>Loading Game Data...</div>;
    }

    return (
        <div className="layout" style={{ backgroundImage: 'none', backgroundColor: '#e0e0e0', padding: '20px', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '20px', height: 'calc(100% - 180px)' }}>
                {/* Left Column: Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <StatusWindow hero={hero} onAllocateStat={handleAllocateStat} />
                    
                    <Window title="Mission Control" width="300px">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                                {Math.floor(timer.timeLeft / 60)}:{(timer.timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                Action: {currentAction}
                            </div>
                            <button className="ro-button" style={{ padding: '5px 20px' }} onClick={toggleTimer}>
                                {timer.isActive ? 'RETREAT (Pause)' : 'START MISSION'}
                            </button>
                        </div>
                    </Window>

                    {showDebug && debugActions && (
                        <Window title="Debug" width="300px">
                            <DebugPanel
                                onAddXp={debugActions.addXp}
                                onTriggerEvent={debugActions.triggerEvent}
                            />
                        </Window>
                    )}
                </div>

                {/* Center: Main View (Hero/Map - Placeholder for now) */}
                <div style={{ flex: 1, border: '2px inset #999', backgroundColor: '#fff', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                         <img src="https://via.placeholder.com/64" alt="Hero" style={{ marginBottom: '10px' }} />
                         <div>{hero.name}</div>
                         <div style={{ fontSize: '12px', color: '#666' }}>{hero.job}</div>
                    </div>
                </div>

                {/* Right Column: Inventory */}
                <div>
                    <InventoryWindow items={hero.inventory} onUseItem={handleUseItem} />
                </div>
            </div>

            {/* Bottom: Chat / Log */}
            <div style={{ height: '160px', marginTop: '20px' }}>
                <GameLog logs={log || []} />
            </div>
        </div>
    )
}

export default App

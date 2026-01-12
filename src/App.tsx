import React from 'react'
import { useGameLoop } from './hooks/useGameLoop'
import { Layout } from './components/Layout/Layout'
import { TimerDisplay } from './components/Timer/TimerDisplay'
import { HeroScene } from './components/Hero/HeroScene'
import { DebugPanel } from './components/Debug/DebugPanel'
import './App.css'
import './index.css'

function App() {
    const { gameState, toggleTimer, debugActions } = useGameLoop()
    const { hero, timer, currentAction } = gameState
    const [showDebug, setShowDebug] = React.useState(true);

    React.useEffect(() => {
        if (window.electronAPI && window.electronAPI.onToggleDebugMode) {
            const removeListener = window.electronAPI.onToggleDebugMode((_event: any, isEnabled: boolean) => {
                setShowDebug(isEnabled);
            });
            return () => removeListener();
        }
    }, []);

    return (
        <Layout>
            {/* Left Column: Stats & Debug */}
            <div className="left-panel">
                <div className="card stats-panel">
                    <h3>Stats</h3>
                    <p>STR: {hero.stats.coding}</p>
                    <p>FOC: {hero.stats.focus}</p>
                    <p>NRG: {hero.stats.energy}</p>
                </div>

                {/* Only show debug panel if we have access to debug actions AND it is enabled */}
                {showDebug && debugActions && (
                    <DebugPanel
                        onAddXp={debugActions.addXp}
                        onTriggerEvent={debugActions.triggerEvent}
                    />
                )}
            </div>

            {/* Center Column: Hero Scene */}
            <HeroScene hero={hero} action={currentAction} />

            {/* Right Column: Timer */}
            <TimerDisplay
                timeLeft={timer.timeLeft}
                isActive={timer.isActive}
                onToggle={toggleTimer}
            />
        </Layout>
    )
}

export default App

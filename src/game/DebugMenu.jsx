import { useState, useEffect } from "react"
import {
  gameTimeState,
  featuresState,
  pauseState,
  gameSizeState,
  gameOffsetState,
  idCounterState,
  scoreState,
  levelState,
  isGameOverState,
  gameOverTimeState,
  preGameState,
  mouseControllerState,
  keysControllerState,
  centerState,
  locationState,
} from "./state";
import './debugMenu.css'
const DebugMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const gameTime = gameTimeState.useValue()
  const features = featuresState.useValue()
  const pause = pauseState.useValue()
  const gameSize = gameSizeState.useValue()
  const gameOffset = gameOffsetState.useValue()
  const idCounter = idCounterState.useValue()
  const score = scoreState.useValue()
  const level = levelState.useValue()
  const isGameOver = isGameOverState.useValue()
  const gameOverTime = gameOverTimeState.useValue()
  const preGame = preGameState.useValue()
  const mouseController = mouseControllerState.useValue()
  const keysController = keysControllerState.useValue()
  const center = centerState.useValue()
  const location = locationState.useValue()

  const handleTildePress = (event) => {
    if (event.key === '`') {
      setIsOpen((isOpen) => !isOpen)
    }
  };

  useEffect(() => {
    window.document.addEventListener('keydown', handleTildePress);

    return () => {
      window.document.removeEventListener('keydown', handleTildePress);
    };
  }, []);


  return isOpen && (
    <div id="debugMenu">
      <h2>Debug Menu</h2>
      <p>GameSize: {JSON.stringify(gameSize)}</p>
      <p>GameOffset: {JSON.stringify(gameOffset)}</p>
      <p>Time: {gameTime}</p>
      <p>ID Counter: {idCounter}</p>
      <p>Center: {JSON.stringify(location)}</p>
      <p>Location: {JSON.stringify(location)}</p>
      <p>Pause: {JSON.stringify(pause)}</p>
      <p>Score: {JSON.stringify(score)}</p>
      <p>Level: {JSON.stringify(level)}</p>
      <p>isGameOver: {JSON.stringify(isGameOver)}</p>
      <p>gameOverTime: {JSON.stringify(gameOverTime)}</p>
      <p>preGame: {JSON.stringify(preGame)}</p>
      <p>mouseController: {JSON.stringify(mouseController)}</p>
      <p>keysController: {JSON.stringify(keysController)}</p>
      <h3>
        Features:
      </h3>
      <ul>
        {Object.entries(features).map(([key, value]) => <li key={key}>{key}: {value ? "on" : "off"}</li>)}
      </ul>
    </div>
  )
}

export default DebugMenu

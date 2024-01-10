import { newRidgeState } from "react-ridge-state"

export const canvasState = newRidgeState()

export const canvasContextState = newRidgeState()

export const gameSizeState = newRidgeState()

export const gameOffsetState = newRidgeState()

export const featuresState = newRidgeState({
  hyperTrails: 0,
  zoomOut: 1,
  drawCenterRetical: 0,
  drawGameGrid: 1,
  drawEntityVelocityVector: 1,
  handleSpawnEnemies: 1,
  handleEnemyOutOfBounds: 1,
  createExplosion: 1,
  keysControl: 1,
  mouseControl: 1,
  noDamage: 1,
})

export const gameTimeState = newRidgeState(0)

export const idCounterState = newRidgeState(0)

export const pauseState = newRidgeState(false)

export const scoreState = newRidgeState()

export const levelState = newRidgeState(3)

export const isGameOverState = newRidgeState(true)

export const gameOverTimeState = newRidgeState()

export const preGameState = newRidgeState(true)

export const mouseControllerState = newRidgeState()

export const keysControllerState = newRidgeState()

export const gamepadControllerState = newRidgeState()

export const playerState = newRidgeState()

export const centerState = newRidgeState()

export const locationState = newRidgeState()
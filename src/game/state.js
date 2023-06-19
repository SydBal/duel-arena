import { newRidgeState } from 'react-ridge-state'

export const canvasState = newRidgeState()

export const canvasContextState = newRidgeState()

export const featuresState = newRidgeState({
  hyperTrails: 0,
  zoomOut: 1,
  drawCenterRetical: 0,
  drawGameGrid: 0,
  drawEntityVelocityVector: 0,
  handleSpawnEnemies: 1,
  handleEnemyOutOfBounds: 1,
  createExplosion: 1,
  keysControl: 1,
  mouseControl: 1,
})
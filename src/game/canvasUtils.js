import { canvasState, featuresState } from "../cartProductsState";

const canvas = canvasState.get()
const features = featuresState.get()

export const calculateGameSize = () =>
  features.zoomOut
    ? Math.min(canvas.width, canvas.height)
    : Math.max(canvas.width, canvas.height)

export const calculateGameOffset = () => {
  let gameSize
  if (
    features.zoomOut
      ? canvas.width < canvas.height
      : canvas.width > canvas.height
  ) {
    gameSize = calculateGameSize(canvas, features)
    return {
      x: 0,
      y: (gameSize - canvas.height) / 2
    }
  }
  if (
    features.zoomOut
      ? canvas.width > canvas.height
      : canvas.width < canvas.height
  ) {
        gameSize = calculateGameSize()
    return {
      x: (gameSize - canvas.width) / 2,
      y: 0
    }
  }
  return {x: 0, y: 0}
}
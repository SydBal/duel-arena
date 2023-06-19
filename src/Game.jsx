import { useRef, useState, useEffect } from "react"

const Game = () => {
  const GAME_CANVAS_ID = 'GameCanvas'

  const canvas = useRef();
  const [canvasContext, setCanvasContext] = useState();
  const [gameSize, setGameSize] = useState();
  const [gameOffset, setGameOffset] = useState();


  const features = {
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
  }

  // init
  useEffect(() => {
    setCanvas(document.getElementById(gameCanvasId))
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    setCanvasContext(canvas.getContext('2d'))
    setGameSize(getGameSize())
    setGameOffset(getGameOffset())
    playGame()
  }, [])

  return (
    <canvas ref={canvas} id={GAME_CANVAS_ID} />
  )
}

export default Game

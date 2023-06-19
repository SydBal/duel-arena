import { useRef, useState, useEffect } from "react"
import { calculateGameSize, calculateGameOffset } from './canvasUtils'

const Game = () => {
  const GAME_CANVAS_ID = 'GameCanvas'

  const canvas = useRef();
  const [canvasContext, setCanvasContext] = useState();
  const [gameSize, setGameSize] = useState();
  const [gameOffset, setGameOffset] = useState();
  const [player, setPlayer] = useState();
  const [mouseController, setMouseController] = useState();
  const [gameTime, setGameTime] = useState();
  const [paused, setPaused] = useState();
  const [isGameOver, setIsGameOver] = useState();
  const [gameOverTime, setGameOverTime] = useState();


  const [features, setFeatures] = {
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
    const canvas = canvas.current
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    setCanvasContext(canvas.getContext('2d'))
    setGameSize(calculateGameSize())
    setGameOffset(calculateGameOffset())
    playGame()
  }, [])

  const playGame = () => {
    handleGamePad()
    if (!isGameOver && checkIsGameOver()) {
      gameOver()
    }
    if (features.hyperTrails) {
      canvasContext.fillStyle = 'rgba(0,0,0,0.1)';
      canvasContext.fillRect(0,0,canvas.width,canvas.height);
    } else {
      canvasContext.clearRect(0,0, canvas.width, canvas.height)
    }
    if (!paused) {
      update()
    }
    draw()
    requestAnimationFrame(playGame)
  }

  const newGame = () => {
    setPlayer = new PlayerBall()
    mouseController = false
    shields = [ new Shield() ]
    enemies = []
    explosions = []
    preGame = false
    isGameOver = false
    score = 0
    gameTime = 0
    level = 1
  }

  const gameOver = () => {
    setIsGameOver(true)
    setGameOverTime(gameTime)
    setPlayer(player => ({...player, controller: false}))
    setMouseController(false)
    setPaused(false)
  }

  const checkIsGameOver = () => player.health <= 0

  window.addEventListener('resize', () => {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    setGameSize(calculateGameSize())
    setGameOffset(calculateGameOffset())
    update()
    draw()
  })

  const draw = () => {
    drawBackground()
    ;([
      player,
      ...enemies,
      ...shields,
      ...explosions,
      ...menus,
    ]).forEach(entity => entity && entity.draw && entity.draw())
  }

  const drawBackground = () => {
    if (features.hyperTrails) return
    canvasContext.save()
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore()
  }

  return (
    <canvas ref={canvas} id={GAME_CANVAS_ID} />
  )
}

export default Game

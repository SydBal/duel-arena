import { useEffect } from "react"
import game from "./main"

const Game = (props) => {
  const {
    gameCanvasId = "gameCanvas"
  } = props

  useEffect(() => {
    game.init({
      gameCanvasId
    })
  }, [])

  return <canvas id={gameCanvasId}/>
}

export default Game

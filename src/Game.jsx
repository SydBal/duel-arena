import { useEffect } from "react"
import game from "./game/main"
import {
  gameTimeState
} from "./game/state";
const Game = (props) => {
  const {
    gameCanvasId = "gameCanvas"
  } = props

  const gameTime = gameTimeState.useValue()

  useEffect(() => {
    game.init({
      gameCanvasId
    })
  }, [])

  return (
    <>
      <canvas id={gameCanvasId}/>
      <div>
        <p>Time: {gameTime}</p>
      </div>
    </>
  )
}

export default Game

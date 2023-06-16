import { useEffect } from "react"
import game from "./game/main"
const App = (props) => {
  const {
    gameCanvasId = "gameCanvas"
  } = props

  useEffect(() => {
    game.init({
      gameCanvasId
    })
  }, [])

  return (
    <canvas id={gameCanvasId}/>
  )
}

export default App

import {
  canvasState,
  canvasContextState,
  gameTimeState,
  idCounterState,
  featuresState,
  pauseState,
  gameSizeState,
  gameOffsetState,
  scoreState,
  levelState,
  isGameOverState,
  gameOverTimeState,
  preGameState,
  mouseControllerState,
  keysControllerState,
  gamepadControllerState,
  playerState,
  centerState,
  locationState,
} from "./state";

const features = featuresState.get()

const drawBackground = () => {
  if (features.hyperTrails) return
  const canvas = canvasState.get()
  const canvasContext = canvasContextState.get()
  canvasContext.save()
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.restore()
  drawGameGrid()
}

const calculateGameSize = () => {
  const canvas = canvasState.get()
  return features.zoomOut
    ? Math.min(canvas.width, canvas.height)
    : Math.max(canvas.width, canvas.height)
}

const calculateGameOffset = () => {
  const canvas = canvasState.get()
  const gameSize = gameSizeState.get()
  if (
    features.zoomOut
      ? canvas.width < canvas.height
      : canvas.width > canvas.height
  ) {
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
    return {
      x: (gameSize - canvas.width) / 2,
      y: 0
    }
  }
  return {x: 0, y: 0}
}

const drawCenterRetical = () => {
  if (!features.drawCenterRetical) return
  const canvas = canvasState.get()
  const canvasContext = canvasContextState.get()
  canvasContext.save()
  canvasContext.strokeStyle = 'red'
  canvasContext.lineWidth = 3
  canvasContext.beginPath()
  canvasContext.moveTo(canvas.width / 2 - 10, canvas.heigh / 2)
  canvasContext.lineTo(canvas.width/ 2 + 10, canvas.height / 2)
  canvasContext.stroke()
  canvasContext.moveTo(canvas.width / 2, canvas.height / 2 - 10)
  canvasContext.lineTo(canvas.width / 2, canvas.height / 2 + 10)
  canvasContext.stroke()
  canvasContext.restore()
}

const drawGameGrid = () => {
  if (!features.drawGameGrid) return
  const canvasContext = canvasContextState.get()
  const gameSize = gameSizeState.get()
  const gameOffset =  gameOffsetState.get()
  const location = locationState.get()
  const center = centerState.get()
  const player = playerState.get()
  canvasContext.save()
  canvasContext.lineWidth = 1
  // Color change based on distance from center
  canvasContext.strokeStyle = `hsl(${
    // Hue (color)
    // North -> Red (fire)
    // South -> Blue (water)
    // East -> Purple (air)
    // West -> Green (earth)
    radiansToDegrees(getAngleBetweenPoints(player, center)) - 90
  } ${
    // Saturation (grey to color)
    // Grey in center, full color after 5 screen lengths
    (Math.abs(location.x) + Math.abs(location.y)) * 20
  }% ${
    // Lightness (black to color to white)
    50
  }%)` 
  canvasContext.beginPath()

  // Overflow grid, 9x9 total, offset by current location to create infinite grid
  for(let column = -1 + Math.floor(location.x + .5); column <= 1 + Math.floor(location.x + .5); column++) {
    for(let row = -1 + Math.floor(-location.y + .5); row <= 1 + Math.floor(-location.y + .5); row++) {

      // vertical grid lines
      for (let x = 0; x <= 10; x++) {
        canvasContext.moveTo(
          gameSize * x * 0.1 - gameOffset.x + (column * gameSize) - (location.x * gameSize),
          0 - gameOffset.y + (row * gameSize) + (location.y * gameSize)
        )
        canvasContext.lineTo(
          gameSize * x * 0.1 - gameOffset.x + (column * gameSize) - (location.x * gameSize),
          gameSize - gameOffset.y + (row * gameSize) + (location.y * gameSize)
        )
        canvasContext.stroke()
      }
      // horizontal grid lines
      for (let y = 0; y <= 10; y++) {
        canvasContext.moveTo(
          0 - gameOffset.x + (column * gameSize) - (location.x * gameSize),
          gameSize * y * 0.1 - gameOffset.y + (row * gameSize) + (location.y * gameSize)
        )
        canvasContext.lineTo(
          gameSize - gameOffset.x + (column * gameSize) - (location.x * gameSize),
          gameSize * y * 0.1 - gameOffset.y + (row * gameSize) + (location.y * gameSize)
        )
        canvasContext.stroke()
      }
    }
  }

  canvasContext.restore()
}

const getScaledFont = (scalar = 1) => `${gameSizeState.get() * .02 * scalar}px sans-serif`

const getScaledFontPixelValue = (scalar = 1) => gameSizeState.get() * .02 * scalar

const incrementScore = () => !isGameOverState.get() && scoreState.set(scoreState.get() + 1)

const incrementTime = () => gameTimeState.set(gameTimeState.get() + 1)

class Menu {
  getSpacer = () => getScaledFontPixelValue(2)
  
  drawBackground() {
    const canvasContext = canvasContextState.get()
    const gameSize = gameSizeState.get()
    const gameOffset =  gameOffsetState.get()
    canvasContext.save()
    canvasContext.fillStyle = 'black'
    canvasContext.globalAlpha = .3
    canvasContext.beginPath()
    canvasContext.arc(
      .5 * gameSize - gameOffset.x,
      .5 * gameSize - gameOffset.y,
      .15 *  gameSize,
      0,
      Math.PI * 2)
    canvasContext.fill()
    canvasContext.arc(
      .5 * gameSize - gameOffset.x,
      .5 * gameSize - gameOffset.y,
      .3 *  gameSize,
      0,
      Math.PI * 2)
    canvasContext.fill()
    canvasContext.arc(
      .5 * gameSize - gameOffset.x,
      .5 * gameSize - gameOffset.y,
      .45 *  gameSize,
      0,
      Math.PI * 2)
    canvasContext.fill()
    canvasContext.restore()
  }
}

class StartMenu extends Menu {
  update() {
    if (!preGameState.get()) return
    const mouseController = mouseControllerState.get()
    if (
      mouseController
      && mouseController.clicking
      && .4 < mouseController.x
      && mouseController.x < .6
      && .4 < mouseController.y
      && mouseController.y < .6
    ) newGame()
  }
  draw() {
    if (!preGameState.get()) return
    this.drawBackground()
    const spacer = this.getSpacer()
    const canvas = canvasState.get()
    const canvasContext = canvasContextState.get()
    canvasContext.save()
    canvasContext.font = getScaledFont(2);
    canvasContext.fillStyle = 'white';
    canvasContext.textAlign = 'center'
    canvasContext.textBaseline = 'ideographic'
    canvasContext.fillText(`Survivor Prototype`, canvas.width / 2, canvas.height / 2);
    canvasContext.font = getScaledFont(1.5);
    canvasContext.fillText(`Tap Enter to Start`, canvas.width / 2, canvas.height / 2 + spacer); 
    canvasContext.font = getScaledFont(1);
    canvasContext.fillText(`Controls: Arrow Keys, WASD,`, canvas.width / 2, canvas.height / 2 + (spacer * 2.2));
    canvasContext.fillText(`Tap, or Click and Drag`, canvas.width / 2, canvas.height / 2 + (spacer * 3));
    canvasContext.restore()
  }
}

class InGameMenu extends Menu {
  draw() {
    if (isGameOverState.get()) return
    const spacer = this.getSpacer()
    const padding = spacer / 2
    const canvasContext = canvasContextState.get()
    const score = scoreState.get()
    const level = levelState.get()
    canvasContext.save()
    canvasContext.font = getScaledFont();
    canvasContext.fillStyle = 'white';
    canvasContext.textAlign = 'start'
    canvasContext.textBaseline = 'hanging'
    canvasContext.fillText(`Level ${level}`, padding, padding);
    canvasContext.fillText(`Score: ${score}`, padding, padding + spacer);
    canvasContext.fillText(`Time: ${gameTimeState.get()}`, padding, padding + spacer * 2);
    canvasContext.restore()
  }
}

class EndGameMenu extends Menu {
  update() {
    if (!isGameOverState.get() || preGameState.get()) return
    const mouseController = mouseControllerState.get()
    if (
      mouseController
      && mouseController.clicking
      && .4 < mouseController.x
      && mouseController.x < .6
      && .4 < mouseController.y
      && mouseController.y < .6
    ) newGame()
  }
  draw() {
    if (!isGameOverState.get() || preGameState.get()) return
    this.drawBackground()
    const spacer = this.getSpacer()
    const canvas = canvasState.get()
    const canvasContext = canvasContextState.get()
    const score = scoreState.get()
    const gameOverTime = gameOverTimeState.get()
    canvasContext.save()
    canvasContext.font = getScaledFont(2);
    canvasContext.fillStyle = 'white';
    canvasContext.textAlign = 'center'
    canvasContext.textBaseline = 'ideographic'
    canvasContext.fillText(`Game Over`, canvas.width / 2, canvas.height / 2 - spacer * 2);
    canvasContext.font = getScaledFont(1.5);
    canvasContext.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - spacer); 
    canvasContext.font = getScaledFont(1.5);
    canvasContext.fillText(`Time: ${gameOverTime}`, canvas.width / 2, canvas.height / 2); 
    canvasContext.font = getScaledFont(1.5);
    canvasContext.fillText(`Tap Enter to Restart`, canvas.width / 2, canvas.height / 2 + spacer); 
    canvasContext.font = getScaledFont(1);
    canvasContext.fillText(`Controls: Arrow Keys, WASD,`, canvas.width / 2, canvas.height / 2 + spacer * 2.2);
    canvasContext.fillText(`Tap, or Click and Drag`, canvas.width / 2, canvas.height / 2 + spacer * 3);
    canvasContext.restore()
  }
}

class PauseMenu extends Menu {
  draw() {
    if (!pauseState.get()) return
    this.drawBackground()
    const canvas = canvasState.get()
    const canvasContext = canvasContextState.get()
    canvasContext.fillStyle = 'white';
    canvasContext.font = getScaledFont(1.5);
    canvasContext.textAlign = 'center'
    canvasContext.textBaseline = 'middle'
    canvasContext.fillText(`Paused`, canvas.width / 2, canvas.height / 2);
  }
}

const randomIntRange = (min = 1, max = 100) =>  Math.floor(Math.random() * (max + 1 - min) + min)

const getPythagorean = (a, b) => Math.sqrt(a * a + b * b)

const getAngleBetweenPoints = (
  {x: x1, y: y1},
  {x: x2, y: y2}
) => Math.atan2((y2 - y1), (x2 - x1))

const radiansToDegrees = rad => (rad * 180.0) / Math.PI;

const findOwnIndexInArray = (entity, array) => array.findIndex((element) => element.id === entity.id)

const removeSelfFromArray = (entity, array) => {
  const selfIndex = findOwnIndexInArray(entity, array)
  if (selfIndex >= 0) {
    array.splice(selfIndex, 1)
  }
}

class Entity {
  constructor(props = {}) {
    const idCounter = idCounterState.get()
    this.id = idCounter
    idCounterState.set(idCounter + 1)
    this.createdDate = new Date()
    this.x = props.x !== undefined ? props.x : .5
    this.y = props.y !== undefined ? props.y : .5
    this.speedX = props.speedX || 0
    this.speedY = props.speedY || 0
    this.text = props.text
    this.textColor = props.textColor || 'black'
    this.textScale = props.textScale || 1
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
  }

  draw() {
    const {x, y, speedX, speedY, text, textColor, textScale} = this
    const canvasContext = canvasContextState.get()
    const gameSize = gameSizeState.get()
    const gameOffset =  gameOffsetState.get()
    if (text) {
      canvasContext.save()
      canvasContext.fillStyle = textColor;
      canvasContext.font = getScaledFont(textScale)
      canvasContext.textAlign = 'center'
      canvasContext.textBaseline = 'middle'
      canvasContext.fillText(
        text,
        x * gameSize - gameOffset.x,
        y * gameSize - gameOffset.y
      )
      canvasContext.restore()
    }
    if (features.drawEntityVelocityVector) {
      canvasContext.save()
      canvasContext.beginPath()
      canvasContext.moveTo(
        x * gameSize - gameOffset.x,
        y * gameSize - gameOffset.y
      )
      canvasContext.lineTo(
        ((x + (speedX * 10)) * gameSize - gameOffset.x),
        ((y + (speedY * 10)) * gameSize - gameOffset.y)
      )
      canvasContext.strokeStyle = 'red'
      canvasContext.stroke()
      canvasContext.closePath();
      canvasContext.restore()
    }
  }

  getVelocityMagnitude() {
    return getPythagorean(this.speedX, this.speedY)
  }

  getVelocityAngle() {
    return getAngleBetweenPoints(
      { x: 0, y: 0 },
      { x: this.speedX, y: this.speedY }
    )
  }
}

class Ball extends Entity {
  constructor(props = {}) {
    super(props)
    this.size = props.size || 0.03
    this.color = props.color || 'white'
    this.opacity = props.opacity || 1
    this.textColor = 'black'
  }

  draw() {
    const {color, x, y, size, opacity} = this
    const canvasContext = canvasContextState.get()
    const gameSize = gameSizeState.get()
    const gameOffset =  gameOffsetState.get()
    canvasContext.save()
    canvasContext.fillStyle = color
    canvasContext.globalAlpha = opacity
    canvasContext.beginPath()
    canvasContext.arc(
      x * gameSize - gameOffset.x,
      y * gameSize - gameOffset.y,
      size *  gameSize,
      0,
      Math.PI * 2)
    canvasContext.fill()
    canvasContext.restore()
    super.draw()
  }
}

class PlayerBall extends Ball {
  constructor(props = {}) {
    super(props)
    this.health = props.health || 10
    this.text = this.health
    this.color = `hsl(${12 * this.health} 100% 50%)`
    this.speed = 0.005
  }
  update() {
    this.text = this.health
    if (isGameOverState.get()) {
      this.size = 0
      this.color = 'black'
      this.text = undefined
    } else {
      this.color = `hsl(${12 * this.health} 100% 50%)`
      // this.textColor = this.textColor
    }
  }
}

class KeysController {}

document.addEventListener('keydown', (event) => {
  if (!features.keysControl) return
  let keysController = keysControllerState.get()
  if (!keysController) {
    keysControllerState.set(new KeysController())
    keysController = keysControllerState.get()
  }
  const isGameOver = isGameOverState.get()
  const player = playerState.get()
  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (isGameOver) break;
      player.controller = keysController
      keysController.up = true
      break
    case "ArrowDown":
    case "s":
      if (isGameOver) break;
      player.controller = keysController
      keysController.down = true
      break
    case "ArrowRight":
    case "d":
      if (isGameOver) break;
      player.controller = keysController
      keysController.right = true
      break
    case "ArrowLeft":
    case "a":
      if (isGameOver) break;
      player.controller = keysController
      keysController.left = true
      break
    case "Escape":
      if (isGameOver) break;
      togglePause()
      break
    case "Enter":
      if (isGameOver) newGame()
      break
  }
})

document.addEventListener('keyup', (event) => {
  const isGameOver = isGameOverState.get()
  if (!features.keysControl) return
  let keysController = keysControllerState.get()
  if (!keysController) {
    keysControllerState.set(new KeysController())
    keysController = keysControllerState.get()
  }
  const player = playerState.get()
  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (isGameOver) break;
      player.controller = keysController
      keysController.up = false
      break;
    case "ArrowDown":
    case "s":
      if (isGameOver) break;
      player.controller = keysController
      keysController.down = false
      break;
    case "ArrowRight":
    case "d":
      if (isGameOver) break;
      player.controller = keysController
      keysController.right = false
      break;
    case "ArrowLeft":
    case "a":
      if (isGameOver) break;
      player.controller = keysController
      keysController.left = false
      break;
  }
})

class MouseController {
  constructor() {
    this.clicking = false
  }
}

document.addEventListener('mousedown', (event) => {
  if (!features.mouseControl) return
  let mouseController = mouseControllerState.get()
  if (!mouseController) {
    mouseController = new MouseController()
    mouseControllerState.set(mouseController)
  }
  if (!isGameOverState.get()) playerState.get().controller = mouseController
  mouseController.clicking = true
  const canvas = canvasState.get()
  mouseController.x = event.pageX / canvas.width
  mouseController.y = event.pageY / canvas.height
});

document.addEventListener('mouseup', (event) => {
  if (!features.mouseControl) return
  let mouseController = mouseControllerState.get()
  if (!mouseController) {
    mouseController = new MouseController()
    mouseControllerState.set(mouseController)
  }
  if (!isGameOverState.get()) playerState.get().controller = mouseController
  mouseController.clicking = false
  const canvas = canvasState.get()
  mouseController.x = event.pageX / canvas.width
  mouseController.y = event.pageY / canvas.height
});

document.addEventListener('mousemove', (event) => {
  if (!features.mouseControl) return
  let mouseController = mouseControllerState.get()
  if (!mouseController) {
    mouseController = new MouseController()
    mouseControllerState.set(mouseController)
  }
  if (!isGameOverState.get() && mouseController.clicking) playerState.get().controller = mouseController
  if (mouseController.clicking) {
    const canvas = canvasState.get()
    mouseController.x = event.pageX / canvas.width,
    mouseController.y = event.pageY / canvas.height
  }
});

class GamepadController {}

window.addEventListener("gamepadconnected", (e) => {
  const connectedGamepad = navigator.getGamepads()[e.gamepad.index]
  console.log("Gamepad connected.", connectedGamepad);
  gamepadControllerState.set(new GamepadController())
  const gamepadController = gamepadControllerState.get()
  gamepadController.index = e.gamepad.index
  gamepadController.axes = connectedGamepad.axes
  gamepadController.buttons = connectedGamepad.buttons
});

window.addEventListener("gamepaddisconnected", (e) => {
  console.log("Gamepad disconnected.", e);
  if (e.gamepad.index === gamepadControllerState.get().index) gamepadControllerState.set(undefined)
});

const handleGamePad = () => {
  const gamepadController = gamepadControllerState.get()
  if (gamepadController) {
    const currentGamepad = navigator.getGamepads()[0]
    if (
      gamepadController.axes[0] == currentGamepad.axes[0]
      && gamepadController.axes[1] == currentGamepad.axes[1]
    ) return
    gamepadController.axes = currentGamepad.axes
    gamepadController.buttons = currentGamepad.buttons
    if (!isGameOverState.get()) {
      if (
        gamepadController.axes[0] > 0.25
        || gamepadController.axes[0] < -0.25
        || gamepadController.axes[1] > 0.25
        || gamepadController.axes[1] < -0.25
      ) {
        gamepadController.x = gamepadController.axes[0]
        gamepadController.y = gamepadController.axes[1]
      } else {
        gamepadController.x = 0
        gamepadController.y = 0
      }
      playerState.get().controller = gamepadController
    }
  }
}


const getClosestEnemy = () => {
  const player = playerState.get()
  return enemies.length && enemies.reduce((enemyA, enemyB) => {
    enemyA.distanceToPlayer = enemyA.distanceToPlayer || getDistanceBetweenEntityCenters(player, enemyA)
    enemyB.distanceToPlayer = getDistanceBetweenEntityCenters(player, enemyB)
    return enemyA.distanceToPlayer < enemyB.distanceToPlayer
      ? enemyA
      : enemyB
  })
}

class AIPlayerBall extends PlayerBall {
  constructor(props = {}){
    super(props)
    this.controller = new MouseController()
    this.controller.x = .5
    this.controller.y = .5
  }
  update() {
    super.update()
    if (!(enemies && enemies.length)) return
    if (!(gameTimeState.get() % 10 == 0)) return
    const closestEnemy = getClosestEnemy()
    if (!closestEnemy) return;
    const angleAwayFromEnemy = getAngleBetweenPoints(playerState.get(), closestEnemy) + Math.PI;
    this.controller.clicked = true,
    this.controller.x = Math.cos(angleAwayFromEnemy)
    this.controller.y = Math.sin(angleAwayFromEnemy)
  }
}

const moveBasedOnKeyBoard = (entity) => {
  const player = playerState.get()
  if (
    player.controller instanceof KeysController
  ) {
    const keysController = keysControllerState.get()
    entity.x += (keysController.right ? -player.speed : 0) + (keysController.left ? player.speed : 0)
    entity.y += (keysController.down ? -player.speed : 0) + (keysController.up ? player.speed : 0)
  }
}

const moveBasedOnMouse = (entity) => {
  const player = playerState.get()
  if (
    player.controller instanceof MouseController
  ) {
    const distanceToPlayer = getDistanceBetweenEntityCenters(player.controller, player)
    if (distanceToPlayer <= player.size) return
    const angleToMouse = getAngleBetweenPoints(player, player.controller)
    entity.x -= player.speed * Math.cos(angleToMouse)
    entity.y -= player.speed * Math.sin(angleToMouse)
  }
}

const moveBasedOnGamepad = (entity) => {
  const player = playerState.get()
  if (
    player.controller instanceof GamepadController
  ) {
    if (player.controller.x === 0 && player.controller.y === 0) {
      return
    }
    const relativeX = player.controller.x + player.x
    const relativeY = player.controller.y + player.y
    const angleToGamepad = getAngleBetweenPoints(player, {x:relativeX, y:relativeY})
    entity.x -= player.speed * Math.cos(angleToGamepad)
    entity.y -= player.speed * Math.sin(angleToGamepad)
  }
}

class MovableEntity extends Entity {
  update() {
    super.update()
    moveBasedOnKeyBoard(this)
    moveBasedOnMouse(this)
    moveBasedOnGamepad(this) 
  }
}

class MovableBall extends Ball {
  update() {
    super.update()
    moveBasedOnKeyBoard(this)
    moveBasedOnMouse(this)
    moveBasedOnGamepad(this) 
  }
}

const setSpeedTowardsTarget = (ball1, ball2, speed) => {
  const angleToTarget = getAngleBetweenPoints(ball1, ball2)
  ball1.speedX = speed * Math.cos(angleToTarget)
  ball1.speedY = speed * Math.sin(angleToTarget)
}

const handleEnemyOutOfBounds = (enemy) => {
  if (!features.handleEnemyOutOfBounds) return
  if (enemy.x > 1.2 || enemy.x < -.2 || enemy.y > 1.2 || enemy.y < -.2) {
    removeSelfFromArray(enemy, enemies)
  }
}

const handleEnemyCollisions = (enemy) => {
  const collisionWithPlayer = getBallCollisionDetected(enemy, playerState.get())
  const collisionWithShield = shields.some(shield => getBallCollisionDetected(enemy, shield))
  if (collisionWithPlayer || collisionWithShield) {
    removeSelfFromArray(enemy, enemies)
    if (collisionWithPlayer) {
      createExplosion({x:collisionWithPlayer.x , y:collisionWithPlayer.y, size: enemy.size})
      if(!features.noDamage) {
        playerState.get().health -= 1
      }
    }
    if (collisionWithShield) {
      createExplosion({x:enemy.x , y:enemy.y, size: enemy.size,color: enemy.color})
      incrementScore()
    }
  }
}

const setRandomLocationOnEdge = (entity) => {
  const random = Math.random()
  if (random < .25) {
    entity.x = 0 - entity.size
    entity.y = Math.random()
  } else if(random < .5) {
    entity.x = 1 + entity.size
    entity.y = Math.random()
  } else if(random < .75) {
    entity.x = Math.random()
    entity.y = 0 - entity.size
  } else {
    entity.x = Math.random()
    entity.y = 1 + entity.size
  }
}

class EnemyBall extends MovableBall {
  constructor(props = {}) {
    super(props)
    this.color = 'darkred'
    this.size = 0.02
    if (props.x === undefined && props.y === undefined) setRandomLocationOnEdge(this)
    if (props.speedX === undefined  && props.speedY === undefined) setSpeedTowardsTarget(this, playerState.get(), .003)
  }

  update(){
    super.update()
    handleEnemyOutOfBounds(this)
    handleEnemyCollisions(this)
  }
}

const spawnEnemyWave = (EnemyType = EnemyBall, nEnemies = 5, angle, enemyProps) => {
  const originEnemy = new EnemyType({...enemyProps})
  const player = playerState.get()
  const wave = [originEnemy]
  for (let i = 0; i < nEnemies - 1; i++) {
    const odd = i % 2
    wave.push(new EnemyType({
      x: originEnemy.x
        + (originEnemy.size * 2 * (
          angle
            ? Math.cos(angle)
            : Math.cos(
              getAngleBetweenPoints(originEnemy, player)
              + (Math.PI / 2)
            )
        ) * (odd ? -1 : 1) * (Math.floor(i / 2) + 1)
      ),
      y: originEnemy.y
        + (originEnemy.size * 2 * (
          angle
            ? Math.sin(angle)
            : Math.sin(
              getAngleBetweenPoints(originEnemy, player)
              + (Math.PI / 2)
            )
        ) * (odd ? -1 : 1) * (Math.floor(i / 2) + 1)
      ),
      speedX: originEnemy.speedX,
      speedY: originEnemy.speedY,
      ...enemyProps
    }))
  }
  wave.forEach(enemy => enemies.push(enemy))
  // console.log(wave)
  // debugger
}

class SmartEnemyBall extends EnemyBall {
  constructor(props = {}) {
    super(props)
    this.color = 'red'
  }
  update() {
    super.update()
    setSpeedTowardsTarget(this, playerState.get(), getPythagorean(this.speedX, this.speedY))
  }
}

class SlowEnemyBall extends SmartEnemyBall {
  constructor(props = {}) {
    super(props)
    this.speedX = this.speedX * .75
    this.speedY = this.speedY * .75
    this.size = 0.026
    this.color = 'orangered'
  }
}

class Explosion extends Ball {  
  constructor(props = {}) {
    super(props)
    this.size = props.size || 0.01
    this.color = props.color || 'BlueViolet'
  }

  update() {
    super.update()
    this.size += 0.001
    this.opacity -= 0.1
    if (this.opacity <= 0) {
      removeSelfFromArray(this, explosions)
    }
  }
}

const createExplosion = ({x, y, color, size} = {}) => {
  if (!features.createExplosion) return
  explosions.push(new Explosion({x, y, color, size}))
}

class Shield extends Ball {
  constructor(props = {}) {
    super(props)
    this.size = 0.02
    this.color = 'deepskyblue'
    this.opacity = 1
    this.x = .5
    this.y = .55
    this.angle = 0
    this.distanceFromCenter = .1
    this.speed = 1
  }
  update() {
    const level = levelState.get()
    this.angle += Math.PI / (100 / Math.min(level, 11)) * this.speed
    this.x = .5 + (this.distanceFromCenter * Math.cos(this.angle))
    this.y = .5 + (this.distanceFromCenter * Math.sin(this.angle))
  }
}

const getDistanceBetweenEntityCenters = (entity1, entity2) => 
  Math.sqrt(
    Math.pow(
      Math.abs(entity1.x - entity2.x),
      2
    )
    +
    Math.pow(
      Math.abs(entity1.y - entity2.y),
      2
    )
  )

const getBallCollisionDetected = (ball1, ball2) => {
  const distanceBetweenBallCenters = getDistanceBetweenEntityCenters(ball1, ball2)
  if (distanceBetweenBallCenters < ball1.size + ball2.size) {
    return {
      x: ball1.x + (ball2.x - ball1.x) * (ball1.size / distanceBetweenBallCenters),
      y: ball1.y + (ball2.y - ball1.y) * (ball1.size / distanceBetweenBallCenters)
    }
  }
}

const handleLevel = () => {
  if (gameTimeState.get() % 1000 === 0 && gameTimeState.get() !== 0) levelState.set(levelState.get() +1)
}

const handleLocation = () => {
  const center = centerState.get()
  center.update()
  locationState.set({
    x: -center.x + 0.5,
    y: center.y - 0.5,
  })
}

const handleSpawnEnemies = () => {
  const level = levelState.get()
  if (!features.handleSpawnEnemies) return
  if (level === 1) {
    if ((gameTimeState.get() % 5) === 0 && enemies.length < 200) {
      enemies.push(new EnemyBall())
    }
  }
  if (level === 2) {
    if ((gameTimeState.get() % 7) === 0 && enemies.length < 200) {
      spawnEnemyWave(EnemyBall, 3)
    }
  }
  if (level === 3) {
    if ((gameTimeState.get() % 5) === 0 && enemies.length < 200) {
      spawnEnemyWave(EnemyBall, 5)
    }
  }
  if (level > 3 && gameTimeState.get() % (11 - Math.min(10, level)) === 0 && enemies.length < 200) {
    const random = randomIntRange(1, 3)
    switch (random) {
      case 1:
        enemies.push(new EnemyBall())
        break
      case 2:
        enemies.push(new SlowEnemyBall())
        break
      case 3:
        enemies.push(new SmartEnemyBall())
        break
    }
  }
}

const update = () => {
  handleLevel()
  handleLocation()
  ;([
    playerState.get(),
    ...shields,
    ...enemies,
    ...explosions,
    ...menus,
  ]).forEach(entity => entity && entity.update && entity.update())
  handleSpawnEnemies()
  incrementTime()
}
 
const draw = () => {
  // Always draw background
  drawBackground()
  drawCenterRetical()
  ;([
    playerState.get(),
    ...enemies,
    ...shields,
    ...explosions,
    ...menus,
  ]).forEach(entity => entity && entity.draw && entity.draw())
}

window.addEventListener('resize', () => {
  const canvas = canvasState.get()
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  gameSizeState.set(calculateGameSize())
  gameOffsetState.set(calculateGameOffset())
  update()
  draw()
})

const togglePause = () => pauseState.set(!pauseState.get())

const newGame = () => {
  playerState.set(new PlayerBall())
  centerState.set(new MovableEntity())
  locationState.set({x:0, y:0})
  mouseControllerState.set(undefined)
  shields = [ new Shield() ]
  enemies = []
  explosions = []
  preGameState.set(false)
  scoreState.set(0)
  gameTimeState.set(0)
  levelState.set(1)
  isGameOverState.set(false)
}

const checkIsGameOver = () => playerState.get().health <= 0

const gameOver = () => {
  gameOverTimeState.set(gameTimeState.get())
  playerState.get().controller = false
  mouseControllerState.set(undefined)
  pauseState.set(false)
  isGameOverState.set(true)
}

const playGame = () => {
  handleGamePad()
  if (!isGameOverState.get() && checkIsGameOver()) {
    gameOver()
  }
  const canvas = canvasState.get()
  const canvasContext = canvasContextState.get()
  if (features.hyperTrails) {
    canvasContext.fillStyle = 'rgba(0,0,0,0.1)'
    canvasContext.fillRect(0,0, canvas.width,canvas.height)
  } else {
    canvasContext.clearRect(0,0, canvas.width, canvas.height)
  }
  if (!pauseState.get()) {
    update()
  }
  draw()
  requestAnimationFrame(playGame)
}

const init = ({
  gameCanvasId = 'gameCanvas'
} = {}) => {
  canvasState.set(document.getElementById(gameCanvasId))
  const canvas = canvasState.get()
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  canvasContextState.set(canvas.getContext('2d'))
  gameSizeState.set(calculateGameSize())
  gameOffsetState.set(calculateGameOffset())
  playerState.set(new AIPlayerBall())
  centerState.set(new MovableEntity())
  locationState.set({x:0, y:0})
  playGame()
}

let shields = []
let enemies = []
let explosions = []
let menus = [
  new StartMenu(),
  new InGameMenu(),
  new EndGameMenu(),
  new PauseMenu(),
]

export default {
  init
}
import { calculateGameSize, calculateGameOffset } from './canvasUtils'

let idCounter = 0

class Entity {
  constructor(props = {}) {
    this.canvas = props.canvas
    this.canvasContext = props.canvasContext
    this.id = ++idCounter
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
    const {x, y, speedX, speedY, text, textColor, textScale, canvasContext} = this
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
    if (isGameOver) {
      this.size = 0
      this.color = 'black'
      this.text = undefined
    } else {
      this.color = `hsl(${12 * this.health} 100% 50%)`
      // this.textColor = this.textColor
    }
  }
}
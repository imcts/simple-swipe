import Assertion from '../../../../../../../assertion/Assertion'

const MOVING_ALLOWED_PERCENT = 15
const DEFAULT_INDEX = 0
const DEFAULT_X = 0
const DEFAULT_Y = 0
const DEFAULT_POSITION = {x: DEFAULT_X, y: DEFAULT_Y}
const DEFAULT_SIZE = 0
const PRESSED = true
const RAISED = false
const SMOOTH_CLASS_NAME = 'smooth'
const LAST_CLASS_NAME = 'last'
const CSS_INDEX = '--i'
const CSS_SIZE = '--size'
const CSS_MOVING = '--moving'

const SmoothSlider = class {
  #container
  #size
  #handler
  #index
  #startX
  #startY
  #press
  
  static from (container, size) {
    Assertion.assertExisting(container)
    Assertion.assertNumber(size)
    return new SmoothSlider(container, size)
  }
  
  static #getPosition (e) {
    let target = e
    const {changedTouches} = target
    if (changedTouches) {
      const [touch] = changedTouches
      if (!touch) {
        return DEFAULT_POSITION
      }
      target = touch
    }
    return {
      x: target.clientX,
      y: target.clientY
    }
  }
  
  constructor (container, size) {
    this.#container = container
    this.#container.style.setProperty(CSS_SIZE, this.#size = size)
    this.#handler = new Map()
      .set('down', this.#down.bind(this))
      .set('move', this.#move.bind(this))
      .set('up', this.#up.bind(this))
    this.#index = DEFAULT_INDEX
    this.#startX = DEFAULT_X
    this.#startY = DEFAULT_Y
    this.#press = RAISED
    this.#bind()
  }
  
  #bind () {
    const container = this.#container
    const down = this.#handler.get('down')
    const move = this.#handler.get('move')
    const up = this.#handler.get('up')
    container.addEventListener('mousedown', down, false)
    container.addEventListener('touchstart', down, false)
    container.addEventListener('mousemove', move, false)
    container.addEventListener('touchmove', move, false)
    container.addEventListener('mouseup', up, false)
    container.addEventListener('touchend', up, false)
  }
  
  #down (e) {
    const {x, y} = SmoothSlider.#getPosition(e)
    this.#startX = x
    this.#startY = y
    this.#toggleSmoothAnimation(PRESSED)
  }
  
  #toggleSmoothAnimation (toggled) {
    this.#container.classList.toggle(SMOOTH_CLASS_NAME, !(this.#press = toggled))
  }
  
  #move (e) {
    if (!this.#press) {
      return
    }
    const {x, y} = SmoothSlider.#getPosition(e)
    const distanceX = x - this.#startX
    const distanceY = y - this.#startY
    if (this.#isVerticalDrag(distanceX, distanceY)) {
      return
    }
    e.preventDefault()
    this.#container.style.setProperty(CSS_MOVING, `${Math.round(distanceX)}px`)
  }

  #isVerticalDrag (distanceX, distanceY) {
    return Math.abs(distanceX) < Math.abs(distanceY)
  }

  #up (e) {
    const container = this.#container
    const distanceX = SmoothSlider.#getPosition(e).x - this.#startX
    const nextIndex = this.#index - Math.sign(distanceX)
    container.style.setProperty(CSS_MOVING, `${DEFAULT_X}px`)
    this.#toggleSmoothAnimation(RAISED)
    if (this.#isSlidingAllowed(distanceX, nextIndex)) {
      return
    }
    container.classList.toggle(LAST_CLASS_NAME, this.#isLast(nextIndex))
    container.style.setProperty(CSS_INDEX, this.#index = nextIndex)
  }
  
  #isSlidingAllowed (distanceX, nextIndex) {
    const distancePercent = Math.abs(distanceX / (this.#container.offsetWidth / this.#size) * 100)
    return nextIndex < DEFAULT_INDEX || nextIndex >= this.#size || distancePercent <= MOVING_ALLOWED_PERCENT
  }
  
  #isLast (to) {
    return to >= this.#size - 1
  }
  
  isNone () {
    return this === this.NONE
  }
  
  unbind () {
    const container = this.#container
    const down = this.#handler.get('down')
    const move = this.#handler.get('move')
    const up = this.#handler.get('up')
    container.removeEventListener('mousedown', down, false)
    container.removeEventListener('touchstart', down, false)
    container.removeEventListener('mousemove', move, false)
    container.removeEventListener('touchmove', move, false)
    container.removeEventListener('mouseup', up, false)
    container.removeEventListener('touchend', up, false)
  }
}

SmoothSlider.NONE = new SmoothSlider(document.createElement('div'), DEFAULT_SIZE)

export default SmoothSlider

/**
 * wrapper: container를 감싸고 있는 dom
 * container: content를 감싸고 있는 dom, container를 transform하여 스크롤한다.
 *
 * 작업전 고려사항.
 * 1. calc와 var는 하위브라우저에서 지원되지 않으니, javascript에서 container의 width를 결정짓는다.
 * 2. translate 위치는 현재는 --i를 가지고 계산하고 있지만, translate속성을 직접 지정하는 편이 좋을 듯 하다.
 *  - position: absolute
 *  - x: 0;
 *  - x의 값을 조작하는 방법도 고려되어야 한다.
 *
 * 1. wrapper(현재는 body) 스크롤바를 css를 사용해서 전부 제거한다.
 * 2. container의 이미지의 개수만큼 css 변수 n을 설정 하여 width가 지정되도록 구현한다.
 * 3. container의 width를 이미지들의 total 가로값으로 지정한다.
 *  - 변수 n을 지정하여 가로값을 계산하게 함으로써 container는 스크롤이 사라지게 된다.
 */
const container = document.querySelector('.container')
const length = container.children.length
const style = container.style
style.setProperty('--n', length)

let i = 0
let x = 0
let press = false

const getEvent = e => e.changedTouches ? e.changedTouches[0] : e

const down = e => {
  e.preventDefault()
  x = getEvent(e).clientX
  container.classList.toggle('smooth', !(press = true))
}

const move = e => {
  e.preventDefault()
  if (press) {
    style.setProperty('--x', `${Math.round(getEvent(e).clientX - x)}px`)
  }
}

const up = e => {
  console.log('up')
  e.preventDefault()
  const to = i - Math.sign(getEvent(e).clientX - x)
  style.setProperty('--x', `${x = 0}px`)
  container.classList.toggle('smooth', !(press = false))
  if (to < 0 || to >= length) {
    return
  }
  style.setProperty('--i', i = to) // translate 위치를 결정하는 것은 여기에서 지정하는 편이 좋을 듯.
}
container.addEventListener('mousedown', down, false)
container.addEventListener('touchstart', down, false)
container.addEventListener('mousemove', move, false)
container.addEventListener('touchmove', move, false)
container.addEventListener('mouseup', up, false)
container.addEventListener('touchend', up, false)

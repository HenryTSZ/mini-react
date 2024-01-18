import React from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
let num = 0
const Counter = ({ count }) => {
  const add = count => {
    num++
    console.log(111, count, num)
    React.update()
  }

  return (
    <div>
      count: {count} <button onClick={() => add(count)}>add</button>
      num: {num}
    </div>
  )
}

const App = (
  <div id="app">
    hi mini-react
    <Counter count={10}></Counter>
  </div>
)

// const App = () => <div id="app">hi mini-react</div>
console.log('🚀 ~ App:', App)

const App2 = () => <div id="app">hi mini-react</div>
console.log('🚀 ~ App2:', App2)

export default App

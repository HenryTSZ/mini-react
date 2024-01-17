import React from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
const Counter = ({ count }) => {
  const add = count => {
    console.log(111, count)
  }

  return (
    <div>
      count: {count} <button onClick={() => add(count)}>add</button>
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

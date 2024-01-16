import React from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
const Counter = count => <div>count: {count}</div>

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

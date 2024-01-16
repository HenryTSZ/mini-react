import React from './core/React.js'

// const App = React.createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
const App = (
  <div id="app">
    hi mini-react <div>test</div>
  </div>
)
// const App = () => <div id="app">hi mini-react</div>
console.log('🚀 ~ App:', App)

const App2 = () => <div id="app">hi mini-react</div>
console.log('🚀 ~ App2:', App2)

export default App

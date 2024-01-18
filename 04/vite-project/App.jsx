import React from './core/React.js'

function Counter({ num }) {
  return <div>count: {num}</div>
}

let count = 0
let attribute = { id: 'app' }

function App() {
  function handleClick() {
    count++
    attribute = { id: 'app' + count }
    console.log(count)
    React.update()
  }

  return (
    <div {...attribute}>
      hi-mini-react
      <Counter num={10}></Counter>
      <button onClick={handleClick}>add</button>
      count: {count}
    </div>
  )
}

export default App

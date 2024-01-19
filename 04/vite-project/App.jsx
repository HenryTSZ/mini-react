import React from './core/React.js'

function Counter({ num }) {
  return <div>num: {num}</div>
}

let count = 0
let attribute = { id: 'app' }
let show = false

function App() {
  function handleClick() {
    count++
    attribute = { id: 'app' + count }
    console.log(count)
    show = !show
    React.update()
  }

  const foo = (
    <div>
      foo
      <div>child</div>
      <div>child1</div>
    </div>
  )
  const bar = <div>bar</div>

  return (
    <div {...attribute}>
      hi-mini-react
      <Counter num={10}></Counter>
      <button onClick={handleClick}>add</button>
      {show && bar}
      count: {count}
    </div>
  )
}

export default App

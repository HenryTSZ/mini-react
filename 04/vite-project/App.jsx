import React from './core/React.js'

let count1 = 0
function Foo() {
  console.log('foo')
  const update = React.update()
  function handleClick() {
    count1++
    update()
  }

  return (
    <div>
      <button onClick={handleClick}>add</button>
      count: {count1}
    </div>
  )
}

let count2 = 0
function Bar() {
  console.log('bar')
  const update = React.update()
  function handleClick() {
    count2++
    update()
  }

  return (
    <div>
      <button onClick={handleClick}>add</button>
      count: {count2}
    </div>
  )
}

let count = 0
let attribute = { id: 'app' }
function App() {
  console.log('app')
  const update = React.update()
  function handleClick() {
    count++
    update()
  }

  return (
    <div {...attribute}>
      hi-mini-react
      <button onClick={handleClick}>add</button>
      count: {count}
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}

export default App

import React from './core/React.js'

function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    setCount(c => c + 1)
    setBar('bar11')
  }

  return (
    <div>
      <button onClick={handleClick}>add</button>
      <br />
      count: {count}
      <br />
      bar: {bar}
    </div>
  )
}

function Bar() {
  const [count, setCount] = React.useState(10)
  function handleClick() {
    setCount(c => c + 1)
    setCount(c => c + 1)
  }

  return (
    <div>
      <button onClick={handleClick}>add</button>
      count: {count}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(10)
  const [attribute, setAttribute] = React.useState({ id: 'app' })
  function handleClick() {
    setCount(c => c + 1)
    setAttribute(a => {
      a.id += 1
      return a
    })
  }

  React.useEffect(() => {
    console.log('useEffect', 'init')
    return () => {
      console.log('cleanup', 'destroy')
    }
  }, [])

  React.useEffect(() => {
    console.log('useEffect', 1)
    return () => {
      console.log('cleanup', 1)
    }
  }, [1])

  React.useEffect(() => {
    console.log('useEffect', count)
    return () => {
      console.log('cleanup', count)
    }
  }, [count])

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

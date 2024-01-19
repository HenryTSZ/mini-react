## [01. 实现最简 mini-react](https://github.com/HenryTSZ/mini-react/tree/53e888f05c5f33915fdb06bc7dbbd0e2e0c12856)

## [02. 使用 jsx](https://github.com/HenryTSZ/mini-react/tree/827131b7d45d76c822cb6a655778ed91bf5a2de1)

## [03. 实现任务调度器](https://github.com/HenryTSZ/mini-react/tree/a23c36b7b2a6e8e7ad28a2431c2f98e3208ac546)

## [04. 实现 fiber 架构](https://github.com/HenryTSZ/mini-react/tree/2e11170fffd1a3123ed0c3372c1702c50af22711)

## [04-1. 优化及重构 fiber 架构](https://github.com/HenryTSZ/mini-react/tree/c823e669adaada3f82ab0873f6c302abb2c64e6e)

## [05. 实现统一提交](https://github.com/HenryTSZ/mini-react/tree/15f6a091c103127e0151859c8ebcf14abe7e240e)

## [06. 实现 function component](https://github.com/HenryTSZ/mini-react/tree/d30278ce013910989fe0cc3b964264ec3d7081df)

## [06-1. 实现 function component 后续](https://github.com/HenryTSZ/mini-react/tree/12420c93998cd1d9fe4ca54cb855b8f30d10e9c7)

## [07. 实现事件绑定](https://github.com/HenryTSZ/mini-react/tree/0fafd119d1ee6aac451c5e1cd211803f71e25282)

## [08. 实现更新 props](https://github.com/HenryTSZ/mini-react/tree/6707b972fc5d62d56059fa27eaa3e2aa4915f082)

## [09. 同步视频中的代码](https://github.com/HenryTSZ/mini-react/tree/d9ced68af4c5a0783d5d1af01b568644b739f254)

## [10. diff-更新 children](https://github.com/HenryTSZ/mini-react/tree/93e9c87f642f6d68bad76f7e302700bf17fdb9d4)

## [11. diff-删除多余的老节点](https://github.com/HenryTSZ/mini-react/tree/4d542bf6e2d938b05b273e8579d2df9357403ef4)

## [12. 解决 edge case 的方式](https://github.com/HenryTSZ/mini-react/tree/abc8bb86e6b9e2a7143f31c64f1fa9d77c607855)

## [13. 优化更新 减少不必要的计算](https://github.com/HenryTSZ/mini-react/tree/9e7205532a13eeb0592f07b82131998619b798ba)

## 14. 实现 useState

先看代码：

```js
function Foo() {
  const [count, setCount] = React.useState(10)
  function handleClick() {
    setCount(c => c + 1)
  }

  return (
    <div>
      <button onClick={handleClick}>add</button>
      count: {count}
    </div>
  )
}
```

我们定义了一个 count，在点击的时候，count + 1。

然后去实现 useState

先把结构写出来：

```js
function useState(initialState) {
  const state = initialState

  const setState = action => {
    action(state)
  }

  return [state, setState]
}
```

在 setState 中，我们需要去执行 update 的操作

```js
function useState(initialState) {
  const currentRoot = currentFc
  const state = initialState

  const setState = action => {
    action(state)

    wipRoot = {
      ...currentRoot,
      alternate: currentRoot
    }
    nextWorkOfUnit = wipRoot
  }

  return [state, setState]
}
```

这里和上节是一样的，也是用闭包来实现的

但我们调用 setState 的时候，stateHook.state 一直是初始值，所以我们需要把这个值与 fiber 绑定起来，每次先去看看 oldFiber 是否有 state

```js
function useState(initialState) {
  const currentRoot = currentFc
  const oldState = currentRoot.alternate?.state

  const state = oldState || initialState

  const setState = action => {
    const newState = action(state)

    wipRoot = {
      ...currentRoot,
      alternate: currentRoot
    }

    wipRoot.alternate.state = newState

    nextWorkOfUnit = wipRoot
  }

  return [state, setState]
}
```

这样我们点击按钮的时候，count 就一直 + 1

我们再加一个 useState

```js
function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    setCount(c => c + 1)
    setBar(s => s + 'bar')
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
```

初始渲染没有问题，但点击按钮后，count 和 bar 都变成 barbar

这是因为 useState 我们只保存了一个 state，所以会存在问题

那就需要用数组处理了，还需要一个索引

```js
let states = []
let stateIndex = 0
```

同时要做更新 fc 是重置，因为这里是处理下一个函数组件了

```js
function updateFunctionComponent(fiber) {
  states = []
  stateIndex = 0

  currentFc = fiber
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}
```

那内部如何处理呢？

我们不能直接使用 states，因为这是一个全局变量，取得值不一定是当前组件的，所以还需要保存到 oldFiber 中

先来写获取

```js
const oldState = currentRoot.alternate?.states

const state = oldState?.[stateIndex] || initialState
```

然后需要更新 states 和 stateIndex

```js
states[stateIndex] = state
stateIndex++
```

那在 setState 中如果把 states 挂到 fiber 上呢

我们可以把 states 再利用闭包传进去

```js
states[stateIndex] = state
stateIndex++

const currentStates = states

const setState = action => {
  const newState = action(state)

  wipRoot = {
    ...currentRoot,
    alternate: currentRoot
  }

  wipRoot.alternate.states = currentStates

  nextWorkOfUnit = wipRoot
}
```

但我们已经用了一个 currentRoot 这个闭包了，现在又增加了一个，能不能把这两个合起来呢？

我们可以发现

```js
wipRoot.alternate.states = currentStates
```

这里的 wipRoot.alternate 就是外面的 currentRoot

所以我们可以在外面就把 states 绑定到 currentRoot 上

```js
states[stateIndex] = state
stateIndex++

currentRoot.states = states

const setState = action => {
  const newState = action(state)

  wipRoot = {
    ...currentRoot,
    alternate: currentRoot
  }

  nextWorkOfUnit = wipRoot
}
```

但现在 newState 还没有在 states 中更新

点击按钮是没有效果的

其实这里我们可以把 state 变成一个对象，利用对象地址引用的更新同步更新数据

```js
function useState(initialState) {
  const currentRoot = currentFc
  const oldState = currentRoot.alternate?.states

  const stateHook = {
    state: oldState?.[stateIndex]?.state || initialState
  }

  states[stateIndex] = stateHook
  stateIndex++

  currentRoot.states = states

  const setState = action => {
    stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentRoot,
      alternate: currentRoot
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}
```

这样点击就互不影响了

那我们把 Bar 和 App 的都改了吧

也没有问题

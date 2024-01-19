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

## 13. 优化更新 减少不必要的计算

目前我们的代码在更新子组件的时候，其他不相关的组件也会更新，这样的话，会导致不必要的计算

代码如下

```js
import React from './core/React.js'

let count1 = 0
function Foo() {
  console.log('foo')
  function handleClick() {
    count1++
    React.update()
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
  function handleClick() {
    count2++
    React.update()
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
  function handleClick() {
    count++
    React.update()
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
```

点击每个子组件的按钮，另一个子组件也会输出

所以我们只需要更新当前组件就可以了

我们还需要一个全局变量，来保存这个组件，这就是起始更新的节点，结束更新的节点就是起始节点的 sibling

在处理 FC 时给其赋值

```js
let currentFc = null

function updateFunctionComponent(fiber) {
  currentFc = fiber
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}
```

我们在 update 函数中看看这个 currentFc

结果发现不论点击哪个按钮，输出的都是 Bar 这个组件

确实是这样的，Bar 是最后执行的，只能保存最后的值

所以我们需要使用闭包来解决这个问题

```js
function update() {
  console.log(currentFc)

  let currentRoot = currentFc
  return () => {
    console.log(currentRoot)

    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextWorkOfUnit = wipRoot
  }
}
```

同时调用也需要改变一下

```js
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
```

这样就只更新当前组件了

但我们还没有设置结束更新的节点

我们需要检测 nextWorkOfUnit 是不是 wipRoot 的 sibling，如果是的话，就需要停止更新了

那我们先来看一下 wipRoot 的 sibling

```js
while (!shouldYield && nextWorkOfUnit) {
  nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

  console.log(wipRoot)

  shouldYield = deadline.timeRemaining() < 1
}
```

发现没有

这是因为我们在 update 中只赋值了 dom、props、alternate，没有赋值 sibling

所以可以重新赋值一下

```js
wipRoot = {
  ...currentRoot,
  alternate: currentRoot
}
```

这样就拿到了，就可以判断了

```js
if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
  nextWorkOfUnit = null
}
```

这样就只更新当前组件了

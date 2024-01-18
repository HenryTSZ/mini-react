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

## 10. diff-更新 children

type 不一致，删除旧节点，新增新节点

代码如下，点击按钮，bar 与 foo 切换显示；

```js
let show = true

function App() {
  function handleClick() {
    count++
    attribute = { id: 'app' + count }
    console.log(count)
    show = !show
    React.update()
  }

  const foo = <div>foo</div>
  const bar = <p>bar</p>

  return (
    <div {...attribute}>
      hi-mini-react
      <Counter num={10}></Counter>
      <button onClick={handleClick}>add</button>
      count: {count}
      {show ? foo : bar}
    </div>
  )
}
```

现在点击的效果是点击按钮后，旧节点没有删除，新节点添加了

我们在 reconcileChildren 中判断 type 不同，直接就添加了，现在加一个删除逻辑就可以了

由于我们是统一提交，所以删除也搞成统一吧，所以需要有一个待删除列表

```js
let deleteList = []
```

在 reconcileChildren 将其添加到待删除列表中

```js
newFiber = {
  type: child.type,
  props: child.props,
  child: null,
  parent: fiber,
  sibling: null,
  dom: null,
  effectType: 'add'
}

deleteList.push(oldFiber)
```

然后在 commit 阶段删除

```js
function commitRoot() {
  commitWork(wipRoot.child)
  deleteDom()
  currentRoot = wipRoot
  wipRoot = null
  deleteList = []
}

function deleteDom() {
  deleteList.forEach(fiber => {
    if (fiber.dom) {
      fiber.dom.remove()
    }
  })
}
```

运行一下，报错了：

> Uncaught TypeError: Cannot read properties of undefined (reading 'dom')

deleteDom 中 fiber 是 undefined

这还没更新呢，咋 deleteList 就有值了呢

原来我们添加的时候没有判断 oldFiber 是否有值，首次渲染肯定沒值的

```js
if (oldFiber) {
  deleteList.push(oldFiber)
}
```

这样就没问题了

然后再试一试 fc

```js
const Foo = () => <div>foo</div>

{
  show ? <Foo></Foo> : bar
}
```

点击按钮后，foo 没有被删除

debug 发现 deleteList 添加的 oldFiber 是 fc

那删除的时候就需要判断一下了

```js
function deleteDom(list = deleteList) {
  list.forEach(fiber => {
    if (fiber.dom) {
      fiber.dom.remove()
    } else {
      deleteDom([fiber.child])
    }
  })
}
```

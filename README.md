## [01. 实现最简 mini-react](https://github.com/HenryTSZ/mini-react/tree/53e888f05c5f33915fdb06bc7dbbd0e2e0c12856)

## [02. 使用 jsx](https://github.com/HenryTSZ/mini-react/tree/827131b7d45d76c822cb6a655778ed91bf5a2de1)

## [03. 实现任务调度器](https://github.com/HenryTSZ/mini-react/tree/a23c36b7b2a6e8e7ad28a2431c2f98e3208ac546)

## 04. 实现 fiber 架构

需要把一个树转变为一个链表，而且是边运行边转变

转变规则就是：

1. 先找 child
2. 没有 child 再找 siblings
3. 没有 siblings 再找 parent 的 siblings

所以一个节点要包含 parent、child、siblings 三个属性

先把上一节的实现代码拿过来放在 02/vite-project/core/React.js 里

需要全局定义一个

```js
let nextWork = null
```

render 中给 nextWork 赋值

然后在 callback 中去执行 runUnitOfWork(nextWork)，并且需要返回下一个 nextWork，然后赋值给 nextWork，再去执行 runUnitOfWork(nextWork)

代码就是

```js
nextWork = runUnitOfWork(nextWork)
```

接下来就是去写 runUnitOfWork 里面的代码了

```js
runUnitOfWork = work => {
  // ...
}
```

首先把 render 中的代码都拿过来

然后虚拟 dom 也需要挂载到 work 上

```js
const dom = (work.dom =
  work.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(work.type))
```

再把 props 同步一下，由于 js 地址引用，所以这里给 dom 赋值后，work.dom 也会同步赋值

```js
Object.keys(work.props).forEach(key => {
  if (key !== 'children') {
    dom[key] = work.props[key]
  }
})
```

接下来就需要处理 children 了，这也是 fiber 的核心

```js
work.props.children.forEach((child, index) => {})
```

由于我们是先去找 child，所以 parent 的 child 是 children[0]

```js
if (!index) {
  work.child = child
}
```

而其余 child 就只能设置 siblings：当前 child 的 siblings 就是上一个 child

所以还需要一个变量来记录 prevChild

并且还需要给每个 child 都把 parent 设置上

```js
let prevChild = null
work.props.children.forEach((child, index) => {
  if (!index) {
    work.child = child
  } else {
    child.siblings = prevChild
  }
  child.parent = work
  prevChild = child
})
```

然后我们就需要返回 nextWork 了

就是先 child -> siblings -> parent.siblings

```js
if (work.child) {
  return work.child
}

if (work.siblings) {
  return work.siblings
}

return work.parent?.siblings
```

由于这里会返回 undefined，所以我们需要判断一下

```js
if (!work) return
```

由于 nextWork 初始值为 null，所以需要在 render 中给赋值，先赋值为

```js
nextWork = el
```

没有报错，但页面也没有渲染，是缺少挂载的部分

由于我们每个 work 都设置了真实 dom，大体思路就是

```js
work.parent.dom.appendChild(work.dom)
```

但报错了：

> Uncaught TypeError: Cannot read properties of undefined (reading 'dom')

是因为 el 没有 parent

所以我们在 render 中给 nextWork 赋值不对

肯定需要 el 的所有属性，还需要有 parent.dom，对应的就是 container

```js
const work = {
  ...el,
  parent: {
    dom: container
  }
}
nextWork = work
```

这样页面就渲染出来了

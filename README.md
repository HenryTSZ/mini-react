## [01. 实现最简 mini-react](https://github.com/HenryTSZ/mini-react/tree/53e888f05c5f33915fdb06bc7dbbd0e2e0c12856)

## [02. 使用 jsx](https://github.com/HenryTSZ/mini-react/tree/827131b7d45d76c822cb6a655778ed91bf5a2de1)

## [03. 实现任务调度器](https://github.com/HenryTSZ/mini-react/tree/a23c36b7b2a6e8e7ad28a2431c2f98e3208ac546)

## [04. 实现 fiber 架构](https://github.com/HenryTSZ/mini-react/tree/2e11170fffd1a3123ed0c3372c1702c50af22711)

## [04-1. 优化及重构 fiber 架构](https://github.com/HenryTSZ/mini-react/tree/c823e669adaada3f82ab0873f6c302abb2c64e6e)

## [05. 实现统一提交](https://github.com/HenryTSZ/mini-react/tree/15f6a091c103127e0151859c8ebcf14abe7e240e)

## [06. 实现 function component](https://github.com/HenryTSZ/mini-react/tree/d30278ce013910989fe0cc3b964264ec3d7081df)

## [06-1. 实现 function component 后续](https://github.com/HenryTSZ/mini-react/tree/12420c93998cd1d9fe4ca54cb855b8f30d10e9c7)

## 07. 实现事件绑定

上一小节又忘了一个，还没有把 App 变成 function component，总是丢三落四的

```js
ReactDOM.createRoot(document.querySelector('#root')).render(<App></App>)
```

果然又报错了：

> Uncaught DOMException: Failed to execute 'createElement' on 'Document': The tag name provided ('[object Object]') is not a valid name.

是这里报错的：

```js
const createDom = type =>
  type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)
```

说 type 是一个对象

打断点看一下确实是一个对象，好像就是 App 的

应该还是 createElement 这里没有处理

可以看到这里的 type 就是一个对象，而我们直接把 type 返回了，导致出问题了

而且这个 type 就是一个 vdom 了，那直接返回 type 就可以了

```js
const createElement = (type, props, ...children) => {
  if (typeof type === 'object') {
    return type
  }
}
```

页面展示正常了

然后就开始实现事件绑定了

```js
const Counter = ({ count }) => {
  const add = () => {
    console.log(111)
  }

  return (
    <div>
      count: {count} <button onClick={add}>add</button>
    </div>
  )
}
```

现在点击是没有反应的

在 updateProps 中可以看到 onClick 这个方法，那我们就给绑定一下就可以了

```js
const updateProps = (work, dom) => {
  console.log('🚀 ~ updateProps ~ work:', work)
  Object.keys(work.props).forEach(key => {
    if (key !== 'children') {
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase()
        dom.addEventListener(eventType, work.props[key])
      } else {
        dom[key] = work.props[key]
      }
    }
  })
}
```

这样点击就能正常触发了

同时也支持传参：

```js
const Counter = ({ count }) => {
  const add = count => {
    console.log(111, count)
  }

  return (
    <div>
      count: {count} <button onClick={() => add(count)}>add</button>
    </div>
  )
}
```

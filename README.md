## [01. 实现最简 mini-react](https://github.com/HenryTSZ/mini-react/tree/53e888f05c5f33915fdb06bc7dbbd0e2e0c12856)

## [02. 使用 jsx](https://github.com/HenryTSZ/mini-react/tree/827131b7d45d76c822cb6a655778ed91bf5a2de1)

## 03. 实现任务调度器

上节课说到的如果渲染的 dom 节点很多，导致浏览器卡死的问题就需要使用任务调度器来解决。

大体思路就是利用浏览器渲染空闲时间来处理虚拟 dom 渲染

主要使用的 api 为 `requestIdleCallback`，地址为 [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

先来测试一下：

```js
requestIdleCallback(callback)

function callback(IdleDeadline) {
  console.log('callback', IdleDeadline.timeRemaining())
}
```

每次刷新浏览器都可以看到剩余的空闲时间有多少

如果在 callback 中继续调用 requestIdleCallback 就会一直输出剩余的时间，不过不能长时间打开当前网页，浏览器会卡死，死循环了

那我们就可以判断如果当前还有空余时间，就可以执行我们的任务

```js
requestIdleCallback(callback)

let taskId = 0
function callback(IdleDeadline) {
  let deadline = IdleDeadline.timeRemaining()
  while (deadline > 0) {
    // do something
    console.log('callback', taskId)
    deadline = IdleDeadline.timeRemaining()
  }
  taskId++
  requestIdleCallback(callback)
}
```

这样，一个简单的任务调度器就实现了

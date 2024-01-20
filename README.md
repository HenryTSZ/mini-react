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

## [14. 实现 useState](https://github.com/HenryTSZ/mini-react/tree/5d767a6318a4d5c079ccfba2379e18c72e5c53d4)

## 15. 批量执行 action

上一小节没有细测，发现还是有问题的

可以看到点击 app 按钮后，两个子组件的数据变了，估计应该是 oldFiber 找错了

看群里有大佬说可以这样写：

```js
const setState = action => {
  stateHook.state = action(stateHook.state)

  // wipRoot = {
  //   ...currentRoot,
  //   alternate: currentRoot
  // }
  wipRoot = currentRoot
  wipRoot.alternate = currentRoot

  nextWorkOfUnit = wipRoot
}
```

这样写确实点击 app 不影响子组件的数据变化，但一个组件内有多个 state，只有第一个会更新，还是有问题

这个就留作后续的作业吧

接下来看批量执行 action

在 react 中是异步更新的，但我们的 state 是同步的，所以不会有多次渲染更新的问题

比如第一个 setState 执行了，给 wipRoot 赋值了，但紧接着又开始执行另一个 setState 了，浏览器没有空闲时间，所以上一个 wipRoot 还不会去渲染更新，而第二个 wipRoot 就会在空闲时间后渲染更新，大家也可以通过打断点的方式来观察更新的情况，我就是这样做的，看视频理解不了，以为第一次给 wipRoot 赋值后就更新了，那下次就又会再更新一次，后来打断点才了解了原理

但我们也模拟一下 react 吧

那就不能在 setState 直接调用了，而是要保存起来，就还需要有一个数组来存储

```js
const stateHook = {
  state: oldState?.[stateIndex]?.state || initialState,
  queue: []
}
const setState = action => {
  stateHook.queue.push(action)
}
```

后面的就与 stateHook.state 类似了

再下次更新的时候调用

```js
const stateHook = {
  state: oldState?.[stateIndex]?.state || initialState,
  queue: oldState?.[stateIndex]?.queue || []
}

stateHook.queue.forEach(action => {
  stateHook.state = action(stateHook.state)
})
stateHook.queue = []
```

这样就完成了

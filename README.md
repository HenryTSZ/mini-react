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

## [15. 批量执行 action](https://github.com/HenryTSZ/mini-react/tree/ac4b821ed9ce319d8c0a4b36b28b5c7e23eefde1)

## [16. action 支持非函数和提前检测 减少不必要的更新](https://github.com/HenryTSZ/mini-react/tree/0ce3cf8afcfe131a38d91405ca49c84a3e7d2daa)

## 17. 实现 useEffect

useEffect 接收两个参数：一个是 callback，另一个是依赖列表 deps。如果依赖列表为空，则会在组件第一次渲染时执行，否则会在依赖列表变化时执行。

我们先来实现 deps 为空的情况

```js
React.useEffect(() => {
  console.log('useEffect')
}, [])
```

由于 callback 不是在调用 useEffect 的时候就执行，所以我们需要在 useEffect 里面先将其保存，等页面渲染完成后再调用

```js
const useEffect = (callback, deps) => {
  const currentRoot = currentFc

  currentRoot.effectHook = {
    callback,
    deps
  }
}
```

然后在 commitWork 结束后再执行 callback

执行也是遍历整棵树，然后执行 callback

```js
function commitRoot() {
  commitWork(wipRoot.child)
  deleteDom()
  commitEffect(wipRoot)
  currentRoot = wipRoot
  wipRoot = null
  deleteList = []
}

function commitEffect(fiber) {
  if (!fiber) {
    return
  }

  fiber.effectHook?.callback()

  commitEffect(fiber.child)
  commitEffect(fiber.sibling)
}
```

这样初始化调用就完成了

然后我们再来实现根据 deps 来调用

这里要分成两种情况来处理：

一种是初始化，全部都需要调用，不管有没有 deps

另一种就是更新，只用 deps 改变的才需要调用

我们可以利用 alternate 来区分这两种情况

```js
if (!fiber.alternate) {
  // init
  fiber.effectHook?.callback()
} else {
  // update
}
```

先测试一下，看看有没有破坏老功能，查看页面输出是没有问题的

然后就需要根据 deps 是否改变来调用 callback

```js
if (fiber.effectHook) {
  const needUpdate = fiber.effectHook.deps.some(
    (dep, index) => dep !== fiber.alternate.effectHook.deps[index]
  )
  if (needUpdate) {
    fiber.effectHook.callback()
  }
}
```

测试一下：

```js
React.useEffect(() => {
  console.log('useEffect', count)
}, [count])
```

没有问题

再测试一下依赖项不变是否可以：

```js
React.useEffect(() => {
  console.log('useEffect', 1)
}, [1])
```

也没有问题

然后再来看看有多个 useEffect 的情况，那这种就需要使用数组来存储了

与 useState 相似

```js
let effects = []
const useEffect = (callback, deps) => {
  const currentRoot = currentFc

  effects.push({
    callback,
    deps
  })

  currentRoot.effectHooks = effects
}
```

```js
function updateFunctionComponent(fiber) {
  states = []
  stateIndex = 0
  effects = []
}
```

```js
function commitEffect(fiber) {
  if (!fiber) {
    return
  }

  if (!fiber.alternate) {
    // init
    fiber.effectHooks?.forEach(effect => {
      effect.callback()
    })
  } else {
    // update
    fiber.effectHooks?.forEach((effect, i) => {
      const needUpdate = effect.deps.some(
        (dep, index) => dep !== fiber.alternate.effectHooks[i].deps[index]
      )
      if (needUpdate) {
        effect.callback()
      }
    })
  }

  commitEffect(fiber.child)
  commitEffect(fiber.sibling)
}
```

测试一下：

```js
React.useEffect(() => {
  console.log('useEffect', 'init')
}, [])

React.useEffect(() => {
  console.log('useEffect', 1)
}, [1])

React.useEffect(() => {
  console.log('useEffect', count)
}, [count])
```

功能没有问题

update 时我们还可以去优化一下，如果没有 deps，那就不需要执行 callback 了

```js
fiber.effectHooks?.forEach((effect, i) => {
  if (!effect.deps.length) {
    return
  }
  const needUpdate = effect.deps.some(
    (dep, index) => dep !== fiber.alternate.effectHooks[i].deps[index]
  )
  if (needUpdate) {
    effect.callback()
  }
})
```

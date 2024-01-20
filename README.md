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

## 16. action 支持非函数和提前检测 减少不必要的更新

目前我们的 action 只支持函数，我们可以把非函数的 action 转变成函数，这样处理逻辑就一致了，通过数据减少逻辑的复杂度

```js
stateHook.queue.push(typeof action === 'function' ? action : () => action)
```

尝试一下

```js
function handleClick() {
  setCount(c => c + 1)
  setBar('bar11')
}
```

没有问题

但点击第三下的时候，bar 依然是 bar11，就不用执行更新逻辑了，所以我们需要判断是否需要执行更新逻辑

我们在 push 前判断一下

```js
const eagerState = typeof action === 'function' ? action(stateHook.state) : action
if (eagerState === stateHook.state) {
  return
}
stateHook.queue.push(typeof action === 'function' ? action : () => action)
```

这样就完成了

## 01. 实现最简 mini-react

本期目标：在页面呈现 app

![](./img/000.png)

### vdom 写死，dom 渲染写死

这个就比较简单了，我们先新建一个 `index.html` 文件，里面有一个 `<div id="root"></div>`，再引入 `main.js`

```html
<div id="root"></div>
<script type="module" src="./main.js"></script>
```

基于小步走的思维，在 `main.js` 中随便输出一个，看是否引入成功

```js
console.log('hello world')
```

验证是没有问题的

然后我们就可以实现功能了：

```js
const dom = document.createElement('div')
dom.id = 'app'
document.querySelector('#root').appendChild(dom)

const testNode = document.createTextNode('')
testNode.nodeValue = 'app'
dom.appendChild(testNode)
```

这样我们在页面中就渲染出 `app` 了

![](./img/001.png)

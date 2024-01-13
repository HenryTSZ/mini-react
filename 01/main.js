//#region
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').appendChild(dom)

// const testNode = document.createTextNode('app')
// dom.appendChild(testNode)
//#endregion

//#region
// const textVDom = {
//   type: 'TEXT_NODE',
//   props: {
//     nodeValue: 'app',
//     children: []
//   }
// }

// const vdom = {
//   type: 'div',
//   props: {
//     id: 'app',
//     children: [textVDom]
//   }
// }

// const dom = document.createElement(vdom.type)
// dom.id = vdom.props.id
// document.querySelector('#root').appendChild(dom)

// const testNode = document.createTextNode(textVDom.props.nodeValue)
// dom.appendChild(testNode)
//#endregion

//#region
// const createTextNode = text => {
//   return {
//     type: 'TEXT_NODE',
//     props: {
//       nodeValue: text,
//       children: []
//     }
//   }
// }

// const createElement = (type, props, children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children
//     }
//   }
// }

// const textVDom = createTextNode('app')
// const App = createElement('div', { id: 'app' }, textVDom)

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').appendChild(dom)

// const testNode = document.createTextNode(textVDom.props.nodeValue)
// dom.appendChild(testNode)
//#endregion

//#region
// const createTextNode = text => {
//   return {
//     type: 'TEXT_NODE',
//     props: {
//       nodeValue: text,
//       children: []
//     }
//   }
// }

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map(child => (typeof child === 'string' ? createTextNode(child) : child))
//     }
//   }
// }

// const App = createElement('div', { id: 'app' }, 'app')

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').appendChild(dom)

// const testNode = document.createTextNode('')
// testNode.nodeValue = App.props.children[0].props.nodeValue
// dom.appendChild(testNode)
//#endregion

//#region
// const createTextNode = text => {
//   return {
//     type: 'TEXT_NODE',
//     props: {
//       nodeValue: text,
//       children: []
//     }
//   }
// }

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map(child => (typeof child === 'string' ? createTextNode(child) : child))
//     }
//   }
// }

// const App = createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
// console.log('🚀 ~ App:', App)

// const render = (el, container) => {
//   const dom =
//     el.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(el.type)

//   Object.keys(el.props).forEach(key => {
//     if (key !== 'children') {
//       dom[key] = el.props[key]
//     }
//   })

//   el.props.children.forEach(child => {
//     render(child, dom)
//   })

//   container.appendChild(dom)
// }

// render(App, document.querySelector('#root'))
//#endregion

//#region
// const createTextNode = text => {
//   return {
//     type: 'TEXT_NODE',
//     props: {
//       nodeValue: text,
//       children: []
//     }
//   }
// }

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map(child => (typeof child === 'string' ? createTextNode(child) : child))
//     }
//   }
// }

// const App = createElement('div', { id: 'app' }, 'hi', ' ', 'mini', '-', 'react')
// console.log('🚀 ~ App:', App)

// const render = (el, container) => {
//   const dom =
//     el.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(el.type)

//   Object.keys(el.props).forEach(key => {
//     if (key !== 'children') {
//       dom[key] = el.props[key]
//     }
//   })

//   el.props.children.forEach(child => {
//     render(child, dom)
//   })

//   container.appendChild(dom)
// }

// const ReactDOM = {
//   createRoot(container) {
//     return {
//       render(el) {
//         render(el, container)
//       }
//     }
//   }
// }

// ReactDOM.createRoot(document.querySelector('#root')).render(App)
//#endregion

//#region
import ReactDOM from './core/ReactDom.js'
import App from './App.js'

ReactDOM.createRoot(document.querySelector('#root')).render(App)
//#endregion

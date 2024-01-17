let nextWork = null
let rootDom = null

const render = (el, container) => {
  const work = {
    ...el,
    parent: {
      dom: container
    }
  }
  nextWork = work
  rootDom = work
}

requestIdleCallback(callback)

function callback(IdleDeadline) {
  let deadline = IdleDeadline.timeRemaining()
  while (deadline > 0 && nextWork) {
    // do something
    nextWork = runUnitOfWork(nextWork)
    deadline = IdleDeadline.timeRemaining()
  }

  if (!nextWork && rootDom) {
    submit()
    rootDom = null
  }

  requestIdleCallback(callback)
}

function submit() {
  submitWork(rootDom)
}

function submitWork(work) {
  if (!work) {
    return
  }
  console.log('🚀 ~ submitWork ~ work:', work)
  work.parent.dom.appendChild(work.dom)
  submitWork(work.child)
  submitWork(work.sibling)
}

const createDom = type =>
  type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)

const updateProps = (work, dom) => {
  console.log('🚀 ~ updateProps ~ work:', work)
  Object.keys(work.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = work.props[key]
    }
  })
}

const initChildren = work => {
  console.log('🚀 ~ initChildren ~ work:', work)
  let prevChild = null
  work.props.children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: work,
      child: null,
      sibling: null
    }
    if (!index) {
      work.child = newWork
    } else {
      prevChild.sibling = newWork
    }
    prevChild = newWork
  })
}

function runUnitOfWork(work) {
  console.log('🚀 ~ runUnitOfWork ~ work:', work)
  // if (typeof work.type === 'function') {
  //   const realWork = work.type(work.props)
  //   for (const key in realWork) {
  //     if (Object.hasOwnProperty.call(realWork, key)) {
  //       console.log('🚀 ~ runUnitOfWork ~ key:', key, realWork[key])
  //       work[key] = realWork[key]
  //     }
  //   }
  // }
  const dom = (work.dom = createDom(work.type))

  updateProps(work, dom)

  initChildren(work)

  if (work.child) {
    return work.child
  }

  if (work.sibling) {
    return work.sibling
  }

  return work.parent?.sibling
}

const createTextNode = text => {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string' || typeof child === 'number') {
          return createTextNode(child)
          // } else if (typeof child === 'object') {
          //   return createTextNode(JSON.stringify(child))
        } else if (typeof child.type === 'function') {
          const extracted = child.type(child.props)
          console.log('🚀 ~ createElement ~ extracted:', extracted)
          return extracted
        } else {
          return child
        }
      })
    }
  }
}

export default {
  render,
  createElement
}

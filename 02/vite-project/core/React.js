let nextWork = null
let rootDom = null
let currentRoot = null

const render = (el, container) => {
  const work = {
    ...el,
    parent: {
      dom: container
    },
    effectTag: 'add'
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
    currentRoot = rootDom
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
  if (work.effectTag === 'add') {
    work.parent.dom.appendChild(work.dom)
  } else if (work.effectTag === 'update') {
    updateProps(work, work.dom, work.alternate?.props)
  }
  submitWork(work.child)
  submitWork(work.sibling)
}

const createDom = type =>
  type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)

const updateProps = (work, dom, oldProps = {}) => {
  console.log('🚀 ~ updateProps ~ work:', work)
  const { props } = work
  // old has, new not
  Object.keys(oldProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in props)) {
        dom.removeAttribute(key)
      }
    }
  })
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      if (props[key] !== oldProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()
          dom.addEventListener(eventType, props[key])
          dom.removeEventListener(eventType, oldProps[key])
        } else {
          dom[key] = props[key]
        }
      }
    }
  })
}

const initChildren = work => {
  console.log('🚀 ~ initChildren ~ work:', work)
  let oldWork = work.alternate?.child
  let prevChild = null
  work.props.children.forEach((child, index) => {
    if (typeof child.type === 'function') {
      const realChild = child.type(child.props)
      for (const key in realChild) {
        if (Object.hasOwnProperty.call(realChild, key)) {
          child[key] = realChild[key]
        }
      }
    }

    const sameType = oldWork?.type === child.type
    let newWork
    if (sameType) {
      newWork = {
        type: child.type,
        props: child.props,
        parent: oldWork.parent,
        child: null,
        sibling: null,
        dom: oldWork.dom,
        alternate: oldWork,
        effectTag: 'update'
      }
    } else {
      newWork = {
        type: child.type,
        props: child.props,
        parent: work,
        child: null,
        sibling: null,
        effectTag: 'add'
      }
    }

    if (oldWork) {
      oldWork = oldWork.sibling
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

  if (typeof work.type === 'function') {
    const realWork = work.type(work.props)
    for (const key in realWork) {
      if (Object.hasOwnProperty.call(realWork, key)) {
        console.log('🚀 ~ runUnitOfWork ~ key:', key, realWork[key])
        work[key] = realWork[key]
      }
    }
  }

  let dom = work.dom
  if (!dom) {
    dom = work.dom = createDom(work.type)
    updateProps(work, dom)
  }

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
  if (typeof type === 'object') {
    return type
  }
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string' || typeof child === 'number') {
          return createTextNode(child)
          // } else if (typeof child === 'object') {
          //   return createTextNode(JSON.stringify(child))
          // } else if (typeof child.type === 'function') {
          //   const extracted = child.type(child.props)
          //   console.log('🚀 ~ createElement ~ extracted:', extracted)
          //   return extracted
        } else {
          return child
        }
      })
    }
  }
}

const update = () => {
  const work = {
    ...currentRoot,
    parent: {
      dom: currentRoot.parent.dom
    },
    alternate: currentRoot,
    effectTag: 'update'
  }
  nextWork = work
  rootDom = work
}

export default {
  update,
  render,
  createElement
}

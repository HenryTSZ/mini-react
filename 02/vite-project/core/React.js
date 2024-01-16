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
  work.parent.dom.appendChild(work.dom)
  submitWork(work.child)
  submitWork(work.sibling)
}

const createDom = type =>
  type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)

const updateProps = (work, dom) => {
  Object.keys(work.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = work.props[key]
    }
  })
}

const initChildren = work => {
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
  const dom = (work.dom = createDom(work.type))

  updateProps(work, dom)

  initChildren(work)

  work.parent.dom.appendChild(work.dom)

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
      children: children.map(child => (typeof child === 'string' ? createTextNode(child) : child))
    }
  }
}

export default {
  render,
  createElement
}

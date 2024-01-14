let nextWork = null

const render = (el, container) => {
  const work = {
    ...el,
    parent: {
      dom: container
    }
  }
  nextWork = work
}

requestIdleCallback(callback)
function callback(IdleDeadline) {
  let deadline = IdleDeadline.timeRemaining()
  while (deadline > 0) {
    // do something
    nextWork = runUnitOfWork(nextWork)
    deadline = IdleDeadline.timeRemaining()
  }
  requestIdleCallback(callback)
}

function runUnitOfWork(work) {
  if (!work) return

  const dom = (work.dom =
    work.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(work.type))

  Object.keys(work.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = work.props[key]
    }
  })

  let prevChild = null
  work.props.children.forEach((child, index) => {
    if (!index) {
      work.child = child
    } else {
      child.siblings = prevChild
    }
    child.parent = work
    prevChild = child
  })

  // container.appendChild(dom)
  work.parent.dom.appendChild(work.dom)

  if (work.child) {
    return work.child
  }

  if (work.siblings) {
    return work.siblings
  }

  return work.parent?.siblings
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

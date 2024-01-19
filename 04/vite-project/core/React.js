function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // children: children.map(child => {
      //   const isTextNode = typeof child === 'string' || typeof child === 'number'
      //   return isTextNode ? createTextNode(child) : child
      // })
      children: children.reduce((acc, child) => {
        if (child === false) {
          return acc
        }
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return acc.concat(isTextNode ? createTextNode(child) : child)
      }, [])
    }
  }
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextWorkOfUnit = wipRoot
}

// work in progress
let wipRoot = null
let currentRoot = null
let nextWorkOfUnit = null
let deleteList = []
let currentFc = null

function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = null
    }

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(wipRoot.child)
  deleteDom()
  currentRoot = wipRoot
  wipRoot = null
  deleteList = []
}

function deleteDom(list = deleteList) {
  list.forEach(fiber => {
    if (fiber.dom) {
      fiber.dom.remove()
    } else {
      deleteDom([fiber.child])
    }
  })
}

function commitWork(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.dom) {
    if (fiber.effectType === 'add') {
      fiberParent.dom.append(fiber.dom)
    } else if (fiber.effectType === 'update') {
      updateProps(fiber.dom, fiber.props, fiber.alternate.props)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

function updateProps(dom, props, oldProps = {}) {
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

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber?.type === child.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectType: 'update'
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectType: 'add'
      }

      if (oldFiber) {
        deleteList.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })

  while (oldFiber) {
    deleteList.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  states = []
  stateIndex = 0

  currentFc = fiber
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    updateProps(dom, fiber.props)
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

function update() {
  console.log(currentFc)

  let currentRoot = currentFc
  return () => {
    console.log(currentRoot)

    wipRoot = {
      ...currentRoot,
      alternate: currentRoot
    }
    nextWorkOfUnit = wipRoot
  }
}

let states = []
let stateIndex = 0
function useState(initialState) {
  const currentRoot = currentFc
  const oldState = currentRoot.alternate?.states

  const stateHook = {
    state: oldState?.[stateIndex]?.state || initialState
  }

  states[stateIndex] = stateHook
  stateIndex++

  currentRoot.states = states

  const setState = action => {
    stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentRoot,
      alternate: currentRoot
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}

const React = {
  useState,
  update,
  render,
  createElement
}

export default React

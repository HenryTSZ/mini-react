const render = (el, container) => {
  const dom =
    el.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(el.type)

  Object.keys(el.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })

  el.props.children.forEach(child => {
    render(child, dom)
  })

  container.appendChild(dom)
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

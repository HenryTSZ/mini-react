const dom = document.createElement('div')
dom.id = 'app'
document.querySelector('#root').appendChild(dom)

const testNode = document.createTextNode('')
testNode.nodeValue = 'app'
dom.appendChild(testNode)

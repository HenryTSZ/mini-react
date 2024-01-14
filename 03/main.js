requestIdleCallback(callback)

let taskId = 0
function callback(IdleDeadline) {
  let deadline = IdleDeadline.timeRemaining()
  while (deadline > 0) {
    // do something
    console.log('callback', taskId)
    deadline = IdleDeadline.timeRemaining()
  }
  taskId++
  requestIdleCallback(callback)
}

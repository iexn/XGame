CanvasRenderingContext2D.prototype.xrect = function() {
  // 处理多余参数
  let args = []
  for (const i in arguments) {
    if (arguments.hasOwnProperty(i)) {
      args.push(arguments[i])
    }
  }
  
  let func = false
  if(Object.prototype.toString.call(args[0]) == "[object Function]") {
    func = args[0]
    args.shift()
  }
  
  // 开始绘图

  if(func) {
    this.beginPath()
    func.call(this)
  }

  this.rect.apply(this, args)

  if(func) {
    this.stroke()
  }
  
  return this
}
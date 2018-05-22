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

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) {r = w / 2;}
    if (h < 2 * r){ r = h / 2;}
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    this.closePath();
    return this;
}
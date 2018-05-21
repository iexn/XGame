require.config({
  paths: {
    CanvasApp: "./script/module/CanvasApp",
    CanvasExtends: "./script/module/CanvasExtends",
    Loader: "./script/module/Loader",
    Frames: "./script/module/Frames"
  }
});
require(["CanvasExtends"])
require(["CanvasApp", "Loader", "Frames"], function(Canvas, Loader, Frames) {
  console.log("资源加载中...")
  Loader.loading(function(residue, total) {
    console.log(total - residue + "/" + total)
  })
  Loader.loaded(init)
  Loader.setImage("button1", "../images/b3.png")
  Loader.setImage("button2", "../images/b14.png")

  function init() {
    console.log("资源加载完毕")
    setTimeout(function(Canvas, Loader, Frames) {
      start(Canvas, Loader, Frames)
      Loader.loaded(init)
    }, 500, Canvas, Loader, Frames)
  }

});

var ft = 0
var status = 0
function start(Canvas, Loader, Frames) {
  var command = main(Canvas, Loader)
  Frames.start(function(framesTime) {
    // console.log(typeof status , 1)
    switch(status) {
      case "1": command.enter(); break
    }
    ft = framesTime
  })
}

function main(Canvas, Loader) {
  var c = new Canvas();
  var cv = c.canvas;
  const context = cv.getContext("2d");
  
  function clear() {
    context.beginPath();
    context.clearRect(0, 0, cv.width, cv.height)
  }

  context.beginPath();
  context.rect(20, 20, 100, 100);
  context.strokeStyle='red';
  context.stroke();

  function rect1() {
    clear()
    context.beginPath();
    context.drawImage(Loader.image("button1"), 20, 20, 100, 100);

    c.addEvent("change1", 20, 20, 100, 100, 1, function() {
      c.removeEvent("change1")
      status = 1
      rect2()
    })
  }

  function rect2() {
    clear()
    context.beginPath();
    context.drawImage(Loader.image("button2"), 100, 100, 200, 200);
    
    c.addEvent("change2", 100, 100, 200, 200, 1, function() {
      c.removeEvent("change2")
      rect1()
    })
  }

  function button(x, y, width, height, background) {
    context.xrect(function() {
      
    }, x, y, width, height)
  }

  /**
   * 获取随机颜色
   * @param {Int} opacity 透明度，0-1
   */
  function randomColor(opacity = 1) {
    return "rgba(" + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ", "+ opacity +")"
  }

  rect1()

  function enter() {
    context.xrect(function() {
      this.strokeStyle = 'yellow'
    },0,0,cv.width,cv.height)
  }

  return {
    enter: enter
  }
}
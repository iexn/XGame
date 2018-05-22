window.oncontextmenu = function() {
  return false
}
var docElm = document.documentElement;
if (docElm.requestFullscreen) {  

    docElm.requestFullscreen();  

}
require.config({
  paths: {
    CanvasApp: "./script/module/CanvasApp",
    CanvasExtends: "./script/module/CanvasExtends",
    Loader: "./script/module/Loader",
    Frames: "./script/module/Frames"
  }
});
require(["CanvasExtends"])

// 加载资源
require(["CanvasApp", "Loader", "Frames"], function(Canvas, Loader, Frames) {

  Loader.setImage("loading", "../images/13320820.jpg", function() {
    var c = new Canvas()

    function clear() {
      c.context.beginPath();
      c.context.clearRect(0, 0, c.canvas.width, c.canvas.height)
    }

    function loadingAni(residue, total, loaded = false) {

      clear()
      c.context.beginPath()
      c.context.drawImage(Loader.image("loading"), 0,0,c.canvas.width, c.canvas.height)

      c.context.beginPath()
      c.context.font = '16px "黑体"';
      c.context.fillStyle = '#ffffff';
      c.context.textAlign = 'center';
      if(loaded) {
        text = '加载完成，正在进入...'
      } else {
        text = '资源加载中'
      }
      c.context.fillText(text, c.canvas.width / 2, c.canvas.height - 100);

      c.context.beginPath()
      c.context.roundRect(c.canvas.width * 0.1, c.canvas.height - 90, c.canvas.width * 0.8, 10, 5)
      c.context.strokeStyle = "#333333"
      c.context.stroke()

      c.context.beginPath()
      c.context.roundRect(c.canvas.width * 0.1, c.canvas.height - 90, c.canvas.width * 0.8 * ((total - residue) / total), 10, 5)
      c.context.fillStyle = "#0000ff"
      c.context.fill()
    }
    
    loadingAni(1,1)

    // 加载资源进度提示
    console.log("资源加载中...")
    Loader.loading(function(residue, total) {
      loadingAni(residue, total)
      console.log(total - residue + "/" + total)
    })
    Loader.loaded(init)
    Loader.setImage("jk", "../images/jk2.png")
    Loader.setImage("jk2", "../images/13320677.jpg")
    Loader.setImage("gamemain", "../images/gamemain.png")
    Loader.setAudio("enterMusic", "../audios/333080708.ogg")
    Loader.setAudio("click", "../audios/click.mp3")
    Loader.setImage("company", "../images/company.png")

    // 资源加载完毕后执行后续逻辑
    function init(residue, total) {
      loadingAni(residue, total, true)
      console.log("资源加载完毕")
      setTimeout(function(c, Loader, Frames) {
        start(c, Loader, Frames)
        Loader.loaded(init)
      }, 500, c, Loader, Frames)
    }

  })

});

var ft = 0
var status = 0 // 状态场景
var s = 60 // 1秒为多少帧
var loadFt = 0

function setStatus(value) {
  status = value
  loadFt = 0
}

function start(c, Loader, Frames) {
  var command = main(c, Loader)
  
  Frames.start(function(framesTime) {

    if(framesTime == 60) {
      // 开始运行
      status = 1
    }

    switch(status) {
      case "1": 
        if(!loadFt) loadFt = framesTime
        command.enter1_input(loadFt); break
      case "2":
        if(!loadFt) loadFt = framesTime
        command.enter1_output(loadFt); break
      case "3": 
        if(!loadFt) loadFt = framesTime
        command.enter2_input(loadFt); break;
      case "4": 
        if(!loadFt) loadFt = framesTime
        command.enter2_output(loadFt); break
      case "5":
        if(!loadFt) loadFt = framesTime
        command.main(loadFt); break;
    }
    ft = framesTime
  })
}

/**
 * 获取随机颜色
 * @param {Int} opacity 透明度，0-1
 */
function randomColor(opacity = 1) {
  return "rgba(" + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ", "+ opacity +")"
}

function main(c, Loader) {
  const context = c.context;
  
  function clear() {
    context.beginPath();
    context.clearRect(0, 0, c.canvas.width, c.canvas.height)
  }


  // 进入函数及属性
  var isEnter = false
  var enterFt = 0

  function adinput(image, durationFt, drawImage, end) {
    // 第一次进入函数，赋初值
    if(!isEnter) {
      isEnter = true
      enterFt = ft
    }
    var dur = ft
    clear()
    c.context.beginPath()
    drawImage && drawImage.call(c.context, image)
    c.context.rect(0,0,c.canvas.width,c.canvas.height)
    c.context.fillStyle = "rgba(0,0,0," + (1 - (dur - enterFt) / durationFt) + ")"
    c.context.fill()
    if(dur > enterFt + durationFt + 1*s) {
      end && end.call(c.context)
      // 还原初值
      isEnter = false
      enterFt = 0
    }
  }

  function adoutput(image, durationFt, drawImage, end) {
    // 第一次进入函数，赋初值
    if(!isEnter) {
      isEnter = true
      enterFt = ft
    }
    var dur = ft
    clear()
    c.context.beginPath()
    drawImage && drawImage.call(c.context, image)
    c.context.rect(0,0,c.canvas.width,c.canvas.height)
    c.context.fillStyle = "rgba(0,0,0," + ((dur - enterFt - durationFt) / durationFt) + ")"
    c.context.fill()
    if(dur > enterFt + durationFt + durationFt + 1*s) {
      end && end.call(c.context)
      // 还原初值
      isEnter = false
      enterFt = 0
    }
  }

  return {
    enter1_input: function() {
      adinput(Loader.image('jk'), 40, function(image) {
        this.drawImage(image, Math.abs(c.canvas.width - 316) / 2, Math.abs(c.canvas.height - 150) / 2, 316, 150)
      }, function() {
        setStatus(2)
      })
    },
    enter1_output: function() {
      adoutput(Loader.image('jk'), 40, function(image) {
        this.drawImage(image, Math.abs(c.canvas.width - 316) / 2, Math.abs(c.canvas.height - 150) / 2, 316, 150)
      }, function() {
        setStatus(3)
      })
    },
    enter2_input: function() {
      adinput(Loader.image('company'), 40, function(image) {
        this.drawImage(image, Math.abs(c.canvas.width - 180) / 2, Math.abs(c.canvas.height - 150) / 2, 180, 150)
      }, function() {
        setStatus(4)
      })
    },
    enter2_output: function() {
      adoutput(Loader.image('company'), 40, function(image) {
        this.drawImage(image, Math.abs(c.canvas.width - 180) / 2, Math.abs(c.canvas.height - 150) / 2, 180, 150)
      }, function() {
        setStatus(5)
      })
    },
    main: function(loadFt) {
      var music = Loader.audio("enterMusic")
      music.loop = true
      music.play()
      if(ft - loadFt > 60) {
        adinput(Loader.image('gamemain'), 180, function(image) {
          this.drawImage(image, 0,0,c.canvas.width,c.canvas.height)
        }, function() {
          console.log("can be click")
          setStatus(0)
          c.addEvent("newGame", 0,0,200,200,1,function() {
            Loader.audio("click").currentTime = 0
            Loader.audio("click").play()
          })
        })
      }
    }
  }
}
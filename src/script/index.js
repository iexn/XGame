// window.oncontextmenu = function() {
//   return false
// }

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
    Loader.setImage("gamemain", "../images/gameenter.jpg")
    Loader.setAudio("bg_enter", "../audios/background_enter.ogg")
    Loader.setAudio("click", "../audios/click.mp3")
    Loader.setImage("company", "../images/company.png")
    Loader.setImage("title", "../images/title.png")
    Loader.setImage("box1", "../images/box1.png")
    Loader.setImage("box2", "../images/box2.png")
    Loader.setImage("box3", "../images/box3.png")
    Loader.setImage("default", "../images/default.png")
    Loader.setAudio("playing", "../audios/gelanzhisen.ogg")

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
      setStatus(1)
    }

    ft = framesTime
    if(!loadFt) loadFt = framesTime
    switch(status) {
      case "1": 
        command.enter1_input(loadFt); break
      case "2":
        command.enter1_output(loadFt); break
      case "3": 
        command.enter2_input(loadFt); break;
      case "4": 
        command.enter2_output(loadFt); break
      case "5":
        command.main(loadFt); break;
      case "5_2":
        command.main2(loadFt); break;
      case "6":
        command.enter_ready(loadFt); break;
      case "7":
        command.scene(loadFt); break;
      default: 
        loadFt = 0
    }
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


  var musicPlay = false
  var gameMap = []
  resetGameMap()
  function resetGameMap(line = 16, item = 8) {
    gameMap = []
    for(let y = 0; y < line; y++) {
      let lineGroup = []
      for(let x = 0; x < item; x++) {
        lineGroup.push(1)
      }
      gameMap.push(lineGroup)
    }
  }
  function drawGameMap(originX = 0, originY = 0, logic = function() {}) {
    const boxWidth = 40
    var baseline = 0
    var baseRow = 0
    var ylen = gameMap.length
    var xlen = gameMap[0].length

    for(let y = 0; y < ylen; y++) {
      this.context.beginPath()

      if(y % 2 == 1) {
        baseRow = 20
      } else {
        baseRow = 0
      }

      for(let x = 0; x < xlen; x++) {
        this.context.drawImage(Loader.image("box" + gameMap[y][x]), originX + boxWidth * x + baseRow, originY + boxWidth * y + baseline, boxWidth, boxWidth)
        if(!this.issetEvent(`box${y}${x}`)) {
          this.addEvent(`box${y}${x}`, originY + boxWidth * y + baseline + 6, originX + boxWidth * x + baseRow + 8, boxWidth - 16, boxWidth - 22, 1, function() {
            logic && logic(x, y)
          })
        }
      }

      baseline -= 20

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
      var music = Loader.audio("bg_enter")
      if(!musicPlay) {
        musicPlay = true
        Loader.audio("bg_enter").loop = true
        Loader.audio("bg_enter").play()
      }
      adoutput(Loader.image('company'), 40, function(image) {
        this.drawImage(image, Math.abs(c.canvas.width - 180) / 2, Math.abs(c.canvas.height - 150) / 2, 180, 150)
      }, function() {
        setStatus(5)
      })
    },
    main: function(loadFt) {
      if(ft - loadFt > 60) {
        adinput(Loader.image('gamemain'), 180, function(image) {
          this.drawImage(image, 
            image.width > c.canvas.width ? (image.width - c.canvas.width) / 2 - 40: 0, 0,
            c.canvas.width,image.height,
            0, 0, c.canvas.width, c.canvas.height
          )
          this.drawImage(Loader.image('title'), c.canvas.width * 0.2, 120, c.canvas.width * 0.6, c.canvas.width * 0.6 * 0.2)
        }, function() {
          setStatus("5_2")
        })
      }
    },
    main2: function(loadFt) {
      clear()
      c.context.beginPath()
      var image = Loader.image('gamemain')
      c.context.drawImage(image, 
        image.width > c.canvas.width ? (image.width - c.canvas.width) / 2 - 40: 0, 0,
        c.canvas.width,image.height,
        0, 0, c.canvas.width, c.canvas.height)
        
      // 游戏标题
      c.context.beginPath()
      c.context.drawImage(Loader.image('title'), c.canvas.width * 0.2, 120, c.canvas.width * 0.6, c.canvas.width * 0.6 * 0.2)

      // 开始游戏闪烁文字
      c.context.beginPath()
      c.context.font = '16px "黑体"';
      c.context.fillStyle = '#ffffff';
      c.context.textAlign = 'center';
      if(ft % 120 < 60) {
        text = '开始游戏'
      } else {
        text = ''
      }
      c.context.fillText(text, c.canvas.width / 2, c.canvas.height - 100);

      // 添加点击进入游戏事件
      if(!c.issetEvent("enterGame")) {
        c.addEvent("enterGame", 0, 0, c.canvas.width, c.canvas.height, 1, function() {
          setStatus("6")
          c.removeEvent("enterGame")
          Loader.audio("click").currentTime = 0
          Loader.audio("click").play()
        })
      }
    },
    enter_ready: function(loadFt) {
      if(ft - loadFt < s) {
        Loader.audio("bg_enter").volume = (1 - (ft - loadFt) / s)
      } else {
        musicPlay = false
        Loader.audio("bg_enter").loop = false
        Loader.audio("bg_enter").pause()
        Loader.audio("bg_enter").currentTime = 0
      }
      adoutput(Loader.image('gamemain'), s, function(image) {
        this.drawImage(image, 
          image.width > c.canvas.width ? (image.width - c.canvas.width) / 2 - 40: 0, 0,
          c.canvas.width,image.height,
          0, 0, c.canvas.width, c.canvas.height)
        this.drawImage(Loader.image('title'), c.canvas.width * 0.2, 120, c.canvas.width * 0.6, c.canvas.width * 0.6 * 0.2)
      }, function() {
        // 实现下一步内容
        resetGameMap()
        setStatus("7")
      })
    },
    scene: function(loadFt) {
      
      if(!musicPlay) {
        var music = Loader.audio("playing")
        music.loop = true
        music.play()
        musicPlay = true
      }

      clear()

      // 绘制棋盘，添加点击点响应逻辑
      drawGameMap.call(c, (c.canvas.width - (8 + 0.5) * 40) / 2, c.canvas.height - (20 + 0.5) * 16 - 100, function(x, y) {
        if(gameMap[y][x] == 1) {
          gameMap[y][x] = 2
        } else if(gameMap[y][x] == 2) {
          gameMap[y][x] = 3
        } else {
          console.log("can not click")
        }
      })
      
      if(ft - loadFt < 2*s) {
        c.context.beginPath()
        c.context.rect(0, 0, c.canvas.width, c.canvas.height)
        c.context.fillStyle = "rgba(0,0,0," + (1 - ((ft - loadFt) / (2*s))) + ")"
        c.context.fill()
      }

    }
  }
}
window.oncontextmenu = function() {
  return false;
};

require.config({
  paths: {
    CanvasApp: "./script/module/CanvasApp",
    CanvasExtends: "./script/module/CanvasExtends",
    Loader: "./script/module/Loader",
    Frames: "./script/module/Frames"
  }
});
require(["CanvasExtends"]);

// 加载资源
require(["CanvasApp", "Loader", "Frames"], function(Canvas, Loader, Frames) {
  Loader.setImage("loading", "../images/13320820.jpg", function() {
    var c = new Canvas();

    function clear() {
      c.context.beginPath();
      c.context.clearRect(0, 0, c.canvas.width, c.canvas.height);
    }

    function loadingAni(residue, total, loaded = false) {
      clear();
      c.context.beginPath();
      c.context.drawImage(
        Loader.image("loading"),
        0,
        0,
        c.canvas.width,
        c.canvas.height
      );

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#ffffff";
      c.context.textAlign = "center";
      if (loaded) {
        text = "加载完成，正在进入...";
      } else {
        text = "资源加载中";
      }
      c.context.fillText(text, c.canvas.width / 2, c.canvas.height - 100);

      c.context.beginPath();
      c.context.roundRect(
        c.canvas.width * 0.1,
        c.canvas.height - 90,
        c.canvas.width * 0.8,
        10,
        5
      );
      c.context.strokeStyle = "#333333";
      c.context.stroke();

      c.context.beginPath();
      c.context.roundRect(
        c.canvas.width * 0.1,
        c.canvas.height - 90,
        c.canvas.width * 0.8 * ((total - residue) / total),
        10,
        5
      );
      c.context.fillStyle = "#0000ff";
      c.context.fill();
    }

    loadingAni(1, 1);

    // 加载资源进度提示
    console.log("资源加载中...");
    Loader.loading(function(residue, total) {
      loadingAni(residue, total);
      console.log(total - residue + "/" + total);
    });
    Loader.loaded(init);
    Loader.setAudio("playing", "../audios/gelanzhisen.ogg");
    Loader.setAudio("bg_enter", "../audios/background_enter.ogg");
    Loader.setAudio("click", "../audios/click.mp3");
    Loader.setImage("jk", "../images/jk2.png");
    Loader.setImage("jk2", "../images/13320677.jpg");
    Loader.setImage("gamemain", "../images/gameenter.jpg");
    Loader.setImage("company", "../images/company.png");
    Loader.setImage("title", "../images/title.png");
    Loader.setImage("box1", "../images/box1.png");
    Loader.setImage("box2", "../images/box2.png");
    Loader.setImage("box3", "../images/box3.png");
    Loader.setImage("default", "../images/default.png");

    // 资源加载完毕后执行后续逻辑
    function init(residue, total) {
      loadingAni(residue, total, true);
      console.log("资源加载完毕");
      setTimeout(
        function(c, Loader, Frames) {
          start(c, Loader, Frames);
          Loader.loaded(init);
        },
        500,
        c,
        Loader,
        Frames
      );
    }
  });
});

var ft = 0;
var status = 0; // 状态场景
var s = 60; // 1秒为多少帧
var loadFt = 0;

function setStatus(value) {
  status = value;
  loadFt = 0;
}

function start(c, Loader, Frames) {
  var command = main(c, Loader);

  Frames.start(function(framesTime) {
    if (framesTime == 60) {
      // 开始运行
      setStatus(7);
    }

    ft = framesTime;
    if (!loadFt) loadFt = framesTime;
    switch (status) {
      case "1":
        command.enter1_input(loadFt);
        break;
      case "2":
        command.enter1_output(loadFt);
        break;
      case "3":
        command.enter2_input(loadFt);
        break;
      case "4":
        command.enter2_output(loadFt);
        break;
      case "5":
        command.main(loadFt);
        break;
      case "5_2":
        command.main2(loadFt);
        break;
      case "6":
        command.enter_ready(loadFt);
        break;
      case "7":
        command.scene(loadFt);
        break;
      case "8":
        command.gameRun(loadFt);
        break;
      default:
        loadFt = 0;
    }
  });
}

/**
 * 获取随机颜色
 * @param {Int} opacity 透明度，0-1
 */
function randomColor(opacity = 1) {
  return (
    "rgba(" +
    ~~(Math.random() * 255) +
    ", " +
    ~~(Math.random() * 255) +
    ", " +
    ~~(Math.random() * 255) +
    ", " +
    opacity +
    ")"
  );
}

function main(c, Loader) {
  const context = c.context;
  // 进入函数及属性
  var isEnter = false;
  var enterFt = 0;

  // 是否正在播放背景音乐
  var musicPlay = false;
  // 游戏棋盘地图二维数组
  var gameMap = [];
  // 当前正在行动的玩家  1 和 2
  var actPlayer = 1;
  // 当前回合数，初始为0
  var round = 1;
  // 手持棋子数
  var p1Chess = 0;
  var p2Chess = 0;
  // 初始化棋盘，防止报错
  resetGameMap();
  // 场外提示动画
  var tipAnimation = null;
  // 提示格子坐标
  var tipx = -1;
  var tipy = -1;
  // 格子宽度，应该是正方形
  const boxWidth = 40;

  function clear() {
    context.beginPath();
    context.clearRect(0, 0, c.canvas.width, c.canvas.height);
  }

  function adinput(image, durationFt, drawImage, end) {
    // 第一次进入函数，赋初值
    if (!isEnter) {
      isEnter = true;
      enterFt = ft;
    }
    var dur = ft;
    clear();
    c.context.beginPath();
    drawImage && drawImage.call(c.context, image);
    c.context.rect(0, 0, c.canvas.width, c.canvas.height);
    c.context.fillStyle =
      "rgba(0,0,0," + (1 - (dur - enterFt) / durationFt) + ")";
    c.context.fill();
    if (dur > enterFt + durationFt + 1 * s) {
      end && end.call(c.context);
      // 还原初值
      isEnter = false;
      enterFt = 0;
    }
  }

  function adoutput(image, durationFt, drawImage, end) {
    // 第一次进入函数，赋初值
    if (!isEnter) {
      isEnter = true;
      enterFt = ft;
    }
    var dur = ft;
    clear();
    c.context.beginPath();
    drawImage && drawImage.call(c.context, image);
    c.context.rect(0, 0, c.canvas.width, c.canvas.height);
    c.context.fillStyle =
      "rgba(0,0,0," + (dur - enterFt - durationFt) / durationFt + ")";
    c.context.fill();
    if (dur > enterFt + durationFt + durationFt + 1 * s) {
      end && end.call(c.context);
      // 还原初值
      isEnter = false;
      enterFt = 0;
    }
  }


  var drawGameBefore = []
  // 重置棋盘
  function resetGameMap(line = 16, item = 8) {
    gameMap = [];
    for (let y = 0; y < line; y++) {
      let lineGroup = [];
      for (let x = 0; x < item; x++) {
        lineGroup.push(1);
      }
      gameMap.push(lineGroup);
    }
    c.clearEvent();
    round = 1;
  }
  // 绘制棋盘，当点击棋盘点时回调函数执行方法
  function drawGameMap(originX = 0, originY = 0, logic = function() {}) {
    var baseline = 0;
    var baseRow = 0;
    var ylen = gameMap.length;
    var xlen = gameMap[0].length;

    for (let y = 0; y < ylen; y++) {
      this.context.beginPath();

      if (y % 2 == 1) {
        baseRow = 20;
      } else {
        baseRow = 0;
      }

      this.eventThrow = false;

      for (const i in drawGameBefore) {
        if (drawGameBefore.hasOwnProperty(i)) {
          this.context.drawImage.call(this.context, drawGameBefore[i])
        }
      }

      for (let x = 0; x < xlen; x++) {
        this.context.drawImage(
          Loader.image("box" + gameMap[y][x]),
          originX + boxWidth * x + baseRow,
          originY + boxWidth * y + baseline,
          boxWidth,
          boxWidth
        );
        if (!this.issetEvent(`box${y}${x}`)) {
          this.addEvent(
            `box${y}${x}`,
            originY + boxWidth * y + baseline + 6,
            originX + boxWidth * x + baseRow + 8,
            boxWidth - 16,
            boxWidth - 22,
            1,
            function() {
              logic && logic(x, y);
            }
          );
        }
      }

      baseline -= 20;
    }
  }


  /**
   * 创建提示框位置信息
   * @param {Int} x 格子横向索引
   * @param {Int} y 格子纵向索引
   * @param {Int} originX 初始棋盘x索引
   * @param {Int} originY 初始棋盘y索引
   * @param {Function} logic 点击提示框后进行的操作
   */
  function drawTipxy(x, y, originX = 0, originY = 0, logic = function() {}) {
    var baseRow = 0;
    var ylen = gameMap.length;
    var xlen = gameMap[0].length;
    var _this = this;

    this.context.beginPath();

    // 偶数行向右移动半个格子
    if (y % 2 == 1) {
      baseRow = 20;
    } else {
      baseRow = 0;
    }

    // 绘制提示框动画效果
    drawGameBefore.push(Loader.image("company"), originX + boxWidth * x + baseRow, originY + boxWidth * y + 6 - 20 * y, boxWidth * 10, boxWidth * 10)

    // 创建提示框交互操作
    if (!this.issetEvent(`tip`)) {
      this.addEvent(
        `tip`,
        originY + boxWidth * y + 6 - 20 * y,
        originX + boxWidth * x + baseRow + 8,
        boxWidth - 16,
        boxWidth - 22,
        2,
        function() {
          drawGameBefore = []
          _this.removeEvent(`tip`);
          logic && logic(x, y);
        }
      );
    }
  }

  return {
    enter1_input: function() {
      adinput(
        Loader.image("jk"),
        40,
        function(image) {
          this.drawImage(
            image,
            Math.abs(c.canvas.width - 316) / 2,
            Math.abs(c.canvas.height - 150) / 2,
            316,
            150
          );
        },
        function() {
          setStatus(2);
        }
      );
    },
    enter1_output: function() {
      adoutput(
        Loader.image("jk"),
        40,
        function(image) {
          this.drawImage(
            image,
            Math.abs(c.canvas.width - 316) / 2,
            Math.abs(c.canvas.height - 150) / 2,
            316,
            150
          );
        },
        function() {
          setStatus(3);
        }
      );
    },
    enter2_input: function() {
      adinput(
        Loader.image("company"),
        40,
        function(image) {
          this.drawImage(
            image,
            Math.abs(c.canvas.width - 180) / 2,
            Math.abs(c.canvas.height - 150) / 2,
            180,
            150
          );
        },
        function() {
          setStatus(4);
        }
      );
    },
    enter2_output: function() {
      var music = Loader.audio("bg_enter");
      if (!musicPlay) {
        musicPlay = true;
        Loader.audio("bg_enter").loop = true;
        Loader.audio("bg_enter").play();
      }
      adoutput(
        Loader.image("company"),
        40,
        function(image) {
          this.drawImage(
            image,
            Math.abs(c.canvas.width - 180) / 2,
            Math.abs(c.canvas.height - 150) / 2,
            180,
            150
          );
        },
        function() {
          setStatus(5);
        }
      );
    },
    main: function(loadFt) {
      if (ft - loadFt > 60) {
        adinput(
          Loader.image("gamemain"),
          180,
          function(image) {
            this.drawImage(
              image,
              image.width > c.canvas.width
                ? (image.width - c.canvas.width) / 2 - 40
                : 0,
              0,
              c.canvas.width,
              image.height,
              0,
              0,
              c.canvas.width,
              c.canvas.height
            );
            this.drawImage(
              Loader.image("title"),
              c.canvas.width * 0.2,
              120,
              c.canvas.width * 0.6,
              c.canvas.width * 0.6 * 0.2
            );
          },
          function() {
            setStatus("5_2");
          }
        );
      }
    },
    main2: function(loadFt) {
      clear();
      c.context.beginPath();
      var image = Loader.image("gamemain");
      c.context.drawImage(
        image,
        image.width > c.canvas.width
          ? (image.width - c.canvas.width) / 2 - 40
          : 0,
        0,
        c.canvas.width,
        image.height,
        0,
        0,
        c.canvas.width,
        c.canvas.height
      );

      // 游戏标题
      c.context.beginPath();
      c.context.drawImage(
        Loader.image("title"),
        c.canvas.width * 0.2,
        120,
        c.canvas.width * 0.6,
        c.canvas.width * 0.6 * 0.2
      );

      // 开始游戏闪烁文字
      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#ffffff";
      c.context.textAlign = "center";
      if (ft % 120 < 60) {
        text = "开始游戏";
      } else {
        text = "";
      }
      c.context.fillText(text, c.canvas.width / 2, c.canvas.height - 100);

      // 添加点击进入游戏事件
      if (!c.issetEvent("enterGame")) {
        c.addEvent(
          "enterGame",
          0,
          0,
          c.canvas.width,
          c.canvas.height,
          1,
          function() {
            setStatus("6");
            c.removeEvent("enterGame");
            Loader.audio("click").currentTime = 0;
            Loader.audio("click").play();
          }
        );
      }
    },
    enter_ready: function(loadFt) {
      if (ft - loadFt < s) {
        Loader.audio("bg_enter").volume = 1 - (ft - loadFt) / s;
      } else {
        musicPlay = false;
        Loader.audio("bg_enter").loop = false;
        Loader.audio("bg_enter").pause();
        Loader.audio("bg_enter").currentTime = 0;
      }
      adoutput(
        Loader.image("gamemain"),
        s,
        function(image) {
          this.drawImage(
            image,
            image.width > c.canvas.width
              ? (image.width - c.canvas.width) / 2 - 40
              : 0,
            0,
            c.canvas.width,
            image.height,
            0,
            0,
            c.canvas.width,
            c.canvas.height
          );
          this.drawImage(
            Loader.image("title"),
            c.canvas.width * 0.2,
            120,
            c.canvas.width * 0.6,
            c.canvas.width * 0.6 * 0.2
          );
        },
        function() {
          // 实现下一步内容
          resetGameMap();
          setStatus("7");
        }
      );
    },
    scene: function(loadFt) {
      if (!musicPlay) {
        var music = Loader.audio("playing");
        music.loop = true;
        music.play();
        musicPlay = true;
      }

      clear();

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("回合数：" + round, 80, 40);

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("玩家1棋子：" + p1Chess, 80, 60);

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("玩家2棋子：" + p2Chess, 80, 80);

      // 绘制棋盘，添加点击点响应逻辑
      drawGameMap.call(
        c,
        (c.canvas.width - (8 + 0.5) * 40) / 2,
        c.canvas.height - (20 + 0.5) * 16 - 100,
        function(x, y) {
          // 判断检查的格子是否越界
          function validNp(y, x) {
            return (
              x >= 0 &&
              x <= gameMapLengthX - 1 &&
              y >= 0 &&
              y <= gameMapLengthY - 1
            );
          }

          // 点击格子不能操作时执行动画
          function resAnimation() {}

          // 可以点击的格子执行动画
          function successAnimation(x, y, callback) {
            c.removeEvent(`tip`);

            tipAnimation = function() {
              drawTipxy.call(
                c,
                x,
                y,
                (c.canvas.width - (8 + 0.5) * 40) / 2,
                c.canvas.height - (20 + 0.5) * 16 - 100,
                function() {
                  tipAnimation = null;
                  callback && callback();
                }
              );
            };
          }

          // 如果点击格子状态为1，进行转换为2的操作
          if (gameMap[y][x] == 1) {
            // 判断不能点击数组
            var npPass = [];
            // 纵向长度
            var gameMapLengthY = gameMap.length;
            // 横向长度
            var gameMapLengthX = gameMap[0].length;

            // 待检查格子状态，添加到npPass中
            validNp(y, x - 1) && npPass.push(gameMap[y][x - 1]);
            validNp(y, x + 1) && npPass.push(gameMap[y][x + 1]);
            validNp(y - 1, x) && npPass.push(gameMap[y - 1][x]);
            validNp(y + 1, x) && npPass.push(gameMap[y + 1][x]);

            // 视觉偶数行
            if (y % 2 == 1) {
              validNp(y - 1, x + 1) && npPass.push(gameMap[y - 1][x + 1]);
              validNp(y + 1, x + 1) && npPass.push(gameMap[y + 1][x + 1]);
            } else {
              // 视觉奇数行

              validNp(y - 1, x - 1) && npPass.push(gameMap[y - 1][x - 1]);
              validNp(y + 1, x - 1) && npPass.push(gameMap[y + 1][x - 1]);
            }

            // 如果检测到周围有2状态的格子，操作失败
            if (npPass.indexOf(2) >= 0) {
              return resAnimation(1);
            } else {
              return successAnimation(x, y, function() {
                // 正常操作：回合数+1  玩家棋子+1  格子切换为2状态
                round % 2 == 1 ? p1Chess++ : p2Chess++;
                round++;
                gameMap[y][x] = 2;
              });
            }
          } else if (gameMap[y][x] == 2) {
            // 如果点击的格子为2状态，该状态为填充模式

            // 判断是否手中有棋子
            if (round % 2 == 1 && p1Chess > 0) {
              return successAnimation(x, y, function() {
                // 手中棋子-1，回合数+1，格子切换为3状态
                p1Chess--;
                round++;
                gameMap[y][x] = 3;

                // 改格子不再接收事件响应
                // TODO: 制作动画的话不能取消事件
                c.removeEvent(`box${y}${x}`);
              });
            } else if (round % 2 == 0 && p2Chess > 0) {
              return successAnimation(x, y, function() {
                p2Chess--;
                round++;
                gameMap[y][x] = 3;

                c.removeEvent(`box${y}${x}`);
              });
            } else {
              // 手中没有棋子不能填充

              // TODO: 怎样确定游戏继续还是结束游戏
              return resAnimation();
            }
          } else {
            // 如果为3状态，没有响应事件

            return resAnimation();
          }
        }
      );

      // 界面入场时（限制为2秒）由黑屏到白
      if (ft - loadFt < 2 * s) {
        c.context.beginPath();
        c.context.rect(0, 0, c.canvas.width, c.canvas.height);
        c.context.fillStyle =
          "rgba(0,0,0," + (1 - (ft - loadFt) / (2 * s)) + ")";
        c.context.fill();
        return;
      }

      // 界面入场完毕后跳转到8状态
      setStatus(8);
    },
    gameRun: function(loadFt) {
      clear();

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("回合数：" + round, 80, 40);

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("玩家1棋子：" + p1Chess, 80, 60);

      c.context.beginPath();
      c.context.font = '16px "黑体"';
      c.context.fillStyle = "#000000";
      c.context.textAlign = "center";
      c.context.fillText("玩家2棋子：" + p2Chess, 80, 80);

      tipAnimation && tipAnimation(loadFt);

      // 绘制棋盘，添加点击点响应逻辑
      drawGameMap.call(
        c,
        (c.canvas.width - (8 + 0.5) * 40) / 2,
        c.canvas.height - (20 + 0.5) * 16 - 100
      );

      c.eventThrow = true;
    }
  };
}

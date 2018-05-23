/**
 * 创建移动端canvas全屏画布
 */
(function(define) {
  function Canvas() {
    const body = document.body;
    while (body.hasChildNodes()) {
      body.removeChild(body.firstChild);
    }
    const canvas = document.createElement("canvas");
    const app = document.createElement("div");
    app.id = "app";
    const eb = document.createElement("div");
    eb.id = "event_box";
    canvas.width = app.style.width = window.innerWidth;
    canvas.height = app.style.height = window.innerHeight;

    app.appendChild(canvas);
    app.appendChild(eb);

    body.appendChild(app);

    const style = document.createElement("style");
    style.innerHTML =
      "\
    body{margin:0}\
    #app {position: relative}\
    #event_box{position:absolute;top:0;left:0;width:0;height:0}\
    #click1{position:absolute;width:80px;height:46px;top:12px;left:40px}";
    document.getElementsByTagName("head")[0].appendChild(style);

    this.eb = eb;
    this.canvas = canvas
    this.context = canvas.getContext("2d")
  }

  Canvas.prototype.addEvent = function(
    id,
    x,
    y,
    width,
    height,
    zindex,
    callback
  ) {
    var el = document.createElement("div");

    el.style.position = "absolute";
    el.style.top = x;
    el.style.left = y;
    el.style.width = width;
    el.style.height = height;
    el.style.zIndex = zindex;
    el.id = id;

    el.addEventListener("touchend", callback);
    this.eb.appendChild(el);
  };

  Canvas.prototype.removeEvent = function(id) {
    var el = document.getElementById(id);
    el.parentNode.removeChild(el);
  };
  
  Canvas.prototype.issetEvent = function(id) {
    var el = document.getElementById(id);
    return !!el
  }

  Canvas.prototype.clearEvent = function() {
    this.eb.innerHTML = ""
  }

  define("CanvasApp", [], function() {
    return Canvas;
  });
})(define);

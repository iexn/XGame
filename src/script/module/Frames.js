/**
 *
 * =========== xGame.Frames.js =============
 * * 有关帧数的操作模块，静态对象
 * * 基于 requestAnimationFrame 处理帧数方面的问题
 *
 *              -- 静态属性 --
 * 1. Frames.time:
 *    {Int} 从开始创建到当前时间帧数值
 * 2. Frames.frame:
 *    {Int} requestAnimationFrame调用次数 / 此值 = 1帧执行时间
 * 
 *              -- 静态函数 --
 * 1. Frames.start(callback):
 *    开始执行帧操作
 *    @param callback {Function} 每次requestAnimationFrame调用的回调函数
 *      > callback(framesTime)
 *      > @param framesTime {Int} 为当前执行到的Frames.time值
 *      > @return void
 *    @return this
 * 2. Frames.ready(module, func, params):
 *    每次调用前执行预加载的外部调用内容
 *    @param module {Object} 调用的模块
 *    @param func {String} 调用模块内的函数名称
 *    @param params {Array} 调用函数传递的参数数组
 *    @return this
 * 3. Frames.pause():
 *    暂停当前帧，恢复调用Frames.start
 *    @return this
 * =========================================
 *
 */
(function(define) {
  /** 内部访问属性 **/

  // 是否可以进行帧动作
  let run = false;

  // 每帧执行函数，参数为当前执行帧数
  let callback = null;

  // 加载外部执行方法
  const loadModule = [];

  /***************/

  // 帧数操作静态对象，向外抛出唯一对象。内部访问Frames变量名称
  const Frames = {};

  /** 抛出属性 **/

  // 记录当前requestAnimationFrame调用次数
  Frames.time = 0;

  // requestAnimationFrame调用多少次算1帧，至少为1
  Frames.frame = 1;

  /*****************/

  /** 内部访问函数 **/

  /**
   * 开始执行外部操作
   */
  function load() {
    for (const i in loadModule) {
      let module = loadModule[i];
      module.module[module.func](module.params);
    }
  }

  // 内部函数，不允许调用
  function requestAnimation() {
    requestAnimationFrame(requestAnimation);

    if (!run) {
      return false;
    }

    // 按例循环
    Frames.time++;
    load();

    if (Frames.time % Frames.frame == 0) {
      callback &&
        callback.call(
          Frames,
          (Frames.time - Frames.time % Frames.frame) / Frames.frame
        );
    }
  }

  /*****************/

  /** 抛出操作函数 **/

  /**
   * 执行函数，按设定的每帧开始执行
   */
  Frames.start = function(cb) {
    run = true;
    callback = cb;
    requestAnimation();
    return this;
  };

  /**
   * 准备执行的外部操作，当帧动画开始执行时，会按顺序逐一调用
   * @param {Object} module 加载实例
   * @param {String} func 执行方法名称
   * @param {Array} params 携带参数
   */
  Frames.ready = function(module, func, params) {
    Frames.loadModule.push({
      module: module,
      func: func,
      params: params
    });
    return this;
  };

  Frames.pause = function() {
    run = false;
    return this;
  };

  // 添加到require模块
  define("Frames", [], function() {
    return Frames;
  });
})(define);

/**
 * 
 * ========== xGame.Loader.js =============
 * * 资源控制和加载资源模块
 * * 资源主要为：图片、音频、视频
 * 
 *           -- 静态函数 --
 * 1. setImage(name, src, callback):
 *    开始加载图片
 *    @param name {String} 为图片设置一个标识
 *    @param src {String} 图片链接
 *    @param callback {Function} 加载成功后执行函数，this指向盖图片
 *      > callback(name)
 *      > @param name {String} 该图片的标识
 *      > @return this
 *    @return this
 * 2. setAudio(name, src, callback):
 *    开始加载音频
 *    @param name {String} 为音频设置一个标识
 *    @param src {String} 音频链接
 *    @param callback {Function} 加载成功后执行函数，this指向盖音频
 *      > callback(name)
 *      > @param name {String} 该音频的标识
 *      > @return this
 *    @return this
 * 3. setVideo(name, src, callback): 
 *    开始加载视频
 *    @param name {String} 为视频设置一个标识
 *    @param src {String} 视频链接
 *    @param callback {Function} 加载成功后执行函数，this指向盖视频
 *      > callback(name)
 *      > @param name {String} 该视频的标识
 *      > @return this
 *    @return this
 * 4. image(name):
 *    获取图片
 *    @param name {String} 图片标识
 *    @return 返回图片资源。如果资源不存在或正在加载中，返回false
 * 5. audio(name):
 *    获取音频
 *    @param name {String} 音频标识
 *    @return 返回音频资源。如果资源不存在或正在加载中，返回false
 * 6. video(name):
 *    获取视频
 *    @param name {String} 视频标识
 *    @return 返回视频资源。如果资源不存在或正在加载中，返回false
 * ========================================
 * 
 */
(function(define) {
  const images = {};
  const audios = {};
  const videos = {};
  var loading = 0
  var loadedCallback = null
  var loadingCallback = null
  var maxLoading = 0
  /**
   * 加载资源
   * @param {String} ResourceType 资源类型，支持值：img|audio|video
   * @param {String} src 资源地址
   * @param {Function} success 如果加载成功，执行此回调函数
   */
  function create(ResourceType, src, success) {
    loading++
    if(loading > maxLoading) {
      maxLoading = loading
    }

    const res = document.createElement(ResourceType);

    res.src = src;

    res.oncanplaythrough = res.onload = e => {
      loading--
      if(loading == 0) {
        var loadedcb = loadedCallback
        var loadingcb = loadingCallback
        loadedCallback = null
        loadingCallback = null
        loadingcb && loadingcb(loading, maxLoading)
        loadedcb && loadedcb()
      } else {
        loadingCallback && loadingCallback(loading, maxLoading)
      }
      success && success.call(res);
    };

    res.onerror = e => {
      console.log(name + "加载失败。地址：" + src);
      // res.src = src + "?rand=" + Math.random();
    };
  }

  /**
   * 获取资源。
   * 获取资源时可能存在延时问题不能正确加载，请在加载成功回调中执行部分操作
   * @param {Object} resource 获取的资源对象，支持的对象为：images、audios、videos
   * @param {String} name 标记资源名称
   */
  function extract(resource, name) {
    if (!resource.hasOwnProperty(name)) {
      console.warn("资源不存在");
      return false;
    }

    if (typeof resource[name] == "string") {
      console.log("资源正在加载中");
      return false;
    }

    return resource[name];
  }

  /**
   * 资源加载，保存
   * TODO: 资源缓存，刷新页面依然存在
   */
  const Loader = {};

  /**
   * 待加载数据加载中执行函数，每次设置仅执行一次
   * @param {Function} callback 执行函数
   */
  Loader.loading = function(callback) {
    loadingCallback = callback
  }

  /**
   * 待加载数据全部加载完毕后执行函数，每次设置仅执行一次
   * @param {Function} callback 执行函数
   */
  Loader.loaded = function(callback) {
    loadedCallback = callback
  }

  /**
   * 加载图片资源
   * @param {String} name 资源名
   * @param {String} src 资源链接
   * @param {Function} cb 成功加载回调函数，this指向资源
   */
  Loader.setImage = function(name, src, cb) {
    images[name] = src;
    create("img", src, function() {
      images[name] = this;
      cb && cb.call(this, name);
    });

    return this;
  };

  /**
   * 获取图片
   * @param {String} name 资源名
   */
  Loader.image = function(name) {
    return extract(images, name);
  };

  /**
   * 加载声音资源
   * @param {String} name 资源名
   * @param {String} src 资源链接
   * @param {Function} cb 成功加载回调函数，this指向资源
   */
  Loader.setAudio = function(name, src, cb) {
    audios[name] = src;
    create("audio", src, function() {
      audios[name] = this;
      cb && cb.call(this, name);
    });

    return this;
  };

  /**
   * 获取声音
   * @param {String} name 资源名
   */
  Loader.audio = function(name) {
    return extract(audios, name);
  };

  /**
   * 加载视频资源
   * @param {String} name 资源名
   * @param {String} src 资源链接
   * @param {Function} cb 成功加载回调函数，this指向资源
   */
  Loader.setVideo = function(name, src, cb) {
    videos[name] = src;

    create("video", src, function() {
      videos[name] = this;
      cb && cb.call(this, name);
    });

    return this;
  };

  /**
   * 获取视频
   * @param {String} name 资源名
   */
  Loader.video = function(name) {
    return extract(videos, name);
  };

  define("Loader", [], function() {
    return Loader;
  });
})(define);

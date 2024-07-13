/**
 * 文件依赖: 1、common/css/mycimtheme.css
 *        2、jquery
 * Created by cinaous on 2017/8/4.
 */
var i5k = {
  root: "/mycim2",
  ajax: function (url, callback, data) {
    if (url.indexOf("http://")) url = i5k.root + url;
    $.ajax({
      url: url,
      data: data || {},
      dataType: "json",
      success: callback,
    });
  },
  showMessage: function (msg, callback) {
    var msgp = document.createElement("div");
    document.body.appendChild(msgp);
    msgp.className = "i5k-message-success icon icon-sentiment_satisfied";
    msgp.innerHTML = msg || i18n.labels.LBL_SAVE_SUCCESS;
    setTimeout(function () {
      msgp.classList.add("i5k-message-hidden");
      callback && callback();
    }, 2000);
  },
};
//NodeList.prototype.forEach=Array.prototype.forEach;

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

//@author Lizhijie
(function ($) {
  // 支持ajax请求
  var MyCim = {
    version: "1.0", // 永远是1.0的版本号
    root: "/mycim2", // 项目根目录
    timeout: 1000 * 300, // 超时时间 300s
  };

  function disposeQueryUrl(url) {
    if (url.indexOf(MyCim.root + "/") === -1) {
      url = MyCim.root + "/" + url;
    }
    return url;
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function processOpt(opt) {
    opt.type = "post";
    opt.dataType = opt.dataType || "json";
    opt.charset = opt.charset || "utf-8";
    opt.contentType = "application/json; charset=utf-8";
    opt.timeout = MyCim.timeout;
    opt.url = disposeQueryUrl(opt.url);
    // 从localstorage中获取useid和facilityRrn
    var userId = window.localStorage.getItem("systemInfo.userId");
    var facilityRrn = window.localStorage.getItem("systemInfo.facilityRrn");
    if (!systemInfo) {
      // 这个对象会自动生成，在head标签里，可能防止localstorage不能用
      var systemInfo = {};
    } else {
      userId = systemInfo.userId || userId;
      facilityRrn = systemInfo.facilityRrn || facilityRrn;
    }

    var request = {
      head: {
        appId: "",
        userId: userId,
        facilityRrn: facilityRrn,
        method: opt.requestMethod,
        format: opt.dataType,
        charset: opt.charset,
        timestamp: new Date().getTime(),
        version: "",
        transactionId: uuidv4(),
      },
      body: opt.data,
    };
    //封装请求，将上面的数据格式stringify，传给jQuery的data
    opt.data = JSON.stringify(request);
    return opt;
  }

  function callbackMethod(opt) {
    var cb = {
      error: function (XMLHttpRequest, textStatus, errorThrown) {},
      success: function (data, textStatus) {},
    };
    if (opt.error) {
      cb.error = opt.error;
    }
    if (opt.success) {
      cb.success = opt.success;
    }
    return cb;
  }

  //创建新的ajax方法
  $.http = function (opt) {
    opt = processOpt(opt); // 处理data数据
    var cb = callbackMethod(opt); // 回调函数
    var _opt = $.extend(opt, {
      // 相当于object.assign
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // 这个是jQuery原生的error函数
        var msg =
          opt.requestMethod +
          " " +
          XMLHttpRequest.status +
          "," +
          XMLHttpRequest.statusText;
        cb.error(msg); // 一般也用不到这个方法，这个error是自己写的方法，要么就是空函数
      },
      success: function (data, textStatus) {
        var msg = "";
        if (data.head.code === "10000") {
          cb.success(data.body, textStatus, data.head);
        } else {
          // 通信成功了，但是不是完整的请求
          if (!data.head.subMessage || data.head.subMessage === "N/A") {
            msg = "[" + data.head.message + "]" + data.head.subMessage;
          } else {
            msg = data.head.subMessage;
          }
          cb.error(msg); // 如果没有正确的返回结果，执行error方法
        }
      },
    });
    $._ajax ? $._ajax(_opt) : $.ajax(_opt); // 这里的ajax是jQuery中的ajax，原生ajax在ext中变成这个了
  };
  // 扩展一个表单提交方法，因为异步无法进行表单提交，需要进行同步请求
  $.extend({
    // 默认请求post，args存入需要上传的字段
    standardPost: function (url, target, args) {
      var body = $(document.body),
        form = $("<form method='post' id='tmpForm'></form>"),
        input;
      form.attr({ action: url, target: target || "" });
      if (args instanceof Array) {
        $.each(args, function (key, value) {
          input = $("<input type='hidden'>");
          input.attr({ name: key });
          input.val(value);
          form.append(input);
        });
      }
      form.appendTo(document.body);
      form.submit();
      document.body.removeChild($("#tmpForm").get(0));
    },
  });
  $.extend({
    // 转换为json对象用于传输数据
    convertToJson: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  });
})(jQuery);

// ext的新ui下的tab模式, 一些公共函数
var mycimUtils = {
  trim: function trim(inString) {
    var l, i, g, t, r;
    inString = Cstr(inString);
    l = inString.length;
    t = inString;
    for (i = 0; i < l; i++) {
      g = inString.substring(i, i + 1);
      if (g == " ") {
        t = inString.substring(i + 1, l);
      } else {
        break;
      }
    }
    r = t;
    l = t.length;
    //Delete the spaces back
    for (i = l; i > 0; i--) {
      g = t.substring(i, i - 1);
      if (g == " ") {
        r = t.substring(i - 1, 0);
      } else {
        break;
      }
    }
    return r;
  },
};
/**
 * 配合Vue食用，否则没啥用，jquery监听新开的iframe的load事件
 * @param cb
 */
var listenIframesLoadingEvent = function (cb) {
  if (!window.Vue) return console.warn("Vue can't installed correct");
  if (typeof cb === "function") {
    Vue.nextTick(function () {
      $("iframe").off("load");
      $("iframe").on("load", cb);
    });
  }
};

// 初始化方法，一些全局设置等
function init() {
  // 全局弹出框的ui，仿ext
  try {
    layer.config({
      extend: "mycimskin/style.css",
      skin: "mycim-layer",
      anim: 5,
      shade: [0.7, "#fff"],
    });
  } catch (e) {
    console.warn("layer is not defined");
  }

  // 让card-body充满可见部分
  var parentHeight = $(".mycim-card[full]").parent().height();
  var cardHeaderHeight =
    $(".mycim-card[full] .mycim-card-header").height() || 0;
  var toolBarHeight = $(".mycim-card[full] .mycim-tool-bar").height() || 0;
  var btnBarHeight = $(".mycim-card[full] .mycim-btn-bar").height() || 0;
  // console.log(parentHeight, cardHeaderHeight, toolBarHeight)
  $(".mycim-card[full] .mycim-card-body").height(
    parentHeight - cardHeaderHeight - toolBarHeight - btnBarHeight
  );
}

function createTab(tabInfo) {
  // 找到vm
  for (var _window = window, vm; !_window.vm; ) {
    _window = window.parent;
  }
  vm = _window.vm;
  vm.createTabFromIframe(tabInfo);
}

function createTabInMainPage(tabInfo) {
  window.top.vm.createdTab(tabInfo);
}

/**
 * 封装layer的loading
 * @returns {Class.index}
 */
function loading(timeout) {
  // 封装loading
  if (!timeout) timeout = 10000;
  var time1 = setTimeout(function () {
    layer.msg("请求超时");
  }, timeout);
  var time2 = setTimeout(function () {
    layer.msg("持续加载中...");
    clearTimeout(time2);
  }, timeout / 3);
  return layer.open({
    type: 3,
    icon: 2,
    time: timeout,
    end: function () {
      clearTimeout(time1);
      clearTimeout(time2);
    },
  });
}

/**
 * 关闭layer的loading
 * @param index loading的index
 */
function closeLoading(index) {
  if (!index) {
    layer.closeAll();
  } else {
    layer.close(index);
  }
}

/** @format */

var MyCim = MyCim || {
  version: "1.0",
  //
  root: "/mycim2",
  // 超时时间 300s
  timeout: 1000 * 300
}
Ext.Ajax.timeout = MyCim.timeout
MyCim.notify = (function () {
  var msgCt
  var loadMarsk

  function createBox(t, s) {
    return '<div class="msg"><h3>' + t + "</h3><p>" + s + "</p></div>"
  }

  function processMessage(msg, args) {
    msg = myCIMMsg(msg, args)
    return msg
  }

  return {
    msg: function (title, format) {
      format = processMessage(format)
      if (!msgCt) {
        msgCt = Ext.DomHelper.insertFirst(document.body, { id: "msg-div" }, true)
      }
      var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1))
      var m = Ext.DomHelper.append(msgCt, createBox(title, s), true)
      m.hide()
      m.slideIn("b").ghost("b", { delay: 2000, remove: true })
    },
    showWaiting: function () {
      if (Ext.getBody() != null) {
        loadMarsk = new Ext.LoadMask(Ext.getBody(), {
          msg: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING
        })
        loadMarsk.show()
      }
      // Ext.MessageBox.show({
      //     msg: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING,
      //     progressText: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING,
      //     width: 300,
      //     wait: true,
      //     waitConfig: {interval: 100},
      //     icon: 'ext-mb-loading'
      // });
    },
    hideWaiting: function () {
      // Ext.MessageBox.hide();
      loadMarsk.hide()
    },
    alert: function (msg, fn) {
      msg = processMessage(msg)
      if (!fn) {
        fn = function (optional) {
          console.log(optional)
        }
      }
      // Ext.MessageBox.alert(i18n.labels.LBS_WARNING, msg, fn);
      Ext.MessageBox.show({
        title: i18n.labels.LBS_PROMPT,
        msg: msg,
        width: 300,
        buttons: Ext.Msg.OK,
        fn: fn,
        icon: Ext.window.MessageBox.WARNING
      })
    },
    alertWithArgs: function (msg, args, fn) {
      msg = processMessage(msg, args)
      if (!fn) {
        fn = function (optional) {
          console.log(optional)
        }
      }
      Ext.MessageBox.show({
        title: i18n.labels.LBS_PROMPT,
        msg: msg,
        width: 300,
        buttons: Ext.Msg.OK,
        fn: fn,
        icon: Ext.window.MessageBox.WARNING
      })
    },
    confirm: function (msg, fn) {
      msg = processMessage(msg)
      Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, msg, fn)
    },
    alertParent: function (msg, fn) {
      msg = processMessage(msg)
      window.parent.frames.MyCim.notify.alert(msg, fn)
    },
    showParentWaiting: function () {
      window.parent.frames.MyCim.notify.showWaiting()
    },
    hideParentWaiting: function () {
      window.parent.frames.MyCim.notify.hideWaiting()
    },
    init: function () {}
  }
})()
Ext.mask = (function () {
  return {
    showBodyMask: function () {
      if (Ext.getBody() != null) {
        Ext.getBody().mask()
      }
    },
    hideBodyMask: function () {
      if (Ext.getBody().isMasked()) {
        Ext.getBody().unmask()
      }
    }
  }
})()
Ext.storage = (function () {
  var storage

  function checkStorage() {
    // check storage
    if (!window.localStorage) {
      Ext.MessageBox.alert(
        i18n.labels.LBS_PROMPT,
        "This browser does NOT support localStorage,</br>" + "Please update your browser to IE8+ or Chrome."
      )
    } else {
      if (!storage) {
        storage = window.localStorage
      }
    }
    return !!window.localStorage
  }

  return {
    put: function (key, value) {
      if (checkStorage()) {
        storage.setItem(key, value)
      }
    },
    remove: function (key) {
      if (checkStorage()) {
        storage.removeItem(key)
      }
    },
    get: function (key) {
      if (checkStorage()) {
        return storage.getItem(key)
      }
    },
    getAll: function () {
      if (checkStorage()) {
        var allMsg = ""
        for (var i = 0; i < storage.length; i++) {
          //aler-t(storage.key(i)+ " : " + storage.getItem(storage.key(i)));
          allMsg += storage.key(i) + " : " + storage.getItem(storage.key(i)) + "</br>"
        }
        Ext.MessageBox.alert(i18n.labels.LBS_CONFIRM, allMsg)
      }
    },
    clear: function () {
      if (checkStorage()) {
        storage.clear()
      }
    }
  }
})()
Ext.themeName = "classic"
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
Ext.BLANK_IMAGE_URL = "/mycim2/vendor/extjs/resources/images/default/tree/s.gif"
// Ext.data.proxy.Ajax.override({
//   actionMethods: {
//     create: "POST",
//     read: "GET",
//     update: "POST",
//     destroy: "POST"
//   }
// })
// 控制 ext 请求 遮罩层显示
Ext.Ajax.on("beforerequest", function (conn, options, eOpts) {
  if (options == null || options.proxy == null || options.proxy.queryMask == null || options.proxy.queryMask) {
    MyCim.notify.showWaiting()
  }
})

// 控制 ext 请求 遮罩层关闭
Ext.Ajax.on("requestcomplete", function (conn, resp, options) {
  if (options == null || options.proxy == null || options.proxy.queryMask == null || options.proxy.queryMask) {
    MyCim.notify.hideWaiting()
  }
})
Ext.Ajax.on("requestexception", function (conn, resp, options) {
  if (options == null || options.proxy == null || options.proxy.queryMask == null || options.proxy.queryMask) {
    MyCim.notify.hideWaiting()
  }
})

// 针对 store load 方法增加 requestMethod方法支持
Ext.override(Ext.data.AbstractStore, {
  load: function (options) {
    var me = this,
      operation

    options = Ext.apply(
      {
        action: "read",
        filters: me.filters.items,
        sorters: me.getSorters()
      },
      options
    )
    me.lastOptions = options

    operation = new Ext.data.Operation(options)

    var requestMethod = me.proxy.requestMethod
    if (me.fireEvent("beforeload", me, operation) !== false) {
      me.loading = true
      me.proxy.requestMethod = options.requestMethod || requestMethod
      me.proxy.read(operation, me.onProxyLoad, me)
    }
    me.proxy.requestMethod = requestMethod

    return me
  }
})

// 重写 proxy servlet 的处理 response方法
Ext.override(Ext.data.proxy.Server, {
  processResponse: function (success, operation, request, response, callback, scope) {
    var me = this,
      reader,
      result

    if (success === true) {
      reader = me.getReader()

      // Apply defaults to incoming data only for read operations.
      // For create and update, there will already be a client-side record
      // to match with which will contain any defaulted in values.
      reader.applyDefaults = operation.action === "read"

      result = reader.read(me.extractResponseData(response))

      if (result.success !== false) {
        //see comment in buildRequest for why we include the response object here
        Ext.apply(operation, {
          response: response,
          resultSet: result
        })

        operation.commitRecords(result.records)
        operation.setCompleted()
        operation.setSuccessful()
      } else {
        operation.setException(result.message)
        me.fireEvent("exception", this, response, operation)
      }
    } else {
      me.setException(operation, response)
      me.fireEvent("exception", this, response, operation)
    }

    //this callback is the one that was passed to the 'read' or 'write' function above
    if (typeof callback == "function") {
      callback.call(scope || me, operation)
    }

    me.afterRequest(request, success)
  }
})

Ext.override(Ext.panel.Header, {
  initComponent: function () {
    this.title = myCIMLabel(this.title)
    this.callParent(arguments)
  }
})

Ext.override(Ext.form.field.Base, {
  initComponent: function () {
    this.fieldLabel = myCIMLabel(this.fieldLabel)
    if (this.allowBlank !== undefined && !this.allowBlank) {
      this.afterLabelTextTpl = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
    }
    this.callParent(arguments)
  }
})

Ext.override(Ext.button.Button, {
  initComponent: function () {
    this.text = myCIMLabel(this.text)
    this.callParent(arguments)
  }
})

Ext.override(Ext.grid.column.Column, {
  initComponent: function () {
    this.header = myCIMLabel(this.header)
    this.callParent(arguments)
  }
})

/**
 * Sets the read only state of this field.
 */
Ext.override(Ext.form.field.Base, {
  setReadOnly: function (readOnly) {
    var me = this,
      inputEl = me.inputEl
    readOnly = !!readOnly
    me.readOnly = readOnly
    if (inputEl) {
      inputEl.dom.readOnly = readOnly
      if (readOnly) {
        inputEl.addCls("x-form-readonly")
      } else {
        inputEl.removeCls("x-form-readonly")
      }
    } else if (me.rendering) {
      me.setReadOnlyOnBoxReady = true
    }
    me.fireEvent("writeablechange", me, readOnly)
  }
})
/**
 * Enable text selectionF
 */
Ext.override(Ext.grid.View, { enableTextSelection: true })

Ext.override(Ext.data.Connection, {
  onComplete: function (request, xdrResult) {
    var me = this,
      options = request.options,
      result,
      success,
      response,
      responseData
    try {
      result = me.parseStatus(request.xhr.status)
    } catch (e) {
      // in some browsers we can't access the status if the readyState is not 4, so the request has failed
      result = {
        success: false,
        isException: false
      }
    }

    var showMessage = false

    if (!options.proxy) {
      showMessage = true
    }

    success = me.isXdr ? xdrResult : result.success
    var msg = ""
    if (success) {
      // 请求成功 - 200
      response = me.createResponse(request)
      me.fireEvent("requestcomplete", me, response, options)

      responseData = Ext.decode(response.responseText)
      if (responseData.head.code == "10000") {
        if (responseData.head.subMessage) {
          msg = responseData.head.subMessage
          if (msg == "N/A") {
            msg = i18n.msgs.MSG_SUCCESS
          }
          // proxy 不show消息
          if (showMessage) {
            MyCim.notify.msg(i18n.labels.LBL_OPERATION_PROMPT, msg)
          }
        }
        Ext.callback(options.success, options.scope, [responseData.body, options, responseData.head])
      } else {
        success = false
        if (!responseData.head.subMessage || responseData.head.subMessage == "N/A") {
          msg = "[" + responseData.head.message + "]" + responseData.head.subMessage
        } else {
          msg = responseData.head.subMessage
        }

        response.status = responseData.head.code
        response.statusText = msg

        MyCim.notify.alert(msg, function (btnId) {
          if (btnId) {
            Ext.callback(options.failure, options.scope, [responseData.head, options])
          }
        })
      }
    } else {
      // 请求失败 - 404等 非200
      if (result.isException || request.aborted || request.timedout) {
        response = me.createException(request)
      } else {
        response = me.createResponse(request)
      }
      me.fireEvent("requestexception", me, response, options)
      msg = options.requestMethod + " " + response.status + "," + response.statusText
      responseData = {
        subCode: response.status,
        subMessage: response.statusText
      }

      MyCim.notify.alert(msg, function (btnId) {
        if (btnId) {
          Ext.callback(options.failure, options.scope, [responseData, options])
        }
      })
    }
    // 代理模式走 callback方法处理
    response.responseText = Ext.encode(responseData.body || {})
    Ext.callback(options.callback, options.scope, [options, success, response])
    delete me.requests[request.id]
    return response
  }
})
// 封装Ext的请求数据
Ext.Ajax.on("beforerequest", function (conn, options, eOpts) {
  options.headers = {
    "Content-Type": "application/json",
    Authorization:
      "JSESSIONID=AF359177663800D9A33E1640395BB964; TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJMQU5HVUFHRSI6IkNOIiwiVVNFUlJSTiI6MjAwLCJVU0VSSUQiOiJBRE1JTiIsIkZBQ0lMSVRZUlJOIjozNTM5NzYsIlVVSUQiOiI0MTFiMWQ0Ny1mYWM4LTQ3ODQtYWY0Yi00MDhlZmQ3MzYxZGEiLCJleHAiOjE3MjA2MDk5OTJ9.AsQhgZBs8e2DU94KkVSdSA6ukzR82ym_lCG-Oan4tEw"
  }
  options.method = "get"
  options.timeout = MyCim.timeout
  options.url = disposeUrl(options.url)

  var userId = window.localStorage.getItem("systemInfo.userId")
  var facilityRrn = window.localStorage.getItem("systemInfo.facilityRrn")

  if (!systemInfo) {
    var systemInfo = {
      userId: "ADMIN",
      facilityRrn: 353976,
      root: "/mycim2",
      version: 202407101648
    }
  }

  if (systemInfo) {
    userId = systemInfo.userId ? systemInfo.userId : userId
    facilityRrn = systemInfo.facilityRrn ? systemInfo.facilityRrn : facilityRrn
  }

  var requestMethod

  // 普通Request请求
  requestMethod = options.requestMethod

  // proxy 代理请求
  if (!requestMethod && options.proxy) {
    requestMethod = options.proxy.requestMethod
  }

  // form 表单请求
  if (!requestMethod) {
    requestMethod = options.scope.requestMethod
  }

  options.requestMethod = requestMethod

  var request = {
    head: {
      appId: "",
      userId: userId,
      facilityRrn: facilityRrn,
      method: requestMethod,
      format: options.dataType ? options.dataType : "json",
      charset: options.charset ? options.charset : "utf-8",
      timestamp: new Date().getTime(),
      version: "",
      transactionId: uuidv4()
    },
    body: options.params
  }
  options.params = Ext.encode(request)
})

// 重写Submit success处理方法
Ext.override(Ext.form.action.Submit, {
  onSuccess: function (response) {
    var form = this.form,
      success = true,
      result = response
    form.afterAction(this, success)
  }
})

function disposeUrl(url) {
  // if (url.indexOf(MyCim.root + "/") === -1) {
  //   url = MyCim.root + "/" + url;
  // }
  return url
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
;(function ($) {
  //备份jquery的ajax方法
  var _ajax = $.ajax

  function processOpt(opt) {
    // opt.type = "post";
    opt.dataType = opt.dataType || "json"
    opt.charset = opt.charset || "utf-8"
    opt.contentType = "application/json; charset=utf-8"
    opt.timeout = MyCim.timeout

    opt.url = disposeUrl(opt.url)

    var userId = window.localStorage.getItem("systemInfo.userId")
    var facilityRrn = window.localStorage.getItem("systemInfo.facilityRrn")

    if (!systemInfo) {
      var systemInfo = {}
    }

    if (systemInfo) {
      userId = systemInfo.userId || userId
      facilityRrn = systemInfo.facilityRrn || facilityRrn
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
        transactionId: uuidv4()
      },
      body: opt.data
    }
    //封装请求
    opt.data = JSON.stringify(request)
    return opt
  }

  function backupMethod(opt) {
    var fn = {
      error: function (XMLHttpRequest, textStatus, errorThrown) {},
      success: function (data, textStatus) {}
    }
    if (opt.error) {
      fn.error = opt.error
    }
    if (opt.success) {
      fn.success = opt.success
    }
    return fn
  }

  $._ajax = function (opt) {
    _ajax(opt)
  }

  //重写jquery的ajax方法
  $.ajax = function (opt) {
    opt = processOpt(opt)

    var fn = backupMethod(opt)

    if (!opt.errorAlert && opt.errorAlert !== false) {
      opt.errorAlert = true
    }
    var errorAlert = opt.errorAlert

    if (!opt.successMsg) {
      opt.successMsg = false
    }
    var successMsg = opt.successMsg

    var _opt = $.extend(opt, {
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        var msg = opt.requestMethod + " " + XMLHttpRequest.status + "," + XMLHttpRequest.statusText
        MyCim.notify.alert(msg, function (btnId) {
          if (btnId) {
            try {
              // 关闭loading 遮罩层
              CloseLoadingDiv()
            } catch (e) {
              // 防止未开启,导致关闭失败
            }
            if (fn.error) {
              fn.error(XMLHttpRequest, textStatus, errorThrown)
            }
          }
        })
      },
      success: function (data, textStatus) {
        var msg = ""
        if (data.head.code === "10000") {
          if (successMsg) {
            if (data.head.subMessage && data.head.subMessage !== "N/A") {
              msg = data.head.subMessage
            } else {
              msg = i18n.msgs.MSG_SUCCESS
            }
            MyCim.notify.msg(i18n.labels.LBL_OPERATION_PROMPT, msg)
          }
          fn.success(data.body, textStatus, data.head)
        } else {
          if (!data.head.subMessage || data.head.subMessage === "N/A") {
            msg = "[" + data.head.message + "]" + data.head.subMessage
          } else {
            msg = data.head.subMessage
          }
          if (errorAlert) {
            MyCim.notify.alert(msg, function (btnId) {
              if (btnId) {
                if (opt.callback) {
                  opt.callback(data.head)
                }
              }
            })
          } else {
            if (opt.callback) {
              opt.callback(data.head)
            }
          }
        }
      }
    })
    _ajax(_opt)
  }
})(jQuery)

initLabels()

MyCim.domUtils = (function () {
  function buildForm(url, method) {
    if (!method) {
      method = "post"
    }

    return Ext.DomHelper.append(
      Ext.getBody(),
      {
        tag: "form",
        method: method,
        action: url,
        target: "_self",
        cls: "x-hidden"
      },
      true
    )
  }

  function addParams(form, name, value) {
    Ext.DomHelper.append(form.dom, {
      tag: "input",
      name: name,
      value: value,
      type: "hidden"
    })
  }

  function submitAndRemove(fd) {
    fd.dom.submit()
    Ext.removeNode(fd.dom)
  }

  return {
    /**
     *
     * @param url 请求地址
     * @param method 请求方式 post or get. 默认post
     * @param params 参数: form.getValues() ,[{name:name1,value:value1},{name:name2,value:value2}]形式
     * */
    buildForm: function (url, method, params) {
      var fd = buildForm(url, method)

      if (!params) {
        params = []
      }

      if (params instanceof Array) {
        $.each(params, function (index, param) {
          addParams(fd, param.name, param.value)
        })
      } else if (params instanceof Object) {
        for (var property in params) {
          addParams(fd, property, params[property])
        }
      }
      return fd
    },
    /**
     *
     * @param url 请求地址
     * @param method 请求方式 post or get. 默认post
     * @param params 参数: form.getValues() ,[{name:name1,value:value1},{name:name2,value:value2}]形式
     * */
    buildFormAndSubmit: function (url, params, method) {
      var fd = buildForm(url, method, params)
      submitAndRemove(fd)
    },
    submitAndRemove: function (fd) {
      submitAndRemove(fd)
    }
  }
})()

// 打印请求
MyCim.print = (function () {
  return {
    /**
     *
     * @param url 请求打印地址
     * @param params 请求参数
     * @param calback 回调方法
     */
    send: function (url, params, calback) {
      url = url + "?"

      if (params instanceof Array) {
        $.each(params, function (index, param) {
          url = url + param.name + "=" + param.value + "&"
        })
      } else if (params instanceof Object) {
        for (var property in params) {
          url = url + property + "=" + params[property] + "&"
        }
      }

      url = url.substr(0, url.length - 1)

      var fd = Ext.DomHelper.append(Ext.getBody(), {
        tag: "iframe",
        id: "printIframe",
        style: "border 0px none;scrollbar:true;visibility:hidden",
        src: url,
        height: "100%",
        width: "100%"
      })

      Ext.EventManager.on("printIframe", "load", function () {
        var data = fd.contentDocument.documentElement.innerText
        var responseData = {}
        try {
          responseData = Ext.decode(data)
        } catch (e) {
          responseData.Version = ""
          responseData.Status = "Faulted"
          responseData.Status = "Faulted"
          responseData.WaitStatus = "Faulted"
          responseData.Validated = false
          responseData.Messages = [
            {
              Text: data
            }
          ]
        }
        Ext.removeNode(fd)
        Ext.callback(calback, this, [responseData])
      })
    }
  }
})()
//每一个列都会出现鼠标悬浮上去显示内容
/**
 * //适用于Extjs4.x
 * @class Ext.grid.GridView
 * @override Ext.grid.GridView
 * GridPanel单元格不能选中复制问题
 * 单元格数据显示不完整 ,增加title 浮动提示信息
 */
Ext.override(Ext.grid.GridPanel, {
  afterRender: Ext.Function.createSequence(Ext.grid.GridPanel.prototype.afterRender, function () {
    /* 默认显示提示
            if (!this.cellTip) {
                return;
            }*/
    var view = this.getView()
    this.tip = new Ext.ToolTip({
      target: view.el,
      delegate: ".x-grid-cell-inner",
      trackMouse: true,
      renderTo: Ext.getBody(),
      listeners: {
        beforeshow: function updateTipBody(tip) {
          //取cell的值
          //fireFox  tip.triggerElement.textContent
          //IE  tip.triggerElement.innerText
          var tipText = tip.triggerElement.innerText || tip.triggerElement.textContent
          if (Ext.isEmpty(tipText) || Ext.isEmpty(tipText.trim())) {
            return false
          }

          tip.update(tipText)
        }
      }
    })
  })
})

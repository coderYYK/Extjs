var MyCim = MyCim || {
  version:"1.0"
};
MyCim.notify = function(){
    var msgCt;
    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('b').ghost("b", { delay: 2000, remove: true});
        },
        showWaiting: function() {
            Ext.MessageBox.show({
            msg: '数据处理中，请稍后....',
            progressText: '处理中...',
            width:300,
            wait:true,
            waitConfig: {interval:100},
            icon:'ext-mb-loading'
          });
        },
        hideWaiting: function() {
          Ext.MessageBox.hide();
        },
        alert: function(msg, fn) {
          Ext.MessageBox.alert("警告", msg, fn);
        },
        confirm: function(msg, fn) {
          Ext.MessageBox.confirm("确认", msg, fn);
        },
        alertParent: function(msg, fn) {
          window.parent.frames.MyCim.notify.alert(msg, fn);
        },
        showParentWaiting: function(msg, fn) {
          window.parent.frames.MyCim.notify.showWaiting();
        },
        hideParentWaiting: function(msg, fn) {
          window.parent.frames.MyCim.notify.hideWaiting();
        },
        init : function(){}
    };
}();
Ext.mask = function() {
  return {
    showBodyMask: function() {
      if(Ext.getBody()!=null) {Ext.getBody().mask();}
    },
    hideBodyMask: function() {
      if(Ext.getBody().isMasked()) {
        Ext.getBody().unmask();
      }
    }
  };
}();
Ext.storage = function(){
  var storage;
  function checkStorage() {// check storage
    if (!window.localStorage) {
      alert('This browser does NOT support localStorage,/n'
        + 'Please update your browser to IE8+ or Chrome.');
    } else {
      if(!storage) {storage = window.localStorage;}     
    }
    return !!window.localStorage;
  }
  return {
    put: function(key,value) {
      if(checkStorage()) {storage.setItem(key,value);}
    },
    remove: function(key) {
      if(checkStorage()) {storage.removeItem(key);}
    },
    get: function(key) {
      if(checkStorage()) {return storage.getItem(key);}
    },
    getAll:function() {
      if(checkStorage()) {
        for(var i=0;i<storage.length;i++){
           alert(storage.key(i)+ " : " + storage.getItem(storage.key(i)));
        }
      }
    },
    clear: function() {
      if(checkStorage()) {storage.clear();}
    }
  };
}();
Ext.themeName = 'classic';
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
Ext.BLANK_IMAGE_URL='/mycim2/app/common/js/extjs/resources/themes/images/default/tree/s.gif';
Ext.Ajax.timeout = 300000; // 5 minutes
Ext.data.proxy.Ajax.override({
    actionMethods: {
        create: 'POST',
        read: 'POST',
        update: 'POST',
        destroy: 'POST'
    }
});
Ext.Ajax.on('beforerequest',function(conn,options,eOpts) {
  MyCim.notify.showWaiting();
});
Ext.Ajax.on('requestcomplete',function(conn,resp,options) {
  MyCim.notify.hideWaiting();
  var sessionOut = resp.responseText.match('relogin.jsp');
  if (sessionOut!=null) {
    window.location.href='/mycim2/relogin.jsp';
    return false;
  }
  
  var responseJson = null;
  try {
    responseJson = Ext.JSON.decode(resp.responseText);
  } catch(e){
    //MyCim.notify.alert('服务器端异常或等待超时,请稍后重试!');
    return false;
  }
  
  // The store data
  var operation = options.operation;
  var successCallback = null;
  var errorCallback = null;
  if(operation!=null) {
    successCallback =  Ext.isFunction(operation.doSuccessCallback) ? operation.doSuccessCallback : Ext.emptyFn;
    errorCallback = Ext.isFunction(operation.doErrorCallback) ? operation.doErrorCallback : Ext.emptyFn;
    if (responseJson.success != null && !responseJson.success) {
      MyCim.notify.alert(responseJson.msg,errorCallback(responseJson.msg,operation,false));
      return false;
    } else {
      Ext.callback(successCallback(responseJson,operation,true),this);
      return true;
    }
  }
  return true;
});
Ext.Ajax.on('requestexception',function(conn,resp,options) {
  MyCim.notify.hideWaiting();
  MyCim.notify.alert('服务器端异常或等待超时,请稍后重试!');
});
Ext.override(Ext.form.field.Base,{
  initComponent:function(){ 
    if(this.allowBlank!==undefined && !this.allowBlank){
      this.afterLabelTextTpl = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    }
    this.callParent(arguments); 　　
    } 
});

/**
 * Sets the read only state of this field.
 */
Ext.override(Ext.form.field.Base,{
  setReadOnly: function(readOnly) {
    var me = this,
        inputEl = me.inputEl;
    readOnly = !!readOnly;
    me.readOnly = readOnly;
    if (inputEl) {
        inputEl.dom.readOnly = readOnly;
        if(readOnly) {
          inputEl.addCls('x-form-readonly');          
        } else {
          inputEl.removeCls('x-form-readonly');
        }
    } else if (me.rendering) {
        me.setReadOnlyOnBoxReady = true;
    }
    me.fireEvent('writeablechange', me, readOnly);
}
});
/**
 * Enable text selectionF
 */
Ext.override(Ext.grid.View, { enableTextSelection: true });
//每一个列都会出现鼠标悬浮上去显示内容
/**
 * //适用于Extjs4.x
 * @class Ext.grid.GridView
 * @override Ext.grid.GridView
 * GridPanel单元格不能选中复制问题
 * 单元格数据显示不完整 ,增加title 浮动提示信息
 */
Ext.override(Ext.grid.GridPanel, {
    afterRender : Ext.Function.createSequence(Ext.grid.GridPanel.prototype.afterRender,
        function() {
            /* 默认显示提示
            if (!this.cellTip) {
                return;
            }*/
            var view = this.getView();
            this.tip = new Ext.ToolTip({
                target: view.el,
                delegate : '.x-grid-cell-inner',
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function updateTipBody(tip) {
                        //取cell的值
                        //fireFox  tip.triggerElement.textContent
                        //IE  tip.triggerElement.innerText
                        var tipText = (tip.triggerElement.innerText || tip.triggerElement.textContent);
                        if (Ext.isEmpty(tipText) || Ext.isEmpty(tipText.trim()) ) {
                            return false;
                        }

                        tip.update(tipText);
                    }
                }
            });
        })
});
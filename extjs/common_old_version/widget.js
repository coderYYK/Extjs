/** Custom control for myCIM */
Ext.apply(Ext.form.VTypes, {
  daterange: function(val, field) {
    var date = field.parseDate(val);
    if (!date) { return false; }
    if (field.startDateField) {
      var start = Ext.getCmp(field.startDateField);
      if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
        start.setMaxValue(date);
        start.validate();
      }
    } else if (field.endDateField) {
      var end = Ext.getCmp(field.endDateField);
      if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
        end.setMinValue(date);
        end.validate();
      }
    }
    return true;
  }
});
Ext.define('MyCim.form.field.Text', {
  extend: 'Ext.form.field.Text',
  xtype: 'mycim.textfield',
  initComponent: function() {
    this.callParent(arguments);
  }
});
Ext.define('MyCim.form.field.Number', {
  extend: 'Ext.form.field.Number',
  xtype: 'mycim.numberfield',
  initComponent: function() {
    this.callParent(arguments);
  }
});
Ext.define('MyCim.form.field.Checkbox', {
  extend: 'Ext.form.field.Checkbox',
  xtype: 'mycim.checkbox',
  initComponent: function() {
    this.callParent(arguments);
  }
});
/** Auto trigger key in put text field */
Ext.define('MyCim.form.field.TriggerKeyText', {
  extend: 'Ext.form.field.Text',
  xtype: 'mycim.triggerkeytextfield',
  initComponent: function() {
    Ext.apply(this, {
      updateBuffer: 500,
      enableKeyEvents: true,
      listeners: {
        scope: this,
        keyup: this.onInputKeyUp,
        el: {
          click: function(e) {
            e.stopPropagation();
          }
        }
      }
    });
    this.updateTask = Ext.create('Ext.util.DelayedTask', this.doInputKeyUp, this);
    this.callParent(arguments);
  },
  onInputKeyUp: function(field, e) {
    var k = e.getKey();
    if (k == e.RETURN && field.isValid()) {
      e.stopEvent();
      return;
    }
    this.updateTask.delay(this.updateBuffer);
  },
  doInputKeyUp: Ext.emptyFn
});
Ext.define('MyCim.data.Model.ComboModel', {
  extend: 'Ext.data.Model',
  fields: [{
    type: 'string',
    name: 'key'
  }, {
    type: 'string',
    name: 'value'
  }, {
    type: 'string',
    name: 'data1Value'
  }, {
    type: 'string',
    name: 'data2Value'
  }]
});
Ext.define('MyCim.form.field.ComboBox', {
  extend: 'Ext.form.field.ComboBox',
  xtype: 'mycim.combobox',
  initComponent: function() {
    Ext.apply(this, {
      store: Ext.create('Ext.data.Store', {
        model: 'MyCim.data.Model.ComboModel',
        autoDestroy: true,
        queryMode: 'local',
        data: this.queryData()
      }),
      displayField: 'value',
      valueField: 'key',
      queryMode: 'local',
      typeAhead: true
    });
    this.callParent(arguments);
  },
  queryData: function() {
    var me = this;
    if (me.loadData != null) {
      return me.loadData;
    } else {
      return [];
    }
  }
});
Ext.define('MyCim.form.field.SearchField', {
  extend: 'Ext.form.field.Trigger',
  xtype: 'mycim.searchfield',
  popWidth: 660,
  popHeight: 380,
  params: [],
  multiRows: false,
  triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
  initComponent: function() {
    Ext.apply(this, {
      onTriggerClick: function() {
        var me = this;
        if (me.type == null || me.targetIds == null) {
          MyCim.notify.alert("type或targetIds属性未配置");
          return;
        } else {
          me.doTriggerClick();
        }
      }
    });
    this.callParent(arguments);
  },
  buildTargetIds: function(targetIds) {
    var me = this;
    var targetIdStr = '';
    var targetIdArray = targetIds.split("|");
    Ext.each(targetIdArray, function(targetId, index) {
      var field = me;
      var form = me.up("form");
      if (form != null) {
        field = form.getForm().findField(targetId);
        if (field == null) {
          field = me.up("form").down("#" + targetId);
        }
        if (field == null) {
          Ext.Msg.alert("元素" + targetId + "未定义!");
        }
        targetIdStr += field.inputId;
      } else {
        targetIdStr += field.inputId;
      }
      if (index < targetIdArray.length - 1) {
        targetIdStr += '|';
      }
    });
    return targetIdStr;
  },
  buildParams: function(params) {
    var me = this;
    var paramStr = '';
    Ext.each(params, function(param, index) {
    	if(param.indexOf(":") != -1 ){
    		paramSplit = param.split(':');
    		paramKey = paramSplit[0];
    		paramValueKey = paramSplit[1];
    		var paramField = me.up("form").getForm().findField(paramValueKey);
    		if (paramField == null) {
    			paramField = me.up("form").down("#" + paramValueKey);
    		}
    		if (paramField == null) {
    			Ext.Msg.alert(i18n_fld_parameter + paramValueKey + i18n_msg_Undefined);
    		} else {
    			var paramValue = paramField.getValue();
    			if (Ext.String.trim(paramValue).length > 0) {
    				paramStr += ("&" + paramKey + "=" + paramValue);
    			}
    		}
    	}else{
    		var paramField = me.up("form").getForm().findField(param);
    		if (paramField == null) {
    			paramField = me.up("form").down("#" + param);
    		}
    		if (paramField == null) {
    			Ext.Msg.alert(i18n_fld_parameter + param + i18n_msg_Undefined);
    		} else {
    			var paramValue = paramField.getValue();
    			if (Ext.String.trim(paramValue).length > 0) {
    				paramStr += ("&" + param + "=" + paramValue);
    			}
    		}
    	}
    });
    return paramStr;
  },
  doTriggerClick: function() {
	    var me = this;
	    var paramStr = me.buildParams(me.params);
	    var targetIds = me.buildTargetIds(me.targetIds);
	    var referceIds='';
	    if(typeof(me.up('form'))!="undefined"){
	    	if(me.up('form').getForm().findField('sysParaSetReferenceProgram')!=null){
	       	 referceIds = me.up('form').getForm().findField('sysParaSetReferenceProgram').inputId;
	       }
	    }
	    var callback = me.callback;
	    var callbakcClick = me.callbackClick;
	    me.doSearch(me.type, me.multiRows, targetIds,referceIds, callback,me.getValue(), paramStr, me.popWidth, me.popHeight, me.callbackClick);
	    
   },
   doSearch: function(type, multiRows, targetIds,referceIds,callback, value, paramStr, width, height, callbackClick) {
		if(callback !=null){
			 var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
	         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr+'&callback=1&referceIds='+referceIds;
		}else if(callbackClick != null){
			var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
	         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr+'&callbackClick='+callbackClick;
		}else{
			 var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
	         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr;
		}
	    window.open(url, 'poppage', 'toolbars=0, scrollbars=0, location=0, statusbars=0, menubars=0, resizable=1, width='
	            + width + ', height=' + height + '');
	}
});

Ext.define('MyCim.form.field.WflInfoField', {
  extend: 'MyCim.form.field.SearchField',
  xtype: 'mycim.wflinfofield',
  popHeight: 400,
  initComponent: function() {
    Ext.apply(this, {
      doTriggerClick: function() {
        var me = this;
        var targetIds = me.buildTargetIds(me.targetIds);
        var paramStr = me.buildParams(me.params);
        if (paramStr == '') {
          me.doSearch(me.type, me.multiRows, targetIds, me.getValue(), paramStr, me.popWidth, me.popHeight);
        } else {
          me.doSearchForWflInfo(me.type, targetIds, me.getValue(), paramStr, me.popWidth, me.popHeight);
        }
      }
    });
    this.callParent(arguments);
  },
  doSearchForWflInfo: function(type, targetIds, value, paramStr, width, height) {
    var url = '/mycim2/wflInfo.do?reqCode=initWflInfoGrid&type=' + type + '&targetIds=' + targetIds + paramStr;
    window.open(url, 'WflInfo_Window',
            'toolbars=0, scrollbars=0, location=no, statusbars=0, menubars=0, resizable=1, width=' + width
                    + ', height=' + height + '');
  }
});
Ext.define('MyCim.PagingToolbar', {
  extend: 'Ext.PagingToolbar',
  xtype: 'mycim.pagingtoolbar',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {
      displayInfo: true,
      items: me.getPageSizeItem(),
      plugins: new Ext.ux.ProgressBarPager()
    });
    this.callParent(arguments);
  },
  getPageSizeItem: function() {
    var me = this;
    return ['-', '&nbsp;&nbsp;', {
      itemId: 'pagesize',
      name: 'pagesize',
      xtype: 'mycim.combobox',
      allowBlank: false,
      forceSelection: true,
      scope: me,
      listeners: {
        scope: this,
        'select': me.doRefreshPage
      },
      value: me.store.pageSize + "",
      loadData: [{
        key: '10',
        value: '10/页'
      }, {
        key: '50',
        value: '50/页'
      }, {
        key: '100',
        value: '100/页'
      }, {
        key: '500',
        value: '500/页'
      }]
    }];
  },
  doRefreshPage: function() {
    var me = this;
    var pageSize = this.child('#pagesize').getValue();
    me.store.pageSize = pageSize;
    me.store.loadPage(1);
  }
});
Ext.define('MyCim.ExcelButton', {
  extend: 'Ext.SplitButton',
  xtype: 'mycim.excelbutton',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {
      text: '导出Excel',
      xtype: 'splitbutton',
      iconCls: 'iconCls_pageExcel',
      handler: function() {
        me.exportCurrentPage()
      },
      menu: [{
        text: '导出当前页',
        handler: function() {
          me.exportCurrentPage()
        }
      }, {
        text: '导出全部',
        handler: function() {
          me.exportFull()
        }
      }]
    });
    this.callParent(arguments);
  },
  exportCurrentPage: function() {
    var me = this, store = me.up("grid").store;
    me.exportExcel(me.url, store.currentPage, store.pageSize, store.proxy.extraParams);
  },
  exportFull: function() {
    var me = this, MAX_PAGE_SIZE = 65536, store = me.up("grid").store;
    me.exportExcel(me.url, 1, MAX_PAGE_SIZE, store.proxy.extraParams);
  },
  exportExcel: function(url, pageNo, pageSize, params) {
    MyCim.notify.showWaiting();
    var fd = Ext.get('frmDummy');
    if (!fd) {
      fd = Ext.DomHelper.append(Ext.getBody(), {
        tag: 'form',
        method: 'POST',
        id: 'frmDummy',
        action: url,
        target: '_self',
        name: 'frmDummy',
        cls: 'x-hidden',
        cn: [{
          tag: 'input',
          name: 'page',
          type: 'hidden',
          value: pageNo
        }, {
          tag: 'input',
          name: 'limit',
          type: 'hidden',
          value: pageSize
        }]
      }, true);
      for ( var key in params) {
        Ext.DomHelper.append(fd, {
          tag: 'input',
          name: key,
          type: 'hidden',
          value: params[key]
        });
      }
    }
    fd.dom.submit();
    fd.destroy();
    MyCim.notify.hideWaiting();
  }
});
Ext.define('MyCim.panel.Panel', {
  extend: 'Ext.panel.Panel',
  xtype: 'mycim.panel',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {});
    this.callParent(arguments);
  }
});
Ext.define('MyCim.form.Panel', {
  extend: 'Ext.form.Panel',
  xtype: 'mycim.form',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {});
    this.callParent(arguments);
  }
});
Ext.define('MyCim.window.SearchWindow', {
  extend: 'Ext.window.Window',
  xtype: 'mycim.window.SearchWindow',
  title: '查询条件',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {
      layout: 'fit',
      closable: false,
      collapsible: true,
      modal: true,
      items: [me.createForm()],
      buttons: [{
        text: '查询',
        iconCls: 'iconCls_magnifier',
        handler: me.doSearch
      }, {
        text: '关闭',
        iconCls: 'iconCls_cancel',
        handler: me.doHide
      }]
    });
    this.callParent(arguments);
  },
  createForm: Ext.emptyFn,
  doHide: function() {
    var btn = this;
    var win = btn.up("window");
    win.hide();
  },
  doSearch: function() {
  }
});
Ext.define('MyCim.window.FormWindow', {
  extend: 'Ext.window.Window',
  xtype: 'mycim.window.FormWindow',
  title: '信息设置',
  layout: 'fit',
  closable: false,
  collapsible: true,
  modal: true,
  buttons: [{
    text: '保存',
    itemId: 'saveBtn',
    iconCls: 'iconCls_accept',
    handler: function(btn) {
      var win = btn.up("window");
      win.doSave(win);
    }
  }, {
    text: '删除',
    itemId: 'deleteBtn',
    iconCls: 'iconCls_delete',
    handler: function(btn) {
      var win = btn.up("window");
      win.doDelete(win);
    }
  }, {
    text: '取消',
    iconCls: 'iconCls_cancel',
    handler: function(btn) {
      var win = btn.up("window");
      win.doHide(win);
    }
  }],
  initComponent: function() {
    var me = this;
    Ext.apply(this, {
      items: [me.createForm()]
    });
    this.callParent(arguments);
  },
  createForm: Ext.emptyFn,
  doHide: function(win) {
    win.hide();
  },
  doSave: Ext.emptyFn,
  doDelete: Ext.emptyFn
});
Ext.define('Mycim.Form', {
  extend: 'Ext.form.Panel',
  xtype: 'widget.mycim.Form',
  initComponent: function() {
    var me = this;
    Ext.apply(this, {
      trackResetOnLoad: true,
      anchor: '100%'
    });
    this.callParent(arguments);
  }
});

Ext.define('MyCim.form.field.SearchField2', {
	  extend: 'Ext.form.field.Trigger',
	  xtype: 'mycim.searchfield2',
	  popWidth: 660,
	  popHeight: 380,
	  params: [],
	  multiRows: false,
	  triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
	  initComponent: function() {
	    Ext.apply(this, {
	      onTriggerClick: function() {
	        var me = this;
	        if (me.type == null || me.targetIds == null) {
	          MyCim.notify.alert("type或targetIds属性未配置");
	          return;
	        } else {
	          me.doTriggerClick();
	        }
	      }
	    });
	    this.callParent(arguments);
	  },
	  buildTargetIds: function(targetIds) {
	    var me = this;
	    var targetIdStr = '';
	    var targetIdArray = targetIds.split("|");
	    Ext.each(targetIdArray, function(targetId, index) {
	      var field = me;
	      var form = me.up("form");
	      if (form != null) {
	        field = form.getForm().findField(targetId);
	        if (field == null) {
	          field = me.up("form").down("#" + targetId);
	        }
	        if (field == null) {
	          Ext.Msg.alert("元素" + targetId + "未定义!");
	        }
	        targetIdStr += field.inputId;
	      } else {
	        targetIdStr += field.inputId;
	      }
	      if (index < targetIdArray.length - 1) {
	        targetIdStr += '|';
	      }
	    });
	    return targetIdStr;
	  },
	  buildParams: function(params) {
		  var me = this;
		  var paramStr = '';
		  if(params!=null&&params!=undefined&&params.length>0){
			  for(var i=0;i<params.length;i++){
				  var param=params[i];
				  for (var paramName in param) {
					  var paramValue=param[paramName];
					  paramStr += ("&" + paramName + "=" + paramValue);
				  }
			  }
		  }
	    
	    return paramStr;
	  },
	  doTriggerClick: function() {
		    var me = this;
		    var paramStr = me.buildParams(me.params);
		    var targetIds = me.buildTargetIds(me.targetIds);
		    var referceIds='';
		    if(typeof(me.up('form'))!="undefined"){
		    	if(me.up('form').getForm().findField('sysParaSetReferenceProgram')!=null){
		       	 referceIds = me.up('form').getForm().findField('sysParaSetReferenceProgram').inputId;
		       }
		    }
		    var callback = me.callback;
		    var callbakcClick = me.callbackClick;
		    me.doSearch(me.type, me.multiRows, targetIds,referceIds, callback,me.getValue(), paramStr, me.popWidth, me.popHeight, me.callbackClick);
		    
	   },
	   doSearch: function(type, multiRows, targetIds,referceIds,callback, value, paramStr, width, height, callbackClick) {
			if(callback !=null){
				 var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
		         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr+'&callback=1&referceIds='+referceIds;
			}else if(callbackClick != null){
				var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
		         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr+'&callbackClick='+callbackClick;
			}else{
				 var url = '/mycim2/searchAction.do?reqCode=init&type=' + type + '&multiRows=' + multiRows + '&targetIds='
		         + targetIds + '&keyValue=' + encodeURIComponent(value) + paramStr;
			}
		    window.open(url, 'poppage', 'toolbars=0, scrollbars=0, location=0, statusbars=0, menubars=0, resizable=1, width='
		            + width + ', height=' + height + '');
		}
	});
/** @format */
const readOnlyFieldStyle = "background-color: rgb(247,248,248); border-color: silver #d9d9d9 #d9d9d9; color: gray;"
const pageSize = 20

function createConditionForm() {
  const conditionForm = Ext.create("Ext.form.Panel", {
    id: "conditionForm",
    bodyPadding: 5,
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      columnWidth: 0.25,
      labelWidth: 100,
      labelAlign: "left",
      padding: "0 5"
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "产品号",
        name: "productId",
        itemId: "productId",
        type: "PRODUCT",
        targetIds: "productId"
      }
    ],
    buttons: [
      {
        name: "qryBtn",
        text: "查询",
        handler: function () {
          refreshFlowConfigGrid()
        }
      },
      {
        name: "addBtn",
        text: "添加",
        handler: function () {
          showSaveFlowWin()
        }
      },
      {
        name: "updateBtn",
        text: "修改",
        handler: function () {
          const mainTabPanel = Ext.getCmp("mainTabPanel")
          const listGrid = mainTabPanel.down("[name=listGrid]")
          const records = listGrid.getSelectionModel().getSelection()
          if (records.length != 1) {
            showWarningAlert("请选择一条修改!!!")
            return
          }
          const data = records[0].data
          data.isEdit = true
          showSaveFlowWin(data)
        }
      },
      {
        name: "delBtn",
        text: "删除",
        handler: function () {
          delFlowConfig()
        }
      },
      {
        name: "curveSetBtn",
        text: "曲线设置",
        handler: function () {
          curveSetConfig()
        }
      },
      {
        name: "deadSpotBtn",
        text: "死点配置",
        handler: function () {
          deadSpotSetConfig()
        }
      }
    ]
  })
  return conditionForm
}

function createListGrid(type) {
  const tabListStore = createListStore(type)
  const tabListGrid = Ext.create("Ext.grid.Panel", {
    name: "listGrid",
    store: tabListStore,
    width: "100%",
    region: "center",
    selModel: Ext.create("Ext.selection.CheckboxModel", { checkOnly: true }),
    multiSelect: true,
    columns: [
      { dataIndex: "rowRrn", align: "left", hidden: true },
      { dataIndex: "type", align: "left", hidden: true },
      { dataIndex: "productId", align: "left", flex: 1, text: "产品号" },
      { dataIndex: "processId", align: "left", flex: 1, text: "流程号" },
      { dataIndex: "routeId", align: "left", flex: 1, text: "工序" },
      { dataIndex: "operationId", align: "left", flex: 1, text: "工步" },
      { dataIndex: "paramId", align: "left", flex: 1, text: "修频项" },
      { dataIndex: "targetValue", align: "left", flex: 1, text: "target值" },
      { dataIndex: "offsetValue", align: "left", flex: 1, text: "offset值" },
      { dataIndex: "updateTimeStr", align: "left", flex: 1, text: "操作时间" },
      { dataIndex: "updateUserId", align: "left", flex: 1, text: "操作人" }
    ],
    bbar: Ext.create("MyCim.PagingToolbar", {
      store: tabListStore
    })
  })

  tabListGrid.on({
    itemdblclick: function (grid, record, item, rowindex, e, opts) {
      const data = record.data
      data.isEdit = true
      showSaveFlowWin(data)
    }
  })
  return tabListGrid
}

function createListStore(type) {
  const tabListStore = Ext.create("Ext.data.Store", {
    storeId: "tabListStore",
    fields: [
      "rowRrn",
      "type",
      "productId",
      "updateTimeStr",
      "updateUserId",
      "processId",
      "routeId",
      "operationId",
      "paramId",
      "targetValue",
      "offsetValue"
    ],
    pageSize: pageSize,
    proxy: {
      type: "ajax",
      url: actionURL,
      requestMethod: "qryConfigPage",
      params: {
        start: 0,
        limit: pageSize
      },
      reader: {
        root: "results",
        totalProperty: "totalItems"
      }
    },
    listeners: {
      scope: this,
      beforeload: function () {
        const me = this
        // 组装数据
        const sendData = Ext.getCmp("conditionForm").getForm().getValues()
        sendData.type = type
        Ext.apply(tabListStore.proxy.extraParams, sendData)
      }
    }
  })
  return tabListStore
}

function createMainPanel() {
  const mainPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [createConditionForm(), createListGrid(type)]
  })
  return mainPanel
}

function createMainTabPanel() {
  const mainTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "mainTabPanel",
    activeTab: 0,
    items: [
      //选项卡中的每一项选项设置
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "TRIM频率设置" + "</span>"
        },
        items: [createMainPanel()]
      }
    ]
  })
  return mainTabPanel
}

function showNewTab(id, title, panel) {
  const newTab = Ext.getCmp(id)
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  if (newTab) {
    mainTabPanel.remove(id)
  }

  mainTabPanel.add({
    id: id,
    name: id,
    title: title,
    closable: true,
    layout: "fit",
    padding: "0 0 0 0",
    items: [panel]
  })
  mainTabPanel.setActiveTab(id)
}

function showSaveFlowWin(data) {
  const baseForm = Ext.create("Ext.form.Panel", {
    name: "saveForm",
    autoScroll: true,
    defaults: {
      anchor: "100%"
    },
    fieldDefaults: {
      labelAlign: "left",
      flex: 1,
      margin: 5
    },
    items: [
      {
        xtype: "container",
        layout: "column",
        defaults: {
          labelWidth: 150,
          columnWidth: 0.5
        },
        items: [
          {
            xtype: "mycim.searchfield",
            fieldLabel: "产品号",
            allowBlank: false,
            readOnly: data?.isEdit,
            fieldStyle: data?.isEdit ? readOnlyFieldStyle : "",
            name: "productId",
            itemId: "productId",
            type: "PRODUCT",
            targetIds: "productId",
            value: data?.productId ? data.productId : "",
            listeners: {
              blur: function () {
                const form = this.up("form")
                const thisForm = form.getForm()

                const productIdCmp = thisForm.findField("productId")
                const productId = productIdCmp.getValue()
                const processIdCmp = thisForm.findField("processId")

                if (!productId) {
                  return
                }

                var params = {
                  productId: productId
                }

                Ext.Ajax.request({
                  url: actionURL,
                  requestMethod: "queryComboboxItemsByProduct",
                  params: params,
                  success: function (response, opts) {
                    if (response.processId) {
                      processIdCmp.setValue(response.processId)
                    }
                  }
                })
              }
            }
          },
          {
            xtype: "mycim.searchfield",
            fieldLabel: "工艺流程号",
            allowBlank: false,
            name: "processId",
            itemId: "processId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.processId ? data.processId : "",
            allowOnlyWhitespace: false
          },
          {
            xtype: "triggerfield",
            fieldLabel: "工序号",
            name: "routeId",
            itemId: "routeId",
            editable: false,
            allowBlank: false,
            triggerCls: Ext.baseCSSPrefix + "form-search-trigger",
            value: data?.routeId ? data.routeId : "",
            onTriggerClick: function () {
              const values = baseForm.getForm().getValues()
              if (!values.productId) {
                showWarningAlert("请先选择产品号!!")
                return
              }
              if (!values.processId) {
                showWarningAlert("请先选择流程号!!")
                return
              }
              searchWfl(
                "OPERATION",
                "operationId,routeId",
                "&isActive=true&filterType=newTreeALL&productId=" + values.productId + "&processId=" + values.processId + "&containsRework=y",
                1000,
                400,
                "N",
                "Y"
              )
            }
          },
          {
            xtype: "textfield",
            fieldLabel: "工步号",
            allowBlank: false,
            name: "operationId",
            itemId: "operationId",
            // targetIds: "operationId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.operationId ? data.operationId : ""
          },
          // {
          //     xtype: "textfield",
          //     fieldLabel: "流程序号",
          //     allowBlank: false,
          //     name: "flowSeq",
          //     itemId: "flowSeq",
          //     readOnly: true,
          //     fieldStyle: readOnlyFieldStyle,
          //     value: data?.operationId ? data.operationId : ""
          // },
          {
            xtype: "textfield",
            fieldLabel: "修频项",
            allowBlank: false,
            name: "paramId",
            itemId: "paramId",
            value: data?.paramId ? data.paramId : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "target值",
            allowBlank: false,
            name: "targetValue",
            itemId: "targetValue",
            value: data?.targetValue ? data.targetValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "offset值",
            allowBlank: false,
            name: "offsetValue",
            itemId: "offsetValue",
            value: data?.offsetValue ? data.offsetValue : ""
          },
          {
            xtype: "combobox",
            name: "type",
            itemId: "type",
            fieldLabel: "类型",
            allowBlank: false,
            displayField: "value",
            valueField: "key",
            queryMode: "local",
            editable: false,
            enableKeyEvents: true,
            store: Ext.create("Ext.data.Store", {
              fields: ["key", "value"],
              autoLoad: true,
              proxy: {
                type: "ajax",
                url: actionURL,
                requestMethod: "getTrimTypeOptions",
                reader: {
                  root: "msg"
                }
              }
            }),
            value: data?.type ? data.type : ""
          },
          {
            xtype: "textfield",
            hidden: true,
            name: "rowRrn",
            itemId: "rowRrn",
            value: data?.rowRrn ? data.rowRrn : ""
          }
        ]
      }
    ]
  })
  Ext.create("Ext.window.Window", {
    width: 950,
    height: 500,
    modal: true, // 是否需要遮罩
    layout: "fit",
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    title: data?.isEdit ? "修改" : "新增",
    autoDestroy: true,
    closeAction: "destroy",
    items: [baseForm],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCpFlowConfig(btn)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function curveSetConfig() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const listGrid = mainTabPanel.down("[name=listGrid]")
  const records = listGrid.getSelectionModel().getSelection()
  if (records.length <= 0) {
    showWarningAlert("请选择一条!!!")
    return
  }
  showNewTab("ctab", "曲线配置", createCurveSetPanel(records[0].data))
  refreshTreeGrid()
  // showNewTab("ctab", "曲线配置", createCurveSetPanel())
}

function createCurveSetPanel(data) {
  const cusrveForm = Ext.create("Ext.form.Panel", {
    name: "cusrveForm",
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      columnWidth: 0.25,
      labelWidth: 80,
      labelAlign: "left",
      padding: "5 5"
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "产品号",
        name: "productId",
        itemId: "productId",
        type: "PRODUCT",
        targetIds: "productId",
        value: data?.productId ? data.productId : "",
        listeners: {
          blur: function () {
            const form = this.up("form")
            const thisForm = form.getForm()

            const productIdCmp = thisForm.findField("productId")
            const productId = productIdCmp.getValue()
            const processIdCmp = thisForm.findField("processId")

            if (!productId) {
              return
            }

            var params = {
              productId: productId
            }

            Ext.Ajax.request({
              url: actionURL,
              requestMethod: "queryComboboxItemsByProduct",
              params: params,
              success: function (response, opts) {
                if (response.processId) {
                  processIdCmp.setValue(response.processId)
                }
              }
            })
          }
        }
      },
      {
        xtype: "textfield",
        fieldLabel: "工艺流程号",
        name: "processId",
        itemId: "processId",
        readOnly: true,
        fieldStyle: readOnlyFieldStyle,
        value: data?.processId ? data.processId : ""
      },
      {
        xtype: "triggerfield",
        fieldLabel: "工序号",
        name: "routeId",
        itemId: "routeId",
        editable: false,
        triggerCls: Ext.baseCSSPrefix + "form-search-trigger",
        value: data?.routeId ? data.routeId : "",
        onTriggerClick: function () {
          const values = baseForm.getForm().getValues()
          if (!values.productId) {
            showWarningAlert("请先选择产品号!!")
            return
          }
          if (!values.processId) {
            showWarningAlert("请先选择流程号!!")
            return
          }
          searchWfl(
            "OPERATION",
            "operationId,routeId",
            "&isActive=true&filterType=newTreeALL&productId=" + values.productId + "&processId=" + values.processId + "&containsRework=y",
            1000,
            400,
            "N",
            "Y"
          )
        }
      },
      {
        xtype: "textfield",
        fieldLabel: "工步号",
        name: "operationId",
        itemId: "operationId",
        // targetIds: "operationId",
        readOnly: true,
        fieldStyle: readOnlyFieldStyle,
        value: data?.operationId ? data.operationId : ""
      },
      {
        xtype: "textfield",
        fieldLabel: "修频项",
        name: "paramId",
        itemId: "paramId",
        value: data?.paramId ? data.paramId : ""
      }
    ],
    buttons: [
      {
        name: "qryBtn",
        text: "查询",
        handler: function () {
          refreshTreeGrid()
        }
      },
      {
        name: "resetBtn",
        text: "重置",
        handler: function () {
          cusrveForm.getForm().findField("productId").setValue("")
          cusrveForm.getForm().findField("processId").setValue("")
          cusrveForm.getForm().findField("routeId").setValue("")
          cusrveForm.getForm().findField("operationId").setValue("")
          cusrveForm.getForm().findField("paramId").setValue("")
        }
      },
      {
        name: "addBtn",
        text: "配置",
        handler: function () {
          addCurveSet(cusrveForm.getForm().getValues())
        }
      },
      {
        name: "delBtn",
        text: "删除",
        // cls: 'btn-red-cls',
        handler: function () {
          delCureSet()
        }
      }
    ]
  })
  const grid = Ext.create("Ext.tree.Panel", {
    name: "treeGrid",
    region: "center",
    maskDisabled: false,
    width: "100%",
    rootVisible: false,
    singleExpand: true,
    store: Ext.create("Ext.data.TreeStore", {
      autoLoad: false,
      fields: ["desc", "xValue", "yValue", "range", "type", "rowRrn", "checked", "parentRrn"]
    }),
    viewConfig: {
      markDirty: false,
      // 给表格行添加样式
      getRowClass(record, rowIndex, rowParams, store) {
        if (record.data.leaf) {
          return "treegrid-row-style-leaf"
        }
      }
    },
    columns: [
      {
        xtype: "treecolumn", //this is so we know which column will show the tree
        text: "描述",
        flex: 2,
        sortable: false,
        dataIndex: "desc"
      },
      {
        hidden: true,
        dataIndex: "type",
        sortable: false
      },
      {
        hidden: true,
        dataIndex: "rowRrn",
        sortable: false
      },
      {
        hidden: true,
        dataIndex: "parentRrn",
        sortable: false
      },
      {
        text: "范围",
        flex: 1,
        dataIndex: "range",
        sortable: false
      },
      {
        text: "X值",
        flex: 1,
        dataIndex: "xValue",
        sortable: false
      },
      {
        text: "Y值",
        flex: 1,
        dataIndex: "yValue",
        sortable: false
      },
      {
        text: "操作",
        width: 100,
        menuDisabled: true,
        xtype: "actioncolumn",
        tooltip: "Edit task",
        align: "center",
        icon: "/mycim2/common/img/edit1.png",
        handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
          if (2 === record.data.type) {
            editCurveSetInfo(record.data)
          }
          if (3 === record.data.type) {
            editCurveSetInfoXy(record.data)
          }
        },
        // Only leaf level tasks may be edited
        isDisabled: function (view, rowIdx, colIdx, item, record) {
          return record.data.type === 1
        }
      }
    ],
    listeners: {
      checkchange: function (node, checked) {
        // 级联处理子节点
        cascadeChildren(node, checked)

        // 处理父节点（向上递归）
        updateParent(node)
      }
    }
  })
  const cusrvePanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [cusrveForm, grid]
  })
  return cusrvePanel
}

function addCurveSet(data) {
  if (isNull(data.productId)) {
    showErrorAlert("产品号不能为空!!")
    return
  }
  if (isNull(data.routeId)) {
    showErrorAlert("工序号不能为空!!")
    return
  }
  if (isNull(data.operationId)) {
    showErrorAlert("工步号不能为空!!")
    return
  }
  if (isNull(data.paramId)) {
    showErrorAlert("修频项不能为空!!")
    return
  }
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryTrimConfigs",
    params: data,
    success: function (response, opts) {
      const record = response[0]
      record.isEdit = false
      showAddCurveSetWin(record)
    }
  })
  // showAddCurveSetWin()
}

function editCurveSetInfo(data) {
  if (!data.rowRrn) {
    return
  }
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryTrimConfigsByCrrn",
    params: data.rowRrn,
    success: function (response, opts) {
      response.isEdit = true
      showAddCurveSetWin(response)
    }
  })
}

function editCurveSetInfoXy(data) {
  if (!data.rowRrn) {
    return
  }
  const form = Ext.create("Ext.form.Panel", {
    layout: "column",
    width: "100%",
    margin: 10,
    border: false,
    bodyStyle: "background-color:#FFFFFF",
    defaults: {
      columnWidth: 0.5,
      labelWidth: 80,
      labelAlign: "left",
      padding: "0 5 5",
      xtype: "textfield"
    },
    items: [
      {
        fieldLabel: "rowRrn",
        name: "rowRrn",
        itemId: "rowRrn",
        hidden: true,
        value: data?.rowRrn
      },
      {
        fieldLabel: "X值",
        name: "xValue",
        itemId: "xValue",
        value: data?.xValue
      },
      {
        fieldLabel: "Y值",
        name: "yValue",
        itemId: "yValue",
        value: data?.yValue
      }
    ]
  })

  Ext.create("Ext.window.Window", {
    width: 500,
    modal: true, // 是否需要遮罩
    layout: "fit",
    title: "修改",
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    autoDestroy: true,
    closeAction: "destroy",
    items: [form],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCurveSetInfoXy(form)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function showAddCurveSetWin(data) {
  const grid = Ext.create("Ext.grid.Panel", {
    region: "center",
    store: Ext.create("Ext.data.Store", {
      fields: ["xValue", "yValue"],
      autoDestroy: true
    }),
    columnLines: true,
    plugins: [
      {
        ptype: "rowediting",
        clicksToEdit: 2,
        pluginId: "rowplugin",
        listeners: {
          edit: (editor, context) => {
            context.record.commit()
          }
        }
      }
    ],
    columns: [
      {
        header: "X",
        dataIndex: "xValue",
        flex: 1,
        sortable: false,
        editor: {
          xtype: "textfield"
        }
      },
      {
        header: "Y",
        dataIndex: "yValue",
        flex: 1,
        sortable: false,
        editor: {
          xtype: "textfield"
        }
      },
      // {
      //   xtype: "templatecolumn",
      //   header: "操作",
      //   width: 150,
      //   tpl:
      //     '<a href="javascript:void(0);" onclick="editUser({id})">编辑</a> | ' + '<a href="javascript:void(0);" onclick="deleteUser({id})">删除</a>'
      // }
      {
        xtype: "actioncolumn",
        sortable: false,
        width: 100,
        stopSelection: true,
        items: [
          {
            iconCls: "iconCls_delete",
            // iconCls: "spaced-icon",
            // icon: "js/delete.png",
            tooltip: "删除",
            handler: function (grid, rowIndex, colIndex) {
              grid.getStore().removeAt(rowIndex)
            }
          }
        ]
      }
    ],
    selType: "rowmodel",
    tbar: [
      {
        text: "添加",
        scope: this,
        handler: function (btn) {
          const rec = grid.getStore().insert(0, {
            xValue: "",
            yValue: "",
            cValue: ""
          })[0]
          grid.getPlugin("rowplugin").startEdit(rec, 0)
        }
      }
    ]
  })
  const form = Ext.create("Ext.form.Panel", {
    layout: "border",
    bodyStyle: "background-color:#FFFFFF",
    items: [
      {
        xtype: "fieldset",
        region: "north",
        title: "基本信息",
        collapsible: true,
        defaultType: "textfield",
        layout: "column",
        defaults: {
          columnWidth: 0.5,
          labelWidth: 150,
          labelAlign: "left",
          padding: "0 5 5"
        },
        items: [
          {
            fieldLabel: "rowRrn",
            name: "rowRrn",
            itemId: "rowRrn",
            hidden: true,
            value: data.isEdit ? data.cpRrn : data.rowRrn
          },
          {
            fieldLabel: "产品号",
            name: "productId",
            itemId: "productId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.productId
          },
          {
            fieldLabel: "工序号",
            name: "routeId",
            itemId: "routeId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.routeId
          },
          {
            fieldLabel: "工步号",
            name: "operationId",
            itemId: "operationId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.operationId
          },
          {
            fieldLabel: "修频项",
            name: "paramId",
            itemId: "paramId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.paramId
          }
        ]
      },
      {
        xtype: "fieldset",
        region: "north",
        title: "曲线范围",
        collapsible: true,
        defaultType: "textfield",
        layout: "column",
        defaults: {
          columnWidth: 0.5,
          labelWidth: 150,
          labelAlign: "left",
          padding: "0 5 5"
        },
        items: [
          {
            fieldLabel: "cRrn",
            name: "cRrn",
            itemId: "cRrn",
            hidden: true,
            value: data.isEdit ? data.rowRrn : 0
          },
          {
            fieldLabel: "下限",
            name: "minValue",
            itemId: "minValue",
            allowBlank: false,
            value: data?.minValue
          },
          {
            fieldLabel: "上限",
            name: "maxValue",
            itemId: "maxValue",
            allowBlank: false,
            value: data?.maxValue
          }
        ]
      },
      {
        xtype: "fieldset",
        region: "center",
        title: "坐标设置",
        collapsible: true,
        layout: "border",
        items: [grid]
      }
    ]
  })

  if (data.cpTrimCurveXyDatas) {
    grid.getStore().add(data.cpTrimCurveXyDatas)
  }

  Ext.create("Ext.window.Window", {
    width: 950,
    height: 700,
    layout: "fit",
    title: "新增",
    modal: true, // 模态化窗口
    closable: true,
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    autoDestroy: true,
    closeAction: "destroy",
    items: [form],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCurveSetInfo(form, grid)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function deadSpotSetConfig() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const listGrid = mainTabPanel.down("[name=listGrid]")
  const records = listGrid.getSelectionModel().getSelection()
  if (records.length <= 0) {
    showWarningAlert("请选择一条!!!")
    return
  }
  showNewTab("dtab", "死点配置", createDeadSpotSetPanel(records[0].data))
  refreshDeadTreeGrid()
  // showNewTab("dtab", "死点配置", createDeadSpotSetPanel())
}

function createDeadSpotSetPanel(data) {
  const deadSpotForm = Ext.create("Ext.form.Panel", {
    name: "deadSpotForm",
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      columnWidth: 0.25,
      labelWidth: 80,
      labelAlign: "left",
      padding: "5 5"
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "产品号",
        name: "productId",
        itemId: "productId",
        type: "PRODUCT",
        targetIds: "productId",
        value: data?.productId ? data.productId : "",
        listeners: {
          blur: function () {
            const form = this.up("form")
            const thisForm = form.getForm()

            const productIdCmp = thisForm.findField("productId")
            const productId = productIdCmp.getValue()
            const processIdCmp = thisForm.findField("processId")

            if (!productId) {
              return
            }

            var params = {
              productId: productId
            }

            Ext.Ajax.request({
              url: actionURL,
              requestMethod: "queryComboboxItemsByProduct",
              params: params,
              success: function (response, opts) {
                if (response.processId) {
                  processIdCmp.setValue(response.processId)
                }
              }
            })
          }
        }
      },
      {
        xtype: "textfield",
        fieldLabel: "工艺流程号",
        name: "processId",
        itemId: "processId",
        readOnly: true,
        fieldStyle: readOnlyFieldStyle,
        value: data?.processId ? data.processId : ""
      },
      {
        xtype: "triggerfield",
        fieldLabel: "工序号",
        name: "routeId",
        itemId: "routeId",
        editable: false,
        triggerCls: Ext.baseCSSPrefix + "form-search-trigger",
        value: data?.routeId ? data.routeId : "",
        onTriggerClick: function () {
          const values = baseForm.getForm().getValues()
          if (!values.productId) {
            showWarningAlert("请先选择产品号!!")
            return
          }
          if (!values.processId) {
            showWarningAlert("请先选择流程号!!")
            return
          }
          searchWfl(
            "OPERATION",
            "operationId,routeId",
            "&isActive=true&filterType=newTreeALL&productId=" + values.productId + "&processId=" + values.processId + "&containsRework=y",
            1000,
            400,
            "N",
            "Y"
          )
        }
      },
      {
        xtype: "textfield",
        fieldLabel: "工步号",
        name: "operationId",
        itemId: "operationId",
        // targetIds: "operationId",
        readOnly: true,
        fieldStyle: readOnlyFieldStyle,
        value: data?.operationId ? data.operationId : ""
      },
      {
        xtype: "textfield",
        fieldLabel: "修频项",
        name: "paramId",
        itemId: "paramId",
        value: data?.paramId ? data.paramId : ""
      }
    ],
    buttons: [
      {
        name: "qryBtn",
        text: "查询",
        handler: function () {
          refreshDeadTreeGrid()
        }
      },
      {
        name: "resetBtn",
        text: "重置",
        handler: function () {
          deadSpotForm.getForm().findField("productId").setValue("")
          deadSpotForm.getForm().findField("processId").setValue("")
          deadSpotForm.getForm().findField("routeId").setValue("")
          deadSpotForm.getForm().findField("operationId").setValue("")
          deadSpotForm.getForm().findField("paramId").setValue("")
        }
      },
      {
        name: "addBtn",
        text: "配置",
        handler: function () {
          addDeadSpotSet(deadSpotForm.getForm().getValues())
        }
      },
      {
        name: "delBtn",
        text: "删除",
        // cls: 'btn-red-cls',
        handler: function () {
          delDeadSet()
        }
      }
    ]
  })

  const grid = Ext.create("Ext.tree.Panel", {
    name: "treeDeadGrid",
    region: "center",
    maskDisabled: false,
    width: "100%",
    rootVisible: false,
    singleExpand: true,
    store: Ext.create("Ext.data.TreeStore", {
      autoLoad: false,
      fields: ["desc", "ruleRelation", "ruleRelationDesc", "ruleType", "ruleTypeDesc", "ruleValue", "rowRrn", "checked", "cpRrn", "type"]
    }),
    viewConfig: {
      markDirty: false,
      // 给表格行添加样式
      getRowClass(record, rowIndex, rowParams, store) {
        if (record.data.leaf) {
          return "treegrid-row-style-leaf"
        }
      }
    },
    columns: [
      {
        xtype: "treecolumn", //this is so we know which column will show the tree
        text: "描述",
        flex: 2,
        sortable: false,
        dataIndex: "desc"
      },
      {
        hidden: true,
        dataIndex: "type",
        sortable: false
      },
      {
        hidden: true,
        dataIndex: "rowRrn",
        sortable: false
      },
      {
        hidden: true,
        dataIndex: "cpRrn",
        sortable: false
      },
      {
        text: "关系",
        flex: 1,
        dataIndex: "ruleRelation",
        sortable: false,
        hidden: true
      },
      {
        text: "规则类型",
        flex: 1,
        dataIndex: "ruleType",
        sortable: false,
        hidden: true
      },
      {
        text: "关系",
        flex: 1,
        dataIndex: "ruleRelationDesc",
        sortable: false
      },
      {
        text: "规则类型",
        flex: 1,
        dataIndex: "ruleTypeDesc",
        sortable: false
      },
      {
        text: "规则值",
        flex: 1,
        dataIndex: "ruleValue",
        sortable: false
      },
      {
        text: "操作",
        width: 100,
        menuDisabled: true,
        xtype: "actioncolumn",
        tooltip: "Edit task",
        align: "center",
        icon: "/mycim2/common/img/edit1.png",
        handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
          if (1 === record.data.type) {
            editDeadSpotSet(record.data)
          }
          if (2 === record.data.type) {
            editDeadSpotSetTwo(record.data)
          }
          if (3 === record.data.type) {
            editDeadSpotSetThree(record.data)
          }
        }
      }
    ],
    listeners: {
      checkchange: function (node, checked) {
        // 级联处理子节点
        cascadeChildren(node, checked)

        // 处理父节点（向上递归）
        updateParent(node)
      }
    }
  })
  const deadSpotPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [deadSpotForm, grid]
  })
  return deadSpotPanel
}

function addDeadSpotSet(data) {
  if (isNull(data.productId)) {
    showErrorAlert("产品号不能为空!!")
    return
  }
  if (isNull(data.routeId)) {
    showErrorAlert("工序号不能为空!!")
    return
  }
  if (isNull(data.operationId)) {
    showErrorAlert("工步号不能为空!!")
    return
  }
  if (isNull(data.paramId)) {
    showErrorAlert("修频项不能为空!!")
    return
  }
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryTrimConfigs",
    params: data,
    success: function (response, opts) {
      const record = response[0]
      Ext.Ajax.request({
        url: actionURL,
        requestMethod: "qryTrimConfigsDeadPotByRrn",
        params: record.rowRrn,
        success: function (response, opts) {
          showDeadSpotSetWin(response)
        }
      })
    }
  })
}

function editDeadSpotSet(data) {
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryTrimConfigsDeadPotByRrn",
    params: data.rowRrn,
    success: function (response, opts) {
      showDeadSpotSetWin(response)
    }
  })
}

function editDeadSpotSetTwo(data) {
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryDeadPotItemByRrn",
    params: data.rowRrn,
    success: function (response, opts) {
      showDeadSpotSetWinTwo(response)
    }
  })
}

function editDeadSpotSetThree(data) {
  showDeadSpotSetWinThree(data)
}

function showDeadSpotSetWin(data) {
  const deadTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "deadTabPanel",
    activeTab: 0,
    cls: "tab-panel-cls-define",
    items: []
  })
  if (data?.cpTrimDeadSpotItems) {
    for (const element of data.cpTrimDeadSpotItems) {
      addRuleTab(deadTabPanel, element, true)
      deadTabPanel.setActiveTab(0)
    }
  }
  const form = Ext.create("Ext.form.Panel", {
    layout: "border",
    bodyStyle: "background-color:#FFFFFF",
    items: [
      {
        xtype: "fieldset",
        region: "north",
        title: "基本信息",
        collapsible: true,
        defaultType: "textfield",
        layout: "column",
        defaults: {
          columnWidth: 0.5,
          labelWidth: 150,
          labelAlign: "left",
          padding: "0 5 5"
        },
        items: [
          {
            fieldLabel: "rowRrn",
            name: "rowRrn",
            itemId: "rowRrn",
            hidden: true,
            value: data?.rowRrn
          },
          {
            fieldLabel: "产品号",
            name: "productId",
            itemId: "productId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.productId
          },
          {
            fieldLabel: "工序号",
            name: "routeId",
            itemId: "routeId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.routeId
          },
          {
            fieldLabel: "工步号",
            name: "operationId",
            itemId: "operationId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.operationId
          },
          {
            fieldLabel: "修频项",
            name: "paramId",
            itemId: "paramId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.paramId
          }
        ]
      },
      {
        xtype: "fieldset",
        region: "center",
        title: "规则配置",
        collapsible: true,
        layout: "border",
        cls: "fieldset-define",
        items: [
          Ext.create("Ext.toolbar.Toolbar", {
            region: "north",
            margin: "0 0 5 0",
            items: [
              {
                xtype: "textfield",
                fieldLabel: "规则项",
                name: "ruleItemId",
                itemId: "ruleItemId",
                id: "ruleItemId",
                labelWidth: 80
              },
              {
                text: "添加配置",
                handler: function (btn, e, eOpts) {
                  addRuleSet(deadTabPanel, {
                    cpRrn: data.rowRrn,
                    itemId: Ext.getCmp("ruleItemId").getValue()
                  })
                }
              }
            ]
          }),
          deadTabPanel
        ]
      }
    ]
  })

  Ext.create("Ext.window.Window", {
    width: 1000,
    height: 600,
    layout: "fit",
    title: "规则配置",
    modal: true, // 模态化窗口
    closable: true,
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    autoDestroy: true,
    closeAction: "destroy",
    items: [form],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCpDeadPotSet(form, deadTabPanel)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function showDeadSpotSetWinTwo(data) {
  const deadTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "deadTabPanel",
    activeTab: 0,
    cls: "tab-panel-cls-define",
    items: []
  })
  addRuleTab(deadTabPanel, data, false)
  deadTabPanel.setActiveTab(0)

  Ext.create("Ext.window.Window", {
    width: 1000,
    height: 350,
    layout: "fit",
    title: "规则配置",
    modal: true, // 模态化窗口
    closable: true,
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    autoDestroy: true,
    closeAction: "destroy",
    items: [deadTabPanel],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCpDeadPotItemSet(data, deadTabPanel)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function showDeadSpotSetWinThree(data) {
  const ruleTypeStore = Ext.create("Ext.data.Store", {
    fields: ["key", "value"],
    data: PAGE_DATA.COMBOXDATAS.cpDeadRuleType
  })

  const ruleRelationStore = Ext.create("Ext.data.Store", {
    fields: ["key", "value"],
    data: PAGE_DATA.COMBOXDATAS.cpDeadRuleRela
  })
  const form = Ext.create("Ext.form.Panel", {
    layout: "column",
    width: "100%",
    margin: 10,
    border: false,
    bodyStyle: "background-color:#FFFFFF",
    defaults: {
      columnWidth: 0.33,
      labelWidth: 80,
      labelAlign: "left",
      padding: "0 5 5",
      xtype: "textfield"
    },
    items: [
      {
        xtype: "combobox",
        allowBlank: false,
        fieldLabel: "关系",
        name: "ruleRelation",
        itemId: "ruleRelation",
        store: ruleRelationStore,
        displayField: "value",
        valueField: "key",
        queryMode: "local",
        forceSelection: true, // 必须选择列表中的项
        editable: false, // 禁止手动输入
        triggerAction: "all", // 点击触发按钮显示所有选项
        value: data?.ruleRelation ? data.ruleRelation : ""
      },
      {
        xtype: "combobox",
        fieldLabel: "规则类型",
        allowBlank: false,
        name: "ruleType",
        itemId: "ruleType",
        store: ruleTypeStore,
        displayField: "value",
        valueField: "key",
        queryMode: "local",
        forceSelection: true, // 必须选择列表中的项
        editable: false, // 禁止手动输入
        triggerAction: "all", // 点击触发按钮显示所有选项,
        value: data?.ruleType ? data.ruleType : ""
      },
      {
        xtype: "textfield",
        fieldLabel: "规则值",
        allowBlank: false,
        name: "ruleValue",
        itemId: "ruleValue",
        value: data?.ruleValue ? data.ruleValue : ""
      }
    ]
  })
  Ext.create("Ext.window.Window", {
    width: 900,
    layout: "fit",
    title: "规则配置",
    modal: true, // 模态化窗口
    closable: true,
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    autoDestroy: true,
    closeAction: "destroy",
    items: [form],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveCpDeadPotItemRuleSet(data, form)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

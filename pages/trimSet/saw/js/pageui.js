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
            const data = {isEdit: false}
          showSaveFlowWin(data)
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
        text: "参数设置",
        handler: function () {
          paramSetConfig()
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
      { dataIndex: "processVersion", align: "left", flex: 1, text: "流程版本号" },
      { dataIndex: "routeId", align: "left", flex: 1, text: "工序" },
      { dataIndex: "operationId", align: "left", flex: 1, text: "工步" },
      { dataIndex: "paramId", align: "left", flex: 1, text: "参照项" },
      { dataIndex: "targetValue", align: "left", flex: 1, text: "目标中心值" },
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
    fields: ["rowRrn", "type", "productId", "updateTimeStr",
        "updateUserId", "processId", "routeId", "operationId",
        "processVersion","paramId","targetValue",],
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
          title: "<span>" + "SAW设置" + "</span>"
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
            name: "productId",
            itemId: "productId",
            editable: false,
            type: "PRODUCT",
            targetIds: "productId",
            value: data?.productId ? data.productId : "",
            listeners: {
              render: function () {
                this.callbackFlag = this.id
                this.dataPermission = true
                this.callbackFunction = function () {
                  const form = this.up("form")
                  const thisForm = form.getForm()

                  const productIdCmp = thisForm.findField("productId")
                  const productId = productIdCmp.getValue()
                  const processIdCmp = thisForm.findField("processId")
                  var processVersionCmp = thisForm.findField("processVersion")
                  var processVersionStore = thisForm.findField("processVersion").getStore()

                  if (!productId) {
                    processVersionStore.removeAll()
                    thisForm.findField("processVersion").setValue("")
                    thisForm.findField("productId").setValue("")
                    thisForm.findField("processId").setValue("")
                    return
                  }

                  thisForm.findField("routeIdName").setValue("")
                  thisForm.findField("operationIdName").setValue("")

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
                        if (response.processVersion) {
                          processVersionCmp.setValue("")
                          processVersionStore.loadData(response.processVersion)
                        }
                      }
                    }
                  })
                }
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
            xtype: "combobox",
            itemId: "processVersion",
            name: "processVersion",
            fieldLabel: i18n.labels.LBL_PROCESS_VERSION,
            displayField: "value",
            valueField: "key",
            queryMode: "local",
            editable: false,
            allowBlank: false,
            enableKeyEvents: true,
            store: Ext.create("Ext.data.Store", {
              storeId: "processVersionStore",
              fields: ["key", "value"]
            }),
            listeners: {
              render: function (cmp) {
                if (data?.processId) {
                  Ext.Ajax.request({
                    url: actionURL,
                    requestMethod: "queryComboboxItemsForProcessVersion",
                    params: {
                      processId: data.processId
                    },
                    success: function (response, opts) {
                      if (response) {
                        cmp.getStore().loadData(response)
                        if (data.processVersion) {
                          cmp.setValue(data.processVersion)
                        }
                      }
                    }
                  })
                }
              },
              change: function (thisCmp, newValue, oldValue) {
                if (oldValue && newValue !== oldValue) {
                  thisCmp.up("form").getForm().findField("routeIdName").setValue("")
                  thisCmp.up("form").getForm().findField("operationIdName").setValue("")
                }
              }
            }
          },
          {
            xtype: "triggerfield",
            fieldLabel: "工序号",
            name: "routeIdName",
            itemId: "routeId",
            editable: false,
            allowBlank: false,
            triggerCls: Ext.baseCSSPrefix + "form-search-trigger",
            value: data?.routeId ? data.routeId : "",
            onTriggerClick: function () {
              const values = this.up("form").getForm().getValues()
              if (!values.productId) {
                showWarningAlert("请先选择产品号!!")
                return
              }
              if (!values.processId) {
                showWarningAlert("请先选择流程号!!")
                return
              }
              if (!values.processVersion) {
                showWarningAlert("请先选择流程版本号!!")
                return
              }
              searchWfl(
                "OPERATION",
                "operationIdName,routeIdName",
                "&isActive=true&filterType=newTreeALL&productId=" +
                  values.productId +
                  "&processId=" +
                  values.processId +
                  "&processVersion=" +
                  values.processVersion +
                  "&containsRework=y",
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
            name: "operationIdName",
            itemId: "operationId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.operationId ? data.operationId : ""
          },
            {
                xtype: "textfield",
                fieldLabel: "参照项",
                allowBlank: false,
                name: "paramId",
                itemId: "paramId",
                value: data?.paramId ? data.paramId : ""
            },
            {
                xtype: "textfield",
                fieldLabel: "目标中心值",
                allowBlank: false,
                name: "targetValue",
                itemId: "targetValue",
                value: data.isEdit ? data.targetValue : ""
            },
          {
            xtype: "textfield",
            fieldLabel: "类型",
            hidden: true,
            name: "type",
            itemId: "type",
            value: type
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

function paramSetConfig() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const listGrid = mainTabPanel.down("[name=listGrid]")
  const records = listGrid.getSelectionModel().getSelection()
  if (records.length !== 1) {
    showWarningAlert("请选择一条!!!")
    return
  }
  showNewTab("ctab", "参数配置", createParamSetPanel(records[0].data))
  refreshTreeGrid()
}

function createParamSetPanel(data) {
  const paramForm = Ext.create("Ext.form.Panel", {
    name: "paramForm",
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      columnWidth: 0.33,
      labelWidth: 100,
      labelAlign: "left",
      padding: "5 5"
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "产品号",
        editable: false,
        name: "productId",
        itemId: "productId",
        type: "PRODUCT",
        targetIds: "productId",
        value: data?.productId ? data.productId : "",
        listeners: {
          render: function () {
            this.callbackFlag = this.id
            this.dataPermission = true
            this.callbackFunction = function () {
              const form = this.up("form")
              const thisForm = form.getForm()

              const productIdCmp = thisForm.findField("productId")
              const productId = productIdCmp.getValue()
              const processIdCmp = thisForm.findField("processId")
              var processVersionCmp = thisForm.findField("processVersion")
              var processVersionStore = thisForm.findField("processVersion").getStore()

              if (!productId) {
                processVersionStore.removeAll()
                thisForm.findField("processVersion").setValue("")
                thisForm.findField("productId").setValue("")
                thisForm.findField("processId").setValue("")
                return
              }

              thisForm.findField("routeId").setValue("")
              thisForm.findField("operationId").setValue("")

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
                    if (response.processVersion) {
                      processVersionCmp.setValue("")
                      processVersionStore.loadData(response.processVersion)
                    }
                  }
                }
              })
            }
          }
        }
      },
      {
        xtype: "mycim.searchfield",
        fieldLabel: "工艺流程号",
        name: "processId",
        itemId: "processId",
        readOnly: true,
        fieldStyle: readOnlyFieldStyle,
        value: data?.processId ? data.processId : ""
      },
      {
        xtype: "combobox",
        itemId: "processVersion",
        name: "processVersion",
        fieldLabel: i18n.labels.LBL_PROCESS_VERSION,
        displayField: "value",
        valueField: "key",
        queryMode: "local",
        editable: false,
        enableKeyEvents: true,
        store: Ext.create("Ext.data.Store", {
          storeId: "processVersionStore",
          fields: ["key", "value"]
        }),
        listeners: {
          render: function (cmp) {
            if (data?.processId) {
              Ext.Ajax.request({
                url: actionURL,
                requestMethod: "queryComboboxItemsForProcessVersion",
                params: {
                  processId: data.processId
                },
                success: function (response, opts) {
                  if (response) {
                    cmp.getStore().loadData(response)
                    if (data.processVersion) {
                      cmp.setValue(data.processVersion)
                    }
                  }
                }
              })
            }
          },
          change: function (thisCmp, newValue, oldValue) {
            if (oldValue && newValue !== oldValue) {
              thisCmp.up("form").getForm().findField("routeId").setValue("")
              thisCmp.up("form").getForm().findField("operationId").setValue("")
            }
          }
        }
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
          const values = this.up("form").getForm().getValues()
          if (!values.productId) {
            showWarningAlert("请先选择产品号!!")
            return
          }
          if (!values.processId) {
            showWarningAlert("请先选择流程号!!")
            return
          }
          if (!values.processVersion) {
            showWarningAlert("请先选择流程版本号!!")
            return
          }
          searchWfl(
            "OPERATION",
            "operationId,routeId",
            "&isActive=true&filterType=newTreeALL&productId=" +
              values.productId +
              "&processId=" +
              values.processId +
              "&processVersion=" +
              values.processVersion +
              "&containsRework=y",
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
        fieldLabel: "类型",
        name: "type",
        itemId: "type",
        hidden: true,
        value: data?.type ? data.type : ""
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
          this.up("form").getForm().findField("productId").setValue("")
          this.up("form").getForm().findField("processId").setValue("")
          this.up("form").getForm().findField("processVersion").setValue("")
          this.up("form").getForm().findField("routeId").setValue("")
          this.up("form").getForm().findField("operationId").setValue("")
        }
      },
      {
        name: "addBtn",
        text: "配置",
        handler: function () {
          addParamSet(this.up("form").getForm().getValues())
        }
      },
      {
        name: "delBtn",
        text: "删除",
        // cls: 'btn-red-cls',
        handler: function () {
          delParamSet()
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
      fields: ["desc", "paramId", "kValue", "bValue", "targetValue", "lslValue", "uslValue", "rowRrn", "checked", "cpRrn", "level"]
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
        dataIndex: "level",
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
            text: "参数项",
            flex: 1,
            dataIndex: "paramId",
            sortable: false
        },
        {
            text: "K值",
            flex: 1,
            dataIndex: "kValue",
            sortable: false
        },
      {
        text: "B值",
        flex: 1,
        dataIndex: "bValue",
        sortable: false
      },
      {
        text: "目标中心值",
        flex: 1,
        dataIndex: "targetValue",
        sortable: false
      },
      {
        text: "LSL(下限值)",
        flex: 1,
        dataIndex: "lslValue",
        sortable: false
      },
      {
        text: "USL(上限值)",
        flex: 1,
        dataIndex: "uslValue",
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
          if (2 === record.data.level) {
              editParamSet(record.data)
          }
        },
        // Only leaf level tasks may be edited
        isDisabled: function (view, rowIdx, colIdx, item, record) {
          return record.data.level === 1
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
  const paramPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [paramForm, grid]
  })
  return paramPanel
}

function editParamSet(data) {
    if (!data.rowRrn) {
        return
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "qryTrimConfigSawParamSet",
        params: data.rowRrn,
        success: function (response, opts) {
            response.isEdit = true
            showAddParamSetWin(response)
        }
    })
}

function addParamSet(data) {
  if (isNull(data.productId)) {
    showErrorAlert("产品号不能为空!!")
    return
  }
  if (isNull(data.processId)) {
    showErrorAlert("流程号不能为空!!")
    return
  }
  if (isNull(data.processVersion)) {
    showErrorAlert("流程版本号不能为空!!")
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
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "qryTrimConfigs",
    params: data,
    success: function (response, opts) {
      const record = response[0]
      record.isEdit = false
      showAddParamSetWin(record)
    }
  })
}
function showAddParamSetWin(data) {
    const pTypeStore = Ext.create("Ext.data.Store", {
        fields: ["key", "value"],
        data: PAGE_DATA.COMBOXDATAS.cpSawpType
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
                        fieldLabel: "cpRrn",
                        name: "cpRrn",
                        itemId: "cpRrn",
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
                        fieldLabel: "参数项",
                        name: "paramId",
                        itemId: "paramId",
                        allowBlank: false,
                        // readOnly: data.isEdit,
                        // fieldStyle: data.isEdit ? readOnlyFieldStyle : "",
                        value: data.isEdit ? data.paramId : ""
                    }
                ]
            },
            {
                xtype: "fieldset",
                region: "center",
                title: "参数设置",
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
                        value: data.isEdit ? data.rowRrn : 0
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "K值",
                        allowBlank: false,
                        name: "kValue",
                        itemId: "kValue",
                        value: data.isEdit ? data.kValue : ""
                     },
                    {
                        xtype: "textfield",
                        fieldLabel: "b值",
                        allowBlank: false,
                        name: "bValue",
                        itemId: "bValue",
                        value: data.isEdit ? data.bValue : ""
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "目标中心值",
                        allowBlank: false,
                        name: "targetValue",
                        itemId: "targetValue",
                        value: data.isEdit ? data.targetValue : ""
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "LSL(下限值)",
                        allowBlank: false,
                        name: "lslValue",
                        itemId: "lslValue",
                        value: data.isEdit ? data.lslValue : ""
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "USL(上限值)",
                        allowBlank: false,
                        name: "uslValue",
                        itemId: "uslValue",
                        value: data.isEdit ? data.uslValue : ""
                    },{
                        xtype: "combobox",
                        allowBlank: false,
                        fieldLabel: "方案类型",
                        name: "pType",
                        itemId: "pType",
                        store: pTypeStore,
                        displayField: "value",
                        valueField: "key",
                        queryMode: "local",
                        forceSelection: true, // 必须选择列表中的项
                        editable: false, // 禁止手动输入
                        triggerAction: "all", // 点击触发按钮显示所有选项
                        value: data.pType ? data.pType : ""
                    }

                ]
            }
        ]
    })

    Ext.create("Ext.window.Window", {
        width: 950,
        height: 600,
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
                    saveParamSetInfo(form)
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

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
          const data = { isEdit: false }
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
      { dataIndex: "cpRrn", align: "left", hidden: true },
      { dataIndex: "type", align: "left", hidden: true },
      { dataIndex: "productId", align: "left", flex: 1, text: "产品号" },
      { dataIndex: "processId", align: "left", flex: 1, text: "流程号" },
      { dataIndex: "processVersion", align: "left", flex: 1, text: "流程版本号" },
      { dataIndex: "routeId", align: "left", flex: 1, text: "工序" },
      { dataIndex: "operationId", align: "left", flex: 1, text: "工步" },
        { dataIndex: "minMatchValue", align: "left", flex: 1, text: "最小匹配度" },
        { dataIndex: "deadMaxRate", align: "left", flex: 1, text: "死点最大占比(%)" },
      { dataIndex: "minTrimQty", align: "left", flex: 1, text: "最小trim量" },
      { dataIndex: "targetValue", align: "left", flex: 1, text: "氧化硅目标值" },
      { dataIndex: "maxExceptionPoint", align: "left", flex: 1, text: "最多异常点位数" },
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
      "cpRrn",
      "type",
      "productId",
      "updateTimeStr",
      "updateUserId",
      "processId",
      "routeId",
      "operationId",
      "processVersion",
      "minMatchValue",
      "minTrimQty",
      "targetValue",
      "maxExceptionPoint",
      "deadMaxRate"
    ],
    pageSize: pageSize,
    proxy: {
      type: "ajax",
      url: actionURL,
      requestMethod: "qryConfigEvenSetPage",
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
          title: "<span>" + "TRIM均匀性设置" + "</span>"
        },
        items: [createMainPanel()]
      }
    ]
  })
  return mainTabPanel
}

function showSaveFlowWin(data) {
  const baseForm = Ext.create("Ext.form.Panel", {
    layout: "border",
    name: "saveForm",
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
            xtype: "mycim.searchfield",
            fieldLabel: "产品号",
            allowBlank: false,
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
            // targetIds: "operationId",
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            value: data?.operationId ? data.operationId : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "类型",
            hidden: true,
            name: "type",
            itemId: "type",
            value: type
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
                xtype: "textfield",
                fieldLabel: "最小匹配度",
                allowBlank: false,
                name: "minMatchValue",
                itemId: "minMatchValue",
                value: data.isEdit ? data.minMatchValue : ""
            },
            {
                xtype: "textfield",
                fieldLabel: "死点最大占比(%)",
                allowBlank: false,
                name: "deadMaxRate",
                itemId: "deadMaxRate",
                value: data.isEdit ? data.deadMaxRate : ""
            },
          {
            xtype: "textfield",
            fieldLabel: "最小trim量",
            allowBlank: false,
            name: "minTrimQty",
            itemId: "minTrimQty",
            value: data.isEdit ? data.minTrimQty : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "氧化硅目标值",
            allowBlank: false,
            name: "targetValue",
            itemId: "targetValue",
            value: data.isEdit ? data.targetValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "最多异常点位数",
            allowBlank: false,
            name: "maxExceptionPoint",
            itemId: "maxExceptionPoint",
            value: data.isEdit ? data.maxExceptionPoint : ""
          },
          {
            fieldLabel: "cpRrn",
            name: "cpRrn",
            itemId: "cpRrn",
            hidden: true,
            value: data.isEdit ? data.cpRrn : 0
          },
          {
            fieldLabel: "rowRrn",
            name: "rowRrn",
            itemId: "rowRrn",
            hidden: true,
            value: data.isEdit ? data.rowRrn : 0
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

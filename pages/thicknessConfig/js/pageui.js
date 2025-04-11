/** @format */
const readOnlyFieldStyle = "background-color: rgb(247,248,248); border-color: silver #d9d9d9 #d9d9d9; color: gray;"
const pageSize = 20
//换液单列表
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
        iconCls: "iconCls_magnifier",
        handler: function () {
          refreshCurThickConfigGrid()
        }
      },
      {
        name: "resetBtn",
        text: "重置",
        iconCls: "iconCls_arrowRedo",
        handler: function () {
          conditionForm.getForm().findField("productId").setValue("")
        }
      }
    ]
  })
  return conditionForm
}

function createTabListGrid(type) {
  const tabListStore = createTabListStore(type)
  const tabListGrid = Ext.create("Ext.grid.Panel", {
    name: "tabListGrid",
    store: tabListStore,
    width: "100%",
    region: "center",
    selModel: Ext.create("Ext.selection.CheckboxModel", { checkOnly: true }),
    multiSelect: true,
    columns: [
      { dataIndex: "rowRrn", align: "left", hidden: true },
      { dataIndex: "type", align: "left", hidden: true },
      { dataIndex: "productId", align: "left", flex: 1, text: "产品号" },
      { dataIndex: "paramId", align: "left", flex: 1, text: "参数" },
      { dataIndex: "processId", align: "left", flex: 1, text: "流程号" },
      { dataIndex: "routeId", align: "left", flex: 1, text: "工序" },
      { dataIndex: "stepId", align: "left", flex: 1, text: "工步" },
      { dataIndex: "kValue", align: "left", flex: 1, text: "K值" },
      { dataIndex: "bValue", align: "left", flex: 1, text: "b值" },
      { dataIndex: "targetCenterValue", align: "left", flex: 1, text: "目标中心值" },
      { dataIndex: "lslValue", align: "left", flex: 1, text: "LSL(下限值)" },
      { dataIndex: "uslValue", align: "left", flex: 1, text: "USL(上限值)" },
      { dataIndex: "updateTimeStr", align: "left", flex: 1, text: "操作时间" },
      { dataIndex: "updateUserId", align: "left", flex: 1, text: "操作人" }
    ],
    dockedItems: [
      {
        xtype: "toolbar",
        dock: "top",
        items: [
          { xtype: "button", text: "添加", width: 80, name: "addBtn", iconCls: "iconCls_add" },
          { xtype: "button", text: "删除", width: 80, name: "delBtn", iconCls: "iconCls_delete" }
        ]
      }
    ],
    bbar: Ext.create("MyCim.PagingToolbar", {
      store: tabListStore
    })
  })
  const addBtn = tabListGrid.query('[name="addBtn"]')[0]
  addBtn.on({
    click: function () {
      showSaveWin({ type: type })
    }
  })
  const delBtn = tabListGrid.query('[name="delBtn"]')[0]
  delBtn.on({
    click: function () {
      delThickConfig()
    }
  })

  tabListGrid.on({
    itemdblclick: function (grid, record, item, rowindex, e, opts) {
      const data = record.data
      data.isEdit = true
      showSaveWin(record.data)
    }
  })
  return tabListGrid
}

function createTabListStore(type) {
  const tabListStore = Ext.create("Ext.data.Store", {
    storeId: "tabListStore",
    fields: [
      "rowRrn",
      "type",
      "productId",
      "paramId",
      "kValue",
      "bValue",
      "targetCenterValue",
      "lslValue",
      "uslValue",
      "updateTimeStr",
      "updateUserId",
      "processId",
      "routeId",
      "stepId"
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
    items: [createConditionForm(), createGridTabPanel()]
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
          title: "<span>" + "膜厚配置" + "</span>"
        },
        items: [createMainPanel()]
      }
    ]
  })
  return mainTabPanel
}

function createGridTabPanel() {
  const gridTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "gridTabPanel",
    activeTab: 0,
    items: [
      //选项卡中的每一项选项设置
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "膜厚配置1" + "</span>"
        },
        items: [createTabListGrid("0")]
      },
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "膜厚配置2" + "</span>"
        },
        items: [createTabListGrid("1")]
      }
    ]
  })
  gridTabPanel.on({
    tabchange: (panel, newCard, oldCard) => {
      refreshCurThickConfigGrid()
    }
  })
  return gridTabPanel
}

function showSaveWin(data) {
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
            type: "PROCESS",
            targetIds: "processId",
            readOnly: data?.isEdit,
            fieldStyle: data?.isEdit ? readOnlyFieldStyle : "",
            value: data?.processId ? data.processId : "",
            allowOnlyWhitespace: false
          },
          {
            xtype: "mycim.searchfield",
            fieldLabel: "工序号",
            allowBlank: false,
            name: "routeId",
            itemId: "routeId",
            type: "ROUTE",
            targetIds: "routeId",
            readOnly: data?.isEdit,
            fieldStyle: data?.isEdit ? readOnlyFieldStyle : "",
            value: data?.routeId ? data.routeId : ""
          },
          {
            xtype: "mycim.searchfield",
            fieldLabel: "工步号",
            allowBlank: false,
            name: "stepId",
            itemId: "stepId",
            type: "OPERATION",
            targetIds: "stepId",
            readOnly: data?.isEdit,
            fieldStyle: data?.isEdit ? readOnlyFieldStyle : "",
            value: data?.stepId ? data.stepId : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "参数",
            allowBlank: false,
            readOnly: data,
            name: "paramId",
            itemId: "paramId",
            readOnly: data?.isEdit,
            fieldStyle: data?.isEdit ? readOnlyFieldStyle : "",
            value: data?.paramId ? data.paramId : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "K值",
            allowBlank: false,
            name: "kValue",
            itemId: "kValue",
            value: data?.kValue ? data.kValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "b值",
            allowBlank: false,
            name: "bValue",
            itemId: "bValue",
            value: data?.bValue ? data.bValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "目标中心值",
            allowBlank: false,
            name: "targetCenterValue",
            itemId: "targetCenterValue",
            value: data?.targetCenterValue ? data.targetCenterValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "LSL(下限值)",
            allowBlank: false,
            name: "lslValue",
            itemId: "lslValue",
            value: data?.lslValue ? data.lslValue : ""
          },
          {
            xtype: "textfield",
            fieldLabel: "USL(上限值)",
            allowBlank: false,
            name: "uslValue",
            itemId: "uslValue",
            value: data?.uslValue ? data.uslValue : ""
          },
          {
            xtype: "textfield",
            hidden: true,
            name: "type",
            itemId: "type",
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
    modal: true, // 模态化窗口
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    title: data?.isEdit ? "修改" : "新增",
    constrain: true, // 限制窗口拖动范围
    id: "eqptPMWindow",
    items: [baseForm],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function (btn, e, eOpts) {
          saveThickConfig(btn)
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

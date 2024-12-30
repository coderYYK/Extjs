/** @format */
function createConditionForm() {
  const conditionForm = Ext.create("Ext.form.Panel", {
    id: "conditionForm",
    bodyPadding: 5,
    width: "100%",
    layout: "column",
    region: "north",
    defaults: {
      labelWidth: 80,
      labelAlign: "right"
    },
    items: [
      {
        xtype: "mycim.searchfield",
        type: "PRODUCTEXPER",
        targetIds: "productId",
        itemId: "productId",
        name: "productId",
        fieldLabel: "产品名:",
        columnWidth: 0.24,
        value: "",
        oldValue: "",
        allowOnlyWhitespace: false,
        listeners: {
          blur: function () {
            clearPage()
            var form = this.up("form")
            var thisForm = form.getForm()

            var productIdCmp = thisForm.findField("productId")
            var productId = productIdCmp.getValue()
            var productVersionStore = Ext.StoreManager.lookup("productVersionStore")
            var processIdCmp = thisForm.findField("processId")

            var processVersionCmp = thisForm.findField("processVersion")
            var processVersionStore = Ext.StoreManager.lookup("processVersionStore")

            if (!productId) {
              form.getForm().reset()
              return
            }

            processIdCmp.setValue("")
            processIdCmp.oldValue = ""
            processVersionCmp.setValue("")
            processVersionStore.loadData([])

            var params = {
              productId: productId
            }

            Ext.Ajax.request({
              url: actionURL,
              requestMethod: "queryComboboxItemsByProduct",
              params: params,
              success: function (response, opts) {
                if (response.processId) {
                  processIdCmp.oldValue = response.processId
                  processIdCmp.setValue(response.processId)
                  if (response.processVersion) {
                    processVersionCmp.setValue("")
                    processVersionStore.loadData(response.processVersion)
                    processVersionCmp.setValue(response.processVersion[0].key)

                    var params = {
                      processId: processIdCmp.getValue(),
                      processVersion: processVersionCmp.getValue(),
                      productId: productIdCmp.getValue()
                    }
                    productVersionStore.getProxy().extraParams = params
                    productVersionStore.load()
                  }
                }
              }
            })
          }
        }
      },
      {
        xtype: "combobox",
        itemId: "productVersion",
        name: "productVersion",
        fieldLabel: "产品版本:",
        displayField: "value",
        valueField: "key",
        queryMode: "local",
        columnWidth: 0.24,
        // editable: false,
        enableKeyEvents: true,
        allowBlank: false,
        allowOnlyWhitespace: false,
        store: Ext.create("Ext.data.Store", {
          storeId: "productVersionStore",
          fields: ["key", "value"],
          autoLoad: false,
          proxy: {
            type: "ajax",
            requestMethod: "queryProductVersions",
            url: actionURL,
            reader: {
              root: "msg"
            }
          },
          listeners: {
            load: function (store, records) {
              var productVersionCmp = Ext.getCmp("conditionForm").getForm().findField("productVersion")
              if (records.length == 0) {
                productVersionCmp.setValue("")
              }
              if (records.length > 0) {
                productVersionCmp.setValue(records[0].get("key"))
              }
            }
          }
        })
      },
      {
        xtype: "mycim.searchfield",
        type: "PROCESS",
        targetIds: "processId",
        itemId: "processId",
        name: "processId",
        fieldLabel: "流程号:",
        columnWidth: 0.24,
        value: "",
        oldValue: "",
        dataPermission: true,
        allowBlank: false,
        enableKeyEvents: true,
        queryMode: "local",
        allowOnlyWhitespace: false,
        listeners: {
          blur: function () {
            clearPage()
            var form = this.up("form")
            var thisForm = form.getForm()
            var processIdCmp = thisForm.findField("processId")
            var processId = processIdCmp.getValue()

            var processVersionCmp = thisForm.findField("processVersion")
            var processVersionStore = Ext.StoreManager.lookup("processVersionStore")

            if (!processId) {
              processIdCmp.oldValue = ""
              processVersionCmp.setValue("")
              processVersionStore.loadData([])
              return
            }

            processVersionStore.getProxy().extraParams = {
              processId: processId
            }
            processVersionStore.load({
              doSuccessCallback: function (records) {
                if (records.length === 0) {
                  processVersionCmp.setValue("")
                }
                if (records.length > 0) {
                  processVersionCmp.setValue(records[0].get("key"))
                }
              }
            })

            processId = processId.toUpperCase()
            processIdCmp.setValue(processId)
          }
        }
      },
      {
        xtype: "combobox",
        itemId: "processVersion",
        name: "processVersion",
        fieldLabel: "流程版本:",
        displayField: "value",
        valueField: "key",
        queryMode: "local",
        columnWidth: 0.24,
        editable: false,
        enableKeyEvents: true,
        store: Ext.create("Ext.data.Store", {
          storeId: "processVersionStore",
          fields: ["key", "value"],
          autoLoad: false,
          proxy: {
            type: "ajax",
            url: actionURL,
            requestMethod: "queryComboboxItemsForProcessVersion",
            reader: {
              root: "msg"
            }
          },
          listeners: {
            load: function (store, records) {
              var processVersionCmp = Ext.getCmp("conditionForm").getForm().findField("processVersion")
              if (records.length === 0) {
                processVersionCmp.setValue("")
              }
              if (records.length > 0) {
                processVersionCmp.setValue(records[0].get("key"))
              }
            }
          }
        }),
        listeners: {
          // keyup: function (cmp, e) {
          //   if (e.getKey() === 13) {
          //     me.doSearch()
          //   }
          // }
        }
      },
      {
        xtype: "button",
        text: "查看",
        formBind: true,
        style: {
          marginLeft: "10px"
        },
        iconCls: "iconCls_magnifier",
        handler: function () {
          refreshOperationGrid()
          refreshEqptGrid()
          refreshbBindGrid()
        }
      },
      {
        xtype: "button",
        text: "绑定",
        style: {
          marginLeft: "20px"
        },
        iconCls: "iconCls_Link",
        handler: function () {
          bindOperationEqpt()
        }
      }
    ]
  })
  return conditionForm
}

function createOperationStore() {
  const operationStore = Ext.create("Ext.data.TreeStore", {
    fields: [
      {
        name: "productId"
      },
      {
        name: "productRrn"
      },
      {
        name: "processId"
      },
      {
        name: "processRrn"
      },
      {
        name: "isRoute"
      },
      {
        name: "seq"
      },
      {
        name: "routeId"
      },
      {
        name: "routeDesc"
      },
      {
        name: "routeRrn"
      },
      {
        name: "operationId"
      },
      {
        name: "operationDesc"
      },
      {
        name: "recipeId"
      },
      {
        name: "eqptRecipe"
      },
      {
        name: "recipeDesc"
      },
      {
        name: "operationType"
      },
      {
        name: "processLocation"
      },
      {
        name: "selected"
      },
      {
        name: "selected"
      },
      {
        name: "rownum"
      },
      {
        name: "flowSeq"
      }
    ],
    autoLoad: false,
    folderSort: true
  })
  return operationStore
}

function createOperationGrid() {
  const operationStore = createOperationStore()
  const operationGrid = Ext.create("Ext.tree.Panel", {
    id: "operationGrid",
    maskDisabled: false,
    rootVisible: false,
    store: operationStore,
    width: "100%",
    region: "center",
    selModel: {
      mode: "SINGLE", // Ensures only one row can be selected at a time
      allowDeselect: false // Prevents deselecting the selected row by clicking on it again
    },
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
        dataIndex: "productId",
        text: "产品号",
        hidden: true
      },
      {
        dataIndex: "productRrn",
        text: "productRrn",
        hidden: true
      },
      {
        dataIndex: "processId",
        text: "流程号",
        hidden: true
      },
      {
        dataIndex: "processRrn",
        text: "processRrn",
        hidden: true
      },
      {
        dataIndex: "isRoute",
        text: "isRoute",
        hidden: true
      },
      {
        xtype: "treecolumn",
        dataIndex: "seq",
        text: "序号",
        width: 150
        // flex: 1
      },
      {
        dataIndex: "flowSeq",
        text: "流程序号",
        width: 80
      },
      {
        dataIndex: "routeId",
        width: 100,
        text: "工序号" // '工序号'
      },
      {
        dataIndex: "routeDesc",
        text: "工序描述",
        width: 150
      },
      {
        dataIndex: "routeRrn",
        text: "routeRrn",
        hidden: true
      },
      {
        dataIndex: "operationId",
        width: 100,
        text: "工步号"
      },
      {
        dataIndex: "operationDesc",
        width: 150,
        text: "工步描述"
      },
      {
        dataIndex: "eqptRecipe",
        flex: 1,
        text: "菜单号" // '工艺菜单号'
      },
      {
        dataIndex: "recipeDesc",
        flex: 1,
        text: "菜单描述",
        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
          metaData.tdAttr = 'data-qtip="' + value + '"'
          return value
        }
      },
      {
        dataIndex: "operationType",
        width: 80,
        text: "工步类型" // '步骤类型'
      },
      {
        dataIndex: "processLocation",
        width: 80,
        text: "流程位置" // '流程位置'
      },
      {
        dataIndex: "rownum",
        text: "rownum",
        hidden: true
      },
      {
        xtype: "checkcolumn",
        header: "选择",
        dataIndex: "selected",
        width: 50,
        stopSelection: false,
        menuDisabled: true,
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
          if (!record.data.leaf) {
            return ""
          } else {
            return new Ext.grid.column.CheckColumn().renderer(value)
          }
        },
        listeners: {
          checkchange: function (column, rowIndex, checked, eOpts) {
            // Loop through the store and uncheck all other rows
            singleOperationTreeGridSelect(Ext.getCmp("operationGrid").getStore().getRootNode(), rowIndex)
            refreshEqptGrid()
            refreshbBindGrid()
          }
        }
      }
    ]
  })
  return operationGrid
}

function createOperationPanel() {
  const operationPanel = Ext.create("Ext.panel.Panel", {
    title: "工步信息",
    region: "west",
    width: "70%",
    layout: { type: "border" },
    items: [createConditionForm(), createOperationGrid()]
  })
  return operationPanel
}

function createEqptPanel() {
  const eqptPanel = Ext.create("Ext.panel.Panel", {
    title: "实验设备",
    region: "center",
    layout: { type: "border" },
    items: [createEqptTreePanel(), createBindPanel()]
  })
  return eqptPanel
}

function createEqptTreePanel() {
  const eqptTreePanel = Ext.create("Ext.tree.Panel", {
    region: "center",
    autoScroll: true,
    maskDisabled: false,
    rootVisible: false,
    id: "EqptTree",
    viewConfig: {
      markDirty: false,
      // 给表格行添加样式
      getRowClass(record, rowIndex, rowParams, store) {
        if (record.data.bindFlag) {
          return "treegrid-row-style-yellow"
        }
      }
    },
    tbar: [
      {
        xtype: "textfield",
        width: "70%",
        cls: "my-border-none-textfield",
        id: "eqptField",
        emptyText: "设备号/设备描述"
      },
      {
        xtype: "button",
        text: "刷新",
        width: "15%",
        id: "refresh",
        iconCls: "iconCls_arrow_refresh",
        listeners: {
          click: function () {
            refreshEqptGrid()
          }
        }
      }
    ],
    // root: {
    //   text: "设备",
    //   cls: "status-run",
    //   id: "EqptTreeNode"
    // },
    store: {
      // proxy: {
      //   type: "ajax",
      //   reader: "json",
      //   url: "data/tree.json"
      // },
      proxy: {
        type: "ajax",
        url: actionURL,
        extraParams: { experFlag: "1" },
        requestMethod: "getEqpTree"
      },
      fields: ["id", "text", "iconCls", "leaf", "entityId", "qtip", "status", "bindFlag"]
    },
    listeners: {
      load: function () {
        expandTreeNode(Ext.getCmp("EqptTree"))
      }
    }
  })
  return eqptTreePanel
}

function createBindStore() {
  const bindStore = Ext.create("Ext.data.Store", {
    storeId: "bindStore",
    fields: ["productId", "operationId", "eqptId", "productRrn", "operationRrn", "eqptRrn"],
    proxy: {
      type: "ajax",
      url: actionURL,
      requestMethod: "getBindEqpts"
    }
  })
  return bindStore
}

function createBindPanel() {
  const bindStore = createBindStore()
  const bindGrid = Ext.create("Ext.grid.Panel", {
    name: "bindGrid",
    forceFit: true,
    id: "bindGrid",
    selModel: Ext.create("Ext.selection.CheckboxModel", { checkOnly: true }),
    multiSelect: true,
    // title: "信息列表",
    store: bindStore,
    region: "south",
    height: 200,
    width: "100%",
    columns: [
      { dataIndex: "productRrn", hidden: true },
      { dataIndex: "operationRrn", hidden: true },
      { dataIndex: "eqptRrn", hidden: true },
      { dataIndex: "productId", align: "center", flex: 1, text: "产品号" },
      { dataIndex: "operationId", align: "center", flex: 1, text: "工步号" },
      { dataIndex: "eqptId", align: "center", flex: 1, text: "设备号" }
    ],
    dockedItems: [
      {
        xtype: "toolbar",
        items: [
          {
            id: "unbindBtn",
            text: "解绑",
            iconCls: "iconCls_delete",
            handler: function () {
              unbindOperationEqpts()
            }
          }
        ]
      }
    ]
  })
  return bindGrid
}

function createMainPanel() {
  const eqptPanel = Ext.create("Ext.panel.Panel", {
    region: "center",
    layout: { type: "border" },
    items: [createOperationPanel(), createEqptPanel()]
  })
  return eqptPanel
}

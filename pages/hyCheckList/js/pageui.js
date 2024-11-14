/** @format */
// const checkListDatas = [
//   { checkListRrn: 100001, checkListId: "换液单001", checkListDesc: "换液单001描述" },
//   { checkListRrn: 100002, checkListId: "换液单002", checkListDesc: "换液单002描述" },
//   { checkListRrn: 100003, checkListId: "换液单003", checkListDesc: "换液单003描述" },
//   { checkListRrn: 100004, checkListId: "换液单004", checkListDesc: "换液单004描述" },
//   { checkListRrn: 100005, checkListId: "换液单005", checkListDesc: "换液单005描述" },
//   { checkListRrn: 100006, checkListId: "换液单006", checkListDesc: "换液单006描述" },
//   { checkListRrn: 100007, checkListId: "换液单007", checkListDesc: "换液单007描述" },
//   { checkListRrn: 100008, checkListId: "换液单008", checkListDesc: "换液单008描述" },
//   { checkListRrn: 100009, checkListId: "换液单009", checkListDesc: "换液单009描述" },
//   { checkListRrn: 100010, checkListId: "换液单010", checkListDesc: "换液单010描述" }
// ]
// const matDatas = [
//   { supplyId: 100001, supplyDesc: "工艺耗材001", standardQty: 100 },
//   { supplyId: 100002, supplyDesc: "工艺耗材002", standardQty: 100 },
//   { supplyId: 100003, supplyDesc: "工艺耗材003", standardQty: 100 },
//   { supplyId: 100004, supplyDesc: "工艺耗材004", standardQty: 100 },
//   { supplyId: 100005, supplyDesc: "工艺耗材005", standardQty: 100 },
//   { supplyId: 100006, supplyDesc: "工艺耗材006", standardQty: 100 },
//   { supplyId: 100007, supplyDesc: "工艺耗材007", standardQty: 100 },
//   { supplyId: 100008, supplyDesc: "工艺耗材008", standardQty: 100 },
//   { supplyId: 100009, supplyDesc: "工艺耗材009", standardQty: 100 },
//   { supplyId: 100010, supplyDesc: "工艺耗材010", standardQty: 100 }
// ]
// const eqptGroups = [
//   { instanceId: 100001, instanceDesc: "工艺耗材001" },
//   { instanceId: 100002, instanceDesc: "工艺耗材002" },
//   { instanceId: 100003, instanceDesc: "工艺耗材003" },
//   { instanceId: 100004, instanceDesc: "工艺耗材004" },
//   { instanceId: 100005, instanceDesc: "工艺耗材005" },
//   { instanceId: 100006, instanceDesc: "工艺耗材006" },
//   { instanceId: 100007, instanceDesc: "工艺耗材007" },
//   { instanceId: 100008, instanceDesc: "工艺耗材008" },
//   { instanceId: 100009, instanceDesc: "工艺耗材009" },
//   { instanceId: 100010, instanceDesc: "工艺耗材010" },
//   { instanceId: 100008, instanceDesc: "工艺耗材008" },
//   { instanceId: 100009, instanceDesc: "工艺耗材009" },
//   { instanceId: 100010, instanceDesc: "工艺耗材010" }
// ]

//换液单列表
function createCheckListForm() {
  const checkListForm = Ext.create("Ext.form.Panel", {
    id: "checkListForm",
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
        xtype: "textfield",
        fieldLabel: "换液检查单号",
        name: "checkListId"
      }
    ],
    buttons: [
      {
        name: "qryBtn",
        text: i18n.labels.LBS_QUERY,
        iconCls: "iconCls_magnifier"
      },
      {
        name: "resetBtn",
        text: i18n.labels.LBS_RESET,
        iconCls: "iconCls_arrowRedo"
      }
    ]
  })
  const qryBtn = checkListForm.query('[name="qryBtn"]')[0]
  qryBtn.on({
    click: function () {
      refreshCheckListGrid()
    }
  })
  const resetBtn = checkListForm.query('[name="resetBtn"]')[0]
  resetBtn.on({
    click: function () {
      clearCheckListForm()
    }
  })
  return checkListForm
}

function createCheckListGrid() {
  const checkListStore = createCheckListStore()
  const checkListGrid = Ext.create("Ext.grid.Panel", {
    id: "checkListGrid",
    store: checkListStore,
    width: "100%",
    region: "center",
    // selModel: new Ext.selection.CheckboxModel({ checkOnly: true }),
    // multiSelect: true,
    columns: [
      { dataIndex: "checkListRrn", hidden: true },
      { dataIndex: "checkListId", align: "left", flex: 1, text: "换液检查单号" },
      { dataIndex: "checkListDesc", align: "left", flex: 1, text: "换液检查单描述" }
    ],
    dockedItems: [
      {
        xtype: "toolbar",
        dock: "top",
        items: [{ xtype: "button", text: "添加", width: 80, name: "addBtn" }]
      }
    ],
    bbar: Ext.create("MyCim.PagingToolbar", {
      store: checkListStore
    })
  })
  const addBtn = checkListGrid.query('[name="addBtn"]')[0]
  addBtn.on({
    click: function () {
      addCheckListDetailTab()
    }
  })
  checkListGrid.on({
    itemdblclick: function (grid, record, item, rowindex, e, opts) {
      showCheckListDetailTab(grid, record, item, rowindex, e, opts)
    }
  })
  return checkListGrid
}

function createCheckListStore() {
  const checkListStore = Ext.create("Ext.data.Store", {
    storeId: "checkListStore",
    fields: ["checkListRrn", "checkListId", "checkListDesc"],
    autoLoad: true,
    pageSize: 20,
    proxy: {
      type: "ajax",
      url: actionUrl,
      requestMethod: "qryChecklists",
      reader: {
        root: "results",
        totalProperty: "totalItems"
      }
    },
    listeners: {
      scope: this,
      beforeload: function () {
        // 组装数据
        const sendData = Ext.getCmp("checkListForm").getForm().getValues()
        Ext.apply(checkListStore.proxy.extraParams, sendData)
      }
    }
  })
  return checkListStore
}

function createCheckListMainPanel() {
  const checkListPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [createCheckListForm(), createCheckListGrid()]
  })
  return checkListPanel
}

function createCheckListDetailForm() {
  const checkListDetailForm = Ext.create("Ext.form.Panel", {
    name: "checkListDetailForm",
    bodyPadding: 5,
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      labelWidth: 100,
      labelAlign: "left",
      padding: "5"
    },
    items: [
      {
        xtype: "textfield",
        name: "checkListRrn",
        hidden: true
      },
      {
        xtype: "textfield",
        fieldLabel: "换液检查单号",
        name: "checkListId",
        columnWidth: 0.5
      },
      {
        xtype: "textfield",
        fieldLabel: "检查单类型",
        name: "checkListType",
        columnWidth: 0.5,
        value: "HY",
        readOnly: true
      },
      {
        xtype: "textfield",
        fieldLabel: "检查单描述",
        name: "checkListDesc",
        columnWidth: 0.5
      },
      {
        xtype: "triggerfield",
        fieldLabel: "设备组",
        name: "eqptGroupIds",
        columnWidth: 0.5,
        editable: false,
        triggerCls: Ext.baseCSSPrefix + "form-search-trigger",
        onTriggerClick: function () {
          const searchWin = createSearchWin(checkListDetailForm)
          const value = checkListDetailForm.getForm().findField("eqptGroupIds").getValue()

          if (value) {
            searchWin.down("[name=searchForm]").getForm().findField("eqptGroupIds").setValue(value)
          }
          searchWin.show()
        }
      },
      {
        xtype: "mycim.searchfield",
        fieldLabel: "表单用户",
        name: "userId",
        columnWidth: 0.5,
        type: "User",
        targetIds: "userId",
        editable: false
      }
    ],
    buttons: [
      {
        name: "saveBtn",
        text: "保存",
        formBind: true,
        iconCls: "iconCls_magnifier"
      },
      {
        name: "delBtn",
        text: "删除",
        iconCls: "iconCls_arrowRedo"
      }
    ]
  })
  const saveBtn = checkListDetailForm.query('[name="saveBtn"]')[0]
  saveBtn.on({
    click: function (btn, e, eOpts) {
      saveCheckListDetail(btn)
    }
  })
  const delBtn = checkListDetailForm.query('[name="delBtn"]')[0]
  delBtn.on({
    click: function (btn, e, eOpts) {
      delCheckListDetail(btn)
    }
  })
  return checkListDetailForm
}

function createCheckListSuppliesStore() {
  const checkListDetailSuppliesStore = Ext.create("Ext.data.Store", {
    storeId: "checkListDetailSuppliesStore",
    fields: ["supplyId", "supplyDesc", "standardQty"]
  })
  return checkListDetailSuppliesStore
}

function createCheckListDetailSuppliesGrid() {
  const checkListDetailSuppliesStore = createCheckListSuppliesStore()
  const checkListDetailSuppliesGrid = Ext.create("Ext.grid.Panel", {
    name: "checkListDetailSuppliesGrid",
    store: checkListDetailSuppliesStore,
    width: "100%",
    region: "center",
    columns: [
      { dataIndex: "supplyId", align: "left", flex: 1, text: "工艺耗材号" },
      { dataIndex: "supplyDesc", align: "left", flex: 1, text: "工艺耗材描述" },
      { dataIndex: "standardQty", align: "left", flex: 1, text: "标准用量" },
      {
        xtype: "actioncolumn",
        header: "操作",
        flex: 1,
        items: [
          {
            iconCls: "iconCls_cancel",
            tooltip: "Delete",
            handler: function (grid, rowIndex, colIndex) {
              grid.getStore().removeAt(rowIndex)
            }
          }
        ]
      }
    ],
    dockedItems: [
      {
        xtype: "toolbar",
        dock: "top",
        items: [{ xtype: "button", text: "添加", width: 80, name: "addBtn" }]
      }
    ]
  })
  const addBtn = checkListDetailSuppliesGrid.query('[name="addBtn"]')[0]
  addBtn.on({
    click: function (btn, e, eOpts) {
      const suppliesWindow = Ext.getCmp("suppliesWindow")
      if (suppliesWindow) {
        suppliesWindow.close()
      }
      const suppliesWin = createCheckListSuppliesWin()

      const checkListDetailForm = btn.up('[name="checkListDetailPanel"]').down("[name=checkListDetailForm]").getForm()
      const suppliesForm = suppliesWin.down("[name=suppliesForm]").getForm()
      suppliesForm.findField("checkListRrn").setValue(checkListDetailForm.findField("checkListRrn").getValue())
      suppliesForm.findField("checkListId").setValue(checkListDetailForm.findField("checkListId").getValue())
      suppliesWin.show()
    }
  })
  return checkListDetailSuppliesGrid
}

function createCheckListDetailPanel() {
  const checkListDetailPanel = Ext.create("Ext.panel.Panel", {
    name: "checkListDetailPanel",
    layout: { type: "border" },
    items: [createCheckListDetailForm(), createCheckListDetailSuppliesGrid()]
  })
  return checkListDetailPanel
}

function createCheckListTabPanel() {
  const checkListTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "checkListTabPanel",
    activeTab: 0,
    items: [
      //选项卡中的每一项选项设置
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "换液检查单" + "</span>"
        },
        items: [createCheckListMainPanel()]
      }
    ],
    // plugins: [me.createTabCloseMenu()],
    listeners: {
      // tabchange: doHandleTab,
      // remove: function () {
      //   tabCount -= 1
      // }
    }
  })
  return checkListTabPanel
}

function createCheckListSuppliesWin() {
  const suppliesForm = Ext.create("Ext.form.Panel", {
    name: "suppliesForm",
    frame: true,
    bodyPadding: 10,
    defaultType: "textfield",
    defaults: {
      anchor: "100%",
      margin: "20 0"
    },
    items: [
      {
        name: "checkListRrn",
        hidden: true
      },
      {
        fieldLabel: "检查单号:",
        name: "checkListId",
        readOnly: true
      },
      {
        xtype: "mycim.searchfield",
        fieldLabel: "工艺耗材号",
        name: "supplyId",
        columnWidth: 0.5,
        type: "Craftsuppliessetting",
        targetIds: "supplyId|supplyDesc",
        editable: false,
        allowBlank: false
      },
      {
        fieldLabel: "工艺耗材描述:",
        name: "supplyDesc",
        readOnly: true
      },
      {
        xtype: "numberfield",
        fieldLabel: "标准用量",
        allowBlank: false,
        name: "standardQty",
        allowDecimals: true,
        decimalPrecision: 4,
        enforceMaxLength: true,
        maxLength: 8
      }
    ]
  })

  const suppliesWin = Ext.create("Ext.window.Window", {
    width: 500,
    height: 300,
    modal: true, // 是否需要遮罩
    layout: "fit",
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    title: "工艺耗材",
    constrain: true, // 限制窗口拖动范围
    name: "suppliesWindow",
    id: "suppliesWindow",
    items: [suppliesForm],
    buttons: [
      {
        text: "保存",
        handler: function () {
          saveCheckListSupplie()
        }
      },
      {
        text: "重置",
        style: "margin-left:10px",
        id: "resetBtn",
        handler: function () {
          const suppliesForm = suppliesWin.down("[name=suppliesForm]").getForm()
          suppliesForm.findField("supplyId").setValue("")
          suppliesForm.findField("standardQty").setValue("")
          suppliesForm.findField("supplyDesc").setValue("")
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          suppliesWin.close()
        }
      }
    ]
  })
  return suppliesWin
}

function createSearchWin(form) {
  if (Ext.getCmp("searchWin")) {
    Ext.getCmp("searchWin").close()
  }

  // 保存已选择的记录
  let selectedRecordsIds = []
  const searchForm = Ext.create("Ext.form.Panel", {
    name: "searchForm",
    // title: "查询条件",
    anchor: "100%",
    region: "north",
    items: [
      {
        xtype: "container",
        layout: "column",
        style: {
          marginTop: "5px",
          marginBottom: "5px",
          marginLeft: "10px"
        },
        defaults: {
          labelWidth: 100,
          labelAlign: "right",
          xtype: "textfield",
          width: 350
        },
        items: [
          {
            xtype: "textfield",
            fieldLabel: "设备组号:",
            name: "eqptGroupIds"
          }
        ]
      }
    ],
    buttons: [
      {
        text: "查询",
        iconCls: "iconCls_magnifier",
        marginRight: "10px",
        handler: function () {
          selectedRecordsIds = []
          searchGrid.getSelectionModel().deselectAll()
          Ext.getCmp("searchGrid").store.loadPage(1)
        }
      }
    ]
  })
  const pageSize = 10
  const searchStore = Ext.create("Ext.data.Store", {
    storeId: "checkListDetailSuppliesStore",
    fields: ["instanceId", "instanceDesc"],
    pageSize: pageSize,
    autoLoad: true,
    // data: eqptGroups,
    proxy: {
      type: "ajax",
      url: actionUrl,
      requestMethod: "searchEqptGroups",
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
        const sendData = searchForm.getForm().getValues()
        Ext.apply(searchStore.proxy.extraParams, sendData)
      }
    }
  })

  const searchGrid = Ext.create("Ext.grid.Panel", {
    name: "searchGrid",
    forceFit: true,
    id: "searchGrid",
    selModel: Ext.create("Ext.selection.CheckboxModel", { checkOnly: true }),
    multiSelect: true,
    // title: "信息列表",
    store: searchStore,
    region: "center",
    width: "100%",
    columns: [
      { dataIndex: "instanceId", align: "center", flex: 1, text: "设备组号" },
      { dataIndex: "instanceDesc", align: "left", flex: 1, text: "设备组描述" }
    ],
    bbar: Ext.create("MyCim.PagingToolbar", {
      store: searchStore
    })
  })
  // 监听选择事件
  searchGrid.getSelectionModel().on("select", function (sm, record, index) {
    if (selectedRecordsIds.includes(record.data.instanceId)) {
      return
    }
    selectedRecordsIds.push(record.data.instanceId)
  })
  searchGrid.getSelectionModel().on("deselect", function (sm, record, index) {
    selectedRecordsIds = selectedRecordsIds.filter((item) => item !== record.data.instanceId)
  })

  searchGrid.getStore().on("load", function (store, records) {
    // searchGrid.getSelectionModel().deselectAll()
    // 恢复之前选择的记录
    Ext.each(records, function (record) {
      if (selectedRecordsIds.includes(record.data.instanceId)) {
        searchGrid.getSelectionModel().select(record.index % pageSize, true)
      }
    })
  })

  const searchWin = Ext.create("Ext.window.Window", {
    width: 800,
    height: 500,
    modal: true, // 是否需要遮罩
    title: "设备组查询",
    layout: {
      type: "border",
      padding: 1
    },
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    name: "searchWin",
    id: "searchWin",
    items: [searchForm, searchGrid],
    buttons: [
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          selectedRecordsIds = []
          searchWin.close()
        }
      },
      {
        text: "确定",
        style: "margin-left:10px",
        handler: function () {
          if (selectedRecordsIds == null || selectedRecordsIds.length === 0) {
            MyCim.notify.msg("提示", "至少选择一条数据!!!")
            return
          } else {
            form.getForm().findField("eqptGroupIds").setValue(selectedRecordsIds.join())
            selectedRecordsIds = []
            searchWin.close()
          }
        }
      }
    ]
  })

  return searchWin
}

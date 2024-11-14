/** @format */
const eqpDatas = [
  { eqptId: "BCL001" },
  { eqptId: "BCL002" },
  { eqptId: "BCL003" },
  { eqptId: "BCL004" },
  { eqptId: "BCL005" },
  { eqptId: "BCL006" },
  { eqptId: "BCL007" },
  { eqptId: "BCL008" },
  { eqptId: "BCL009" },
  { eqptId: "BCL010" }
]
const productDatas = [
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" },
  { productId: "PCL001", productDesc: "PCL产品001" }
]

function createEqptStore() {
  const eqptStore = Ext.create("Ext.data.Store", {
    storeId: "eqptStore",
    data: eqpDatas,
    fields: ["eqptId"]
  })
  return eqptStore
}
function createEqptGrid() {
  const eqptStore = createEqptStore()
  const eqptGrid = Ext.create("Ext.grid.Panel", {
    name: "eqptGrid",
    store: eqptStore,
    width: "100%",
    flex: 1,
    hideHeaders: true,
    columns: [{ dataIndex: "eqptId", align: "left", flex: 1 }]
  })
  eqptGrid.on({
    itemclick: function () {
      refreshRelationGrid()
    }
  })
  return eqptGrid
}

function createEqptPanel() {
  const eqptPanel = Ext.create("Ext.panel.Panel", {
    id: "eqptPanel",
    width: 300,
    title: "实验设备",
    region: "west",
    resizable: true,
    layout: {
      type: "vbox"
    },
    items: [
      {
        xtype: "mycim.clearfield",
        name: "eqptId",
        emptyText: "请输入设备号",
        width: "100%"
      },
      createEqptGrid()
    ]
  })

  const eqptIdIp = eqptPanel.query('[name="eqptId"]')[0]
  eqptIdIp.on({
    specialkey: function (field, e) {
      if (e.getKey() == e.ENTER) {
        refreshEqptGrid()
      }
    }
  })
  return eqptPanel
}

//产品列表
function createFormPanel() {
  const productForm = Ext.create("Ext.form.Panel", {
    id: "productFormPanel",
    bodyPadding: 5,
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      columnWidth: 0.25,
      labelWidth: 80,
      labelAlign: "left",
      padding: "0 5"
    },
    items: [
      {
        xtype: "textfield",
        fieldLabel: "产品号",
        name: "eqptId"
      },
      {
        xtype: "mycim.searchfield",
        type: "PROCESS",
        targetIds: "processId",
        itemId: "processId",
        name: "processId",
        fieldLabel: "工艺流程号"
      },
      {
        xtype: "mycim.combobox",
        fieldLabel: "产品类型",
        itemId: "productType",
        name: "productType",
        editable: false,
        displayField: "value",
        keyField: "key"
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
  const qryBtn = productForm.query('[name="qryBtn"]')[0]
  qryBtn.on({
    click: function () {
      refreshProductGrid()
    }
  })
  const resetBtn = productForm.query('[name="resetBtn"]')[0]
  resetBtn.on({
    click: function () {
      clearProductForm()
    }
  })
  return productForm
}

function createProductGrid() {
  const productStore = createProductStore()
  const productGrid = Ext.create("Ext.grid.Panel", {
    id: "productGridPanel",
    store: productStore,
    width: "100%",
    region: "center",
    selModel: new Ext.selection.CheckboxModel({ checkOnly: true }),
    multiSelect: true,
    columns: [
      { dataIndex: "productId", align: "left", flex: 1, text: "产品号" },
      { dataIndex: "productDesc", align: "left", flex: 1, text: "产品描述" }
    ],
    dockedItems: [
      {
        xtype: "toolbar",
        dock: "top",
        items: [{ xtype: "button", text: "绑定", width: 80, name: "bindBtn" }]
      }
    ]
  })
  const resetBtn = productGrid.query('[name="bindBtn"]')[0]
  resetBtn.on({
    click: function () {
      bindEqptProduct()
    }
  })
  return productGrid
}

function createProductStore() {
  const productStore = Ext.create("Ext.data.Store", {
    storeId: "productStore",
    fields: ["productId", "productDesc"],
    data: productDatas
  })
  return productStore
}

function createProductPanel() {
  const productPanel = Ext.create("Ext.panel.Panel", {
    title: "产品列表",
    region: "center",
    layout: { type: "border" },
    items: [createFormPanel(), createProductGrid(), createRelationGrid()]
  })
  return productPanel
}
//绑定关系
function createRelationGrid() {
  const relationStore = createRelationStore()
  const relationGrid = Ext.create("Ext.grid.Panel", {
    id: "relationGrid",
    title: "绑定列表",
    resizable: true,
    store: relationStore,
    region: "south",
    height: 300,
    width: "100%",
    columns: [
      { dataIndex: "productId", align: "left", flex: 1, text: "产品号" },
      { dataIndex: "productDesc", align: "left", flex: 1, text: "产品描述" }
    ]
  })
  return relationGrid
}

function createRelationStore() {
  const relationStore = Ext.create("Ext.data.Store", {
    storeId: "relationStore",
    fields: ["productId", "productDesc"],
    data: productDatas
  })
  return relationStore
}

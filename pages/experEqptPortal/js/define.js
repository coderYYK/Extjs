/** @format */
function refreshEqptGrid() {
  const eqptPanel = Ext.getCmp("eqptPanel")
  const grid = eqptPanel.query('[name="eqptGrid"]')[0]
  const store = grid.store
  store.reload()
}

function refreshProductGrid() {
  const productFormPanel = Ext.getCmp("productFormPanel")
  const values = productFormPanel.getValues()
  const productGridPanel = Ext.getCmp("productGridPanel")
  const store = productGridPanel.store
  store.proxy.extraParams = values
  store.reload()
}

function clearProductForm() {
  const productFormPanel = Ext.getCmp("productFormPanel")
  productFormPanel.getForm().reset()
  refreshProductGrid()
}

function bindEqptProduct() {
  const eqptGrid = Ext.getCmp("eqptPanel").query('[name="eqptGrid"]')[0]
  var eqptRecords = eqptGrid.getSelectionModel().getSelection()
  if (eqptRecords.length <= 0) {
    showWarningAlert(window.CN0EN == "EN" ? "Please select exper equipment!" : "请选中要绑定的实验设备!")
    return
  }
  const productGridPanel = Ext.getCmp("productGridPanel")
  var pRecords = productGridPanel.getSelectionModel().getSelection()
  if (pRecords.length <= 0) {
    showWarningAlert(window.CN0EN == "EN" ? "Please select product!" : "请选择要绑定的产品!")
    return
  }
  const eqptId = eqptRecords[0].data.eqptId
  const productIds = pRecords.map((p) => p.data.productId).join(",")

  const unbindData = pRecords.map((p) => new Object({ productDesc: p.data.productDesc, productId: p.data.productId }))

  console.log(eqptId)
  console.log(productIds)
  console.log(unbindData)
}

function refreshRelationGrid() {
  const eqptGrid = Ext.getCmp("eqptPanel").query('[name="eqptGrid"]')[0]
  var eqptRecords = eqptGrid.getSelectionModel().getSelection()
  if (eqptRecords.length == 1) {
    const param = {
      eqptId: eqptRecords[0].eqptId
    }
    const relationGrid = Ext.getCmp("relationGrid")
    const store = relationGrid.store
    store.proxy.extraParams = param
    store.reload()
  }
}

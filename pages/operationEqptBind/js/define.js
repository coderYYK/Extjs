/** @format */

var actionURL = "/mycim2/proOperEqptBind.do"
function expandTreeNode(tree) {
  var rootNode = tree.getRootNode()
  var childNodes = rootNode.childNodes
  for (var i = 0; i < childNodes.length; i++) {
    childNodes[i].expand()
    var childNodes1 = childNodes[i].childNodes
    for (var j = 0; j < childNodes1.length; j++) {
      childNodes1[j].expand()
    }
  }
}

function refreshOperationGrid() {
  var form = Ext.getCmp("conditionForm").getForm()
  var operationGrid = Ext.getCmp("operationGrid")
  if (form.isValid()) {
    var operationStore = operationGrid.store
    // operationStore.setProxy({
    //     type: "ajax",
    //     reader: "json",
    //     url: "data/opration.json"
    // })
    operationStore.setProxy({
      type: "ajax",
      url: actionURL,
      requestMethod: "qryContextValueByProcessPre"
    })
    operationStore.proxy.extraParams = form.getValues()
    operationStore.load()
  }
}

function clearOperationGrid() {
  Ext.getCmp("operationGrid").getStore().getRootNode().removeAll()
}

function clearEqptGrid() {
  Ext.getCmp("EqptTree").getStore().getRootNode().removeAll()
}

function refreshEqptGrid() {
  const eqpt = Ext.getCmp("eqptField").getValue()
  const eqptTree = Ext.getCmp("EqptTree")
  const eqptStore = eqptTree.store

  const selectedOperationDatas = []
  var treeStore = Ext.getCmp("operationGrid").getStore() // 获取 TreeStore
  var rootNode = treeStore.getRootNode() // 获取根节点
  getOperationTreeGridData(rootNode, selectedOperationDatas)
  eqptStore.proxy.extraParams.eqpt = eqpt
  if (selectedOperationDatas.length === 1) {
    eqptStore.proxy.extraParams.productId = selectedOperationDatas[0].productId
    eqptStore.proxy.extraParams.operationId = selectedOperationDatas[0].operationId
  } else {
    eqptStore.proxy.extraParams.productId = ""
    eqptStore.proxy.extraParams.operationId = ""
  }
  eqptStore.load()
}

function refreshbBindGrid() {
  const bindGrid = Ext.getCmp("bindGrid")
  const bindStore = bindGrid.store

  const selectedOperationDatas = []
  var treeStore = Ext.getCmp("operationGrid").getStore() // 获取 TreeStore
  var rootNode = treeStore.getRootNode() // 获取根节点
  getOperationTreeGridData(rootNode, selectedOperationDatas)
  const params = {}
  if (selectedOperationDatas.length === 1) {
    params.productId = selectedOperationDatas[0].productId
    params.operationId = selectedOperationDatas[0].operationId
  }
  bindStore.proxy.extraParams = params
  bindStore.load()
}

function clearBindGrid() {
  Ext.getCmp("bindGrid").getStore().removeAll()
}

function clearPage() {
  clearOperationGrid()
  clearBindGrid()
  refreshEqptGrid()
}

function bindOperationEqpt() {
  const selectedOperationDatas = []
  const selectedEqptDatas = []
  var treeStore = Ext.getCmp("operationGrid").getStore() // 获取 TreeStore
  var rootNode = treeStore.getRootNode() // 获取根节点
  getOperationTreeGridData(rootNode, selectedOperationDatas)
  // console.log(selectedOperationDatas)

  if (selectedOperationDatas.length !== 1) {
    showWarningAlert("请选择工步!")
    return
  }

  var eqptTreeStore = Ext.getCmp("EqptTree").getStore() // 获取 TreeStore
  var eqptRootNode = eqptTreeStore.getRootNode() // 获取根节点
  getEqptTreeGridData(eqptRootNode, selectedEqptDatas)
  // console.log(selectedEqptDatas)
  if (selectedEqptDatas.length === 0) {
    showWarningAlert("请选择设备!")
    return
  }

  const params = {}
  params.productId = selectedOperationDatas[0].productId
  params.operationId = selectedOperationDatas[0].operationId
  params.eqptIds = selectedEqptDatas
    .map((obj) => {
      return obj.entityId
    })
    .join(",")

  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "bindOperationEqpt",
    params: params,
    success: function (resp, opts) {
      showSuccessAlert("工步:" + params.operationId + ",设备:" + params.eqptIds + "绑定成功!")
      refreshEqptGrid()
      refreshbBindGrid()
    },
    failure: function (resp, opts) {}
  })
}

function unbindOperationEqpts() {
  var records = Ext.getCmp("bindGrid").getSelectionModel().getSelection()
  if (records.length <= 0) {
    showWarningAlert("至少选择一条!!!")
    return
  }

  const recordsData = []
  for (let i = 0; i < records.length; i++) {
    recordsData.push(records[i].data)
  }

  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "unbindOperationEqpt",
    params: {
      unBindInfos: recordsData
    },
    success: function (resp, opts) {
      showSuccessAlert("解绑成功!")
      refreshEqptGrid()
      refreshbBindGrid()
    },
    failure: function (resp, opts) {}
  })
}

function getOperationTreeGridData(node, selectedOperationDatas) {
  if (node.data.selected) {
    selectedOperationDatas.push(node.data)
  }
  if (node.childNodes) {
    for (n of node.childNodes) {
      getOperationTreeGridData(n, selectedOperationDatas)
    }
  }
}

function getEqptTreeGridData(node, selectedEqptDatas) {
  if (node.data.checked) {
    selectedEqptDatas.push(node.data)
  }
  if (node.childNodes) {
    for (n of node.childNodes) {
      getEqptTreeGridData(n, selectedEqptDatas)
    }
  }
}
function singleOperationTreeGridSelect(node, rowIndex) {
  if (node.data.selected && node.data.rownum !== rowIndex) {
    node.data.selected = false
    Ext.getCmp("operationGrid").getView().refreshNode(node.data.rownum)
  }
  if (node.childNodes) {
    for (n of node.childNodes) {
      singleOperationTreeGridSelect(n, rowIndex)
    }
  }
}

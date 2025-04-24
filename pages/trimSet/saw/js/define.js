function destroyWindow(window) {
  if (window) {
    window.destroy()
  }
}
function saveCpFlowConfig(btn) {
  const form = btn.up("window").down("[name=saveForm]")
  const values = form.getForm().getValues()
  values.routeId = values.routeIdName
  values.operationId = values.operationIdName
  if (checkSaveValues(values)) {
    Ext.Ajax.request({
      url: actionURL,
      requestMethod: "saveConfigPage",
      params: values,
      success: function (response) {
        showSuccessAlert("保存成功!", function () {
          destroyWindow(btn.up("window"))
          refreshFlowConfigGrid()
        })
      },
      failure: function () {}
    })
  }
}

function checkSaveValues(values) {
  if (isNull(values.productId)) {
    showErrorAlert("产品号不能为空!!")
    return false
  }
  if (isNull(values.processId)) {
    showErrorAlert("流程号不能为空!!")
    return false
  }
  if (isNull(values.processVersion)) {
    showErrorAlert("流程版本号不能为空!!")
    return false
  }
  if (isNull(values.routeId)) {
    showErrorAlert("工序号不能为空!!")
    return false
  }
  if (isNull(values.operationId)) {
    showErrorAlert("工步号不能为空!!")
    return false
  }
  if (isNull(values.type)) {
    showErrorAlert("类型不能为空!!")
    return false
  }
  return true
}

function refreshFlowConfigGrid() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const store = mainTabPanel.down("[name=listGrid]").getStore()
  store.currentPage = 1
  store.load()
}

function delFlowConfig() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const listGrid = mainTabPanel.down("[name=listGrid]")
  const records = listGrid.getSelectionModel().getSelection()
  if (records.length <= 0) {
    showWarningAlert("至少选择一条删除!!!")
    return
  }
  Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, "是否确认删除?", function (button) {
    if (button === "yes") {
      const rrns = []
      for (let i = 0; i < records.length; i++) {
        rrns.push(records[i].data.rowRrn)
      }
      Ext.Ajax.request({
        url: actionURL,
        requestMethod: "delCpConfigs",
        params: {
          rowRrns: rrns
        },
        success: function (resp, opts) {
          showSuccessAlert("删除成功!")
          refreshFlowConfigGrid()
        },
        failure: function (resp, opts) {}
      })
    }
  })
}

// 递归子节点
function cascadeChildren(node, checked) {
  node.cascadeBy(function (child) {
    child.set("checked", checked)
  })
}
// 更新父节点的选中状态
function updateParent(node) {
  const parent = node.parentNode

  if (!parent) return

  let allChecked = true
  let anyChecked = false

  parent.eachChild(function (sibling) {
    if (sibling.get("checked")) {
      anyChecked = true
    } else {
      allChecked = false
    }
  })

  // 你可以选择不同的逻辑：
  // 若至少一个子节点选中，则选中父节点（半选）；这里只做全选才勾选父节点
  parent.set("checked", allChecked)

  // 递归向上处理
  updateParent(parent)
}

function saveParamSetInfo(form) {
  const values = form.getForm().getValues()
  if (!checksaveParamSetValues(values)) {
    return
  }
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "saveSawParamSet",
    params: values,
    success: function (resp, opts) {
      showSuccessAlert("保存成功!")
      destroyWindow(form.up("window"))
      refreshTreeGrid()
    },
    failure: function (resp, opts) {}
  })
}

function checksaveParamSetValues(values) {
  if (isNull(values.cpRrn)) {
    showErrorAlert("cpRrn不能为空!!")
    return false
  }
  if (isNull(values.productId)) {
    showErrorAlert("产品号不能为空!!")
    return false
  }
  if (isNull(values.routeId)) {
    showErrorAlert("工序号不能为空!!")
    return false
  }
  if (isNull(values.operationId)) {
    showErrorAlert("工步号不能为空!!")
    return false
  }
  if (isNull(values.paramId)) {
    showErrorAlert("参数项不能为空!!")
    return false
  }

  if (isNull(values.pType)) {
    showErrorAlert("方案类型不能为空!!")
    return false
  }
  const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
  if (!reg.test(values.kValue)) {
    showErrorAlert("k值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.bValue)) {
    showErrorAlert("b值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.targetValue)) {
    showErrorAlert("目标中心值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.lslValue)) {
    showErrorAlert("LSL下限值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.uslValue)) {
    showErrorAlert("USL上限值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  return true
}

function refreshTreeGrid() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const store = mainTabPanel.down("[name=treeGrid]").getStore()
  const form = mainTabPanel.down("[name=paramForm]").getForm()
  store.setProxy({
    type: "ajax",
    url: actionURL,
    requestMethod: "qryTrimConfigSawParmas"
  })
  const values = form.getValues()
  values.type = type
  store.proxy.extraParams = values
  store.load()
}

function delParamSet() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const treeGrid = mainTabPanel.down("[name=treeGrid]")
  const values = []
  treeGrid.getRootNode().cascadeBy(function (node) {
    if (node.get("checked") && node.get("level")) {
      values.push({
        rowRrn: node.data.rowRrn,
        cpRrn: node.data.cpRrn,
        level: node.data.level
      })
    }
  })
  if (values.length < 1) {
    showWarningAlert("请选择要删除的记录!!!")
    return
  }

  Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, "是否确认删除?", function (button) {
    if (button === "yes") {
      Ext.Ajax.request({
        url: actionURL,
        requestMethod: "delParamSet",
        params: values,
        success: function (resp, opts) {
          showSuccessAlert("删除成功!")
          refreshTreeGrid()
        },
        failure: function (resp, opts) {}
      })
    }
  })
}

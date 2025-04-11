function destroyWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}
function saveCpFlowConfig(btn) {
  const form = btn.up("window").down("[name=saveForm]")
  const values = form.getForm().getValues()
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
  if (isNull(values.paramId)) {
    showErrorAlert("修频项不能为空!!")
    return false
  }
  const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
  if (!reg.test(values.targetValue)) {
    showErrorAlert("target值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.offsetValue)) {
    showErrorAlert("offset值格式有误(请填写数字,最多四位小数!)")
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

function saveCurveSetInfo(form, grid) {
  const values = form.getForm().getValues()
  values.cpTrimCurveXyDatas = grid
    .getStore()
    .getRange()
    .map((r) => r.data)
  values.cpTrimCurveInfo = {
    cpRrn: values.rowRrn,
    maxValue: values.maxValue,
    minValue: values.minValue
  }
  if (!checksaveCurveSetValues(values)) {
    return
  }
  Ext.Ajax.request({
    url: actionURL,
    requestMethod: "saveCurveSet",
    params: values,
    success: function (resp, opts) {
      showSuccessAlert("保存成功!")
      destroyWindow(grid.up("window"))
    },
    failure: function (resp, opts) {}
  })
}

function checksaveCurveSetValues(values) {
  if (isNull(values.rowRrn)) {
    showErrorAlert("rowRrn不能为空!!")
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
    showErrorAlert("修频项不能为空!!")
    return false
  }

  const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
  if (!reg.test(values.minValue)) {
    showErrorAlert("下限值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.maxValue)) {
    showErrorAlert("上限值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (values.cpTrimCurveXyDatas.length === 0) {
    showErrorAlert("XY值不能为空!!")
    return false
  }

  for (const element of values.cpTrimCurveXyDatas) {
    if (!element.xValue || !element.yValue) {
      showErrorAlert("XY值填写有误,存在空值!")
      return false
    }
    if (!reg.test(element.xValue)) {
      showErrorAlert("X值" + element.xValue + "填写有误(请填写数字,最多四位小数!)")
      return false
    }
    if (!reg.test(element.yValue)) {
      showErrorAlert("Y值" + element.yValue + "填写有误(请填写数字,最多四位小数!)")
      return false
    }
  }
  return true
}

function refreshTreeGrid() {
  const mainTabPanel = Ext.getCmp("mainTabPanel")
  const store = mainTabPanel.down("[name=treeGrid]").getStore()
  const form = mainTabPanel.down("[name=cusrveForm]").getForm()
  store.setProxy({
    type: "ajax",
    url: actionURL,
    requestMethod: "qryTrimConfigCurveXys"
  })
  store.proxy.extraParams = form.getValues()
  store.load()
}

function destroyWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}

function saveThickConfig(btn) {
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
          refreshCurThickConfigGrid()
        })
      },
      failure: function () {}
    })
  }
}

function refreshCurThickConfigGrid() {
  const tabPanel = Ext.getCmp("gridTabPanel")
  const store = tabPanel.getActiveTab().down("[name=tabListGrid]").getStore()
  store.currentPage = 1
  store.load()
}

function delThickConfig() {
  const tabPanel = Ext.getCmp("gridTabPanel")
  const tabListGrid = tabPanel.getActiveTab().down("[name=tabListGrid]")
  const records = tabListGrid.getSelectionModel().getSelection()
  if (records.length <= 0) {
    showWarningAlert("至少选择一条!!!")
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
        requestMethod: "delThickConfigs",
        params: {
          rowRrns: rrns
        },
        success: function (resp, opts) {
          showSuccessAlert("删除成功!")
          refreshCurThickConfigGrid()
        },
        failure: function (resp, opts) {}
      })
    }
  })
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
  if (isNull(values.stepId)) {
    showErrorAlert("工步号不能为空!!")
    return false
  }
  if (isNull(values.paramId)) {
    showErrorAlert("参数号不能为空!!")
    return false
  }
  if (isNull(values.type)) {
    showErrorAlert("类型不能为空!!")
    return false
  }
  const reg = /^(0(\.\d{1,4})?|[1-9]\d*(\.\d{1,4})?)$/
  if (!reg.test(values.kValue)) {
    showErrorAlert("k值格式有误(请填写大于0的数,最多四位小数!)")
    return false
  }
  if (!reg.test(values.bValue)) {
    showErrorAlert("b值格式有误(请填写大于0的数,最多四位小数!)")
    return false
  }
  if (!reg.test(values.targetCenterValue)) {
    showErrorAlert("目标中心值格式有误(请填写大于0的数,最多四位小数!)")
    return false
  }
  if (!reg.test(values.lslValue)) {
    showErrorAlert("LSL下限值格式有误(请填写大于0的数,最多四位小数!)")
    return false
  }
  if (!reg.test(values.uslValue)) {
    showErrorAlert("USL上限值格式有误(请填写大于0的数,最多四位小数!)")
    return false
  }
  return true
}

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
  values.cpTrimEvenSetInfo = {
    cpRrn: values.cpRrn,
    rowRrn: values.rowRrn,
    minMatchValue: values.minMatchValue,
    minTrimQty: values.minTrimQty,
    targetValue: values.targetValue,
    maxExceptionPoint: values.maxExceptionPoint,
    deadMaxRate: values.deadMaxRate
  }
  if (checkSaveValues(values)) {
    Ext.Ajax.request({
      url: actionURL,
      requestMethod: "saveEvenConfig",
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
  const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
  const reg1 = /^(0|[1-9]\d*)$/
  if (!reg.test(values.minMatchValue)) {
    showErrorAlert("最小匹配度值格式有误(请填写数字,最多四位小数!)")
    return false
  }
    if (!reg1.test(values.deadMaxRate)) {
        showErrorAlert("死点最大占比格式有误(请填写大于0小于100的整数值!)")
        return false
    }
    if (Number(values.deadMaxRate) <=0 || Number(values.deadMaxRate) >=100) {
        showErrorAlert("死点最大占比格式有误(请填写大于0小于100的整数值!)")
        return false
    }
  if (!reg.test(values.minTrimQty)) {
    showErrorAlert("最小trim量值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg.test(values.targetValue)) {
    showErrorAlert("氧化硅目标值格式有误(请填写数字,最多四位小数!)")
    return false
  }
  if (!reg1.test(values.maxExceptionPoint)) {
    showErrorAlert("最多异常点位数格式有误(请填写正整数!)")
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
        rrns.push(records[i].data.cpRrn)
      }
      Ext.Ajax.request({
        url: actionURL,
        requestMethod: "delCpConfigs",
        params: {
          rowRrns: rrns,
          type: type
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

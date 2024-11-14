/** @format */
const actionUrl = "/mycim2/hyChecklistAction.do?r=" + Math.random()
function refreshCheckListGrid() {
  const checkListForm = Ext.getCmp("checkListForm")
  // const values = checkListForm.getValues()
  const checkListGrid = Ext.getCmp("checkListGrid")
  checkListGrid.getStore().reload()
}

function clearCheckListForm() {
  const checkListForm = Ext.getCmp("checkListForm")
  checkListForm.getForm().reset()
  refreshCheckListGrid()
}
function showCheckListDetailTab(grid, record, item, rowindex, e, opts) {
  const checkListRrn = record.data.checkListRrn
  const checkListId = record.data.checkListId
  const checkListTabPanel = Ext.getCmp("checkListTabPanel")
  const checkListDetailTab = Ext.getCmp("checkListDetailTab" + checkListRrn)

  if (checkListDetailTab) {
    checkListTabPanel.remove("checkListDetailTab" + checkListRrn)
  }

  checkListTabPanel.add({
    id: "checkListDetailTab" + checkListRrn,
    name: "checkListDetailTab",
    title: checkListId,
    closable: true,
    layout: "fit",
    padding: "0 0 0 0",
    items: [createCheckListDetailPanel()]
  })
  checkListTabPanel.setActiveTab("checkListDetailTab" + checkListRrn)

  const form = Ext.getCmp("checkListDetailTab" + checkListRrn).down("[name=checkListDetailForm]")
  const dgrid = Ext.getCmp("checkListDetailTab" + checkListRrn).down("[name=checkListDetailSuppliesGrid]")
  form.getForm().findField("checkListRrn").setValue(checkListRrn)

  refreshCheckListDetailInfo(form, dgrid)
}

function addCheckListDetailTab() {
  const checkListAddTab = Ext.getCmp("checkListAddTab")
  const checkListTabPanel = Ext.getCmp("checkListTabPanel")
  if (checkListAddTab) {
    checkListTabPanel.remove("checkListAddTab")
  }

  checkListTabPanel.add({
    id: "checkListAddTab",
    name: "checkListDetailTab",
    title: "添加清单",
    closable: true,
    layout: "fit",
    padding: "0 0 0 0",
    items: [createCheckListDetailPanel()]
  })
  checkListTabPanel.setActiveTab("checkListAddTab")
  const form = Ext.getCmp("checkListAddTab").down("[name=checkListDetailForm]")
  const dgrid = Ext.getCmp("checkListAddTab").down("[name=checkListDetailSuppliesGrid]")
  refreshCheckListDetailInfo(form, dgrid)
}

function refreshCheckListDetailInfo(form, grid) {
  const checkListRrn = form.getForm().findField("checkListRrn").getValue()
  if (!checkListRrn) {
    form.getForm().findField("checkListRrn").setValue("")
    form.getForm().findField("checkListId").setValue("")
    form.getForm().findField("checkListDesc").setValue("")
    form.getForm().findField("eqptGroupIds").setValue("")
    form.getForm().findField("userId").setValue("")
    form.query('[name="delBtn"]')[0].hide()
    // grid.query('[name="addBtn"]')[0].setDisabled(true)
    grid.getStore().removeAll()
    return
  }
  form.getForm().findField("checkListId").setReadOnly(true)
  form.query('[name="delBtn"]')[0].show()
  // grid.query('[name="addBtn"]')[0].setDisabled(false)

  Ext.Ajax.request({
    url: actionUrl,
    requestMethod: "qryChecklistDetail",
    params: {
      checkListRrn: checkListRrn
    },
    success: function (response) {
      form.getForm().findField("checkListRrn").setValue(response.checkListRrn)
      form.getForm().findField("checkListId").setValue(response.checkListId)
      form.getForm().findField("checkListDesc").setValue(response.checkListDesc)
      form.getForm().findField("eqptGroupIds").setValue(response.eqptGroupIds)
      form.getForm().findField("userId").setValue(response.userId)
      grid.getStore().loadData(response.checkListSupplies, false)
    },
    failure: function () {}
  })
}

function saveCheckListDetail(btn) {
  const form = btn.up('[name="checkListDetailForm"]')
  const grid = btn.up('[name="checkListDetailPanel"]').down("[name=checkListDetailSuppliesGrid]")
  const values = form.getForm().getValues()
  if (!checkDtailFormInfo(values)) {
    return
  }
  values.checkListId = values.checkListId.trim()
  values.checkListDesc = values.checkListDesc.trim()

  const suppliesRecords = grid.getStore().getRange(0, grid.getStore().getCount())
  const supplies = suppliesRecords.map((s) => s.data)
  values.checkListSupplies = supplies
  Ext.Ajax.request({
    url: actionUrl,
    requestMethod: "saveCheckListDetail",
    params: values,
    success: function (response) {
      showSuccessAlert("保存成功!", function () {
        form.getForm().findField("checkListRrn").setValue(response)
        refreshCheckListDetailInfo(form, grid)
        refreshCheckListGrid()
      })
    },
    failure: function () {}
  })
}

function delCheckListDetail(btn) {
  const form = btn.up('[name="checkListDetailForm"]')
  const values = form.getForm().getValues()
  if (isNull(values.checkListRrn)) {
    return
  }

  Ext.Ajax.request({
    url: actionUrl,
    requestMethod: "delCheckListByRrn",
    params: { checkListRrn: values.checkListRrn },
    success: function (response) {
      showSuccessAlert("删除成功!", function () {
        form.up('[name="checkListDetailTab"]').close()
        refreshCheckListGrid()
      })
    },
    failure: function () {}
  })
}

function saveCheckListSupplie() {
  const suppliesForm = Ext.getCmp("suppliesWindow").down("[name=suppliesForm]").getForm()
  const grid = Ext.getCmp("checkListTabPanel").getActiveTab().down("[name=checkListDetailSuppliesGrid]")
  if (!checkSuppliesFormInfo(suppliesForm.getValues())) {
    return
  }
  const records = grid.getStore().getRange(0, grid.getStore().getCount())
  const nrecords = records.filter((r) => r.data.supplyId === suppliesForm.getValues().supplyId)
  if (nrecords != null && nrecords.length > 0) {
    showErrorAlert(suppliesForm.getValues().supplyId + "已存在!!")
    return
  }
  grid.getStore().loadData([suppliesForm.getValues()], true)
  Ext.getCmp("suppliesWindow").close()
}

function checkDtailFormInfo(values) {
  if (isNull(values.checkListId)) {
    showErrorAlert("检查单号不能为空!!")
    return false
  }
  if (isNull(values.checkListType)) {
    showErrorAlert("检查类型不能为空!!")
    return false
  }
  if (isNull(values.eqptGroupIds)) {
    showErrorAlert("设备组不能为空!!")
    return false
  }
  if (isNull(values.userId)) {
    showErrorAlert("表单用户不能为空!!")
    return false
  }
  return true
}

function checkSuppliesFormInfo(values) {
  if (isNull(values.checkListId)) {
    showErrorAlert("检查单号不能为空!!")
    return false
  }
  if (isNull(values.supplyId)) {
    showErrorAlert("工艺耗材号不能为空!!")
    return false
  }
  if (isNull(values.standardQty)) {
    showErrorAlert("标准用量不能为空!!")
    return false
  }
  const reg = /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$/
  if (!reg.test(values.standardQty)) {
    showErrorAlert("标准用量输入错误,请输入大于0的数字!!")
    return false
  }
  return true
}

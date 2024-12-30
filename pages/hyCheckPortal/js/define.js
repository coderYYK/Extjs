/** @format */
const actionUrl = "/mycim2/eqptPMPortal.do"
const actionUrlTwo = "/mycim2/eqptHYPortal.do"
var allowEditFieldStyle = "background: #fff repeat-x 0 0; border-color: silver #d9d9d9 #d9d9d9; color: #000;"
const mycim2dev = "/mycim2"
const pageSize = 20
let op = ""
const readOnlyFieldStyle = "background-color: rgb(247,248,248); border-color: silver #d9d9d9 #d9d9d9; color: gray;"
let detailInfoTmp = {}
let pmRrnStr = ""
let defaultEndEvent = ""
let startTargetStatus = ""
const endPmEventStore = Ext.create("Ext.data.Store", {
  fields: ["key", "value"]
})
function comboboxStore(url, requestMethod) {
  var store = Ext.create("Ext.data.Store", {
    fields: ["key", "value"],
    proxy: {
      type: "ajax",
      actionMethods: ["GET"],
      requestMethod: requestMethod,
      url: url,
      queryMask: false
    },
    autoLoad: true
  })

  return store
}
function recipeTypeStore() {
  return new Ext.data.SimpleStore({
    fields: ["key", "data1", "data2"],
    data: [
      ["BY_FILM_THICKNESS", "膜厚", "0"],
      ["BY_RFON", "RFON", "0"]
    ]
  })
}

function recipeCountTypeStore() {
  return new Ext.data.SimpleStore({
    fields: ["key", "data1", "data2"],
    data: [
      ["BY_JOB", "BY_JOB", "0"],
      ["BY_LOT", "BY_LOT", "0"],
      ["BY_WAFER", "BY_WAFER", "0"]
    ]
  })
}
function amTypeStore(type) {
  if (type == "addAMCount") {
    return new Ext.data.SimpleStore({
      fields: ["key", "data1", "data2"],
      data: [
        ["BY_JOB", "By Job", "0"],
        ["BY_LOT", "By Lot", "0"],
        ["BY_WAFER", "By Wafer", "0"],
        //[ 'BY_CHECKLIST_ITEM', 'By Checklist Item', '0' ],
        ["BY_RECIPE", "By Recipe", "0"]
      ]
    })
  }
  if (type == "addAMTime") {
    return Ext.create("Ext.data.Store", {
      fields: ["key", "data1", "data2"],
      proxy: {
        type: "ajax",
        actionMethods: { read: "GET" },
        url: actionUrlTwo + "?op=getCycleType&windowFlag=1",
        requestMethod: "getCycleType",
        queryMask: false
      },
      autoLoad: true
    })
  }
  //var pmTypeArray = ["WEEKLY", "MONTHLY", "DAYS"];
  return Ext.create("Ext.data.Store", {
    fields: ["key", "data1", "data2"],
    proxy: {
      type: "ajax",
      actionMethods: { read: "GET" },
      url: actionUrlTwo + "?op=getCycleType",
      requestMethod: "getCycleType",
      queryMask: false
    },
    autoLoad: true
  })
}

// function controlTypeStore(isPMTimeFlag) {
//     var type = isPMTimeFlag != null ? (isPMTimeFlag ? "AMTIME" : "AMCOUNT") : "ALL"
//     return Ext.create("Ext.data.Store", {
//         fields: ["key", "value"],
//         proxy: {
//             type: "ajax",
//             url: actionUrlTwo,
//             requestMethod: "getAMControlTypes",
//             extraParams: {
//                 type: type
//             },
//             queryMask: false
//         },
//         autoLoad: true
//     })
// }

function initComboboxStore() {
  Ext.Ajax.request({
    url: actionUrlTwo,
    requestMethod: "queryComboboxDatas",
    params: {},
    method: "POST",
    async: false,
    success: function (response, options) {
      startTargetStatus = response.startTargetStatus

      var endEventList = response.endEventList
      if (endEventList != null && endEventList != undefined && endEventList.length > 0) {
        var firstEvent = endEventList[0]
        defaultEndEvent = firstEvent["key"]
        endPmEventStore.loadData(endEventList, false)
      }
    }
  })
}

function controlTypeHandler(val, addFlag) {
  if (addFlag) {
    reset4Add()
  }
  if (val == "AM_TIME") {
    show4Schedule()
  } else if (val == "AM_COUNT") {
    show4Count()
  }
}

function show4Schedule() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  waferQtyContainer.getComponent("pmType").show()
  waferQtyContainer.getComponent("cycleTime").show()
  waferQtyContainer.getComponent("timeColumn").show()
  waferQtyContainer.getComponent("pmTimeType").show()

  waferQtyContainer.getComponent("totalCount").hide()
  waferQtyContainer.getComponent("alarmCount").hide()
}

function show4Count() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  waferQtyContainer.getComponent("pmType").show()
  waferQtyContainer.getComponent("cycleTime").hide()
  waferQtyContainer.getComponent("timeColumn").hide()
  waferQtyContainer.getComponent("pmTimeType").hide()
  waferQtyContainer.getComponent("totalCount").show()
  waferQtyContainer.getComponent("alarmCount").show()
}

function reset4Add() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  // schedule
  waferQtyContainer.getComponent("pmType").setValue("")
  waferQtyContainer.getComponent("cycleTime").setValue("")
  waferQtyContainer.getComponent("timeColumn").getComponent("nextPmTimeStr").setValue("")
  waferQtyContainer.getComponent("timeColumn").getComponent("subNextPmTimeStr").setValue("")

  // count
  waferQtyContainer.getComponent("totalCount").hide()
  waferQtyContainer.getComponent("alarmCount").hide()

  waferQtyContainer.getComponent("itemStatus").setValue("OFF")
  waferQtyContainer.getComponent("autoEqpStatus").setValue("YES")
  waferQtyContainer.getComponent("comment").setValue("")
}

function refreshEqptPortal() {
  const eqptPMForm = Ext.getCmp("eqptPMForm")
  const eqptPMGrid = Ext.getCmp("eqptPMGrid")
  const values = eqptPMForm.getForm().getValues()
  const store = eqptPMGrid.store
  store.currentPage = 1
  store.proxy.extraParams = values
  store.load()
}

function clearEqptPortalForm() {
  Ext.getCmp("eqptPMForm").getForm().reset()
}

function comboForCheckList(combo, addOrModifyFlag) {
  var EQPId = combo.getValue()

  $.ajax({
    type: "POST",
    url: actionUrlTwo,
    requestMethod: "getCheckListCombo",
    data: {
      EQPId: EQPId
    },
    success: function (msg) {
      Ext.getCmp("checklistId").clearValue()
      var lotTypeStore = Ext.getCmp("checklistId").getStore()
      lotTypeStore.loadData(msg)

      // if (addOrModifyFlag && Ext.getCmp("pmType").getValue() === "BY_CHECKLIST_ITEM") {
      //     comboForCheckListItem(EQPId)
      // }
    }
  })
}

function getCycleTime(time) {
  var timeStr = time.toString()
  var year = timeStr.substring(11, 15)
  var month = timeStr.substring(4, 7)
  var array = ["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"]
  if (array.includes(month)) {
    return 31
  } else if (month == "Feb") {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return 29
    } else {
      return 28
    }
  } else {
    return 30
  }
}

// function comboForCheckListItem(eqptId) {
//     $.ajax({
//         type: "POST",
//         url: mycim2dev + "/eqptPortal.do",
//         requestMethod: "getCheckListItemCombo",
//         data: {
//             eqptId: eqptId
//         },
//         success: function (msg) {
//             Ext.getCmp("checklistItemId").clearValue()
//             var lotTypeStore = Ext.getCmp("checklistItemId").getStore()
//             lotTypeStore.loadData(msg)
//         }
//     })
// }

function save(window) {
  var form = Ext.getCmp("eqptPMWindowForm")
  var params = form.getValues()
  if (!validateData()) {
    return false
  }
  showPasswordWin(function () {
    Ext.Ajax.request({
      url: actionUrlTwo + "?op=" + op,
      requestMethod: op,
      method: "POST",
      params: params,
      success: function (result) {
        destroyWindow(window)
        refreshEqptPortal()
      }
    })
  })
}

function destroyWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}
function validateData() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  var val = waferQtyContainer.getComponent("controlType").getValue()
  if (val == "AM_TIME") {
    result = check4Schedule()
  } else if (val == "AM_COUNT") {
    result = check4Count()
  }
  return result
}

function check4Schedule() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  var eqptId = waferQtyContainer.getComponent("objectId").getValue()
  var controlType = waferQtyContainer.getComponent("controlType").getValue()
  var pmType = waferQtyContainer.getComponent("pmType").getValue()
  var cycleTime = waferQtyContainer.getComponent("cycleTime").getValue()
  var nextPmTimeStr = waferQtyContainer.getComponent("timeColumn").getComponent("nextPmTimeStr").getValue()
  var subNextPmTimeStr = waferQtyContainer.getComponent("timeColumn").getComponent("subNextPmTimeStr").getValue()
  var onOff = waferQtyContainer.getComponent("itemStatus").getValue()
  var comments = waferQtyContainer.getComponent("comment").getValue()
  var checklistId = waferQtyContainer.getComponent("checklistId").getValue()
  var autoBy = waferQtyContainer.getComponent("byColumn").getComponent("autoBy").getValue()
  var byStandardQty = waferQtyContainer.getComponent("byColumn").getComponent("byStandardQty").getValue()

  var resultMsg = ""
  if (!eqptId || eqptId.length <= 0) {
    resultMsg += "The EQP ID cannot be empty!<br>"
  }
  if (!controlType || controlType.length <= 0) {
    resultMsg += "The control type cannot be empty!<br>"
  }
  if (!pmType || pmType.length <= 0) {
    resultMsg += "The pm type cannot be empty!<br>"
  }
  if (!checklistId || checklistId.length <= 0) {
    resultMsg += "The checklistId cannot be empty!<br>"
  }
  if (!cycleTime || cycleTime.length <= 0) {
    resultMsg += "The cycle time cannot be empty!<br>"
  }
  if (!nextPmTimeStr || nextPmTimeStr.length <= 0) {
    resultMsg += "The next pm time[Y/m/d] cannot be empty!<br>"
  }
  if (!subNextPmTimeStr || subNextPmTimeStr.length <= 0) {
    resultMsg += "The next pm time[H:i] cannot be empty!<br>"
  }
  if (!onOff || onOff.length <= 0) {
    resultMsg += "The on/off cannot be empty!<br>"
  }
  if (autoBy === "YES" && isNull(byStandardQty)) {
    resultMsg += "The byStandardQty cannot be empty!<br>"
  }

  if (resultMsg.length > 0) {
    showWarningAlert(resultMsg)
    return false
  }

  return true
}

function check4Count() {
  var waferQtyContainer = Ext.getCmp("waferQtyContainer")
  var eqptId = waferQtyContainer.getComponent("objectId").getValue()
  var controlType = waferQtyContainer.getComponent("controlType").getValue()
  var pmType = waferQtyContainer.getComponent("pmType").getValue()
  var totalCount = waferQtyContainer.getComponent("totalCount").getValue()
  var alarmCount = waferQtyContainer.getComponent("alarmCount").getValue()
  var onOff = waferQtyContainer.getComponent("itemStatus").getValue()
  var comments = waferQtyContainer.getComponent("comment").getValue()
  var checklistId = waferQtyContainer.getComponent("checklistId").getValue()
  var autoBy = waferQtyContainer.getComponent("byColumn").getComponent("autoBy").getValue()
  var byStandardQty = waferQtyContainer.getComponent("byColumn").getComponent("byStandardQty").getValue()

  var resultMsg = ""
  if (!eqptId || eqptId.length <= 0) {
    resultMsg += "The EQP ID cannot be empty!<br>"
  }
  if (!controlType || controlType.length <= 0) {
    resultMsg += "The control type cannot be empty!<br>"
  }
  if (!pmType || pmType.length <= 0) {
    resultMsg += "The pm type cannot be empty!<br>"
  }
  if (!checklistId || checklistId.length <= 0) {
    resultMsg += "The checklistId cannot be empty!<br>"
  }
  if (!totalCount || totalCount.length <= 0) {
    resultMsg += "The total count cannot be empty!<br>"
  }
  if (!alarmCount || alarmCount.length <= 0) {
    resultMsg += "The alarm count cannot be empty!<br>"
  }
  if (totalCount && alarmCount && alarmCount >= totalCount) {
    resultMsg += "The alarm count must be less than the total count!<br>"
  }
  if (!onOff || onOff.length <= 0) {
    resultMsg += "The on/off cannot be empty!<br>"
  }
  if (autoBy === "YES" && isNull(byStandardQty)) {
    resultMsg += "The byStandardQty cannot be empty!<br>"
  }

  if (resultMsg.length > 0) {
    showWarningAlert(resultMsg)
    return false
  }

  return true
}

function checkIdEquals() {
  var mainEqptId = ""
  var containsMainEqptFlag = false // 勾选的PM设备中是否包含chamber主机台
  var prevPmEqptId = ""
  var multipleEqptFlag = false // 勾选的设备是否包含多个不同的id，无关是否是chamber设备
  var isDifferentEqptFlag = false

  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var eqptId = item.data.objectId
      if (mainEqptId.length > 0) {
        var currEqptId = eqptId
        var lastIndex = eqptId.lastIndexOf("_")
        if (lastIndex > 0) {
          eqptId = eqptId.substring(0, lastIndex) // 如果是chamber设备，截取主机台id
        } else {
          containsMainEqptFlag = true
        }
        if (mainEqptId != eqptId) {
          isDifferentEqptFlag = true
          return
        }
        if (prevPmEqptId != currEqptId) {
          multipleEqptFlag = true
        }
        prevPmEqptId = currEqptId
      } else {
        var lastIndex = eqptId.lastIndexOf("_")
        prevPmEqptId = eqptId
        if (lastIndex > 0) {
          eqptId = eqptId.substring(0, lastIndex) // 保存chamber主机台ID或manual设备ID
        } else {
          containsMainEqptFlag = true
        }
        // mainEqptId 保存的始终是主机台id
        mainEqptId = eqptId
      }
    })

    if (isDifferentEqptFlag) {
      showWarningAlert(window.CN0EN == "EN" ? "Multiple EQP cannot AM together!" : "不同的设备不能同时操作！")
      return false
    } else {
      // 有同一chamber主机台下不同的chamber设备，但是没有选择chamber主机台
      if (multipleEqptFlag && !containsMainEqptFlag) {
        showWarningAlert(
          window.CN0EN == "EN"
            ? "Multiple EQP can`t AM together, reason: unselected chamber parent EQP!"
            : "未选择chamber主机台不能多个chamber设备同时操作！"
        )
        return false
      }
    }
  }
  return true
}

function checkHaveChecklist(obj) {
  var checkedEqptIds = ""
  var isOK = true
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var eqptId = item.data.objectId
      if (checkedEqptIds.indexOf(eqptId + ",") < 0) {
        checkedEqptIds += eqptId + ","
      }
      var checklistId = item.data.checklistId
      var eqptStatus = item.data.eqptStatus

      let checklistJobRrn = item.data.checklistJobRrn

      var autoDayCheck = item.data.autoDayCheck

      if (obj != "1") {
        if (eqptStatus != "AM") {
          isOK = false
          showWarningAlert(window.CN0EN == "EN" ? "The " + eqptStatus + " current status is invalid!" : "设备：" + eqptStatus + " 当前状态无效！")
          return false
        }

        if (checklistJobRrn == null || checklistJobRrn == 0 || checklistJobRrn === "") {
          isOK = false
          showWarningAlert(window.CN0EN == "EN" ? "The checklistJobRrn is invalid!" : "请先完成已开始的AM清单，再继续下一个AM！")
          return false
        }
      }

      if (Ext.isEmpty(checklistId)) {
        isOK = false
        showWarningAlert(window.CN0EN == "EN" ? "There is no checklist in the selected EQP!" : "选择的设备没有检查单！")
        return false
      }
    })
  } else {
    showWarningAlert(window.CN0EN == "EN" ? "Please choose EQP!" : "请选择要操作的设备！")
    isOK = false
  }
  return isOK
}

function checkForChecklist(obj) {
  if (checkIdEquals()) {
    return checkHaveChecklist(obj)
  }
  return false
}

function checkOnOffStatus() {
  var invalidEqptIds = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var onOffStatus = item.data.itemStatus
      if (onOffStatus == "OFF" || onOffStatus == "off") {
        var eqptId = item.data.objectId + ","
        if (invalidEqptIds.indexOf(eqptId) < 0) {
          invalidEqptIds += eqptId
        }
      }
    })
  }

  if (invalidEqptIds && invalidEqptIds.length > 0) {
    invalidEqptIds = invalidEqptIds.substring(0, invalidEqptIds.lastIndexOf(","))
    showWarningAlert(window.CN0EN == "EN" ? "The " + invalidEqptIds + " is OFF!" : "设备：" + invalidEqptIds + " 是OFF模式！")
    return false
  } else {
    return true
  }
}

function getPmRrnsForBatch() {
  var pmRrns = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var pmRrn = item.data.pmRrn
      if (pmRrn && pmRrn > 0) {
        pmRrns += pmRrn + ","
      }
    })
    if (pmRrns && pmRrns.length > 0) {
      pmRrns = pmRrns.substring(0, pmRrns.lastIndexOf(","))
    }
    return pmRrns
  } else {
    showWarningAlert(window.CN0EN == "EN" ? "Please choose EQP!" : "请选择要操作的设备！")
    return false
  }
}

function getMainEqpt() {
  var firstMainEqptId = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var eqptId = item.data.objectId
      if (firstMainEqptId.length > 0) {
        var lastIndex = eqptId.lastIndexOf("_")
        if (lastIndex > 0) {
          eqptId = eqptId.substring(0, lastIndex) // 如果是chamber设备，截取主机台id
        }
        if (firstMainEqptId !== eqptId) {
          showWarningAlert(window.CN0EN == "EN" ? "Multiple EQP cannot AM together!" : "不同的设备不能同时操作！")
          return false
        }
      } else {
        var lastIndex = eqptId.lastIndexOf("_")
        if (lastIndex > 0) {
          eqptId = eqptId.substring(0, lastIndex) // 保存chamber主机台ID或manual设备ID
        }
        // firstMainEqptId 保存的是主机台id
        firstMainEqptId = eqptId
      }
    })
    return firstMainEqptId
  }
}

function confirmNumberOfOperations(callFn) {
  var checkedEqptIds = ""
  var resultMsg = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var eqptId = item.data.objectId

      if (checkedEqptIds.indexOf(eqptId + ",") < 0) {
        Ext.Ajax.request({
          url: actionUrlTwo + "?op=queryPmsList",
          requestMethod: "queryPmsList",
          method: "POST",
          params: { objectId: eqptId },
          async: false, // 同步请求
          success: function (resp, opts) {
            var list = resp
            if (list.length > 1) {
              resultMsg +=
                window.CN0EN == "EN"
                  ? "The " + list[0].objectId + " has " + list.length + " AM schedule!<br>"
                  : "设备：" + list[0].objectId + " 有 " + list.length + " 条AM Schedule!<br>"
            }
          }
        })
      }
    })
  }

  if (resultMsg && resultMsg.length > 0) {
    resultMsg += window.CN0EN == "EN" ? "Whether to continue?<br>" : "是否继续执行?<br>"
    showConfirmByExt(callFn, window.CN0EN, resultMsg)
  } else {
    callFn()
  }
}

function getPmRrnsForBatchAndCheckStatus() {
  var pmRrns = ""
  var errorMsg = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var pmRrn = item.data.pmRrn
      var eqptStatus = item.data.eqptStatus
      if (eqptStatus == "AM") {
        errorMsg = window.CN0EN == "EN" ? "The eqpt status is AM and operation is not allowed!" : "设备状态为AM，不允许操作！"
        return false
      }
      if (pmRrn && pmRrn > 0) {
        pmRrns += pmRrn + ","
      }
    })
    if (errorMsg != "") {
      showWarningAlert(errorMsg)
      return false
    }
    if (pmRrns && pmRrns.length > 0) {
      pmRrns = pmRrns.substring(0, pmRrns.lastIndexOf(","))
    }
    return pmRrns
  } else {
    showWarningAlert(window.CN0EN == "EN" ? "Please choose EQP!" : "请选择要操作的设备！")
    return false
  }
}

function showOnOffWindow(pmRrns) {
  var title = i18n.labels.LBS_PM_ON_OFF
  if (pmRrns && pmRrns.length > 0) {
    pmRrnStr = pmRrns
  } else {
    return
  }

  var baseForm = Ext.create("Ext.form.Panel", {
    id: "eqptPMOnOffWindowForm",
    autoScroll: true,
    defaults: {
      anchor: "100%"
    },
    fieldDefaults: {
      labelAlign: "left",
      flex: 1,
      margin: 5
    },
    items: [
      {
        xtype: "container",
        layout: "column",
        id: "onOffContainer",
        defaults: {
          labelWidth: 100,
          columnWidth: 0.5
        },
        items: [
          {
            xtype: "combobox",
            fieldLabel: i18n.labels.LBS_PM_ON_OFF,
            style: "margin-left:100px;margin-top:20px",
            name: "itemStatus",
            editable: false,
            allowBlank: false,
            displayField: "key",
            valueField: "value",
            store: ["ON", "OFF"],
            value: "OFF",
            queryMode: "local"
          },
          {
            xtype: "textareafield",
            grow: false,
            name: "comment",
            fieldLabel: i18n.labels.LBL_COMMENTS,
            allowBlank: false,
            anchor: "100%",
            columnWidth: 1,
            readOnly: false,
            fieldStyle: "",
            height: 120,
            resizable: false //textarea 输入框是否可拖拽
          }
        ]
      }
    ]
  })

  Ext.create("Ext.window.Window", {
    title: title,
    width: 780,
    height: 350,
    // modal: true, // 是否需要遮罩
    layout: "fit",
    modal: true, // 模态化窗口
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    buttons: [
      {
        text: i18n.labels.LBS_SAVE,
        formBind: true,
        handler: function () {
          saveOnOff(this.up("window"))
        }
      },
      {
        text: i18n.labels.LBS_RESET,
        style: "margin-left:10px",
        handler: function () {
          Ext.getCmp("eqptPMOnOffWindowForm").getForm().reset()
        }
      },
      {
        text: i18n.labels.LBL_CANCEL,
        style: "margin-left:10px",
        handler: function () {
          destroyOnOffWindow(this.up("window"))
        }
      }
    ],
    id: "eqptPMOnOffWindow",
    items: [baseForm]
  }).show()
}

function saveOnOff(window) {
  var form = Ext.getCmp("eqptPMOnOffWindowForm")
  var params = form.getValues()
  if (!form.isValid() || pmRrnStr.length < 1) {
    return false
  }
  params.pmRrnStr = pmRrnStr
  showPasswordWin(function () {
    Ext.Ajax.request({
      url: actionUrlTwo + "?op=onOffChange&pmRrnStr=" + pmRrnStr,
      requestMethod: "onOffChange",
      method: "POST",
      params: params,
      success: function (resp, opts) {
        destroyOnOffWindow(window)
        refreshEqptPortal()
      }
    })
  })
}

function destroyOnOffWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}

function showDeleteWindow(pmRrns) {
  var title = i18n.labels.LBS_DELETE
  if (pmRrns && pmRrns.length > 0) {
    pmRrnStr = pmRrns
  } else {
    return
  }

  var baseForm = Ext.create("Ext.form.Panel", {
    id: "eqptPMDeleteWindowForm",
    autoScroll: true,
    defaults: {
      anchor: "100%"
    },
    fieldDefaults: {
      labelAlign: "left",
      flex: 1,
      margin: 5
    },
    items: [
      {
        xtype: "container",
        layout: "column",
        id: "deleteContainer",
        defaults: {
          labelWidth: 100,
          columnWidth: 0.5
        },
        items: [
          {
            xtype: "textareafield",
            grow: false,
            name: "comment",
            fieldLabel: i18n.labels.LBL_COMMENTS,
            allowBlank: false,
            anchor: "100%",
            columnWidth: 1,
            readOnly: false,
            fieldStyle: "",
            height: 120,
            resizable: false //textarea 输入框是否可拖拽
          }
        ]
      }
    ]
  })

  Ext.create("Ext.window.Window", {
    title: title,
    constrain: true, // 限制窗口拖动范围
    id: "eqptPMDeleteWindow",
    width: 780,
    height: 350,
    layout: "fit",
    modal: true, // 模态化窗口
    closable: true,
    resizable: false,
    buttons: [
      {
        text: i18n.labels.LBS_DELETE,
        formBind: true,
        handler: function () {
          deletePM(this.up("window"))
        }
      },
      {
        text: i18n.labels.LBS_RESET,
        style: "margin-left:10px",
        handler: function () {
          Ext.getCmp("eqptPMDeleteWindowForm").getForm().reset()
        }
      },
      {
        text: i18n.labels.LBL_CANCEL,
        style: "margin-left:10px",
        handler: function () {
          destroyDeleteWindow(this.up("window"))
        }
      }
    ],
    items: [baseForm]
  }).show()
}

function deletePM(window) {
  var form = Ext.getCmp("eqptPMDeleteWindowForm")
  var params = form.getValues()
  if (!form.isValid() || pmRrnStr.length < 1) {
    return false
  }
  params.pmRrnStr = pmRrnStr
  showPasswordWin(function () {
    Ext.Ajax.request({
      url: actionUrlTwo + "?op=deletePmSchedule&pmRrnStr=" + pmRrnStr,
      requestMethod: "deletePmSchedule",
      method: "POST",
      params: params,
      success: function (result) {
        // showSuccessAlert(i18n_msg_SuccessfulOperation);
        destroyDeleteWindow(window)
        refreshEqptPortal()
      }
    })
  })
}

function destroyDeleteWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}

function getPmRrnAndIdForBatch() {
  var data = []
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var pmRrn = item.data.pmRrn
      var pmId = item.data.pmId
      if (pmRrn && pmRrn > 0) {
        data.push({ key: pmRrn, value: pmId })
      }
    })
    return data
  } else {
    showWarningAlert(window.CN0EN == "EN" ? "Please choose EQP!" : "请选择要操作的设备！")
    return false
  }
}

function startPM(window) {
  var form = Ext.getCmp("eqptPMStartEndWindowForm")
  var params = form.getValues()
  if (!form.isValid() || pmRrnStr.length < 1) {
    return false
  }
  params.pmRrnStr = pmRrnStr
  showPasswordWin(function () {
    Ext.Ajax.request({
      url: actionUrlTwo + "?op=pmStart&pmRrnStr=" + pmRrnStr,
      requestMethod: "pmStart",
      method: "POST",
      params: params,
      success: function (resp, opts) {
        destroyStartEndWindow(window)
        refreshEqptPortal()
      }
    })
  })
}

function endPM(window) {
  var form = Ext.getCmp("eqptPMStartEndWindowForm")
  var params = form.getValues()
  if (!form.isValid() || pmRrnStr.length < 1) {
    return false
  }
  params.pmRrnStr = pmRrnStr
  showPasswordWin(function () {
    Ext.Ajax.request({
      url: actionUrlTwo + "?op=pmEnd&pmRrnStr=" + pmRrnStr,
      requestMethod: "pmEnd",
      method: "POST",
      params: params,
      success: function (resp, opts) {
        destroyStartEndWindow(window)
        refreshEqptPortal()
      }
    })
  })
}

function destroyStartEndWindow(window) {
  if (window) {
    window.down("form").down("container").destroy()
    window.destroy()
  }
}

function getChecklistJobData() {
  let checklistJobRrn = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("checklistJobRrn")
  Ext.Ajax.request({
    url: actionUrlTwo,
    requestMethod: "getCheckListJob",
    method: "POST",
    params: { checklistJobRrn },
    success: function (resp) {
      refreshHyBasicDetailForm(resp)
      refreshSuppliesGrid(resp)
      refreshSuppliesLotNumberGrid(resp)
    }
  })
}

function getBYChecklistJobData() {
  let checklistJobRrn = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("checklistJobRrn")
  Ext.Ajax.request({
    url: actionUrlTwo,
    requestMethod: "getCheckListJob",
    method: "POST",
    params: { checklistJobRrn },
    success: function (resp) {
      refreshHyBasicDetailForm(resp)
      refreshSuppliesGrid(resp)
      refreshSuppliesLotNumberGrid(resp)
    }
  })
}

function refreshHyBasicDetailForm(data) {
  const hyBasicDetailForm = Ext.getCmp("hyBasicDetailForm")
  hyBasicDetailForm.getForm().findField("checklistJobRrn").setValue(data.checklistJobRrn)
  hyBasicDetailForm.getForm().findField("entityId").setValue(data.entityId)
  hyBasicDetailForm.getForm().findField("pmId").setValue(data.pmId)
  hyBasicDetailForm.getForm().findField("checkListId").setValue(data.checklistId)
  hyBasicDetailForm.getForm().findField("checklistJobState").setValue(data.checklistJobState)
}

function refreshSuppliesGrid(data) {
  const suppliesGrid = Ext.getCmp("suppliesGrid")
  suppliesGrid.getStore().loadData(data.checklistJobSupplies)
}

function refreshSuppliesLotNumberGrid(data) {
  const lotNumbeGrid = Ext.getCmp("lotNumbeGrid")
  lotNumbeGrid.getStore().loadData(data.checklistJobSuppliesDatas)
}
function saveLotNumberIssue(issueWin) {
  const params = {}
  const issueForm = Ext.getCmp("issueForm").getForm()
  if (!checkIssueFormInfo(issueForm.getValues())) {
    return
  }
  const hyBasicDetailForm = Ext.getCmp("hyBasicDetailForm").getForm()
  params.checkListJobRrn = hyBasicDetailForm.getValues().checklistJobRrn
  params.supplyRrn = issueForm.getValues().supplyRrn
  params.lotNumber = issueForm.getValues().lotNumber
  params.issueQty = issueForm.getValues().issueQty
  params.comments = issueForm.getValues().comments

  Ext.Ajax.request({
    url: actionUrlTwo,
    requestMethod: "addCheckListJobSuppliesData",
    params: params,
    method: "POST",
    async: false,
    success: function (response, options) {
      getChecklistJobData()
      issueWin.close()
    }
  })
}
function deleteLotNumberIssue(rec) {
  const params = {}
  const hyBasicDetailForm = Ext.getCmp("hyBasicDetailForm").getForm()
  params.checkListJobRrn = hyBasicDetailForm.getValues().checklistJobRrn
  params.supplyRrn = rec.data.supplyRrn
  params.lotNumber = rec.data.lotNumber
  params.issueQty = rec.data.issueQty

  Ext.Ajax.request({
    url: actionUrlTwo,
    requestMethod: "delCheckListJobSuppliesData",
    params: params,
    method: "POST",
    async: false,
    success: function (response, options) {
      getChecklistJobData()
    }
  })
}

function checkIssueFormInfo(values) {
  if (isNull(values.supplyId)) {
    showErrorAlert("工艺耗材号不能为空!!")
    return false
  }
  if (isNull(values.lotNumber)) {
    showErrorAlert("批次号不能为空!!")
    return false
  }
  if (isNull(values.issueQty)) {
    showErrorAlert("消耗量不能为空!!")
    return false
  }
  const reg = /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$/
  if (!reg.test(values.issueQty)) {
    showErrorAlert("消耗量输入错误,请输入大于0的数字!!")
    return false
  }
  return true
}
// function showHYDetailTab(grid, record, item, rowindex, e, opts) {
//   const pmRrn = record.data.pmRrn
//   const pmId = record.data.pmId
//   const eqptTabPanel = Ext.getCmp("eqptTabPanel")
//   const hyDetailTab = Ext.getCmp("hyDetailTab" + pmRrn)

//   if (hyDetailTab) {
//     eqptTabPanel.remove("hyDetailTab" + pmRrn)
//   }

//   eqptTabPanel.add({
//     id: "hyDetailTab" + pmRrn,
//     title: pmId,
//     closable: true,
//     layout: "fit",
//     padding: "0 0 0 0",
//     items: [createHYDetailPanel()]
//   })
//   eqptTabPanel.setActiveTab("hyDetailTab" + pmRrn)
// }

function checkCurrStatusForPM() {
  var invalidEqptIds = ""
  var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
  if (checkbox && checkbox.length > 0) {
    Ext.each(checkbox, function (item, index) {
      var status = item.data.eqptStatus
      if (status == "PM" || status == "PM_OVERDUE") {
        var eqptId = item.data.objectId + ","
        if (invalidEqptIds.indexOf(eqptId) < 0) {
          invalidEqptIds += eqptId
        }
      }
    })
  }

  if (invalidEqptIds && invalidEqptIds.length > 0) {
    invalidEqptIds = invalidEqptIds.substring(0, invalidEqptIds.lastIndexOf(","))
    showWarningAlert(window.CN0EN == "EN" ? "The " + invalidEqptIds + " current status is AM!" : "设备：" + invalidEqptIds + " 当前状态为PM,请先PM！")
    return false
  } else {
    return true
  }
  return false
}

function exportQuery() {
  var lotPlanGrid = Ext.getCmp("eqptPMGrid")
  var lotPlanStore = lotPlanGrid.getStore()
  if (lotPlanStore.data.items.length > 0) {
    MyCim.exportUtils.exportExcelExtByCurrentData(lotPlanStore, lotPlanGrid, "eqptHYPortal.do", "exportQuery")
  } else {
    showAlertByExt(
      i18n.labels.LBS_PROMPT,
      window.CN0EN === "EN" ? "Please click the query button first!" : "请先点击查询按钮!",
      0,
      window.CN0EN === "EN" ? 0 : 1
    )
  }
}

function refreshAmHisGrid() {
  const eqptHisForm = Ext.getCmp("eqptHisForm")
  const eqptAmHisGrid = Ext.getCmp("eqptAmHisGrid")
  const values = eqptHisForm.getForm().getValues()
  const store = eqptAmHisGrid.store
  store.currentPage = 1
  store.proxy.extraParams = values
  store.load()
}

function refreshAmSuppliesHisGrid() {
  const eqptHisForm = Ext.getCmp("eqptHisForm")
  const amSuppliesHisGrid = Ext.getCmp("amSuppliesHisGrid")
  const values = eqptHisForm.getForm().getValues()
  const store = amSuppliesHisGrid.store
  store.currentPage = 1
  store.proxy.extraParams = values
  store.load()
}

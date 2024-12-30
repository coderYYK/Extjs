/** @format */
// const matDatas = [
//   {
//     supplyId: "TEST0001",
//     supplyDesc: "DESC001",
//     standardQty: 111
//   }
// ]
function createEqptPMForm() {
  const eqptPMForm = Ext.create("Ext.form.Panel", {
    id: "eqptPMForm",
    bodyPadding: 5,
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      labelWidth: 130,
      labelAlign: "right",
      padding: 1
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "设备",
        name: "objectId",
        type: "EQUIPMENT", //'EQPTNOTCHAMBER''LOGEQUIPMENTEVENTBYUSER',
        targetIds: "objectId",
        columnWidth: 0.25
      },
      {
        xtype: "combobox",
        fieldLabel: "维护类型",
        name: "pmType",
        columnWidth: 0.25,
        editable: false,
        displayField: "data1",
        valueField: "key",
        store: amTypeStore(),
        queryMode: "local"
      },
      {
        xtype: "combobox",
        fieldLabel: "设备状态",
        name: "eqptStatus",
        columnWidth: 0.25,
        editable: false,
        displayField: "key",
        valueField: "value",
        store: comboboxStore(mycim2dev + "/eqptPortal.do?op=combo&type=status", "comboData"),
        queryMode: "local"
      },
      {
        xtype: "combobox",
        fieldLabel: "区域",
        name: "area",
        columnWidth: 0.25,
        editable: false,
        displayField: "key",
        valueField: "value",
        store: comboboxStore(mycim2dev + "/eqptPortal.do?op=conditionCombo&type=location", "getConditionCombo"),
        queryMode: "local"
      },
      {
        xtype: "datefield",
        fieldLabel: "开始时间",
        format: "Y/m/d",
        name: "startDate",
        value: "",
        enableKeyEvents: false,
        columnWidth: 0.25
      },
      {
        xtype: "datefield",
        fieldLabel: "结束时间",
        name: "endDate",
        format: "Y/m/d",
        value: "",
        enableKeyEvents: false,
        columnWidth: 0.25
      },
      {
        xtype: "combobox",
        fieldLabel: "ON/OFF",
        name: "itemStatus",
        columnWidth: 0.25,
        editable: false,
        displayField: "key",
        valueField: "value",
        store: ["", "ON", "OFF"],
        value: "",
        queryMode: "local"
      },
      {
        xtype: "combobox",
        fieldLabel: "工程师组",
        id: "engineerGroup",
        name: "engineerGroup",
        columnWidth: 0.25,
        editable: false,
        emptyText: "--" + i18n_fld_choice + "--",
        displayField: "key",
        valueField: "value",
        store: Ext.create("Ext.data.Store", {
          fields: ["key", "value"],
          proxy: {
            type: "ajax",
            actionMethods: { read: "GET" },
            url: "/" + APP_NAME + "/eqptPortal.do?type=engineer",
            requestMethod: "getConditionCombo",
            queryMask: false
          },
          autoLoad: true
        }),
        queryMode: "local"
      }
    ],
    buttons: [
      {
        text: "查看",
        formBind: true,
        disabled: true,
        region: "center",
        iconCls: "iconCls_magnifier",
        handler: function () {
          refreshEqptPortal()
        }
      },
      {
        text: "清空信息",
        formBind: true,
        disabled: true,
        region: "center",
        iconCls: "iconCls_arrowRedo",
        handler: function () {
          clearEqptPortalForm()
        }
      }
    ]
  })
  return eqptPMForm
}

function createEqptPMGrid() {
  const eqptPMStore = createEqptPMStore()
  const eqptPMGrid = Ext.create("Ext.grid.Panel", {
    id: "eqptPMGrid",
    store: eqptPMStore,
    width: "100%",
    region: "center",
    columnLines: true,
    stripeRows: true,
    viewConfig: {
      loadMask: false,
      getRowClass: function (record, rowIndex, rowParams, store) {
        //toleranceStatus -1 yellow, 1 green, 2 or 3 red
        var highLight = record.data.toleranceStatus
        if (highLight == "-1") {
          return "x-grid-record-yellow"
        } else if (highLight == "1") {
          return "x-grid-record-green"
        } else if (highLight == "2" || highLight == "3") {
          return "x-grid-record-red"
        } else if (highLight == "-2") {
          return "x-grid-record-orange"
        }
        return ""
      }
    },
    dockedItems: [
      {
        xtype: "toolbar",
        id: "parameterToolbars",
        items: [
          {
            itemId: "addAMTimeBtn",
            text: "AM Time",
            iconCls: "iconCls_add",
            handler: function () {
              showEditWindow("addAMTime")
            }
          },
          {
            itemId: "addAMCountBtn",
            text: "AM Count",
            iconCls: "iconCls_add",
            handler: function () {
              showEditWindow("addAMCount")
            }
          },
          {
            itemId: "pmChecklistBtn",
            text: "Checklist",
            iconCls: "iconCls_edit",
            scope: this,
            handler: function () {
              if (checkForChecklist("0")) {
                showChecklistJob()
              }
              // showChecklistJob()
            }
          },
          {
            itemId: "hyStartBtn",
            text: "开始换液",
            handler: function () {
              if (checkCurrStatusForPM()) {
                if (checkOnOffStatus()) {
                  var pmRrns = getPmRrnsForBatch()
                  showStartEndWindow(pmRrns, "start")
                }
              }
            }
          },
          {
            itemId: "hyEndBtn",
            text: "结束换液",
            handler: function () {
              if (checkCurrStatusForPM()) {
                var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
                if (checkbox && checkbox.length > 0) {
                  let checklistJobRrn = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("checklistJobRrn")
                  let pmId = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("pmId")
                  if (checklistJobRrn == null || checklistJobRrn == 0) {
                    showWarningAlert(window.CN0EN == "EN" ? "the AM is not start" : "当前AM ID 还没点击[开始维护]！" + pmId)
                  } else {
                    if (checkOnOffStatus()) {
                      var pmRrns = getPmRrnsForBatch()
                      var pmRrnAndId = getPmRrnAndIdForBatch()
                      var mainEqpt = getMainEqpt()
                      confirmNumberOfOperations(function () {
                        showStartEndWindow(pmRrns, "end", mainEqpt, pmRrnAndId)
                      })
                    }
                  }
                }
              }
            }
          },
          {
            itemId: "onOffBtn",
            text: "ON/OFF",
            handler: function () {
              var pmRrns = getPmRrnsForBatchAndCheckStatus()
              showOnOffWindow(pmRrns)
            }
          },
          {
            itemId: "deleteBtn",
            text: "删除",
            iconCls: "iconCls_delete",
            handler: function () {
              var errorMsg = ""
              var checkbox = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()
              if (checkbox && checkbox.length > 0) {
                Ext.each(checkbox, function (item, index) {
                  var pmStatus = item.raw.transId
                  if (pmStatus == "AM_START") {
                    errorMsg += window.CN0EN == "EN" ? "AM Item has started. delete not allowed!" : "所选AM条目中包含正在执行的，不能删除！"
                    return false
                  }
                })
              }
              if (errorMsg.length > 0) {
                showWarningAlert(errorMsg)
                return
              }
              var pmRrns = getPmRrnsForBatchAndCheckStatus()
              showDeleteWindow(pmRrns)
            }
          },
          {
            itemId: "export",
            text: i18n.labels.LBS_EXPORT,
            scope: this,
            iconCls: "iconCls_pageExcel",
            handler: function () {
              exportQuery()
            }
          },
          {
            itemId: "hyAddBtn",
            text: "补液",
            handler: function () {
              showBYChecklistJob()
            }
          }
        ]
      },
      {
        xtype: "mycim.pagingtoolbar",
        id: "pmsPagingTool",
        store: eqptPMStore,
        dock: "bottom",
        displayInfo: true,
        displayMsg: i18n_fld_showThe + "{0}" + i18n_fld_to + "{1}," + i18n_fld_total + "{2}" + i18n_fld_tiao,
        emptyMsg: i18n.msgs.MSG_NO_RESULT
      }
    ],
    selModel: Ext.create("Ext.selection.CheckboxModel", {
      injectCheckbox: 1,
      mode: "single",
      checkOnly: true,
      allowDeselect: true,
      enableKeyNav: true
    }),
    listeners: {
      itemdblclick: function (dataview, record, item, index, e) {
        if (record.getData().inUserLocation && record.getData().eqptStatus != "AM") {
          showEditWindow("modify", record.getData())
        }
      }
    },
    columns: [
      {
        xtype: "gridcolumn",
        dataIndex: "pmRrn",
        header: "",
        hidden: true
      },
      {
        xtype: "gridcolumn",
        dataIndex: "checklistJobRrn",
        header: "",
        hidden: true,
        width: 30
      },
      {
        xtype: "rownumberer",
        header: "编号",
        menuDisabled: true,
        dataIndex: "iconSelect",
        width: 50,
        id: "IconSelect"
      },
      {
        xtype: "gridcolumn",
        dataIndex: "pmId",
        menuDisabled: true,
        header: "换液ID",
        width: 120
      },
      {
        xtype: "gridcolumn",
        dataIndex: "objectId",
        header: "设备号",
        width: 120
      },
      {
        xtype: "gridcolumn",
        dataIndex: "checklistId",
        menuDisabled: true,
        header: "换液清单号",
        width: 100
      },
      {
        xtype: "gridcolumn",
        menuDisabled: true,
        dataIndex: "totalCount",
        header: "总数量",
        width: 80
      },
      {
        xtype: "gridcolumn",
        menuDisabled: true,
        dataIndex: "alarmCount",
        header: "警报数量",
        width: 80
      },
      {
        xtype: "gridcolumn",
        menuDisabled: true,
        dataIndex: "currentPmCount",
        header: "当前数量",
        width: 80
      },
      {
        xtype: "gridcolumn",
        menuDisabled: true,
        dataIndex: "currentJobCount",
        header: "JOB数量",
        width: 100
      },
      {
        xtype: "gridcolumn",
        menuDisabled: true,
        dataIndex: "surplusQuantity",
        header: "剩余加工数量",
        width: 120
      },
      {
        xtype: "gridcolumn",
        dataIndex: "eqptStatus",
        menuDisabled: true,
        header: "设备状态",
        width: 100
      },
      {
        xtype: "gridcolumn",
        dataIndex: "lastPmTime",
        menuDisabled: true,
        header: "上次换液时间",
        width: 150
      },
      {
        xtype: "gridcolumn",
        dataIndex: "nextPmTime",
        menuDisabled: true,
        header: "下次换液时间",
        width: 150,
        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
          if (record.getData().controlType === "AM_COUNT") {
            return ""
          } else {
            return value
          }
        }
      },
      {
        xtype: "gridcolumn",
        dataIndex: "pmType",
        header: "维护类型",
        menuDisabled: true,
        width: 100
      },
      {
        xtype: "gridcolumn",
        dataIndex: "controlType",
        menuDisabled: true,
        header: "控制类型",
        width: 80
      },
      {
        xtype: "gridcolumn",
        dataIndex: "itemStatus",
        menuDisabled: true,
        header: "ON/OFF",
        width: 75
      },
      {
        xtype: "gridcolumn",
        dataIndex: "autoEqpStatus",
        menuDisabled: true,
        header: "自动切换设备状态",
        width: 130
      },
      {
        xtype: "gridcolumn",
        dataIndex: "cycleTime",
        menuDisabled: true,
        header: "换液间隔时间",
        width: 120,
        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
          if (record.getData().controlType === "AM_COUNT") {
            return ""
          } else {
            return value
          }
        }
      },
      // {
      //     xtype: "gridcolumn",
      //     dataIndex: "toleranceTime",
      //     menuDisabled: true,
      //     header: "容忍时间(时)",
      //     width: 100,
      //     renderer: function (value, metadata, record, rowIndex, colIndex, store) {
      //         if (record.getData().controlType === "AM_COUNT") {
      //             return ""
      //         } else {
      //             return value
      //         }
      //     }
      // },
      // {
      //     xtype: "gridcolumn",
      //     dataIndex: "durationTime",
      //     menuDisabled: true,
      //     header: "持续时间(时)",
      //     width: 100,
      //     renderer: function (value, metadata, record, rowIndex, colIndex, store) {
      //         if (record.getData().controlType === "AM_COUNT") {
      //             return ""
      //         } else {
      //             return value
      //         }
      //     }
      // },
      {
        xtype: "gridcolumn",
        dataIndex: "pmReminder",
        menuDisabled: true,
        header: "提醒时间",
        width: 75
      },
      // {
      //     xtype: "gridcolumn",
      //     dataIndex: "maintenanceEngineerId",
      //     header: "工程师组",
      //     sortable: true,
      //     width: 100,
      //     align: "left",
      //     id: "maintenanceEngineerId"
      // },
      {
        xtype: "gridcolumn",
        dataIndex: "equipmentLocation",
        menuDisabled: true,
        header: "位置",
        width: 80
      },
      {
        xtype: "gridcolumn",
        dataIndex: "pmItemDesc",
        menuDisabled: true,
        header: "描述",
        width: 100
      },
      {
        xtype: "gridcolumn",
        dataIndex: "autoBy",
        header: "自动补液",
        width: 85
      },
      {
        xtype: "gridcolumn",
        dataIndex: "byStandardQty",
        header: "补液标准量",
        width: 100
      },
      {
        xtype: "gridcolumn",
        dataIndex: "createUserId",
        header: "创建者",
        width: 85
      }
      // {
      //   xtype: "gridcolumn",
      //   dataIndex: "deadLine",
      //   menuDisabled: true,
      //   header: i18n.labels.LBS_POST_NEXT_AM_TIME,
      //   width: 150,
      //   renderer: function (value, metadata, record, rowIndex, colIndex, store) {
      //     if (record.getData().controlType === "AM_COUNT") {
      //       return ""
      //     } else {
      //       return value
      //     }
      //   }
      // },
    ]
  })
  return eqptPMGrid
}

function createEqptPMStore() {
  const eqptPMStore = Ext.create("Ext.data.Store", {
    storeId: "eqptPMStore",
    fields: [
      {
        name: "pmRrn"
      },
      {
        name: "pmId"
      },
      {
        name: "objectId"
      },
      {
        name: "chamberId"
      },
      {
        name: "pmType"
      },
      {
        name: "eqptStatus"
      },
      {
        name: "maintenanceEngineerId"
      },
      {
        name: "pmItemDesc"
      },
      {
        name: "createUserId"
      },
      {
        name: "cycleTime"
      },
      {
        name: "nextPmTime"
      },
      {
        name: "toleranceTime"
      },
      {
        name: "durationTime"
      },
      {
        name: "itemStatus"
      },
      {
        name: "autoEqpStatus"
      },
      {
        name: "toleranceStatus"
      },
      {
        name: "nextPmTimeStr"
      },
      {
        name: "subNextPmTimeStr"
      },
      {
        name: "inUserLocation"
      },
      {
        name: "lastPmTime"
      },
      {
        name: "deadLine"
      },
      {
        name: "station"
      },
      {
        name: "controlType"
      },
      {
        name: "totalCount"
      },
      {
        name: "alarmCount"
      },
      {
        name: "currentPmCount"
      },
      {
        name: "checklistId"
      },
      {
        name: "checklistJobRrn"
      },
      {
        name: "pmTimeType"
      },
      {
        name: "equipmentLocation"
      },
      {
        name: "pmLinks"
      },
      {
        name: "consumePartStatus"
      },
      {
        name: "conditionQty"
      },
      {
        name: "comment"
      },
      {
        name: "recipeType"
      },
      {
        name: "recipeCountType"
      },
      { name: "pmReminder" },
      {
        name: "surplusQuantity"
      },
      {
        name: "currentJobCount"
      },
      {
        name: "autoBy"
      },
      {
        name: "byStandardQty"
      }
    ],
    // data: datas
    pageSize: pageSize,
    proxy: {
      type: "ajax",
      params: {
        start: 0,
        limit: pageSize
      },
      url: actionUrlTwo + "?op=getPmList",
      requestMethod: "getPmList",
      reader: {
        root: "results",
        totalProperty: "totalItems"
      }
    }
  })
  return eqptPMStore
}

function showEditWindow(type, detailInfo) {
  const addOrModifyFlag = type == "addAMTime" || type == "addAMCount"
  op = addOrModifyFlag ? "addPmSchedule" : "modifyPmSchedule"
  const title = addOrModifyFlag ? "添加" : "编辑"
  let isPMTimeFlag = false
  if (type == "addAMTime" || (!addOrModifyFlag && detailInfo.controlType === "AM_TIME")) {
    isPMTimeFlag = true
  }

  let controlType = ""
  switch (type) {
    case "addAMTime":
      controlType = "AM_TIME"
      break
    case "addAMCount":
      controlType = "AM_COUNT"
      break
  }
  const defControlType = !addOrModifyFlag ? detailInfo.controlType : controlType

  var baseForm = Ext.create("Ext.form.Panel", {
    id: "eqptPMWindowForm",
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
        id: "waferQtyContainer",
        defaults: {
          labelWidth: 150,
          columnWidth: 0.5
        },
        items: [
          {
            xtype: "textfield",
            hidden: true,
            id: "pmRrn",
            name: "pmRrn",
            itemId: "pmRrn"
          },
          {
            xtype: "textfield",
            fieldLabel: "换液ID",
            allowBlank: false,
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            name: "pmId",
            itemId: "pmId",
            listeners: {
              blur: function (e) {
                if (e.getRawValue() != "") {
                  e.setRawValue(e.getRawValue().toString().trim())
                }
              }
            }
          },
          {
            xtype: "mycim.searchfield",
            fieldLabel: "设备号",
            allowBlank: false,
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            id: "objectId",
            name: "objectId",
            itemId: "objectId",
            type: "LOGEQUIPMENTEVENTBYUSER",
            targetIds: "objectId",
            listeners: {
              blur: function (combo) {
                if (addOrModifyFlag) {
                  comboForCheckList(combo, addOrModifyFlag)
                }
              }
            }
          },
          {
            xtype: "textfield",
            fieldLabel: "控制类型",
            allowBlank: false,
            readOnly: true,
            fieldStyle: readOnlyFieldStyle,
            name: "controlType",
            itemId: "controlType",
            value: defControlType
          },
          {
            xtype: "combobox",
            fieldLabel: "维护类型",
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            name: "pmType",
            itemId: "pmType",
            id: "pmType",
            editable: false,
            allowBlank: false,
            displayField: "data1",
            valueField: "key",
            store: amTypeStore(type),
            queryMode: "local",
            listeners: {
              change: function (comboObj, value, prevValue) {
                var pmTypeComboVals = comboObj.getStore().data.items
                if (pmTypeComboVals && pmTypeComboVals.length > 0) {
                  for (var i = 0; i < pmTypeComboVals.length; i++) {
                    var obj = pmTypeComboVals[i]
                    if (obj && obj.data) {
                      var data = obj.data
                      var key = data.key
                      var data1 = data.data1
                      var data2 = data.data2
                      if (value == key) {
                        Ext.getCmp("waferQtyContainer").getComponent("cycleTime").setValue(data2)
                      }
                    }
                  }

                  // cycle time setup
                  var container = Ext.getCmp("waferQtyContainer")
                  var cycleTimeTxt = container.getComponent("cycleTime")
                  if (cycleTimeTxt && (value == "DAYS" || value == "HOURS")) {
                    cycleTimeTxt.setReadOnly(false)
                    cycleTimeTxt.setFieldStyle(allowEditFieldStyle)
                  } else {
                    cycleTimeTxt.setReadOnly(true)
                    cycleTimeTxt.setFieldStyle(readOnlyFieldStyle)
                  }
                }

                if (value === "BY_RECIPE") {
                  Ext.getCmp("recipeType").show()
                  Ext.getCmp("recipeCountType").show()
                } else {
                  Ext.getCmp("recipeType").hide()
                  Ext.getCmp("recipeCountType").hide()
                }
              }
              // blur: function (combo) {
              //     let value1 = combo.getValue()
              //     if (addOrModifyFlag) {
              //         let value = Ext.getCmp("objectId").getValue()
              //         if (value !== "" && value1 === "BY_CHECKLIST_ITEM") {
              //             comboForCheckListItem(value)
              //         }
              //     }
              // }
            }
          },
          {
            xtype: "combobox",
            name: "recipeType",
            itemId: "recipeType",
            id: "recipeType",
            editable: false,
            fieldLabel: "recipe类型<span class='mynecessary'>*</span>",
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            displayField: "data1",
            valueField: "key",
            store: recipeTypeStore(),
            queryMode: "local",
            hidden: true
          },
          {
            xtype: "combobox",
            name: "recipeCountType",
            itemId: "recipeCountType",
            id: "recipeCountType",
            editable: false,
            fieldLabel: "计数类型<span class='mynecessary'>*</span>",
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            displayField: "data1",
            valueField: "key",
            store: recipeCountTypeStore(),
            queryMode: "local",
            hidden: true
          },
          {
            xtype: "numberfield",
            fieldLabel: "换液时间间隔",
            allowBlank: false,
            name: "cycleTime",
            itemId: "cycleTime",
            allowDecimals: false, // 是否允许输入小数
            minValue: 1,
            readOnly: true,
            fieldStyle: readOnlyFieldStyle
          },
          {
            xtype: "textfield",
            fieldLabel: "描述",
            allowBlank: true,
            name: "pmItemDesc",
            id: "pmItemDesc"
          },
          {
            xtype: "mycim.combobox",
            name: "checklistId",
            id: "checklistId",
            itemId: "checklistId",
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            editable: false,
            fieldLabel: "换液清单号",
            queryMode: "local",
            allowBlank: false
          },
          {
            xtype: "container",
            layout: "column",
            itemId: "timeColumn",
            items: [
              {
                xtype: "datefield",
                fieldLabel: "下次换液时间",
                labelWidth: 150,
                columnWidth: 0.7,
                name: "nextPmTimeStr",
                itemId: "nextPmTimeStr",
                format: "Y/m/d",
                allowBlank: false,
                value: "",
                enableKeyEvents: false,
                listeners: {
                  change: function (comboObj, value, prevValue) {
                    var pmType = Ext.getCmp("waferQtyContainer").getComponent("pmType").getValue()
                    if (pmType == "MONTHLY") {
                      var cycleTime = getCycleTime(value)
                      Ext.getCmp("waferQtyContainer").getComponent("cycleTime").setValue(cycleTime)
                    }
                  }
                }
              },
              {
                xtype: "timefield",
                name: "subNextPmTimeStr",
                columnWidth: 0.3,
                itemId: "subNextPmTimeStr",
                format: "H:i",
                allowBlank: false,
                // allowOnlyWhitespace: true,
                autoSelect: false
              }
            ]
          },
          {
            xtype: "combobox",
            fieldLabel: "维护时间类型",
            allowBlank: false,
            name: "pmTimeType",
            itemId: "pmTimeType",
            displayField: "key",
            valueField: "value",
            store: [
              ["Static", "标准时间"],
              ["Flex", "动态时间"]
            ],
            queryMode: "local",
            editable: false,
            listeners: {
              afterRender: function (combo) {
                if (type == "addAMTime") {
                  combo.setValue("Static")
                }
              }
            }
          },
          {
            xtype: "numberfield",
            fieldLabel: "总数量",
            allowBlank: false,
            name: "totalCount",
            itemId: "totalCount",
            allowDecimals: true, // 是否允许输入小数
            minValue: 0
          },
          {
            xtype: "numberfield",
            fieldLabel: "警报数量",
            allowBlank: false,
            name: "alarmCount",
            itemId: "alarmCount",
            allowDecimals: true, // 是否允许输入小数
            minValue: 0
          },
          // {
          //   xtype: "combobox",
          //   fieldLabel: "自动切换设备",
          //   name: "autoEqp",
          //   itemId: "autoEqp",
          //   editable: false,
          //   allowBlank: false,
          //   displayField: "key",
          //   valueField: "value",
          //   store: ["YES", "NO"],
          //   value: "NO",
          //   queryMode: "local"
          // },
          {
            xtype: "combobox",
            fieldLabel: i18n.labels.LBS_PM_ON_OFF,
            name: "itemStatus",
            itemId: "itemStatus",
            id: "itemStatus",
            editable: false,
            allowBlank: false,
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            displayField: "key",
            valueField: "value",
            store: ["ON", "OFF"],
            value: "ON",
            queryMode: "local"
          },
          {
            xtype: "combobox",
            fieldLabel: "自动切换状态",
            readOnly: !addOrModifyFlag,
            fieldStyle: addOrModifyFlag ? "" : readOnlyFieldStyle,
            name: "autoEqpStatus",
            itemId: "autoEqpStatus",
            editable: false,
            allowBlank: false,
            displayField: "key",
            valueField: "value",
            store: ["YES", "NO"],
            value: "NO",
            queryMode: "local"
          },
          {
            xtype: "numberfield",
            fieldLabel: "邮件间隔时间(Hour)",
            allowBlank: false,
            name: "emailIntervalTime",
            itemId: "emailIntervalTime",
            allowDecimals: false, // 是否允许输入小数
            minValue: 1,
            value: "6"
          },
          {
            xtype: "numberfield",
            fieldLabel: "提醒时间",
            name: "pmReminder",
            itemId: "pmReminder",
            allowDecimals: false, // 是否允许输入小数
            allowBlank: false,
            minValue: 1,
            value: "3"
          },
          {
            xtype: "container",
            layout: "column",
            itemId: "byColumn",
            items: [
              {
                xtype: "combobox",
                fieldLabel: "自动补液:",
                labelWidth: 150,
                name: "autoBy",
                itemId: "autoBy",
                editable: false,
                columnWidth: 0.7,
                store: ["YES", "NO"],
                queryMode: "local",
                listeners: {
                  change: function (comboObj, value, prevValue) {
                    if (value == "NO") {
                      Ext.getCmp("waferQtyContainer").getComponent("byColumn").getComponent("byStandardQty").hide()
                    } else {
                      Ext.getCmp("waferQtyContainer").getComponent("byColumn").getComponent("byStandardQty").show()
                    }
                  }
                }
              },
              {
                xtype: "numberfield",
                allowBlank: false,
                columnWidth: 0.3,
                emptyText: "标准量",
                name: "byStandardQty",
                itemId: "byStandardQty",
                allowDecimals: true, // 是否允许输入小数
                minValue: 0,
                hidden: true
              }
            ]
          },
          {
            xtype: "textareafield",
            grow: false,
            name: "comment",
            itemId: "comment",
            fieldLabel: "备注",
            anchor: "100%",
            columnWidth: 1,
            readOnly: false,
            fieldStyle: "",
            height: 100,
            resizable: false //textarea 输入框是否可拖拽
          },
          {
            xtype: "displayfield",
            value: addOrModifyFlag,
            id: "editorFlag",
            name: "editorFlag",
            itemId: "editorFlag",
            hidden: true
          }
        ]
      }
    ]
  })

  const loadMarsk = new Ext.LoadMask(Ext.getCmp("eqptPMWindowForm"), {
    msg: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING,
    wait: true
  })
  controlTypeHandler(defControlType, addOrModifyFlag)
  detailInfoTmp = detailInfo
  baseForm.getForm().setValues(detailInfo)
  if (addOrModifyFlag) {
    Ext.getCmp("itemStatus").setValue("ON")
  }

  const window = Ext.create("Ext.window.Window", {
    width: 950,
    height: 500,
    modal: true, // 是否需要遮罩
    layout: "fit",
    modal: true, // 模态化窗口
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    title: "新增",
    constrain: true, // 限制窗口拖动范围
    id: "eqptPMWindow",
    items: [baseForm],
    buttons: [
      {
        text: "保存",
        formBind: true,
        handler: function () {
          save(window)
        }
      },
      {
        text: "重置",
        style: "margin-left:10px",
        id: "resetBtn",
        handler: function () {
          Ext.getCmp("eqptPMWindowForm").remove(Ext.getCmp("numberGrid"))
          Ext.getCmp("checklistId").getStore().loadData("")
          Ext.getCmp("eqptPMWindow").down("form").getForm().reset()
          Ext.getCmp("eqptPMWindow").down("form").getForm().setValues(detailInfoTmp)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyWindow(this.up("window"))
        }
      }
    ]
  }).show()
}

function createEqptMainPanel() {
  const eqptMainPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [createEqptPMForm(), createEqptPMGrid()]
  })
  return eqptMainPanel
}

function createEqptTabPanel() {
  const eqptTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "eqptTabPanel",
    activeTab: 0,
    items: [
      //选项卡中的每一项选项设置
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "换液检查Portal" + "</span>"
        },
        items: [createEqptMainPanel()]
      },
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "历史信息" + "</span>"
        },
        items: [createEqptHisPanel()]
      }
    ],
    listeners: {}
  })
  return eqptTabPanel
}

function showStartEndWindow(pmRrns, op) {
  var startOrEndFlag = false // start==true; end==false;
  var title = ""
  if (pmRrns && pmRrns.length > 0) {
    pmRrnStr = pmRrns
    if (op == "start") {
      title = "开始换液"
      startOrEndFlag = true
    } else {
      title = "结束换液"
    }
  } else {
    return
  }

  var baseForm = Ext.create("Ext.form.Panel", {
    id: "eqptPMStartEndWindowForm",
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
        id: "startEndContainer",
        defaults: {
          labelWidth: 100,
          columnWidth: 0.5
        },
        items: [
          {
            xtype: "textfield",
            name: "startTargetStatus",
            itemId: "startTargetStatus",
            fieldLabel: "目标状态:",
            allowBlank: !startOrEndFlag,
            disabled: !startOrEndFlag,
            hidden: !startOrEndFlag,
            readOnly: true,
            fieldStyle: "background:rgb(247, 248, 248);",
            value: startTargetStatus
          },
          {
            xtype: "combobox",
            fieldLabel: "目标状态:",
            style: "margin-left:100px;margin-top:20px",
            name: "targetEventId",
            itemId: "targetEventId",
            store: endPmEventStore,
            queryMode: "local",
            editable: false,
            valueField: "key",
            displayField: "value",
            allowBlank: startOrEndFlag,
            disabled: startOrEndFlag,
            hidden: startOrEndFlag,
            value: defaultEndEvent
          },
          {
            xtype: "textareafield",
            grow: false,
            name: "comment",
            fieldLabel: "备注:",
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

  const startEndWin = Ext.create("Ext.window.Window", {
    title: title,
    width: 780,
    height: 350,
    modal: true, // 是否需要遮罩
    layout: "fit",
    modal: true, // 模态化窗口
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    id: "eqptPMStartEndWindow",
    items: [baseForm],
    buttons: [
      // {
      //   text: "查看PM Checklist",
      //   id: "showChecklistJobBtn",
      //   handler: function () {
      //     showChecklistJob("1")
      //   }
      // },
      {
        text: "开始",
        formBind: true,
        id: "startPmBtn",
        handler: function () {
          startPM(this.up("window"))
        }
      },
      {
        text: "结束",
        formBind: true,
        style: "margin-left:10px",
        id: "endPmBtn",
        handler: function () {
          endPM(this.up("window"))
        }
      },
      {
        text: i18n.labels.LBS_RESET,
        style: "margin-left:10px",
        handler: function () {
          Ext.getCmp("eqptPMStartEndWindowForm").getForm().reset()
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          destroyStartEndWindow(this.up("window"))
        }
      }
    ]
  })
  startEndWin.show()

  if (startOrEndFlag) {
    Ext.getCmp("endPmBtn").hide()
    // Ext.getCmp("showChecklistJobBtn").hide()
  } else {
    Ext.getCmp("startPmBtn").hide()
  }
}

function showChecklistJob() {
  // let checklistJobRrn = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("checklistJobRrn")
  // let eqptId = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("objectId")
  const win = Ext.create("Ext.window.Window", {
    width: "70%",
    height: "80%",
    header: false,
    maximizable: false,
    closable: true, // 去掉关系按钮
    isTopContainer: true,
    modal: true,
    resizable: true,
    autoScroll: false,
    layout: { type: "border" },
    items: [createHyBasicDetailForm(), createSuppliesPanel()],
    buttons: [
      {
        text: "关闭",
        style: "margin-left:10px",
        handler: function () {
          win.close()
        }
      }
    ]
  })
  win.show()
  getChecklistJobData()
}

function showBYChecklistJob() {
  // let checklistJobRrn = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("checklistJobRrn")
  // let eqptId = Ext.getCmp("eqptPMGrid").getSelectionModel().getSelection()[0].get("objectId")
  const win = Ext.create("Ext.window.Window", {
    width: "70%",
    height: "80%",
    header: false,
    maximizable: false,
    closable: true, // 去掉关系按钮
    isTopContainer: true,
    modal: true,
    resizable: true,
    autoScroll: false,
    layout: { type: "border" },
    items: [createHyBasicDetailForm(), createSuppliesPanel()],
    buttons: [
      {
        text: "关闭",
        style: "margin-left:10px",
        handler: function () {
          win.close()
        }
      }
    ]
  })
  win.show()
  getBYChecklistJobData()
}

function createHyBasicDetailForm() {
  const hyBasicDetailForm = Ext.create("Ext.form.Panel", {
    id: "hyBasicDetailForm",
    title: "基本信息",
    frame: true,
    width: 320,
    region: "west",
    bodyPadding: 10,
    defaultType: "textfield",
    defaults: {
      anchor: "100%"
    },
    items: [
      {
        name: "checklistJobRrn",
        hidden: true
      },
      {
        fieldLabel: "设备号",
        name: "entityId",
        readOnly: true
      },
      {
        fieldLabel: "换液号",
        name: "pmId",
        readOnly: true
      },
      {
        fieldLabel: "换液检查单号",
        name: "checkListId",
        readOnly: true
      },
      {
        fieldLabel: "检查列表状态",
        name: "checklistJobState",
        readOnly: true
      }
    ]
  })
  return hyBasicDetailForm
}

function createSuppliesStore() {
  const suppliesStore = Ext.create("Ext.data.Store", {
    storeId: "suppliesStore",
    fields: ["supplyRrn", "supplyId", "supplyDesc", "standardQty"]
    // data: matDatas
  })
  return suppliesStore
}

function createSuppliesGrid() {
  const suppliesStore = createSuppliesStore()
  const suppliesGrid = Ext.create("Ext.grid.Panel", {
    id: "suppliesGrid",
    store: suppliesStore,
    width: "100%",
    region: "north",
    flex: 5,
    title: "工艺耗材",
    columns: [
      { dataIndex: "supplyRrn", align: "left", hidden: true },
      { dataIndex: "supplyId", align: "left", flex: 1, text: "工艺耗材号" },
      { dataIndex: "supplyDesc", align: "left", flex: 1, text: "工艺耗材描述" },
      { dataIndex: "standardQty", align: "left", flex: 1, text: "标准用量" },
      {
        text: "操作",
        renderer: function (val, meta, rec) {
          // 为元素生成唯一id
          var id = Ext.id()
          Ext.defer(function () {
            Ext.widget("button", {
              renderTo: id,
              text: "消耗",
              scale: "small",
              width: 40,
              height: 20,
              handler: function () {
                if (Ext.getCmp("issueWin")) {
                  Ext.getCmp("issueWin").close()
                }
                const issueWin = showIssueWindow()
                issueWin.show()
                const issueForm = Ext.getCmp("issueForm")
                issueForm.getForm().findField("supplyRrn").setValue(rec.data.supplyRrn)
                issueForm.getForm().findField("supplyId").setValue(rec.data.supplyId)
                issueForm.getForm().findField("supplyDesc").setValue(rec.data.supplyDesc)
              }
            })
          }, 50)
          return Ext.String.format('<div id="{0}"></div>', id)
        }
      }
    ]
  })
  return suppliesGrid
}

function createLotNumberStore() {
  const lotNumbeStore = Ext.create("Ext.data.Store", {
    storeId: "lotNumbeStore",
    fields: ["supplyRrn", "supplyId", "supplyDesc", "lotNumber", "issueQty", "comments"]
  })
  return lotNumbeStore
}

function createSuppliesLotNumberGrid() {
  const lotNumbeStore = createLotNumberStore()
  const lotNumbeGrid = Ext.create("Ext.grid.Panel", {
    id: "lotNumbeGrid",
    store: lotNumbeStore,
    width: "100%",
    region: "south",
    flex: 5,
    title: "批次消耗",
    region: "center",
    columns: [
      { dataIndex: "supplyRrn", hidden: true },
      { dataIndex: "supplyId", align: "left", flex: 1, text: "工艺耗材号" },
      { dataIndex: "supplyDesc", align: "left", flex: 1, text: "工艺耗材描述" },
      { dataIndex: "lotNumber", align: "left", flex: 1, text: "批次号" },
      { dataIndex: "issueQty", align: "left", flex: 1, text: "消耗数量" },
      { dataIndex: "comments", align: "left", flex: 1, text: "备注" },
      {
        align: "left",
        text: "操作",
        renderer: function (val, meta, rec) {
          // 为元素生成唯一id
          var id = Ext.id()
          Ext.defer(function () {
            Ext.widget("button", {
              renderTo: id,
              text: "删除",
              scale: "small",
              width: 40,
              height: 20,
              style: {
                backgroundColor: "#ff4d4f"
              },
              handler: function () {
                deleteLotNumberIssue(rec)
              }
            })
          }, 50)
          return Ext.String.format('<div id="{0}"></div>', id)
        }
      }
    ]
  })
  return lotNumbeGrid
}

function createSuppliesPanel() {
  const suppliesPanel = Ext.create("Ext.panel.Panel", {
    region: "center",
    layout: { type: "border" },
    items: [createSuppliesGrid(), createSuppliesLotNumberGrid()]
  })
  return suppliesPanel
}

function showIssueWindow() {
  const issueForm = Ext.create("Ext.form.Panel", {
    id: "issueForm",
    frame: true,
    bodyPadding: 10,
    defaultType: "textfield",
    defaults: {
      anchor: "100%",
      margin: "20 0"
    },
    items: [
      {
        name: "supplyRrn",
        columnWidth: 0.5,
        hidden: true
      },
      {
        fieldLabel: "工艺耗材号:",
        name: "supplyId",
        columnWidth: 0.5,
        readOnly: true
      },
      {
        fieldLabel: "工艺耗材描述:",
        name: "supplyDesc",
        readOnly: true
      },
      {
        xtype: "mycim.searchfield",
        fieldLabel: "批次号:",
        name: "lotNumber",
        columnWidth: 0.5,
        type: "LOTNUMBER_IN_SUPPLIES",
        params: ["supplyRrn"],
        targetIds: "lotNumber",
        editable: false,
        allowBlank: false
      },
      {
        xtype: "numberfield",
        fieldLabel: "消耗数量:",
        allowBlank: false,
        name: "issueQty",
        allowDecimals: true,
        decimalPrecision: 4,
        enforceMaxLength: true,
        maxLength: 8
      },
      {
        fieldLabel: "备注:",
        name: "comments"
      }
    ]
  })

  const issueWin = Ext.create("Ext.window.Window", {
    width: 500,
    height: 400,
    modal: true, // 是否需要遮罩
    layout: "fit",
    closable: true,
    constrain: true, // 限制窗口拖动范围
    resizable: false,
    constrain: true, // 限制窗口拖动范围
    name: "issueWin",
    id: "issueWin",
    items: [issueForm],
    buttons: [
      {
        text: "确定",
        handler: function () {
          saveLotNumberIssue(issueWin)
        }
      },
      {
        text: "取消",
        style: "margin-left:10px",
        handler: function () {
          issueWin.close()
        }
      }
    ]
  })
  return issueWin
}

function createEqptHisPanel() {
  const eqptHisPanel = Ext.create("Ext.panel.Panel", {
    layout: { type: "border" },
    items: [createEqptHisForm(), createHisTabPanel()]
  })
  return eqptHisPanel
}
function createEqptAmHisStore() {
  const eqptAmHisStore = Ext.create("Ext.data.Store", {
    storeId: "eqptAmHisStore",
    fields: [
      {
        name: "transRrn"
      },
      {
        name: "transId"
      },
      {
        name: "transPerformedBy"
      },
      {
        name: "transStartTimestamp"
      },
      {
        name: "pmId"
      },
      {
        name: "objectId"
      },
      {
        name: "pmType"
      },
      {
        name: "cycleTime"
      },
      {
        name: "durationTime"
      },
      {
        name: "nextPmTime"
      },
      {
        name: "totalCount"
      },
      {
        name: "alarmCount"
      },
      {
        name: "itemStatus"
      },
      {
        name: "comments"
      }
    ],
    // data: datas
    pageSize: pageSize,
    proxy: {
      type: "ajax",
      params: {
        start: 0,
        limit: pageSize
      },
      url: actionUrlTwo,
      requestMethod: "queryPmsHist",
      reader: {
        root: "results",
        totalProperty: "totalItems"
      }
    }
  })
  return eqptAmHisStore
}
function createEqptHisForm() {
  const eqptHisForm = Ext.create("Ext.form.Panel", {
    id: "eqptHisForm",
    bodyPadding: "5 25",
    width: "100%",
    region: "north",
    layout: "column",
    defaults: {
      labelWidth: 100,
      labelAlign: "right",
      padding: 1
    },
    items: [
      {
        xtype: "mycim.searchfield",
        fieldLabel: "设备",
        name: "objectId",
        type: "EQUIPMENT", //'EQPTNOTCHAMBER''LOGEQUIPMENTEVENTBYUSER',
        targetIds: "objectId",
        columnWidth: 0.4
      },
      {
        xtype: "combobox",
        fieldLabel: "维护类型",
        name: "pmType",
        columnWidth: 0.4,
        editable: false,
        displayField: "data1",
        valueField: "key",
        store: amTypeStore(),
        queryMode: "local"
      },
      {
        xtype: "datefield",
        fieldLabel: "开始时间",
        format: "Y/m/d",
        name: "startDate",
        value: "",
        enableKeyEvents: false,
        columnWidth: 0.4
      },
      {
        xtype: "datefield",
        fieldLabel: "结束时间",
        name: "endDate",
        format: "Y/m/d",
        value: "",
        enableKeyEvents: false,
        columnWidth: 0.4
      }
    ]
  })
  return eqptHisForm
}
function createEqptAmHisGrid() {
  const eqptAmHisStore = createEqptAmHisStore()
  const eqptAmHisGrid = Ext.create("Ext.grid.Panel", {
    id: "eqptAmHisGrid",
    store: eqptAmHisStore,
    width: "100%",
    columnLines: true,
    stripeRows: true,
    dockedItems: [
      {
        xtype: "toolbar",
        items: [
          {
            iconCls: "iconCls-refresh",
            text: "刷新",
            handler: function () {
              refreshAmHisGrid()
            }
          }
        ]
      },
      {
        xtype: "mycim.pagingtoolbar",
        store: eqptAmHisStore,
        dock: "bottom",
        displayInfo: true,
        displayMsg: i18n_fld_showThe + "{0}" + i18n_fld_to + "{1}," + i18n_fld_total + "{2}" + i18n_fld_tiao,
        emptyMsg: i18n.msgs.MSG_NO_RESULT
      }
    ],
    columns: [
      {
        xtype: "gridcolumn",
        dataIndex: "transRrn",
        header: "",
        hidden: true
      },
      // {
      //   xtype: "rownumberer",
      //   header: "编号",
      //   menuDisabled: true,
      //   dataIndex: "iconSelect",
      //   width: 50,
      //   id: "IconSelect"
      // },
      {
        xtype: "gridcolumn",
        dataIndex: "transId",
        header: "事务号",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "transPerformedBy",
        header: "事务执行者",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "transStartTimestamp",
        header: "创建时间",
        width: 200
      },
      {
        xtype: "gridcolumn",
        dataIndex: "pmId",
        header: "AM ID",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "objectId",
        header: "设备号",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "pmType",
        header: "维护类型",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "cycleTime",
        header: "间隔时间",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "durationTime",
        header: "持续时间",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "nextPmTime",
        header: "下次换液时间",
        width: 200
      },
      {
        xtype: "gridcolumn",
        dataIndex: "totalCount",
        header: "总数量",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "alarmCount",
        header: "警报数量",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "itemStatus",
        header: "ON/OFF",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "comments",
        header: "备注",
        width: 250
      }
    ]
  })
  return eqptAmHisGrid
}

function createAmSuppliesHisStore() {
  const amSuppliesHisStore = Ext.create("Ext.data.Store", {
    storeId: "amSuppliesHisStore",
    fields: [
      {
        name: "transRrn"
      },
      {
        name: "equipmentId"
      },
      {
        name: "equipmentDesc"
      },
      {
        name: "materialId"
      },
      {
        name: "materialDesc"
      },
      {
        name: "lotNumber"
      },
      {
        name: "qty"
      },
      {
        name: "createDateStr"
      },
      {
        name: "createUser"
      }
    ],
    // data: datas
    pageSize: pageSize,
    proxy: {
      type: "ajax",
      params: {
        start: 0,
        limit: pageSize
      },
      url: actionUrlTwo,
      requestMethod: "queryHySuppliesHist",
      reader: {
        root: "results",
        totalProperty: "totalItems"
      }
    }
  })
  return amSuppliesHisStore
}
function createAmSuppliesHisGrid() {
  const amSuppliesHisStore = createAmSuppliesHisStore()
  const amSuppliesHisGrid = Ext.create("Ext.grid.Panel", {
    id: "amSuppliesHisGrid",
    store: amSuppliesHisStore,
    width: "100%",
    region: "center",
    columnLines: true,
    stripeRows: true,
    dockedItems: [
      {
        xtype: "toolbar",
        items: [
          {
            iconCls: "iconCls-refresh",
            text: "刷新",
            handler: function () {
              refreshAmSuppliesHisGrid()
            }
          }
        ]
      },
      {
        xtype: "mycim.pagingtoolbar",
        store: amSuppliesHisStore,
        dock: "bottom",
        displayInfo: true,
        displayMsg: i18n_fld_showThe + "{0}" + i18n_fld_to + "{1}," + i18n_fld_total + "{2}" + i18n_fld_tiao,
        emptyMsg: i18n.msgs.MSG_NO_RESULT
      }
    ],
    columns: [
      {
        xtype: "gridcolumn",
        dataIndex: "transRrn",
        header: "",
        hidden: true
      },
      {
        xtype: "gridcolumn",
        dataIndex: "equipmentId",
        header: "设备号",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "equipmentDesc",
        header: "设备描述",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "materialId",
        header: "物料号",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "materialDesc",
        header: "物料描述",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "lotNumber",
        header: "批次号",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "qty",
        header: "数量",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "createUser",
        header: "操作人",
        flex: 1
      },
      {
        xtype: "gridcolumn",
        dataIndex: "createDateStr",
        header: "消耗时间",
        width: 200
      }
    ]
  })
  return amSuppliesHisGrid
}

function createHisTabPanel() {
  const hisTabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "hisTabPanel",
    activeTab: 0,
    region: "center",
    items: [
      //选项卡中的每一项选项设置
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "换液历史" + "</span>"
        },
        items: [createEqptAmHisGrid()]
      },
      {
        closable: false,
        layout: "fit",
        tabConfig: {
          title: "<span>" + "消耗历史" + "</span>"
        },
        items: [createAmSuppliesHisGrid()]
      }
    ],
    listeners: {}
  })
  return hisTabPanel
}

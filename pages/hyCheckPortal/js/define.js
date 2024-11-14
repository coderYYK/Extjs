/** @format */
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
function pmTypeStore(type) {
  if (type == "addPMCount") {
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
  if (type == "addPMTime") {
    return Ext.create("Ext.data.Store", {
      fields: ["key", "data1", "data2"],
      proxy: {
        type: "ajax",
        actionMethods: { read: "GET" },
        url: mycim2dev + "/eqptPMPortal.do?op=getCycleType&windowFlag=1",
        requestMethod: "getCycleType",
        queryMask: false
      },
      autoLoad: true
    })
  }
  if (type == "addPMCondition") {
    return new Ext.data.SimpleStore({
      fields: ["key", "data1", "data2"],
      data: [["BY_WAFER", "By Wafer", "0"]]
    })
  }
  //var pmTypeArray = ["WEEKLY", "MONTHLY", "DAYS"];
  return Ext.create("Ext.data.Store", {
    fields: ["key", "data1", "data2"],
    proxy: {
      type: "ajax",
      actionMethods: { read: "GET" },
      url: mycim2dev + "/eqptPMPortal.do?op=getCycleType",
      requestMethod: "getCycleType",
      queryMask: false
    },
    autoLoad: true
  })
  //return pmTypeArray;
}

function showHYDetailTab(grid, record, item, rowindex, e, opts) {
  const pmRrn = record.data.pmRrn
  const pmId = record.data.pmId
  const eqptTabPanel = Ext.getCmp("eqptTabPanel")
  const hyDetailTab = Ext.getCmp("hyDetailTab" + pmRrn)

  if (hyDetailTab) {
    eqptTabPanel.remove("hyDetailTab" + pmRrn)
  }

  eqptTabPanel.add({
    id: "hyDetailTab" + pmRrn,
    title: pmId,
    closable: true,
    layout: "fit",
    padding: "0 0 0 0",
    items: [createHYDetailPanel()]
  })
  eqptTabPanel.setActiveTab("hyDetailTab" + pmRrn)
}

function showIssueWindow() {}

/** @format */
let loadMask = {}
function createTabPanel() {
  const panel = Ext.create("MyCim.panel.Panel", {
    title: "毛棒投批",
    items: [createQryForm(), createBasicForm(), createLotForm(), createResultForm()]
  })
  const tabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "lotTabPanel",
    activeTab: 0,
    items: [panel]
  })
  return tabPanel
}

function createQryForm() {
  const qryForm = Ext.create("InitViewer.QryForm", {
    id: "qryForm"
  })
  const qryBtn = qryForm.query('[name="qryBtn"]')[0]
  const resetBtn = qryForm.query('[name="resetBtn"]')[0]
  qryBtn.on({
    click: () => {
      const id = qryForm.getForm().findField("taskId").getValue()
      if (!id) {
        return
      }
      getTaskInfo(id, (response) => {
        console.log(response)
        if (response.flag) {
          const basicForm = Ext.getCmp("basicForm").getForm()
          basicForm.findField("furnaceTaskId").setValue(response.taskId)

          basicForm.findField("productSpecBook").getStore().loadData(response.productList)
          response.productList.forEach((item) => {
            if (item.selected === "Y") {
              basicForm.findField("productSpecBook").setValue(item.productId)
              return
            }
          })

          basicForm.findField("processId").getStore().loadData(response.technologys)
          response.technologys.forEach((item) => {
            if (item.selected === "Y") {
              basicForm.findField("processId").setValue(item.instancerrn)
              return
            }
          })
        } else {
          Ext.Msg.alert(i18n.labels.LBS_ERROR, response.msg)
        }
      })
    }
  })
  resetBtn.on({
    click: () => {
      qryForm.getForm().reset()
      Ext.getCmp("basicForm").getForm().reset()
      Ext.getCmp("lotForm").getForm().reset()
      Ext.getCmp("resultForm").getForm().reset()
    }
  })
  return qryForm
}

function createBasicForm() {
  const basicForm = Ext.create("InitViewer.BasicForm", {
    title: "基本信息",
    id: "basicForm"
  })
  const productSpecBook = basicForm.getForm().findField("productSpecBook")
  productSpecBook.store = Ext.create("Ext.data.Store", {
    fields: ["productId", "productDesc"]
  })

  const process = basicForm.getForm().findField("processId")
  process.store = Ext.create("Ext.data.Store", {
    fields: ["instancerrn", "instanceid"]
  })

  const generateBtn = basicForm.query('[name="generateBtn"]')[0]
  generateBtn.on({
    click: () => {
      const taskId = basicForm.getForm().findField("furnaceTaskId").getValue()
      if (!taskId) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "炉台任务号不能为空!")
        return
      }
      const productId = basicForm.getForm().findField("productSpecBook").getValue()
      if (!productId) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "产品规格书不能为空!")
        return
      }
      const processRrn = basicForm.getForm().findField("processId").getValue()
      if (!processRrn) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "工艺流程号不能为空!")
        return
      }
      const params = { taskId, productId, processRrn }
      generateId(params, (response) => {
        if (response.flag) {
          const lotForm = Ext.getCmp("lotForm").getForm()
          lotForm.findField("hairStickId").setValue(response.lotId)
        } else {
          Ext.Msg.alert(i18n.labels.LBS_ERROR, response.msg)
        }
      })
    }
  })
  return basicForm
}

function createResultForm() {
  const resultForm = Ext.create("InitViewer.ResultForm", {
    title: "批次信息",
    id: "resultForm"
  })
  return resultForm
}

function createLotForm() {
  const lotForm = Ext.create("InitViewer.LotForm", {
    title: "批次信息",
    id: "lotForm"
  })
  const addBtn = lotForm.query('[name="addBtn"]')[0]
  addBtn.on({
    click: () => {
      const basicForm = Ext.getCmp("basicForm")
      const taskId = basicForm.getForm().findField("furnaceTaskId").getValue()
      if (!taskId) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "炉台任务号不能为空!")
        return
      }
      const productId = basicForm.getForm().findField("productSpecBook").getValue()
      if (!productId) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "产品规格书不能为空!")
        return
      }
      const processRrn = basicForm.getForm().findField("processId").getValue()
      if (!processRrn) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "工艺流程号不能为空!")
        return
      }
      const lotId = lotForm.getForm().findField("hairStickId").getValue()
      if (!lotId) {
        Ext.Msg.alert(i18n.labels.LBS_ERROR, "毛棒号不能为空!")
        return
      }
      const params = { taskId, productId, processRrn, lotId }
      showLoadMask()
      createLot(
        params,
        (response) => {
          if (response.flag) {
            MyCim.notify.msg("提示", "创建成功!")
            const resultForm = Ext.getCmp("resultForm").getForm()
            resultForm.findField("lotId").setValue(response.lotInfo.lotId)
            resultForm.findField("furnaceTaskId").setValue(response.lotInfo.taskId)
            resultForm.findField("processId").setValue(response.lotInfo.processId)
            resultForm.findField("routeId").setValue(response.lotInfo.routeId)
            resultForm.findField("stepId").setValue(response.lotInfo.operationId)
            resultForm.findField("lotStatus").setValue(response.lotInfo.lotStatus)
          } else {
            Ext.Msg.alert(i18n.labels.LBS_ERROR, response.msg)
          }
          removeLoadMask()
        },
        () => {
          removeLoadMask()
        }
      )
    }
  })
  return lotForm
}

function removeLoadMask() {
  if (loadMask instanceof Ext.LoadMask) {
    loadMask.hide()
  }
}

function showLoadMask() {
  if (!(loadMask instanceof Ext.LoadMask)) {
    loadMask = new Ext.LoadMask(Ext.getBody(), "Please waiting...")
  }

  loadMask.show()
}

function getTaskInfo(id, sucCallFn, failCallFn) {
  Ext.Ajax.request({
    url: "/mycim2/createhairlot.do",
    requestMethod: "queryByStickId",
    params: { taskId: id },
    success: function (response) {
      sucCallFn(response)
    },
    failure: function () {}
  })
}

function generateId(params, sucCallFn, failCallFn) {
  Ext.Ajax.request({
    url: "/mycim2/createhairlot.do",
    requestMethod: "generateLotId",
    params: params,
    success: function (response) {
      sucCallFn(response)
    },
    failure: function () {}
  })
}

function createLot(params, sucCallFn, failCallFn) {
  Ext.Ajax.request({
    url: "/mycim2/createhairlot.do",
    requestMethod: "createLot",
    params: params,
    success: function (response) {
      sucCallFn(response)
    },
    failure: function () {
      failCallFn()
    }
  })
}

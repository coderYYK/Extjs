/** @format */
const PAGE_SIZE = 20
function createQryForm() {
  const qryForm = Ext.create("InitViewer.QryForm", {
    id: "qryForm",
    title: "机加完工明细",
    region: "north"
  })
  const form = qryForm.getForm()

  const qryBtn = qryForm.query('[name="qryBtn"]')[0]
  qryBtn.on({
    click: () => {
      const id = form.findField("squareStickId").getValue()
      if (!id) {
        return
      }
      const activeTab = Ext.getCmp("detailTabPanel").getActiveTab()
      if (activeTab.id === "detailGrid") {
        const detailStore = Ext.data.StoreManager.lookup("detailStore")
        detailStoreReload(detailStore)
      } else if (activeTab.id === "basicInfoForm") {
        getJjBasicInfo(id, (data) => {
          const basicForm = Ext.getCmp("basicInfoForm").getForm()
          setBasicFormInfo(basicForm, data)
        })
      }
    }
  })
  return qryForm
}

function createTabPanel() {
  const tabPanel = Ext.create("Ext.tab.Panel", {
    region: "center",
    id: "detailTabPanel",
    activeTab: 0,
    items: [createBsicInfoForm(), createDetailGrid()]
  })
  tabPanel.on({
    tabchange: (panel, newCard, oldCard) => {
      console.log(newCard, oldCard)
      const id = Ext.getCmp("qryForm").getForm().findField("squareStickId").getValue()
      if (!id) {
        return
      }
      if (newCard.id === "detailGrid") {
        const detailStore = Ext.data.StoreManager.lookup("detailStore")
        detailStoreReload(detailStore)
      } else if (newCard.id === "basicInfoForm") {
        getJjBasicInfo(id, (data) => {
          const basicForm = Ext.getCmp("basicInfoForm").getForm()
          setBasicFormInfo(basicForm, data)
        })
      }
    }
  })
  return tabPanel
}

function createBsicInfoForm() {
  const basicInfoForm = Ext.create("InitViewer.BasicInfoForm", {
    id: "basicInfoForm",
    title: "基本信息",
    region: "center"
  })
  return basicInfoForm
}

function createPagingTool(store) {
  const detailPagingTool = Ext.create("MyCim.PagingToolbar", {
    id: "detailPagingTool",
    store: store,
    dock: "bottom",
    displayInfo: true,
    inputItemWidth: 50,
    emptyMsg: i18n.msgs.MSG_NO_RESULT,
    displayMsg: i18n_fld_showThe + "{0}" + i18n_fld_to + "{1}," + i18n_fld_total + "{2}" + i18n_fld_tiao
  })
  return detailPagingTool
}

function createDetailGrid() {
  const detailStore = createDetailStore()
  const detailGrid = Ext.create("InitViewer.DetailGrid", {
    id: "detailGrid",
    store: detailStore,
    title: "完工明细",
    region: "center",
    dockedItems: [createPagingTool(detailStore)]
  })
  return detailGrid
}

function createDetailStore() {
  const detailStore = Ext.create("InitViewer.DetailStore", {
    storeId: "detailStore",
    pageSize: PAGE_SIZE
  })
  detailStore.setProxy({
    type: "ajax",
    url: "http://127.0.0.1:8080/ext/queryDetail",
    params: {
      start: 0,
      limit: PAGE_SIZE
    },
    reader: {
      root: "data",
      totalProperty: "total"
    }
  })
  return detailStore
}

function detailStoreReload(store, exparam) {
  store.loadPage(1, {
    params: {
      start: 0,
      limit: PAGE_SIZE
    }
  })
  if (exparam) {
    store.proxy.extraParams = exparam
  }
}

function setBasicFormInfo(basicForm, data) {
  basicForm.findField("squareStickId").setValue(data.squareStickId)
  basicForm.findField("workorderId").setValue(data.workorderId)
  basicForm.findField("jjTechnologyWorkflowId").setValue(data.jjTechnologyWorkflowId)
  basicForm.findField("technologyWorkflowVersion").setValue(data.technologyWorkflowVersion)
  basicForm.findField("productSpecBook").setValue(data.productSpecBook)
  basicForm.findField("squareStickStatus").setValue(data.squareStickStatus)
  basicForm.findField("hairStickId").setValue(data.hairStickId)
  basicForm.findField("hairStickFurnaceId").setValue(data.hairStickFurnaceId)
  basicForm.findField("furnaceTaskId").setValue(data.furnaceTaskId)
}

function getJjDetailInfo(id, sucCallFn, failCallFn) {
  $.ajax({
    type: "GET",
    url: "../../data/jjDetials.json",
    success: function (data) {
      sucCallFn(data.data)
    },
    error: function (result) {}
  })
}

function getJjBasicInfo(id, sucCallFn, failCallFn) {
  $.ajax({
    type: "GET",
    url: "../../data/jjBasicInfo.json",
    success: function (data) {
      sucCallFn(data.data)
    },
    error: function (result) {}
  })
}

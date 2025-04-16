/** @format */
Ext.Loader.setConfig({ enabled: false })
Ext.onReady(function () {
  var app = new InitViewer.App()
  refreshFlowConfigGrid()
})
Ext.Loader.setConfig({ enabled: false })
Ext.onReady(function () {
  Ext.QuickTips.init()
  if (!Ext.grid.View.prototype.templates) {
    Ext.grid.View.prototype.templates = {}
  }
  Ext.BLANK_IMAGE_URL = "/" + APP_NAME + "/vendor/extjs/resources/images/default/tree/s.gif"
})

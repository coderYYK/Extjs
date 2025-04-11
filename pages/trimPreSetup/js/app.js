/** @format */
Ext.Loader.setConfig({ enabled: false })
Ext.onReady(function () {
  var app = new InitViewer.App()
  refreshFlowConfigGrid()
})

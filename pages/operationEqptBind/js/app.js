/** @format */

Ext.define("InitViewer.App", {
  extend: "Ext.container.Viewport",
  initComponent: function () {
    Ext.apply(this, {
      layout: {
        type: "border"
      },
      items: [createMainPanel()]
    })
    this.callParent(arguments)
  }
})

Ext.Loader.setConfig({ enabled: false })
Ext.onReady(function () {
  var app = new InitViewer.App()
  //   Ext.select('a[data-qtip="Refresh"]').hide()
  Ext.BLANK_IMAGE_URL = "../../extjs/resources/images/default/tree/s.gif"
})

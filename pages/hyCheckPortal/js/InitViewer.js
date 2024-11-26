/** @format */

Ext.define("InitViewer.App", {
  extend: "Ext.container.Viewport",
  initComponent: function () {
    Ext.apply(this, {
      layout: {
        type: "border"
      },
      items: [createEqptTabPanel()]
    })
    this.callParent(arguments)
  }
})

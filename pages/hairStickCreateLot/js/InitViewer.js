/** @format */

Ext.define("InitViewer.App", {
  extend: "Ext.container.Viewport",
  initComponent: function () {
    Ext.apply(this, {
      layout: {
        type: "border",
        padding: 1
      },
      items: [createTabPanel()]
    })
    this.callParent(arguments)
  }
})

/** @format */

Ext.define("InitViewer.App", {
  extend: "Ext.container.Viewport",
  initComponent: function () {
    Ext.apply(this, {
      layout: {
        type: "border"
      },
      items: [createCheckListTabPanel()]
    })
    this.callParent(arguments)
  }
})

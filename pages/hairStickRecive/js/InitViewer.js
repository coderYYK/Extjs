Ext.define("InitViewer.App", {
  extend: "Ext.container.Viewport",
  initComponent: function () {
    Ext.apply(this, {
      minHeight: 900,
      layout: {
        type: "border",
        padding: 1,
      },
      items: [createInitForm("initForm", "毛棒接收管理")],
    });
    this.callParent(arguments);
  },
});

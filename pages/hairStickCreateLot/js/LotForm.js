/** @format */

Ext.define("InitViewer.LotForm", {
  extend: "Ext.form.Panel",
  constructor: function (config) {
    Ext.applyIf(config, {
      layout: "column",
      fieldDefaults: {
        labelWidth: 100,
        labelAlign: "right",
        margin: 15
      },
      defaultType: "textfield",
      items: [
        {
          xtype: "textfield",
          name: "hairStickId",
          fieldLabel: I18N_HAIR_STICK_ID,
          columnWidth: 0.3,
          readOnly: true
        }
      ],
      buttons: [
        {
          text: I18N_CREATE,
          region: "center",
          iconCls: "iconCls_add",
          name: "addBtn"
        }
      ]
    })
    this.callParent(arguments)
  }
})

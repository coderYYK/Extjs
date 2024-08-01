/** @format */

Ext.define("InitViewer.QryForm", {
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
          xtype: "mycim.searchfield",
          name: "taskId",
          fieldLabel: I18N_FURNACE_TASK_ID,
          type: "MONOLOTPLAN",
          targetIds: "taskId",
          columnWidth: 0.3
        }
      ],
      buttons: [
        {
          text: I18N_QUERY,
          formBind: false,
          disabled: false,
          region: "center",
          iconCls: "iconCls_arrowRedo",
          name: "qryBtn"
        },
        {
          text: i18n_fld_reset,
          formBind: false,
          disabled: false,
          region: "center",
          iconCls: "iconCls_arrowRedo",
          name: "resetBtn"
        }
      ]
    })
    this.callParent(arguments)
  }
})

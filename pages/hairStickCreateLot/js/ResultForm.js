/** @format */

Ext.define("InitViewer.ResultForm", {
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
          name: "lotId",
          fieldLabel: i18n_fld_LotID,
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "furnaceTaskId",
          fieldLabel: I18N_FURNACE_TASK_ID,
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "textfield",
          fieldLabel: i18n_fld_processID,
          name: "processId",
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "textfield",
          fieldLabel: i18n_fld_RouteId,
          name: "routeId",
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "textfield",
          fieldLabel: I18N_STEP_ID,
          name: "stepId",
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "textfield",
          fieldLabel: i18n_fld_lotStatus,
          name: "lotStatus",
          columnWidth: 0.3,
          readOnly: true
        }
      ]
    })
    this.callParent(arguments)
  }
})

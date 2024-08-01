/** @format */

Ext.define("InitViewer.BasicForm", {
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
          name: "furnaceTaskId",
          fieldLabel: I18N_FURNACE_TASK_ID,
          columnWidth: 0.3,
          readOnly: true
        },
        {
          xtype: "combobox",
          fieldLabel: I18N_WORK_PRODUCT_SPEC,
          name: "productSpecBook",
          columnWidth: 0.3,
          displayField: "productDesc",
          valueField: "productId",
          editable: false
        },
        {
          xtype: "combobox",
          fieldLabel: i18n_fld_processID,
          name: "processId",
          columnWidth: 0.3,
          displayField: "instanceid",
          valueField: "instancerrn",
          editable: false
        }
      ],
      buttons: [
        {
          text: I18N_GENERATE_ID,
          formBind: false,
          disabled: false,
          region: "center",
          iconCls: "iconCls_arrowRedo",
          name: "generateBtn"
        }
      ]
    })
    this.callParent(arguments)
  }
})

/** @format */

Ext.define("InitViewer.InitForm", {
  extend: "Ext.form.Panel",
  constructor: function (config) {
    Ext.applyIf(config, {
      layout: "column",
      defaults: {
        anchor: "100%"
      },
      fieldDefaults: {
        labelWidth: 100,
        labelAlign: "left",
        flex: 1,
        margin: 5
      },
      // The fields
      defaultType: "textfield",
      items: [
        {
          xtype: "textfield",
          name: "hairStickId",
          fieldLabel: I18N_HAIR_STICK_ID,
          allowBlank: false,
          columnWidth: 0.5,
          enableKeyEvents: true
        },
        {
          xtype: "textfield",
          name: "workorderId",
          fieldLabel: I18N_WORK_ORDER,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "furnaceTaskId",
          fieldLabel: I18N_FURNACE_TASK_ID,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "furnaceId",
          fieldLabel: I18N_FURNACE_ID,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "productSpecBook",
          fieldLabel: I18N_WORK_PRODUCT_SPEC,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "rczPartNum",
          fieldLabel: I18N_RCZ_PART_NUM,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "hairStickLength",
          fieldLabel: I18N_HAIR_STICK_LENGTH,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "spec",
          fieldLabel: i18n_fld_specifications,
          columnWidth: 0.5,
          readOnly: true
        },
        {
          xtype: "textfield",
          name: "reciverId",
          fieldLabel: I18N_REVICER_ID,
          columnWidth: 0.5,
          allowBlank: false
        },
        {
          xtype: "textfield",
          name: "password",
          fieldLabel: I18N_PASSWORD,
          columnWidth: 0.5,
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: I18N_REVICE,
          formBind: true,
          disabled: true,
          region: "center",
          iconCls: "iconCls_add",
          name: "addBtn"
        },
        {
          text: I18N_RESET,
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

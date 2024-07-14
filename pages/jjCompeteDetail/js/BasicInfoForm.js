Ext.define('InitViewer.BasicInfoForm', {
	extend: 'Ext.form.Panel',
	constructor: function (config) {
		Ext.applyIf(config, {
			layout: 'column',
			defaults: {
				anchor: '100%'
			},
			fieldDefaults: {
				labelWidth: 100,
				labelAlign: 'left',
				margin: 5
			},
			// The fields
			defaultType: 'textfield',
			items: [
				{
					xtype: 'textfield',
					name: 'squareStickId',
					fieldLabel: I18N_SQUARE_STICK_ID,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'workorderId',
					fieldLabel: I18N_WORK_ORDER,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'jjTechnologyWorkflowId',
					fieldLabel: I18N_JJ_TECHNOLOGY_WORKFLOW_ID,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'technologyWorkflowVersion',
					fieldLabel: I18N_TECHNOLOGY_WORKFLOW_VERSION,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'productSpecBook',
					fieldLabel: I18N_WORK_PRODUCT_SPEC,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'squareStickStatus',
					fieldLabel: I18N_SQUARE_STICK_STATUS,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'hairStickId',
					fieldLabel: I18N_HAIR_STICK_ID,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'hairStickFurnaceId',
					fieldLabel: I18N_HAIR_STICK_FURNACE_ID,
					columnWidth: 0.5,
					readOnly: true
				},
				{
					xtype: 'textfield',
					name: 'furnaceTaskId',
					fieldLabel: I18N_FURNACE_TASK_ID,
					columnWidth: 0.5,
					readOnly: true
				}
			]
		});
		this.callParent(arguments);
	}
});

Ext.define('InitViewer.QryForm', {
	extend: 'Ext.form.Panel',
	constructor: function (config) {
		Ext.applyIf(config, {
			layout: 'column',
			fieldDefaults: {
				labelWidth: 100,
				labelAlign: 'right',
				margin: 15
			},
			defaultType: 'textfield',
			items: [
				{
					xtype: 'textfield',
					name: 'squareStickId',
					fieldLabel: I18N_SQUARE_STICK_ID,
					columnWidth: 0.3
				}
			],
			buttons: [
				{
					text: I18N_QUERY,
					formBind: false,
					disabled: false,
					region: 'center',
					iconCls: 'iconCls_arrowRedo',
					name: 'qryBtn'
				}
			]
		});
		this.callParent(arguments);
	}
});

Ext.define('InitViewer.App', {
	extend: 'Ext.container.Viewport',
	initComponent: function () {
		Ext.apply(this, {
			layout: {
				type: 'border',
				padding: 1
			},
			items: [createQryForm(), createTabPanel()]
		});
		this.callParent(arguments);
	}
});

Ext.define('InitViewer.DetailStore', {
	extend: 'Ext.data.Store',
	fields: ['rownum', 'routeId', 'routeDesc', 'operationId', 'operationDesc', 'eqptId', 'jobStartTime', 'jobEndTime', 'jobUser', 'jobUserId']
});

Ext.define('InitViewer.DetailGrid', {
	extend: 'Ext.grid.Panel',
	columnLines: true,
	initComponent: function () {
		Ext.apply(this, {
			columns: [
				{ text: I18N_SEQ_NO, dataIndex: 'rownum', align: 'center', flex: 1 },
				{ text: i18n_fld_routeID, dataIndex: 'routeId', align: 'center', flex: 2 },
				{ text: i18n_fld_routeDesc, dataIndex: 'routeDesc', align: 'center', flex: 2 },
				{ text: i18n_fld_operationId, dataIndex: 'operationId', align: 'center', flex: 2 },
				{ text: i18n_fld_operationDesc, dataIndex: 'operationDesc', align: 'center', flex: 2 },
				{ text: I18N_EQP_ID, dataIndex: 'eqptId', align: 'center', flex: 2 },
				{ text: I18N_JOB_START_TIME, dataIndex: 'jobStartTime', align: 'center', flex: 2 },
				{ text: I18N_JOB_END_TIME, dataIndex: 'jobEndTime', align: 'center', flex: 2 },
				{ text: I18N_JOB_USER, dataIndex: 'jobUser', align: 'center', flex: 2 },
				{ text: I18N_JOB_USER_ID, dataIndex: 'jobUserId', align: 'center', flex: 2 }
			]
		});
		this.callParent(arguments);
	}
});

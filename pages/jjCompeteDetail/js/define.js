function createQryForm() {
	const qryForm = Ext.create('InitViewer.QryForm', {
		id: 'qryForm',
		title: '机加完工明细',
		region: 'north'
	});
	const form = qryForm.getForm();

	const qryBtn = qryForm.query('[name="qryBtn"]')[0];
	qryBtn.on({
		click: () => {
			const id = form.findField('squareStickId').getValue();
			if (!id) {
				return;
			}
			getJjBasicInfo(id, (data) => {
				const basicForm = Ext.getCmp('basicInfoForm').getForm();
				basicForm.findField('squareStickId').setValue(data.squareStickId);
				basicForm.findField('workorderId').setValue(data.workorderId);
				basicForm.findField('jjTechnologyWorkflowId').setValue(data.jjTechnologyWorkflowId);
				basicForm.findField('technologyWorkflowVersion').setValue(data.technologyWorkflowVersion);
				basicForm.findField('productSpecBook').setValue(data.productSpecBook);
				basicForm.findField('squareStickStatus').setValue(data.squareStickStatus);
				basicForm.findField('hairStickId').setValue(data.hairStickId);
				basicForm.findField('hairStickFurnaceId').setValue(data.hairStickFurnaceId);
				basicForm.findField('furnaceTaskId').setValue(data.furnaceTaskId);
			});
		}
	});
	return qryForm;
}

function createTabPanel() {
	const tabPanel = Ext.create('Ext.tab.Panel', {
		region: 'center',
		activeTab: 0,
		items: [createBsicInfoForm(), createDetailGrid()]
	});
	tabPanel.on({
		tabchange: (panel, newCard, oldCard) => {
			console.log(newCard, oldCard);
			if (newCard.id === 'detailGrid') {
				const id = Ext.getCmp('qryForm').getForm().findField('squareStickId').getValue();
				if (!id) {
					return;
				}
				getJjDetailInfo(id, (data) => {
					console.log(data);
					const detailStore = Ext.data.StoreManager.lookup('detailStore');
					detailStore.loadData(data);
				});
			}
		}
	});
	return tabPanel;
}

function createBsicInfoForm() {
	const basicInfoForm = Ext.create('InitViewer.BasicInfoForm', {
		id: 'basicInfoForm',
		title: '基本信息',
		region: 'center'
	});
	return basicInfoForm;
}

function createPagingTool(store) {
	const detailGrid = Ext.create('mycim.pagingtoolbar', {
		id: 'detailPagingTool',
		store: store,
		dock: 'bottom'
	});
}

function createDetailGrid() {
	const detailStore = createDetailStore();
	const detailGrid = Ext.create('InitViewer.DetailGrid', {
		id: 'detailGrid',
		store: detailStore,
		title: '完工明细',
		region: 'center'
	});
	return detailGrid;
}

function createDetailStore() {
	const detailStore = Ext.create('InitViewer.DetailStore', {
		storeId: 'detailStore'
	});

	return detailStore;
}

function getJjDetailInfo(id, sucCallFn, failCallFn) {
	$.ajax({
		type: 'GET',
		url: '../../data/jjDetials.json',
		success: function (data) {
			sucCallFn(data.data);
		},
		error: function (result) {}
	});
}

function getJjBasicInfo(id, sucCallFn, failCallFn) {
	$.ajax({
		type: 'GET',
		url: '../../data/jjBasicInfo.json',
		success: function (data) {
			sucCallFn(data.data);
		},
		error: function (result) {}
	});
}

const xxxx = 'requireConfig';
function createInitForm() {
	const initForm = Ext.create('InitViewer.InitForm', {
		id: 'initForm',
		title: '毛棒接收管理',
		region: 'center'
	});
	const form = initForm.getForm();
	form.findField('hairStickId').on({
		keyup: (cmp, e) => {
			if (e.getKey() === 13 && cmp.getValue()) {
				getHairStickInfo(
					cmp.getValue(),
					(data) => {
						if (!data) {
							return;
						}
						form.findField('workorderId').setValue(data.workorderId);
						form.findField('furnaceTaskId').setValue(data.furnaceTaskId);
						form.findField('furnaceId').setValue(data.furnaceId);
						form.findField('productSpecBook').setValue(data.productSpecBook);
						form.findField('rczPartNum').setValue(data.rczPartNum);
						form.findField('hairStickLength').setValue(data.hairStickLength);
						form.findField('spec').setValue(data.spec);
					},
					() => {}
				);
			}
		}
	});

	const resetBtn = initForm.query('[name="resetBtn"]')[0];
	resetBtn.on({
		click: () => {
			form.reset();
		}
	});
	return initForm;
}

function getHairStickInfo(id, sucCallFn, failCallFn) {
	$.ajax({
		type: 'GET',
		url: '../../data/stickInfo.json',
		success: function (data) {
			console.log(data.data.furnaceId);
			sucCallFn(data.data);
		},
		error: function (result) {}
	});
}

MyCim.notify = (function () {
	var msgCt;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}

	return {
		msg: function (title, format) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);
			}
			var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
			m.hide();
			m.slideIn('b').ghost('b', { delay: 50000, remove: true });
		},
		showWaiting: function () {
			window.parent.frames.Ext.MessageBox.show({
				msg: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING,
				progressText: i18n.msgs.MSG_PROCESSING_PLEASE_WAITTING,
				width: 300,
				wait: true,
				waitConfig: { interval: 200 },
				icon: 'ext-mb-loading'
			});
		},
		hideWaiting: function () {
			window.parent.frames.Ext.MessageBox.hide();
		},
		alert: function (msg, fn) {
			window.parent.frames.Ext.MessageBox.alert(i18n.labels.LBL_WARNING, msg, fn);
		},
		alertParent: function (msg, fn) {
			MyCim.notify.alert(msg, fn);
		},
		showParentWaiting: function (msg, fn) {
			MyCim.notify.showWaiting();
		},
		hideParentWaiting: function (msg, fn) {
			MyCim.notify.hideWaiting();
		},
		init: function () {}
	};
})();
Ext.mask = (function () {
	return {
		showBodyMask: function () {
			if (Ext.getBody() != null) {
				Ext.getBody().mask();
			}
		},
		hideBodyMask: function () {
			if (Ext.getBody().isMasked()) {
				Ext.getBody().unmask();
			}
		}
	};
})();
Ext.storage = (function () {
	var storage;

	function checkStorage() {
		//check storage
		if (!window.localStorage) {
			//			aler-t('This browser does NOT support localStorage,/n'
			//				+ 'Please update your browser to IE8+ or Chrome.');
			Ext.MessageBox.alert(
				i18n.labels.LBS_PROMPT,
				'This browser does NOT support localStorage,</br>' + 'Please update your browser to IE8+ or Chrome.'
			);
		} else {
			if (!storage) {
				storage = window.localStorage;
			}
		}
		return !!window.localStorage;
	}

	return {
		put: function (key, value) {
			if (checkStorage()) {
				storage.setItem(key, value);
			}
		},
		remove: function (key) {
			if (checkStorage()) {
				storage.removeItem(key);
			}
		},
		get: function (key) {
			if (checkStorage()) {
				return storage.getItem(key);
			}
		},
		getAll: function () {
			if (checkStorage()) {
				var allMsg = '';
				for (var i = 0; i < storage.length; i++) {
					//				   aler-t(storage.key(i)+ " : " + storage.getItem(storage.key(i)));
					allMsg += storage.key(i) + ' : ' + storage.getItem(storage.key(i)) + '</br>';
				}
				Ext.MessageBox.alert(i18n.labels.LBS_CONFIRM, allMsg);
			}
		},
		clear: function () {
			if (checkStorage()) {
				storage.clear();
			}
		}
	};
})();
Ext.BLANK_IMAGE_URL = '/mycim2/vendor/extjs/resources/images/default/tree/s.gif';
Ext.Ajax.timeout = 300000; // 10 minutes
Ext.Ajax.on('beforerequest', function (conn, options, eOpts) {
	MyCim.notify.showParentWaiting();
});
Ext.Ajax.on('requestcomplete', function (conn, resp, options) {
	MyCim.notify.hideParentWaiting();
	var sessionOut = resp.responseText.match('relogin.jsp');
	if (sessionOut != null) {
		window.location.href = '/mycim2/relogin.jsp';
	}
});
Ext.Ajax.on('requestexception', function (conn, resp, options) {
	MyCim.notify.hideParentWaiting();
	MyCim.notify.alert(i18n_msg_ServerExceptionOrTimeoutTryLater);
});

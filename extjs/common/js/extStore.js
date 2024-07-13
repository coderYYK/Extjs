Ext.onReady(function () {
	Ext.getDoc().on('keydown', function (e) {
		if (e.getKey() == 8 && e.getTarget().type == 'text' && !e.getTarget().readOnly) {
		} else if (e.getKey() == 8 && e.getTarget().type == 'textarea' && !e.getTarget().readOnly) {
		} else if (e.getKey() == 8 && e.getTarget().type == 'password' && !e.getTarget().readOnly) {
		} else if (e.getKey() == 8) {
			e.preventDefault();
		}
	});

	// 重构Ext store 排序
	Ext.data.Store.prototype.createComparator = function (sorters) {
		return function (r1, r2) {
			var s = sorters[0],
				f = s.property;
			var v1 = r1.data[f]; //比较的第一个值
			var v2 = r2.data[f]; //比较的第二个值
			var result = 0;
			if (v1 && v1.length > 0) {
				if (!isNaN(v1) || !isNaN(v2)) {
					// v1或v2是一个数字
					try {
						v1 = parseFloat(v1);
					} catch (e) {
						console.log(e);
					}
					try {
						v2 = parseFloat(v2);
					} catch (e) {
						console.log(e);
					}
				}
			}
			if (typeof v1 == 'string') {
				// 第一个值是字符串类型
				if (v2 && v2 != null) {
					// 如果两个相互比较的数据都是有值的，
					// 那么直接比较，倒序则取反
					result = v1.localeCompare(v2);
					if (s.direction == 'DESC') {
						result *= -1;
					}
				} else {
					// 如果第二个值为null，则直接返回 1（把第一个值放在上面）
					// 倒序直接返回 -1（把第一个值放在下面）
					if (s.direction == 'DESC') {
						result = -1;
					} else {
						result = 1;
					}
				}
			} else {
				// js 中，0 等价于false，即v1为0的情况下，if直接进入false逻辑
				if ((v1 && v1 != null) || v1 == 0) {
					if ((v2 && v2 != null) || v2 == 0) {
						if (v1 == v2) {
							result = 0;
						} else if (v1 > v2) {
							result = 1;
						} else {
							result = -1;
						}
						if (s.direction == 'DESC') {
							result *= -1;
						}
					} else {
						if (s.direction == 'DESC') {
							result = -1;
						} else {
							result = 1;
						}
					}
				} else {
					if (s.direction == 'DESC') {
						result = -1;
					} else {
						result = 1;
					}
				}
			}
			return result;
		};
	};
});

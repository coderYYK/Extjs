(typeof jQuery == "undefined") && document.write("<script language=javascript src='" + getRootPath_web() + "/vendor/jquery/jquery-1.8.3.js?version=201906271436'></script>");
//document.write("<script language=javascript src='"+getRootPath_web()+"/app/common/js/jquery.md5.js?version=${version}'></script>")
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */

/*
 * These are the functions you'll usually want to call They take string
 * arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}

function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
}

function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
}

/* Backwards compatibility - same as hex_md5() */
function calcMD5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally to
 * work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words If chrsz is ASCII,
 * characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF)
            + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
            | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
            | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32)
                str += b64pad;
            else
                str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}

function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

/**
 * error alert by Ext
 * [1 arg:msg 内容]
 * [2 arg:回调函数 callBack]
 * [3 arg:width 数值类型，自定义弹出框的宽度]
 */
function showErrorAlertHasScroll(msg, callback, width) {
    showAlertByExt(i18n.labels.LBS_ERROR, msg, 1, window.CN0EN, callback, width);
}

function showWarningAlertHasScroll(msg, callback, width) {
    showAlertByExt(i18n.labels.LBS_ERROR, msg, 2, window.CN0EN, callback, width);
}

function showSuccessAlertHasScroll(msg, callback, width) {
    showAlertByExt(i18n.labels.LBS_ERROR, msg, 3, window.CN0EN, callback, width);
}

function showInfoAlertHasScroll(msg, callback, width) {
    showAlertByExt(i18n.labels.LBS_ERROR, msg, 0, window.CN0EN, callback, width);
}

/**
 * error alert by Ext
 * [1 arg:msg 内容]
 * [2 arg:回调函数 callBack]
 */
function showErrorAlert(msg, callback) {
    showAlertByExt(i18n.labels.LBS_ERROR, msg, 1, window.CN0EN, callback);
}

function showWarningAlert(msg, callback) {
    showAlertByExt(i18n.labels.LBS_WARNING, msg, 2, window.CN0EN, callback);
}

function showSuccessAlert(msg, callback) {
    showAlertByExt(i18n.labels.LBS_PROMPT, msg, 3, window.CN0EN, callback);
}

function showInfoAlert(msg, callback) {
    showAlertByExt(i18n.labels.LBS_PROMPT, msg, 0, window.CN0EN, callback);
}

/**
 * alert by Ext show
 * [1 arg:title 标题]
 * [2 arg:msg 内容]
 * [3 arg:样式序号 0-info, 1-error, 2-warning, 3-success]
 * [4 arg:中英文环境 (1 or 'CN'), (0 or 'EN')]
 * [5 arg:回调函数 callBack]
 * [6 arg:width 自定义弹出框的宽度]
 */
function showAlertByExt(title, msg, iconClsSeq, language, callBack, width) {
    var iconCls = '';
    if (iconClsSeq) {
        if (iconClsSeq === 1) {
            iconCls = Ext.Msg.ERROR;
        } else if (iconClsSeq === 2) {
            iconCls = Ext.Msg.WARNING;
        } else if (iconClsSeq === 3) {
            iconCls = 'x-message-box-success';
        } else {
            iconCls = Ext.Msg.INFO;
        }
    } else {
        iconCls = Ext.Msg.INFO;
    }

    var btnText = 'OK'
    if (language) {
        if (language == 1 || language == 'CN') {
            btnText = '确认';
        }
    }
    var haveApply = $("#haveApply");
    if (haveApply != null) {
        var height = $(document.body).height();
        $(haveApply).append('<iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:' + height + 'px;z-index:1; filter:alpha(opacity=0);"></iframe>');
    }
    var fianlCallBack;
    if (callBack != undefined) {
        fianlCallBack = function () {
            $("#haveApply").find("#iframe1").eq(0).remove();
            callBack();
        }
    } else {
        fianlCallBack = function () {
            $("#haveApply").find("#iframe1").eq(0).remove();
        }
    }

    // 防止弹框信息被EXT自动换行导致信息最后一行显示不完全
    Ext.select('.alert-window-line-height').removeCls('alert-window-line-height');
    if (width && width > 0) {
        Ext.Msg.setOverflowXY('', 'scroll').show({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OK,
            buttonText: {ok: btnText},
            width: width,
            icon: iconCls,
            fn: fianlCallBack
        });
    } else {
        Ext.Msg.show({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OK,
            buttonText: {ok: btnText},
            icon: iconCls,
            fn: fianlCallBack
        });
    }
    Ext.select('.x-form-display-field').addCls('alert-window-line-height');
}

/**
 * Ext样式的确认弹框
 * @param callFn  点击按钮后执行的回调
 * @param language  语言环境：匹配按钮中英文显示，默认英语，(1 or CN)-中文
 * @param confirmMsg  弹框内容，默认 Are you sure?
 * @param confirmTitle  弹框标题，默认confirm
 */
function showConfirmByExt(callFn, language, confirmMsg, confirmTitle, width) {
    var title = i18n.labels.LBS_CONFIRM, okBtnText = 'Confirm', cancleBtnText = 'Cancel',
        msg = 'Are you sure?';

    if (confirmTitle) {
        title = confirmTitle;
    }

    if (language) {
        if (language == 'CN' || language == 1) {
            okBtnText = '确认';
            cancleBtnText = '取消';
            msg = '确定执行此操作?';
        }
    }

    if (confirmMsg && confirmMsg != '' && confirmMsg != ' ') {
        msg = confirmMsg;
    }

    // 防止弹框信息被EXT自动换行导致信息最后一行显示不完全
    Ext.select('.alert-window-line-height').removeCls('alert-window-line-height');
    if (width && width > 0) {
        Ext.Msg.setOverflowXY('', 'scroll').confirm({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OKCANCEL,
            width: width,
            buttonText: {ok: okBtnText, cancel: cancleBtnText},
            icon: Ext.Msg.QUESTION,
            fn: function (result) {
                if (result === 'ok') {
                    callFn();
                }
            }
        });
    } else {
        Ext.Msg.confirm({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OKCANCEL,
            buttonText: {ok: okBtnText, cancel: cancleBtnText},
            icon: Ext.Msg.QUESTION,
            fn: function (result) {
                if (result === 'ok') {
                    callFn();
                }
            }
        });
    }
    Ext.select('.x-form-display-field').addCls('alert-window-line-height');
}

/**
 * Ext样式的确认弹框
 * @param callFn  点击按钮后执行的回调
 * @param language  语言环境：匹配按钮中英文显示，默认英语，(1 or CN)-中文
 * @param confirmMsg  弹框内容，默认 Are you sure?
 * @param confirmTitle  弹框标题，默认confirm
 */
function showConfirmByExtWithCancel(callFn, cancelFn, language, confirmMsg, confirmTitle, width) {
    var title = i18n.labels.LBS_CONFIRM, okBtnText = 'Confirm', cancleBtnText = 'Cancel',
        msg = 'Are you sure?';

    if (confirmTitle) {
        title = confirmTitle;
    }

    if (language) {
        if (language == 'CN' || language == 1) {
            okBtnText = '确认';
            cancleBtnText = '取消';
            msg = '确定执行此操作?';
        }
    }

    if (confirmMsg && confirmMsg != '' && confirmMsg != ' ') {
        msg = confirmMsg;
    }

    // 防止弹框信息被EXT自动换行导致信息最后一行显示不完全
    Ext.select('.alert-window-line-height').removeCls('alert-window-line-height');
    if (width && width > 0) {
        Ext.Msg.setOverflowXY('', 'scroll').confirm({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OKCANCEL,
            width: width,
            buttonText: {ok: okBtnText, cancel: cancleBtnText},
            icon: Ext.Msg.QUESTION,
            fn: function (result) {
                if (result === 'ok') {
                    callFn();
                } else {
                    cancelFn();
                }

            }
        });
    } else {
        Ext.Msg.confirm({
            title: title,
            msg: msg + '</br>',
            buttons: Ext.Msg.OKCANCEL,
            buttonText: {ok: okBtnText, cancel: cancleBtnText},
            icon: Ext.Msg.QUESTION,
            fn: function (result) {
                if (result === 'ok') {
                    callFn();
                } else {
                    cancelFn();
                }
            }
        });
    }
    Ext.select('.x-form-display-field').addCls('alert-window-line-height');
}

var win;

function showPasswordWin(successCallbackFn, callbackFnParam) {
    win = new Ext.Window({
        title: i18n.labels.LBS_CONFIRM,
        modal: true,
        width: 350,
        height: 160,
        //constrain: true,  //限制窗口拖动范围
        anchor: '85%',
        collapsible: false,
        resizable: false,
        defaultFocus: 'alertPassword',
        //    closeAction:'hide',
        items: [showPasswordWinformPanel(successCallbackFn, callbackFnParam)],

        listeners: {
            'beforeshow': function () {
                var haveApply = $("#haveApply");
                if (haveApply != null) {
                    var height = $(document.body).height();
                    $(haveApply).append('<iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:' + height + 'px;z-index:1; filter:alpha(opacity=0);"></iframe>');
                }
            },
            'beforeclose': function () {
                $("#haveApply").find("#iframe1").eq(0).remove();
            }
        }
    });

    win.show();
}

function showPasswordWinformPanel(successCallbackFn, callbackFnParam) {
    return new Ext.form.FormPanel({
        autoWidth: true,
        layout: "form",
        frame: true,
        labelWidth: 50,
        labelAlign: "right",
        items: [{
            xtype: "label",
            margin: '5',
            height: 60,
            text: i18n.labels.LBL_SURE_PASSWORD
        }, {
            xtype: "textfield",
            readOnly: true,
            margin: '5',
            name: 'userId',
            value: window.USER,
            fieldLabel: i18n.labels.LBL_USER_ID,
            columnWidth: 0.8,
            height: 25
        }, {
            xtype: "textfield",
            inputType: 'password',
            id: 'alertPassword',
            fieldLabel: i18n.labels.LBL_PASSWORD,
            name: 'password',
            columnWidth: 0.8,
            height: 25,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (field, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        checkPwd(successCallbackFn, callbackFnParam);
                    }
                }
            }
        }],
        buttons: [{
            text: i18n.labels.LBS_OK,
            handler: function () {
                checkPwd(successCallbackFn, callbackFnParam);
            }
        }, {
            text: i18n.labels.LBL_CANCEL,
            handler: function () {
                win.close();
            }
        }]
    });
}

function checkPwd(successCallbackFn, callbackFnParam) {
    var txt = win.down('form').getValues().password;
    $.ajax({
        url: '/mycim2/login.do',
        requestMethod: 'checkPwd',
        successMsg: false,
        data: hex_md5(txt),
        success: function (response, opts) {
            //check password success callback
            if (callbackFnParam) {
                successCallbackFn(callbackFnParam);
            } else {
                successCallbackFn();
            }
            win.close();
        }
    });
}

/**
 * 获取界面滚动条属性
 * @returns  返回包含left/top/width/height四个属性的对象
 */
function getScollPostion() {
    var t, l, w, h;
    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    return {
        top: t,
        left: l,
        width: w,
        height: h
    };
}

/**
 * 加载流程树窗口
 * @param type        typedefinitions.jsp中的type
 * @param targetIds   获取grid中的某几列数据以及回传显示的元素id
 * @param paramStr    参数字符串，'&'符号开头，例如：'&param1=1&param2=2'
 * @param width       窗口宽度
 * @param height      窗口高度
 * @param qryActiveOrFrozenVersionFlag      获取哪个状态下的流程最新版本，Y 表示非unfrozen的最新版本，N 表示active的最新版本
 * @param noEditFlag      是否允许编辑标识，Y 表示允许，N或空 表示不允许
 */
function searchWfl(type, targetIds, paramStr, width, height, qryActiveOrFrozenVersionFlag, noEditFlag) {
    var url = '/mycim2/wflInfoGrid.do?qryActiveOrFrozenVersionFlag=' + qryActiveOrFrozenVersionFlag + '&reqCode=initWflInfoGrid&noEditFlag=' + noEditFlag + '&type='
        + type + '&targetIds=' + targetIds + paramStr;
    window.open(url, 'WflInfo_Window',
        'toolbars=0, scrollbars=0, location=no, statusbars=0, menubars=0, resizable=1, width=' + width
        + ', height=' + height + '');
}

/**
 * Main Function List:
 *
 * Cstr(string)      :change the string into int;return string;
 * Rep1(string)      :change the string 's "'",""" into "`" and change "<>" into "()" ;return string;
 * Trim(string)      :Trim the string's " " before and after the string;return string;
 *
 * @format
 */

//*************************************** string function *************************
var APP_NAME = "mycim2"

function proPath() {
  var pathName = window.document.location.pathname
  return pathName.substring(0, pathName.substr(1).indexOf("/") + 1) + "/"
}

function buildUrl(actionPath) {
  return proPath() + actionPath
}

//Avoid error when no validate function found.
function validate(form) {
  return true
}

function Cstr(inp) {
  return "" + inp + ""
}

function cstr(inp) {
  return "" + inp + ""
}

function Trim(inString) {
  var l, i, g, t, r
  inString = Cstr(inString)
  l = inString.length
  t = inString
  for (i = 0; i < l; i++) {
    g = inString.substring(i, i + 1)
    if (g == " ") {
      t = inString.substring(i + 1, l)
    } else {
      break
    }
  }
  r = t
  l = t.length
  //Delete the spaces back
  for (i = l; i > 0; i--) {
    g = t.substring(i, i - 1)
    if (g == " ") {
      r = t.substring(i - 1, 0)
    } else {
      break
    }
  }
  return r
}

function trim(inString) {
  var l, i, g, t, r
  inString = Cstr(inString)
  l = inString.length
  t = inString
  for (i = 0; i < l; i++) {
    g = inString.substring(i, i + 1)
    if (g == " ") {
      t = inString.substring(i + 1, l)
    } else {
      break
    }
  }
  r = t
  l = t.length
  //Delete the spaces back
  for (i = l; i > 0; i--) {
    g = t.substring(i, i - 1)
    if (g == " ") {
      r = t.substring(i - 1, 0)
    } else {
      break
    }
  }
  return r
}

//to solve the hyper link that does not inherit form bean
// todo dosubmit update delete 整合
function doSubmit(action, overlay) {
  if (!overlay) {
    origAction = document.forms[0].action
    if (null != action) {
      destAction = origAction + "?" + action
    } else {
      destAction = origAction
    }
  } else {
    destAction = action
  }
  document.forms[0].action = destAction
  document.forms[0].submit()
  MyCim.notify.showWaiting()
}

function doDelete(action, overlay) {
  if (!validateDelete()) return

  if (overlay == null) {
    origAction = document.forms[0].action
    if (null != action) {
      destAction = origAction + "?" + action
    } else {
      destAction = origAction
    }
  } else {
    destAction = action
  }
  document.forms[0].action = destAction
  document.forms[0].submit()
}

function doupdate(action, overlay) {
  if (!validateDelete()) return

  if (overlay == null) {
    origAction = document.forms[0].action
    if (null != action) {
      destAction = origAction + "?" + action
    } else {
      destAction = origAction
    }
  } else {
    destAction = action
  }
  document.forms[0].action = destAction
  document.forms[0].submit()
}

function doSearch(id, type, value, path) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 700
  var op_heigh = 680
  //find the relative dir
  var dest = path + "/search?id=" + id + "&type=" + encodeURI(type)
  //alert(dest);
  //alert(trim(replace(value,"|","",false,false)));
  if (value != null && value != "" && trim(replace(value, "|", "", false, false)) != "") {
    dest = dest + "&value=" + value
  } else {
    dest = dest + "&page=1"
  }
  //alert(dest);
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",top=0,left=0"
  window.open(dest, "what_I_want", option)
}
function doUpde(action, overlay) {
  if (overlay == null) {
    origAction = document.forms[0].action
    if (null != action) {
      destAction = origAction + "?" + action
    } else {
      destAction = origAction
    }
  } else {
    destAction = action
  }
  document.forms[0].action = destAction
  document.forms[0].submit()
}

function doCheckTask(otherTaskorderId, workorderType) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 1200
  var op_heigh = 500
  var dest =
    getContextPath() +
    "/wip/implsheet/checkTask/productUpgradeVersionInfo.jsp?otherTaskorderId=" +
    otherTaskorderId +
    "&workorderType=" +
    workorderType
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  window.open(dest, "what_I_want", option)
}

function doSearchWithExt(id, type, value, path, callback) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 800
  var op_heigh = 500

  if (value == undefined || value == null) {
    value = ""
  }

  //find the relative dir
  var dest = path + "/searchAction.do?reqCode=init"
  if (callback == undefined || callback == null || callback == "") {
    dest += "&targetIds=" + id + "&type=" + UrlEncode(type) + "&keyValue=" + value
  } else {
    dest += "&targetIds=" + id + "&type=" + UrlEncode(type) + "&keyValue=" + value + "&callbackFunc=" + callback
  }
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)

  var new_win = window.open(dest, "what_I_want", option)
  new_win.focus()
}

function doSearchWithExtNew(id, type, value, path, callback) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 1200
  var op_heigh = 500

  if (value == undefined || value == null) {
    value = ""
  }

  //find the relative dir
  var dest = path + "/searchAction.do?reqCode=init"
  if (callback == undefined || callback == null || callback == "") {
    dest += "&targetIds=" + UrlEncode(id) + "&type=" + UrlEncode(type) + "&keyValue=" + value
  } else {
    dest += "&targetIds=" + UrlEncode(id) + "&type=" + UrlEncode(type) + "&keyValue=" + value + "&callbackFunc=" + callback
  }
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)

  var new_win = window.open(dest, "what_I_want", option)
  new_win.focus()
}

function doSearchWithExt2(id, type, value, path, callback) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 1000
  var op_heigh = 500

  if (value == undefined || value == null) {
    value = ""
  }

  //find the relative dir
  var dest = path + "/searchAction2.do?reqCode=init"
  if (callback === undefined || callback == null || callback == "") {
    dest += "&targetIds=" + id + "&type=" + UrlEncode(type) + "&keyValue=" + value
  } else {
    dest += "&targetIds=" + id + "&type=" + UrlEncode(type) + "&keyValue=" + value + "&callbackFunc=" + callback
  }
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)

  var new_win = window.open(dest, "what_I_want", option)
  new_win.focus()
}

//for calendar control
function openCal(id, path, date) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 0
  var op_resize = 1
  var op_wid = 300
  var op_heigh = 220

  //find the relative dir
  if (path) {
    dest = path + "/calendar?config=" + id
  } else {
    dest = proPath() + "calendar?config=" + id
  }
  if (date) {
    dest += "&date=" + date
  }
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  window.open(dest, "calendar", option)
}

/* 打开选择日期的日历窗口 */
function openNewCal(id) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 0
  var op_resize = 1
  var op_wid = 300
  var op_heigh = 220

  var dest = proPath() + "/calendar?config=" + id

  var option = ""
  option += "toolbar=" + op_tool
  option += ",location=" + op_loc_box
  option += ",directories=" + op_dir
  option += ",status=" + op_stat
  option += ",menubar=" + op_menu
  option += ",scrollbars=" + op_scroll
  option += ",resizable=" + op_resize
  option += ",width=" + op_wid
  option += ",height=" + op_heigh
  option += ",left=" + (window.screen.availWidth / 2 - op_wid / 2)
  option += ",top=" + (window.screen.availHeight / 2 - op_heigh / 2)

  window.open(dest, "calendar", option)
}

function doChangeId() {
  with (document.forms[0]) {
    //rrn=fldRrn.value;
    //id=fldId.value;
    //objecttype="FIELD";
    //window.open("changeid.jsp?rrn="+rrn+"&&id="+id+"&objecttype="+objecttype);
  }
}

function doCopy(type) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 1200
  var op_heigh = 500
  var dest = getContextPath() + "/copyfunction.jsp?type=" + type
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  window.open(dest, "what_I_want", option)
}

function doOpenObjAttrs(url, name) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 850
  var op_heigh = 380
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  handle = window.open(dest, name, option)
  handle.focus()
}
function doOpenMax(url) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    window.screen.availWidth +
    ",height=" +
    window.screen.availHeight
  handle = window.open(dest, "spec", option)
  handle.focus()
}
function doOpenFl(url) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 500
  var op_heigh = 650
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    "TOP = 100 , LEFT = 0"
  window.open(dest, "doOpen", option)
}

function doOpenFree(url, name) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 0
  var op_wid = 850
  var op_heigh = 500
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  handle = window.open(dest, name, option)
  handle.focus()
}

function doOpenFree2(url, name) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 0
  var op_wid = 1000
  var op_heigh = 700
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  handle = window.open(dest, name, option)
  handle.focus()
}

function doOpen(url, name) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 0
  var op_wid = 600
  var op_heigh = 400
  var dest = !!url.match("^" + proPath()) ? url : proPath() + url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  handle = window.open(dest, name, option)
  handle.focus()
}

function doOpenWaferList25(url, name) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 0
  var op_wid = 600
  var op_heigh = 825
  var dest = !!url.match("^" + proPath()) ? url : proPath() + url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    ",left=" +
    (window.screen.availWidth / 2 - op_wid / 2) +
    ",top=" +
    (window.screen.availHeight / 2 - op_heigh / 2)
  handle = window.open(dest, name, option)
  handle.focus()
}

// check whether id is proper
function isProper(string) {
  if (!string) return false

  var iChars = "*|!,\":<>[]{}`';()@&$#%"

  for (var i = 0; i < string.length; i++) {
    if (iChars.indexOf(string.charAt(i)) != -1) return false
  }
  return true
}

//-------------------------------------------------------------   check numeric
//this function is used to tell whether str is numeric.
function IsNumeric(str) {
  if (str == "") {
    return true
  }
  if (str.search(/^[+|-]?[0-9]+[.]?[0-9]*$/) != -1) return true
  else return false
}

//
function IsFloat(str) {
  var loctionpoint = Trim(str).lastIndexOf(".")
  if (loctionpoint != -1) {
    if (IsNumeric(str)) {
      return true
    }
  } else return false
}

function IsInt(str) {
  //is integer and natural number
  var bflag = true
  var nLen = str.length
  for (i = 0; i < nLen; i++) {
    if (str.charAt(i) < "0" || str.charAt(i) > "9") bflag = false
  }
  return bflag
}

//-------------------------------------------------------------   check length
//to get the string(unicode including GBK)'s real length,
//a chinese char means a three chars length
function getLength(str) {
  var _str_code = ""
  var i = 0
  var j = 0
  //avoid the null pointer exception;
  if (str == null) return

  str = Trim(str)

  while (true) {
    _str_code = str.charCodeAt(i)
    i++
    if (_str_code >= 0 && _str_code <= 255) {
      j++
    } else if (_str_code > 255) {
      j = j + 3
    } else {
      break
    }
  }
  return j
}

//-------------------------------------------------------------   check date format

function IsDate(str) {
  bValid = true
  //DD/MM/YYYY
  dateRegexp = new RegExp("^(\\d{4})[/-](\\d{2})[/-](\\d{2})$")

  var matched = dateRegexp.exec(str)

  if (matched != null) {
    if (!isValidDate(matched[1], matched[2], matched[3])) {
      bValid = false
    }
  } else {
    bValid = false
  }
  return bValid
}

function IsDate(str, format) {
  bValid = true

  //default date format is "DD/MM/YYYY"
  exp = "^(\\d{4})[/-](\\d{2})[/-](\\d{2})$"

  if (format == "DD/MM/YYYY" || format == "DD-MM-YYYY") {
    exp = "^(\\d{2})[/-](\\d{2})[/-](\\d{4})$"
  } else if (format == "DD/MM/YY" || format == "DD-MM-YY") {
    exp = "^(\\d{2})[/-](\\d{2})[/-](\\d{2})$"
  } else if (format == "MM/DD/YYYY" || format == "MM-DD-YYYY") {
    exp = "^(\\d{2})[/-](\\d{2})[/-](\\d{4})$"
  } else if (format == "YYYY/MM/DD" || format == "YYYY-MM-DD") {
    exp = "^(\\d{4})[/-](\\d{2})[/-](\\d{2})$"
  }
  //DD/MM/YYYY
  dateRegexp = new RegExp(exp)

  var matched = dateRegexp.exec(str)

  if (matched != null) {
    year = matched[1]
    month = matched[2]
    day = matched[3]

    if (format == "DD/MM/YYYY" || format == "DD-MM-YYYY" || format == "DD/MM/YY" || format == "DD-MM-YY") {
      day = matched[1]
      month = matched[2]
      year = matched[3]
    } else if (format == "MM/DD/YYYY" || format == "MM-DD-YYYY") {
      day = matched[2]
      month = matched[1]
      year = matched[3]
    } else if (format == "YYYY/MM/DD" || format == "YYYY-MM-DD") {
      day = matched[3]
      month = matched[2]
      year = matched[1]
    }
    if (!isValidDate(day, month, year)) {
      bValid = false
    }
  } else {
    bValid = false
  }
  return bValid
}

function isValidDate(day, month, year) {
  if (month < 1 || month > 12) return false

  if (day < 1 || day > 31) return false

  if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) return false

  if (month == 2) {
    var leap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
    if (day > 29 || (day == 29 && !leap)) return false
  }

  return true
}

//-------------------------------------------------------------   check time
function IsTime(str) {
  if (str.search(/^[0-9]?[0-9]:[0-5][0-9]:[0-5][0-9]$/) != -1) {
    return validtime(str)
  } else {
    return false
  }
}

function IsTimeFormat(str) {
  var checkValue = new RegExp("^[0-2]{1}[0-6]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}")
  if (checkValue.test(str)) {
    return true
  } else {
    return false
  }
}

/* Hours must be between 0 and 24, since minutes and seconds have been filtered by regular expression. */
function validtime(obj) {
  retval = false

  i = obj.indexOf(":")

  hours = obj.substring(0, i)

  if (parseInt(hours) >= 0 && parseInt(hours) < 24) retval = true

  return retval
}

//-------------------------------------------------------------   check email
function IsEmail(str) {
  if (str.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) return true
  else return false
}

function goToURL() {
  var i,
    args = goToURL.arguments
  document.returnValue = false
  for (i = 0; i < args.length - 1; i += 2) eval(args[i] + ".location='" + args[i + 1] + "'")
}

//---------------------------------------------------------------  replace for validate_adhoc
function replace(target, oldTerm, newTerm, caseSens, wordOnly) {
  var wk
  var ind = 0
  var next = 0
  wk = Cstr(target)
  if (!caseSens) {
    oldTerm = oldTerm.toLowerCase()
    wk = target.toLowerCase()
  }
  while ((ind = wk.indexOf(oldTerm, next)) >= 0) {
    if (wordOnly) {
      var before = ind - 1
      var after = ind + oldTerm.length
      if (!(space(wk.charAt(before)) && space(wk.charAt(after)))) {
        next = ind + oldTerm.length
        continue
      }
    }
    target = target.substring(0, ind) + newTerm + target.substring(ind + oldTerm.length, target.length)
    wk = wk.substring(0, ind) + newTerm + wk.substring(ind + oldTerm.length, wk.length)
    next = ind + newTerm.length
    if (next >= wk.length) {
      break
    }
  }
  return target
}

/**
 * 禁用页面按钮、a标签、img标签
 * @param noWaitFlag 大于0，不将鼠标设置成wait状态；不输入或小于0，则将鼠标设置成wait状态
 */
function disabledBtn(noWaitFlag) {
  var aList = document.getElementsByTagName("a")
  for (i = 0; i < aList.length; i++) {
    aList[i].disabled = true
  }
  var imgList = document.getElementsByTagName("img")
  for (i = 0; i < imgList.length; i++) {
    imgList[i].disabled = true
  }
  for (i = 0; i < document.forms[0].elements.length; i++) {
    if (
      document.forms[0].elements[i].type == "button" ||
      document.forms[0].elements[i].type == "submit" ||
      document.forms[0].elements[i].type == "reset"
    ) {
      document.forms[0].elements[i].disabled = true
    }
  }
  if (noWaitFlag && noWaitFlag > 0) {
  } else {
    document.body.style.cursor = "wait"
  }
}

/**
 * 启用页面按钮、a标签、img标签
 */
function resurgenceBtn() {
  var aList = document.getElementsByTagName("a")
  for (i = 0; i < aList.length; i++) {
    aList[i].disabled = false
  }
  var imgList = document.getElementsByTagName("img")
  for (i = 0; i < imgList.length; i++) {
    imgList[i].disabled = false
  }
  for (i = 0; i < document.forms[0].elements.length; i++) {
    if (
      document.forms[0].elements[i].type == "button" ||
      document.forms[0].elements[i].type == "submit" ||
      document.forms[0].elements[i].type == "reset"
    ) {
      document.forms[0].elements[i].disabled = false
    }
  }
  document.body.style.cursor = ""
}

function disabledBtnAtSubmitNoValidate(obj) {
  disabledBtn()
  if (document.forms[0].action.indexOf("?") > 0) {
    document.forms[0].action = document.forms[0].action + "&" + obj.name + "=1"
  } else {
    document.forms[0].action = document.forms[0].action + "?" + obj.name + "=1"
  }
  document.forms[0].submit()
  obj.disabled = true
}

//avoid double post transaction
function transaction(obj, validated, updateAction) {
  if (!validated) {
    sType = "validate"
  } else {
    sType = "novalidate"
  }

  if (!updateAction) {
    updateAction = true
  } else {
    updateAction = false
  }

  //validate method bug, it should return true instead of undefined
  //so use validate(document.forms[0])!=false instead of  validate(document.forms[0])
  if (sType == "novalidate" || (sType == "validate" && validate(document.forms[0]) != false)) {
    for (i = 0; i < document.forms[0].elements.length; i++) {
      if (
        document.forms[0].elements[i].type == "button" ||
        document.forms[0].elements[i].type == "submit" ||
        document.forms[0].elements[i].type == "reset"
      ) {
        document.forms[0].elements[i].disabled = true
      }
    }
    if (updateAction) {
      if (document.forms[0].action.indexOf("?") > 0) {
        document.forms[0].action = document.forms[0].action + "&action=" + obj.name
      } else {
        document.forms[0].action = document.forms[0].action + "?action=" + obj.name
      }
    }
    document.body.style.cursor = "wait"
    document.forms[0].submit()
    obj.disabled = true
  }
}

function transactionWithMask(obj, validated) {
  transaction(obj, validated)
  if (window.parent.frames.showLoadMask) {
    window.parent.frames.showLoadMask()
  }
}

function UrlEncode(str) {
  var i,
    c,
    ret = "",
    strSpecial = "!\"#$%&'()*+,/:;<=>?@[]^`{|}~%"
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 0x4e00) {
      return str
    } else {
      c = str.charAt(i)
      if (c == " ") ret += "+"
      else if (strSpecial.indexOf(c) != -1) ret += "%" + str.charCodeAt(i).toString(16)
      else ret += c
    }
  }
  return ret
}

function ResponseEnter() {
  if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
    for (i = 0; i < document.forms[0].elements.length; i++) {
      if (document.forms[0].elements[i].type == "submit") {
        document.forms[0].action = document.forms[0].action + "?" + document.forms[0].elements[i].name
        document.forms[0].submit()
        break
      }
    }
  }
}

//add by mark
function closeDetailPanel() {
  if (window.parent.frames.handleTabAction) {
    window.parent.frames.handleTabAction()
  }
}

/*
 * 根据元素clsssName得到元素集合
 * @param fatherId 父元素的ID，默认为document
 * @tagName 子元素的标签名
 * @className 用空格分开的className字符串
 */
function getElementsByClassName(fatherId, tagName, className) {
  node = (fatherId && document.getElementById(fatherId)) || document
  tagName = tagName || "*"
  className = className.split(" ")
  var classNameLength = className.length
  for (var i = 0, j = classNameLength; i < j; i++) {
    //创建匹配类名的正则
    className[i] = new RegExp("(^|\\s)" + className[i].replace(/\-/g, "\\-") + "(\\s|$)")
  }
  var elements = node.getElementsByTagName(tagName)
  var result = []
  for (var i = 0, j = elements.length, k = 0; i < j; i++) {
    //缓存length属性
    var element = elements[i]
    while (className[k++].test(element.className)) {
      //优化循环
      if (k === classNameLength) {
        result[result.length] = element
        break
      }
    }
    k = 0
  }
  return result
}

//copy from xitech

//Add by Andy Gao 2009-07-15
var maskName = "mask"
var divName = "loading"

var docEle = function () {
  return document.getElementById(arguments[0]) || false
}

function OpenMaskDiv() {
  CloseMaskDiv()

  var _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)
  var _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)

  var newMask = document.createElement("div")

  newMask.id = maskName
  newMask.style.position = "absolute"
  newMask.style.zIndex = "0"
  newMask.style.width = _scrollWidth + "px"
  newMask.style.height = _scrollHeight + "px"
  newMask.style.top = "0px"
  newMask.style.left = "0px"
  newMask.style.background = "#33393C"
  newMask.style.filter = "alpha(opacity=20)"
  newMask.style.opacity = "0.40"

  document.body.appendChild(newMask)
}

function CloseMaskDiv() {
  if (docEle(maskName)) document.body.removeChild(docEle(maskName))
}

var newDivFont = "Processing, please wait..."

function OpenNewDiv() {
  CloseNewDiv()

  var newDivWidth = 400
  var newDivHeight = 50

  var newDiv = document.createElement("div")

  newDiv.id = divName
  newDiv.style.position = "absolute"
  newDiv.style.zIndex = "0"
  newDiv.style.width = newDivWidth + "px"
  newDiv.style.height = newDivHeight + "px"
  newDiv.style.top = document.body.scrollTop + document.body.clientHeight / 2 - newDivHeight / 2 + "px"
  newDiv.style.left = document.body.scrollLeft + document.body.clientWidth / 2 - newDivWidth / 2 + "px"
  newDiv.style.background = "#e9e9e9"
  newDiv.style.border = "1px solid #696969"
  newDiv.style.padding = "5px"
  newDiv.style.filter = "alpha(opacity=100)"
  newDiv.innerHTML =
    '<table width="100%" height="100%"><tr><td valign="middle" align="center"><font style="font-family:Arial; font-size:12px;"><strong>' +
    newDivFont +
    '</strong></font><br /><img src="/mycim2/img/loading.gif" width="220" height="19" /></td></tr></table>'

  document.body.appendChild(newDiv)

  function newDivCenter() {
    newDiv.style.top = document.body.scrollTop + document.body.clientHeight / 2 - newDivHeight / 2 + "px"
    newDiv.style.left = document.body.scrollLeft + document.body.clientWidth / 2 - newDivWidth / 2 + "px"
  }

  if (document.all) {
    window.attachEvent("onscroll", newDivCenter)
  } else {
    window.addEventListener("scroll", newDivCenter, false)
  }
}

function CloseNewDiv() {
  if (docEle(divName)) document.body.removeChild(docEle(divName))
}

function OpenLoadingDiv() {
  OpenMaskDiv()
  OpenNewDiv()
  OpenOtherFrameMaskDiv()
}

function CloseLoadingDiv() {
  CloseOtherFrameMaskDiv()
  CloseNewDiv()
  CloseMaskDiv()
}

function OpenOtherFrameMaskDiv() {
  if (window.parent != null && window.parent.frames["mycim2_navi"] != null && window.parent.frames["mycim2_navi"].document.readyState == "complete") {
    window.parent.frames["mycim2_navi"].window.OpenMaskDiv()
  }

  if (window.parent != null && window.parent.frames["mycim2_menu"] != null && window.parent.frames["mycim2_menu"].document.readyState == "complete") {
    window.parent.frames["mycim2_menu"].window.OpenMaskDiv()
  }
}

function CloseOtherFrameMaskDiv() {
  if (window.parent != null && window.parent.frames["mycim2_navi"] != null && window.parent.frames["mycim2_navi"].document.readyState == "complete") {
    window.parent.frames["mycim2_navi"].window.CloseMaskDiv()
  }

  if (window.parent != null && window.parent.frames["mycim2_menu"] != null && window.parent.frames["mycim2_menu"].document.readyState == "complete") {
    window.parent.frames["mycim2_menu"].window.CloseMaskDiv()
  }
}

function checkSpecialChar(name) {
  var str = document.getElementsByName(name)[0].value
  var iChars = "&"
  for (var i = 0; i < str.length; i++) {
    if (iChars.indexOf(str.charAt(i)) != -1) {
      showAlertByExt(i18n.labels.LBS_WARNING, "Cannot contain half-width character &", 2)
      document.forms[0].elements[name].focus()
      document.getElementsByName(name)[0].value = ""
    }
  }
}

function minsToTime(min) {
  var time = ""
  if (min < 60) {
    if (min < 10) {
      time = "00:0" + min + ":00"
    } else {
      time = "00:" + min + ":00"
    }
  } else {
    var hh = parseInt(min / 60)
    var mm = min % 60
    if (hh < 10) {
      hh = "0" + hh
    }
    if (mm < 10) {
      mm = "0" + mm
    }
    time = hh + ":" + mm + ":00"
  }
  return time
}

function cascadeSelect(source, target, options, callback) {
  if (source == null || target == null || options == null) {
    return
  }
  if (target.is("select")) {
    target.empty()
    target.append($("<option></option>").val("").html(""))
  }
  var url = options.url
  if (url == null) {
    url = "/" + APP_NAME + "/ajaxflush.do"
  }
  if (options != null) {
    options.timstamp = new Date().getTime()
  }

  $.getJSON(url, options, function (data) {
    $.each(data, function (val, text) {
      if (target.is("select")) {
        target.append($("<option></option>").val(val).html(text))
      } else {
        target.val(text)
      }
    })
    if (callback) {
      callback(data)
    }
  })
}

function showRecipeDocument(documentFile) {
  var pos = documentFile.lastIndexOf(".")
  var fileSuffix = documentFile.substring(pos, documentFile.length)
  if (fileSuffix.toLowerCase() == ".pdf") {
    window.open(documentFile)
    return
  }
  var openDocObj = null
  if (openDocObj == null) {
    openDocObj = new ActiveXObject("SharePoint.OpenDocuments.3")
  }
  if (openDocObj == null) {
    openDocObj = new ActiveXObject("SharePoint.OpenDocuments.2")
  }
  if (openDocObj == null) {
    openDocObj = new ActiveXObject("SharePoint.OpenDocuments.1")
  }
  if (openDocObj == null) {
    showAlertByExt(i18n.labels.LBS_WARNING, "Please install it office", 2)
    return
  }
  var falg = openDocObj.ViewDocument(documentFile)
  if (!falg) {
    showAlertByExt(i18n.labels.LBS_WARNING, "Unable to open the document.", 2)
  }
}

//解析当前url地址
function getContextPath() {
  var localObj = window.location
  var contextPath = localObj.pathname.split("/")[1]
  var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath
  return basePath
}

//转换小数并补0
function changeNumberDecimal(num, digit) {
  var d = Math.pow(10, digit)
  var f_x = Math.round(num * d) / d
  var s_x = f_x.toString()
  var pos_decimal = s_x.indexOf(".")
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += "."
  }
  while (s_x.length <= pos_decimal + digit) {
    s_x += "0"
  }
  return s_x
}

function stopDefault(e) {
  // 如果提供了事件对象，则这是一个非IE浏览器
  if (e && e.preventDefault) {
    // 阻止默认浏览器动作(W3C)
    e.preventDefault()
  } else {
    // IE中阻止函数器默认动作的方式
    window.event.returnValue = false
  }
  return false
}

function enterSubmitInit() {
  var name = arguments[0]
  var url = arguments[1] != void 0 ? arguments[1] : doSearchUrl
  var validate = arguments[2] != void 0 ? arguments[2] : true
  var alias = arguments[3]
  if (typeof validate != "function" && validate != true && validate != false) {
    alias = validate
    validate = true
  }
  $('input[name="' + name + '"]').keydown(function (e) {
    if (e.keyCode == 13) {
      stopDefault(e)
      console.log("validate value ---> " + validate)
      searchFormSubmit(url, validate, name, alias)
    }
  })

  $('input[name="' + name + '"]').blur(function () {
    var _name = $.trim($('input[name="' + name + '"]').val())
    if (_name != undefined && _name.length > 0) {
      searchFormSubmit(url, validate, name, alias)
    }
  })
}

function searchFormSubmit(url, validate, name, alias) {
  var $theform = $(document.forms[0])
  if (typeof validate == "function" ? validate.call() : validate) {
    if (name != void 0 && alias != void 0) {
      changeName(name, alias)
    }
    $theform.attr("action", url)
    $theform.removeAttr("onsubmit")
    $theform.submit()
  }
}

function changeName(name, alias) {
  $("input[name='" + name + "']").attr("name", alias)
}

function searchSubmit() {
  var size = arguments.length
  var validate = arguments[1] != void 0 ? arguments[1] : true
  var url = arguments.length > 0 && arguments[0].length > 0 ? arguments[0] : doSearchUrl
  searchFormSubmit(url, validate, arguments[2], arguments[3])
}

function addDoSearch4baseLotInfo() {
  var type = arguments[2]
  var path = arguments[3]
  var id = (arguments.length > 4 ? parseCallback(arguments[4], path) : "") + arguments[1]
  var $telescope = $("<a></a>")
  var $telImg = $("<img style='margin-left:2px;'></img>")
  $telImg.attr("src", "/mycim2/img/search.gif")
  $("input[name='" + arguments[0] + "']")
    .removeAttr("readonly")
    .attr("name", arguments[1])
    .attr("class", "myfield")
    .after($telescope)
  $telescope.append($telImg)
  $telescope.attr("target", "_blank").click(function () {
    doSearchWithExt(id, type, $("input[name='" + arguments[1] + "']").val(), path)
  })
  $telescope.parent().attr("nowrap", "nowrap")
}

function parseCallback(callback, path) {
  var result = ""
  var QUO_REGEX = /['"].*?['"]/
  if (callback != void 0 && callback.length > 0) {
    var _result = "callback="
    _result += callback.substring(0, callback.indexOf("(") + 1)
    var param = callback.substring(callback.indexOf("(") + 1, callback.lastIndexOf(")")).trim()
    if (param.length > 0) {
      var paramArr = param.split(",")
      var paramLen = paramArr.length
      for (var i in paramArr) {
        if (QUO_REGEX.test(paramArr[i])) {
          var quoted = paramArr[i].substring(1, paramArr[i].length - 1)
          _result += "'" + path + (quoted.charAt(0) != "/" ? "/" : "") + quoted + "'"
        } else {
          _result += "opener." + paramArr[i]
        }
        _result += i < paramLen - 1 ? "," : ""
      }
    }
    result = _result + ")&"
  }
  return result
}

document.onreadystatechange = function () {
  var nameSpaceValues = document.getElementsByName("namedSpace")
  for (var i = 0; i < nameSpaceValues.length; i++) {
    var elemTD = nameSpaceValues[i].parentNode
    var elemTR = elemTD.parentNode
    clearSpaceSiblingNodes(elemTR)
    if (nameSpaceValues[i].type == "text") {
      var nameSpaceLabel = nameSpaceValues[i].parentNode.previousSibling
      nameSpaceLabel.innerHTML = " "
      nameSpaceValues[i].style.display = "none"
    }
  }
}

function formatDueDate(dateStr) {
  return dateStr.split(" ")[0]
}

function formateDueDate4lotbaseInfo($inputDueDateName) {
  $inputDueDateName.css("display", "none")
  var $displayDueDate = $("<input type='text' class='myreadonly'  size = '32' readonly/>")
  var text = $inputDueDateName != null ? formatDueDate($inputDueDateName.val()) : ""
  $displayDueDate.val(text)
  $inputDueDateName.parent().append($displayDueDate)
}

function clearSpaceSiblingNodes(oEelement) {
  for (var i = 0; i < oEelement.childNodes.length; i++) {
    var node = oEelement.childNodes[i]
    if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
      node.parentNode.removeChild(node)
    }
  }
}

function validateConsistency() {
  var names = arguments
  var validateFlag = validate(document.forms[0])
  validateFlag = validateFlag == void 0 || validateFlag
  if (validateFlag == true) {
    for (var each in names) {
      var name = names[each]
      var value = $('input[name="' + name + '"]').val()
      var _value = $("#_" + name).val()
      validateFlag = _value.length < 1 || _value == value
      if (validateFlag != true) {
        showAlertByExt(i18n.labels.LBS_WARNING, $("#invalidId").val(), 2)
        break
      }
    }
  }
  return validateFlag
}

function formatDouble2Int($elem) {
  var value = $elem.val()
  $elem.val(value.split(".")[0])
}

function operationConfirm() {
  var submitName = document.activeElement.name
  if (submitName === "modify" || submitName === "create" || submitName === "rework") {
    if (window.CN0EN == "EN") {
      return confirm("confirm ?")
    } else {
      return confirm("确定?")
    }
  }
  return true
}

function operationMsg() {
  var operationSuccess = $("input[name='operationSuccess']").val()
  if (operationSuccess === "true") {
    if (window.CN0EN == "EN") {
      showAlertByExt(i18n.labels.LBS_PROMPT, "Successful operation!", 3)
    } else {
      showAlertByExt(i18n.labels.LBS_PROMPT, "操作成功!", 3, 1)
    }
  }
  $("input[name='operationSuccess']").val("")
}

function operationMeans() {
  var operationSuccessspe = $("input[name='operationSuccessspe']").val()
  if (operationSuccessspe === "true") {
    if (window.CN0EN == "EN") {
      showAlertByExt(i18n.labels.LBS_PROMPT, "Successful operation!", 3)
    } else {
      showAlertByExt(i18n.labels.LBS_PROMPT, "操作成功!", 3, 1)
    }
  }
  $("input[name='operationSuccessspe']").val("")
}

//获取地址栏参数值 name:参数名
function GetParameterValue(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

//获取 lot owner 下拉列表
function setLotOwner() {
  var $lotowner = $("#_lotOwner").val()
  $.ajax({
    url: getContextPath() + "/userGroupAction.do?reqCode=qrylotOwnerInfo",
    dataType: "json",
    requestMethod: "qrylotOwnerInfo",
    success: function (result) {
      $.each(result.results, function (n, value) {
        var options = ""
        if ($lotowner === value.instanceDesc) {
          var options = "<option value='" + value.instanceDesc + "' selected='selected'>" + value.instanceDesc + "</option>"
        } else {
          options = "<option value='" + value.instanceDesc + "'>" + value.instanceDesc + "</option>"
        }
        $("[name='lotOwner']").append(options)
      })
    }
  })
}

//阻止掉页面自带的input框回车提交表单功能，如果需要回车就通过js代码添加
/*document.onkeydown=function(e){
	if(e.keyCode==13){
		stopDefault(e);
	}
};*/

// 处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpaceAndEnterSubmit(e) {
  var ev = e || window.event // 获取event对象
  var obj = ev.target || ev.srcElement // 获取事件源
  var t = obj.type || obj.getAttribute("type") // 获取事件源类型
  if (e.keyCode == 13 && (t == "password" || t == "text")) {
    stopDefault(e)
  }
  // 获取作为判断条件的事件类型
  var vReadOnly = obj.readOnly
  var vDisabled = obj.disabled
  // 处理undefined值情况
  vReadOnly = vReadOnly == undefined ? false : vReadOnly
  vDisabled = vDisabled == undefined ? true : vDisabled
  // 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
  // 并且readOnly属性为true或disabled属性为true的，则退格键失效
  var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true)
  // 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
  var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"
  // 判断
  if (flag2 || flag1) return false
}

// 禁止后退键 作用于Firefox、Opera
document.onkeypress = forbidBackSpaceAndEnterSubmit
// 禁止后退键 作用于IE、Chrome
document.onkeydown = forbidBackSpaceAndEnterSubmit

//输入框数字验证
function checkNumber(obj) {
  obj.value = obj.value.replace(/[^\d]/g, "")
  var inputdata = $(obj).val()
  if (inputdata != "" && inputdata < 1) {
    inputdata = 1
  }
  if (inputdata != "" && inputdata > 25) {
    inputdata = 25
  }
  $(obj).val(inputdata)
}

function getUsersByDept(dept, user) {
  var s = document.getElementsByName(dept)[0]
  var deptId = s.options[s.options.selectedIndex].value
  var url = proPath() + "ajaxflush.do?dept=" + deptId
  var userIds = $("select[name=" + user + "]")
  userIds.empty()
  userIds.append($("<option></option>").val("").html(""))
  $.ajax({
    url: url,
    requestMethod: "findUserByDeptId",
    success: function (data) {
      $.each(data, function (val, text) {
        if (userIds.is("select")) {
          userIds.append($("<option></option>").val(val).html(text))
        } else {
          userIds.val(text)
        }
      })
    }
  })
}

function getTelByDeptAndUserId(dept, user, deptExt) {
  var s1 = document.getElementsByName(dept)[0]
  var deptId = s1.options[s1.options.selectedIndex].value
  var s2 = document.getElementsByName(user)[0]
  var userName = s2.options[s2.options.selectedIndex].value
  document.getElementById("userRrn").value = s2.value
  var url = proPath() + "ajaxflush.do?dept=" + deptId + "&user=" + userName
  $.ajax({
    url: url,
    requestMethod: "getTel",
    success: function (data) {
      document.getElementsByName(deptExt)[0].value = data
    }
  })
}

function getReworkCodeByDept(dept, code) {
  var s = document.getElementsByName(dept)[0]
  var deptId = s.options[s.options.selectedIndex].value
  var url = proPath() + "ajaxflush.do?deptId=" + deptId
  var codes = $("select[name=" + code + "]")
  codes.empty()
  codes.append($("<option></option>").val("").html(""))
  $.ajax({
    url: url,
    requestMethod: "getReworkCodes",
    success: function (data) {
      $.each(data, function (val, text) {
        if (codes.is("select")) {
          codes.append($("<option></option>").val(val).html(text))
        } else {
          codes.val(text)
        }
      })
    }
  })
}
function doOpenNew(url) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 950
  var op_heigh = 750
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    "TOP = 20 , LEFT = 0"
  window.open(dest, "", option)
}
function doOpenFl(url) {
  var op_tool = 0
  var op_loc_box = 0
  var op_dir = 0
  var op_stat = 0
  var op_menu = 0
  var op_scroll = 1
  var op_resize = 1
  var op_wid = 850
  var op_heigh = 650
  var dest = url
  var option =
    "toolbar=" +
    op_tool +
    ",location=" +
    op_loc_box +
    ",directories=" +
    op_dir +
    ",status=" +
    op_stat +
    ",menubar=" +
    op_menu +
    ",scrollbars=" +
    op_scroll +
    ",resizable=" +
    op_resize +
    ",width=" +
    op_wid +
    ",height=" +
    op_heigh +
    "TOP = 20 , LEFT = 0"
  window.open(dest, "doOpen", option)
}

function closeCurrentTab() {
  window.parent.vm.closeTabs("current")
}

/**
 * 假设要四舍五入的数字为number，要保留n位小数，可以先用 ，然后用 Math.round()取整，最后在除去，间接实现四舍五入。
 * 另外toFixed()还有个自动补零的功能，也要实现一下，故下面简单封装了一个toFixed方法来实现四舍五入
 * @param number
 * @param m
 * @returns {*}
 */
function toFixed(number, m) {
  if (typeof number !== "number") {
    throw new Error("number不是数字")
  }
  let result = Math.round(Math.pow(10, m) * number) / Math.pow(10, m)
  result = String(result)
  if (result.indexOf(".") == -1) {
    if (m != 0) {
      result += "."
      result += new Array(m + 1).join("0")
    }
  } else {
    let arr = result.split(".")
    if (arr[1].length < m) {
      arr[1] += new Array(m - arr[1].length + 1).join("0")
    }
    result = arr.join(".")
  }
  return result
}

/**
 *  禁用按钮并且提交，可选是否需要校验
 * @param button        按钮对象
 * @param noValidated   是否不需要校验：true = 需要不校验 、 false和空 = 需要校验
 * @param updateAction  是否修改action：true = 不修改 、 false和空 = 修改
 * @param needConfirm   需要确认吗：    true = 需要 、 false和空= 不需要
 * @param addButtonName 是否需要添加上button的name，用于当method和name不一样时：true = 需要，则updateAction必须为true 、 false和空=不需要
 * @returns {boolean}
 */
function disabledBtnAtSubmit4Validate(button, noValidated, updateAction, needConfirm, addButtonName) {
  disabledBtn()
  if (needConfirm) {
    if (!confirm(i18n_fld_confirm)) {
      resurgenceBtn()
      return false
    }
  }
  if (addButtonName) {
    if (button.formAction) {
      document.forms[0].action = button.formAction
    }
    var value = "1"
    if (button.value) {
      value = button.value
    }
    if (document.forms[0].action.indexOf("?") > 0) {
      document.forms[0].action = document.forms[0].action + "&" + button.name + "=" + value
    } else {
      document.forms[0].action = document.forms[0].action + "?" + button.name + "=" + value
    }
  }
  transaction(button, noValidated, updateAction)
}

function disabledBtnValidate(button, noValidated, updateAction, needConfirm, addButtonName) {
  var objectSubtype = document.getElementsByName("objectSubtype")[0].value
  if (objectSubtype == null || objectSubtype == undefined || objectSubtype.length == 0) {
    MyCim.notify.alert("I_MSG_MATERIAL_TYPE_CANNOT_BE_EMPTY")
    return false
  }
  var storeUom = document.getElementsByName("storeUom")[0].value
  if (storeUom == null || storeUom == undefined || storeUom.length == 0) {
    MyCim.notify.alert("I_MSG_MEASUREMENT_UNIT_CANNOT_BE_EMPTY")
    return false
  }
  disabledBtn()
  if (needConfirm) {
    if (!confirm(i18n_fld_confirm)) {
      resurgenceBtn()
      return false
    }
  }
  if (addButtonName) {
    if (button.formAction) {
      document.forms[0].action = button.formAction
    }
    var value = "1"
    if (button.value) {
      value = button.value
    }
    if (document.forms[0].action.indexOf("?") > 0) {
      document.forms[0].action = document.forms[0].action + "&" + button.name + "=" + value
    } else {
      document.forms[0].action = document.forms[0].action + "?" + button.name + "=" + value
    }
  }
  transaction(button, noValidated, updateAction)
}

/**
 * 时间格式化 YYYY-MM-DD
 * @param date
 * @returns {string}
 */
function dateToString(date) {
  if (!date) return date
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString()
  let day = date.getDate().toString()
  if (month.length == 1) {
    month = "0" + month
  }
  if (day.length == 1) {
    day = "0" + day
  }
  let dateTime = year + "-" + month + "-" + day
  return dateTime
}

/**
 *  禁用按钮并且提交，可选是否需要校验
 * @param button        按钮对象
 * @param noValidated   是否不需要校验：true = 需要不校验 、 false和空 = 需要校验
 * @param updateAction  是否修改action：true = 不修改 、 false和空 = 修改
 * @param needConfirm   需要确认吗：    true = 需要 、 false和空= 不需要
 * @param addButtonName 是否需要添加上button的name，用于当method和name不一样时：true = 需要，则updateAction必须为true 、 false和空=不需要
 * @returns {boolean}
 */
function disabledBtnAtSubmit4Validate(button, noValidated, updateAction, needConfirm, addButtonName) {
  disabledBtn()
  if (needConfirm) {
    if (!confirm(i18n_fld_confirm)) {
      resurgenceBtn()
      return false
    }
  }
  if (addButtonName) {
    if (button.formAction) {
      document.forms[0].action = button.formAction
    }
    var value = "1"
    if (button.value) {
      value = button.value
    }
    if (document.forms[0].action.indexOf("?") > 0) {
      document.forms[0].action = document.forms[0].action + "&" + button.name + "=" + value
    } else {
      document.forms[0].action = document.forms[0].action + "?" + button.name + "=" + value
    }
  }
  transaction(button, noValidated, updateAction)
}

function _checkNull(value) {
  if (value == null || value == undefined || value == "null" || value == "undefined" || value == "") {
    return true
  }
  return false
}

//value 为空则返回 true
function _checkNumberNull(value) {
  if (value == null || value == undefined || value == "null" || value == "undefined" || value == "" || value == 0 || isNaN(value)) {
    return true
  }
  return false
}

var optionsPrint = {
  url: "ws://127.0.0.1:5200", //打印电脑的IP
  pingTimeout: 15000,
  pongTimeout: 10000,
  reconnectTimeout: 50000,
  pingMsg: "ping"
}

function isNull(data) {
  if (data == null || data == undefined || data === "" || data == "null") {
    return true
  } else {
    return false
  }
}

function destroyWindow(window) {
    if (window) {
        window.destroy()
    }
}
function saveCpFlowConfig(btn) {
    const form = btn.up("window").down("[name=saveForm]")
    const values = form.getForm().getValues()
    values.routeId = values.routeIdName;
    values.operationId = values.operationIdName
    values.ibeRouteId = values.ibeRouteIdName;
    values.ibeOperationId = values.ibeOperationIdName
    if (checkSaveValues(values)) {
        Ext.Ajax.request({
            url: actionURL,
            requestMethod: "saveConfigPage",
            params: values,
            success: function (response) {
                showSuccessAlert("保存成功!", function () {
                    destroyWindow(btn.up("window"))
                    refreshFlowConfigGrid()
                })
            },
            failure: function () {}
        })
    }
}

function checkSaveValues(values) {
    if (isNull(values.productId)) {
        showErrorAlert("产品号不能为空!!")
        return false
    }
    if (isNull(values.processId)) {
        showErrorAlert("流程号不能为空!!")
        return false
    }
    if (isNull(values.processVersion)) {
        showErrorAlert("流程版本号不能为空!!")
        return false
    }
    if (isNull(values.routeId)) {
        showErrorAlert("工序号不能为空!!")
        return false
    }
    if (isNull(values.operationId)) {
        showErrorAlert("工步号不能为空!!")
        return false
    }
    if (isNull(values.ibeRouteId)) {
        showErrorAlert("IBE工序号不能为空!!")
        return false
    }
    if (isNull(values.ibeOperationId)) {
        showErrorAlert("IBE工步号不能为空!!")
        return false
    }
    if (values.routeId === values.ibeRouteId && values.operationId === values.ibeOperationId) {
        showErrorAlert("PVS工步不能和IBE工步相同")
        return false
    }
    if (isNull(values.type)) {
        showErrorAlert("类型不能为空!!")
        return false
    }
    if (isNull(values.paramId)) {
        showErrorAlert("修频项不能为空!!")
        return false
    }
    const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
    if (!reg.test(values.targetValue)) {
        showErrorAlert("target值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    if (!reg.test(values.offsetValue)) {
        showErrorAlert("offset值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    return true
}

function refreshFlowConfigGrid() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const store = mainTabPanel.down("[name=listGrid]").getStore()
    store.currentPage = 1
    store.load()
}

function delFlowConfig() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const listGrid = mainTabPanel.down("[name=listGrid]")
    const records = listGrid.getSelectionModel().getSelection()
    if (records.length <= 0) {
        showWarningAlert("至少选择一条删除!!!")
        return
    }
    Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, "是否确认删除?", function (button) {
        if (button === "yes") {
            const rrns = []
            for (let i = 0; i < records.length; i++) {
                rrns.push(records[i].data.rowRrn)
            }
            Ext.Ajax.request({
                url: actionURL,
                requestMethod: "delCpConfigs",
                params: {
                    rowRrns: rrns,
                    type: type
                },
                success: function (resp, opts) {
                    showSuccessAlert("删除成功!")
                    refreshFlowConfigGrid()
                },
                failure: function (resp, opts) {}
            })
        }
    })
}

function saveCurveSetInfo(form, grid) {
    const values = form.getForm().getValues()
    values.cpTrimCurveXyDatas = grid
            .getStore()
            .getRange()
            .map((r) => r.data)
    values.cpTrimCurveInfo = {
        cpRrn: values.rowRrn,
        rowRrn: values.cRrn,
        maxValue: values.maxValue,
        minValue: values.minValue,
        rSquareWarnValue: values.rSquareWarnValue
    }
    if (!checksaveCurveSetValues(values)) {
        return
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "saveCurveSet",
        params: values,
        success: function (resp, opts) {
            showSuccessAlert("保存成功!")
            destroyWindow(grid.up("window"))
            refreshTreeGrid()
        },
        failure: function (resp, opts) {}
    })
}

function saveCurveSetInfoXy(form) {
    const values = form.getForm().getValues()
    if (isNull(values.rowRrn)) {
        showErrorAlert("rowRrn不能为空!!")
        return false
    }
    if (isNull(values.xValue)) {
        showErrorAlert("x值不能为空!!")
        return false
    }
    if (isNull(values.yValue)) {
        showErrorAlert("y值不能为空!!")
        return false
    }
    const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
    if (!reg.test(values.xValue)) {
        showErrorAlert("x值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    if (!reg.test(values.yValue)) {
        showErrorAlert("y值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "saveCurveSetInfoXy",
        params: values,
        success: function (resp, opts) {
            showSuccessAlert("保存成功!")
            destroyWindow(form.up("window"))
            refreshTreeGrid()
        },
        failure: function (resp, opts) {}
    })
}

function checksaveCurveSetValues(values) {
    if (isNull(values.rowRrn)) {
        showErrorAlert("rowRrn不能为空!!")
        return false
    }
    if (isNull(values.productId)) {
        showErrorAlert("产品号不能为空!!")
        return false
    }
    if (isNull(values.routeId)) {
        showErrorAlert("工序号不能为空!!")
        return false
    }
    if (isNull(values.operationId)) {
        showErrorAlert("工步号不能为空!!")
        return false
    }
    if (isNull(values.paramId)) {
        showErrorAlert("修频项不能为空!!")
        return false
    }

    const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
    if (!reg.test(values.minValue)) {
        showErrorAlert("下限值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    if (!reg.test(values.maxValue)) {
        showErrorAlert("上限值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    if (!reg.test(values.rSquareWarnValue)) {
        showErrorAlert("R2告警值格式有误(请填写数字,最多四位小数!)")
        return false
    }
    if (values.cpTrimCurveXyDatas.length === 0) {
        showErrorAlert("XY值不能为空!!")
        return false
    }

    for (const element of values.cpTrimCurveXyDatas) {
        if (!element.xValue || !element.yValue) {
            showErrorAlert("XY值填写有误,存在空值!")
            return false
        }
        if (!reg.test(element.xValue)) {
            showErrorAlert("X值" + element.xValue + "填写有误(请填写数字,最多四位小数!)")
            return false
        }
        if (!reg.test(element.yValue)) {
            showErrorAlert("Y值" + element.yValue + "填写有误(请填写数字,最多四位小数!)")
            return false
        }
    }
    return true
}

function refreshTreeGrid() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const store = mainTabPanel.down("[name=treeGrid]").getStore()
    const form = mainTabPanel.down("[name=cusrveForm]").getForm()
    store.setProxy({
        type: "ajax",
        url: actionURL,
        requestMethod: "qryTrimConfigCurveXys"
    })
    const values = form.getValues()
    values.type = type
    store.proxy.extraParams = values
    store.load()
}

// 递归子节点
function cascadeChildren(node, checked) {
    node.cascadeBy(function (child) {
        child.set("checked", checked)
    })
}
// 更新父节点的选中状态
function updateParent(node) {
    const parent = node.parentNode

    if (!parent) return

    let allChecked = true
    let anyChecked = false

    parent.eachChild(function (sibling) {
        if (sibling.get("checked")) {
            anyChecked = true
        } else {
            allChecked = false
        }
    })

    // 你可以选择不同的逻辑：
    // 若至少一个子节点选中，则选中父节点（半选）；这里只做全选才勾选父节点
    parent.set("checked", allChecked)

    // 递归向上处理
    updateParent(parent)
}

function delCureSet() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const treeGrid = mainTabPanel.down("[name=treeGrid]")
    const values = []
    treeGrid.getRootNode().cascadeBy(function (node) {
        if (node.get("checked") && node.get("type")) {
            values.push({
                rowRrn: node.data.rowRrn,
                parentRrn: node.data.parentRrn,
                type: node.data.type
            })
        }
    })
    if (values.length < 1) {
        showWarningAlert("请选择要删除的记录!!!")
        return
    }

    Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, "是否确认删除?", function (button) {
        if (button === "yes") {
            Ext.Ajax.request({
                url: actionURL,
                requestMethod: "delCureSet",
                params: values,
                success: function (resp, opts) {
                    showSuccessAlert("删除成功!")
                    refreshTreeGrid()
                },
                failure: function (resp, opts) {}
            })
        }
    })
}

function refreshDeadTreeGrid() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const store = mainTabPanel.down("[name=treeDeadGrid]").getStore()
    const form = mainTabPanel.down("[name=deadSpotForm]").getForm()
    store.setProxy({
        type: "ajax",
        url: actionURL,
        requestMethod: "qryTrimConfigDeadSpotRules"
    })
    const values = form.getValues()
    values.type = type
    values.ibeRouteId = values.deadRouteId
    values.ibeOperationId = values.deadOperationId

    store.proxy.extraParams = values
    store.load()
}

function addRuleTab(deadTabPanel, cpTrimDeadSpotItem,isClose) {
    if (!cpTrimDeadSpotItem.itemId) {
        return
    }
    const newTab = Ext.getCmp(cpTrimDeadSpotItem.itemId)
    if (newTab) {
        deadTabPanel.remove(cpTrimDeadSpotItem.itemId)
    }

    const grid = Ext.create("Ext.grid.Panel", {
        region: "center",
        name: "ruleGrid",
        store: Ext.create("Ext.data.Store", {
            fields: ["rowRrn", "cpRrn", "ruleType","ruleTypeDesc", "ruleRelation","ruleRelationDesc", "ruleValue"],
            autoDestroy: true
        }),
        columnLines: true,
        // plugins: [
        //     {
        //         ptype: "rowediting",
        //         clicksToEdit: 2,
        //         pluginId: "rowplugin",
        //         listeners: {
        //             edit: (editor, context) => {
        //                 context.record.commit()
        //             }
        //         }
        //     }
        // ],
        columns: [
            // {
            //     header: "关系",
            //     dataIndex: "ruleRelationDesc",
            //     sortable: false,
            //     flex: 1
            // },
            {
                header: "规则类型",
                dataIndex: "ruleTypeDesc",
                sortable: false,
                flex: 1
            },
            // {
            //     header: "关系",
            //     dataIndex: "ruleRelation",
            //     flex: 1,
            //     sortable: false,
            //     hidden: true
            //     // editor: {
            //     //     xtype: "combobox",
            //     //     store: ruleRelationStore,
            //     //     displayField: "value",
            //     //     valueField: "key",
            //     //     queryMode: "local",
            //     //     forceSelection: true, // 必须选择列表中的项
            //     //     editable: false, // 禁止手动输入
            //     //     triggerAction: "all" // 点击触发按钮显示所有选项
            //     // },
            //     // // 显示value但存储key
            //     // renderer: function (value) {
            //     //     var record = ruleRelationStore.findRecord("key", value)
            //     //     return record ? record.get("value") : value
            //     // }
            // },
            {
                header: "规则类型",
                dataIndex: "ruleType",
                flex: 1,
                sortable: false,
                hidden: true
                // editor: {
                //     xtype: "combobox",
                //     store: ruleTypeStore,
                //     displayField: "value",
                //     valueField: "key",
                //     queryMode: "local",
                //     forceSelection: true, // 必须选择列表中的项
                //     editable: false, // 禁止手动输入
                //     triggerAction: "all" // 点击触发按钮显示所有选项
                // },
                // // 显示value但存储key
                // renderer: function (value) {
                //     var record = ruleTypeStore.findRecord("key", value)
                //     return record ? record.get("value") : value
                // }
            },
            {
                header: "规则值",
                dataIndex: "ruleValue",
                flex: 1,
                sortable: false
                // editor: {
                //     xtype: "textfield"
                // }
            },
            {
                xtype: "actioncolumn",
                sortable: false,
                width: 100,
                stopSelection: true,
                items: [
                    {
                        iconCls: "iconCls_delete",
                        // iconCls: "spaced-icon",
                        // icon: "js/delete.png",
                        tooltip: "删除",
                        handler: function (grid, rowIndex, colIndex) {
                            grid.getStore().removeAt(rowIndex)
                        }
                    }
                ]
            }
        ],
        tbar: [
            {
                text: "添加",
                scope: this,
                handler: function (btn) {
                    // const rec = grid.getStore().insert(0, {
                    //     ruleType: "",
                    //     ruleRelation: "",
                    //     ruleValue: ""
                    // })[0]
                    // grid.getPlugin("rowplugin").startEdit(rec, 0)
                    const data = {
                        isEdit: false
                    }
                    showEditRuleWindow(data,grid);
                }
            }
            // "->",
            // {
            //     xtype: "tbtext",
            //     text: "提示:规则类型选择范围时,按照 下限~上限 形式输入,如: 1~3,-9.98~9.89",
            //     style: {
            //         color: "red",
            //         marginRight: "16px"
            //     }
            // }
        ],
        listeners: {
            itemdblclick: function(view, record, item, index, e, eOpts) {
                const data = {
                    isEdit: true
                }
                // 双击行时弹出窗口，只处理特定列
                showEditRuleWindow(data,grid,record);
            }
        }
    })
    if (cpTrimDeadSpotItem.rules) {
        grid.getStore().add(cpTrimDeadSpotItem.rules)
    }
    deadTabPanel.add({
        id: cpTrimDeadSpotItem.itemId,
        name: "rule",
        title: cpTrimDeadSpotItem.itemId,
        closable: isClose,
        layout: "fit",
        padding: "0 0 0 0",
        items: [grid]
    })
    deadTabPanel.setActiveTab(cpTrimDeadSpotItem.itemId)
}

function showEditRuleWindow(data,grid,record) {

    const ruleTypeStore = Ext.create("Ext.data.Store", {
        fields: ["key", "value"],
        data: PAGE_DATA.COMBOXDATAS.cpDeadRuleType
    })

    // const ruleRelationStore = Ext.create("Ext.data.Store", {
    //     fields: ["key", "value"],
    //     data: PAGE_DATA.COMBOXDATAS.cpDeadRuleRela
    // })

    const form = Ext.create("Ext.form.Panel", {
        layout: "column",
        width: "100%",
        margin: 10,
        border: false,
        bodyStyle: "background-color:#FFFFFF",
        defaults: {
            columnWidth: 1,
            labelWidth: 80,
            labelAlign: "left",
            padding: "0 5 5",
            xtype: "textfield"
        },
        items: [
            // {
            //     xtype: "combobox",
            //     fieldLabel: "关系",
            //     name: "ruleRelation",
            //     store: ruleRelationStore,
            //     displayField: "value",
            //     valueField: "key",
            //     queryMode: "local",
            //     allowBlank: false,
            //     forceSelection: true, // 必须选择列表中的项
            //     editable: false, // 禁止手动输入
            //     triggerAction: "all", // 点击触发按钮显示所有选项
            //     value: data.isEdit ? record.data.ruleRelation : ""
            // },
            {
                xtype: "combobox",
                fieldLabel: "规则类型",
                store: ruleTypeStore,
                name: "ruleType",
                displayField: "value",
                valueField: "key",
                queryMode: "local",
                allowBlank: false,
                forceSelection: true, // 必须选择列表中的项
                editable: false, // 禁止手动输入
                triggerAction: "all", // 点击触发按钮显示所有选项
                value: data.isEdit ? record.data.ruleType : "",
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var form = combo.up("form")
                        if (form){
                            var container = form.down("#dynamicFields")

                            // 清空原来的
                            container.removeAll()

                            getDynamicFied(newValue,container,{isEdit: false},record)
                        }
                    }
                }
            },
            {
                xtype: "container",
                itemId: "dynamicFields",
                layout: "anchor"
            }
            // {
            //     xtype: "textfield",
            //     fieldLabel: "规则值",
            //     allowBlank: false,
            //     name: "ruleValue",
            //     value: data.isEdit ? record.data.ruleValue : ""
            // }
        ]
    })
    Ext.create("Ext.window.Window", {
        width: 400,
        modal: true, // 是否需要遮罩
        layout: "fit",
        title: "规则配置",
        closable: true,
        constrain: true, // 限制窗口拖动范围
        resizable: false,
        autoDestroy: true,
        closeAction: "destroy",
        items: [form],
        buttons: [
            {
                text: "保存",
                formBind: true,
                handler: function (btn, e, eOpts) {
                    const values = form.getForm().getValues()
                    if (!checkEditRule(values,form)){
                        return
                    }
                    if (data.isEdit){
                        record.set(values)
                    }else {
                        grid.getStore().insert(0, values)[0]
                    }
                    destroyWindow(this.up("window"))
                }
            },
            {
                text: "取消",
                style: "margin-left:10px",
                handler: function () {
                    destroyWindow(this.up("window"))
                }
            }
        ]
    }).show()
    getDynamicFied(form.getForm().findField("ruleType").getValue(),form.down("#dynamicFields"),data,record)
}

function checkEditRule(values,form) {

    const reg = /^-?(0|([1-9]\d*))(\.\d{1,4})?$/
    // if (isNull(values.ruleRelation)) {
    //     showErrorAlert("关系不能为空!!")
    //     return false
    // }
    if (isNull(values.ruleType)) {
        showErrorAlert("规则类型不能为空!!")
        return false
    }
    // const ruleRelationC = form.getForm().findField("ruleRelation").findRecordByValue(form.getForm().findField("ruleRelation").getValue());
    // values.ruleRelationDesc = ruleRelationC.data.value
    const ruleTypeC = form.getForm().findField("ruleType").findRecordByValue(form.getForm().findField("ruleType").getValue());
    values.ruleTypeDesc = ruleTypeC.data.value
    if (values.ruleType === "M±") {
        if (!reg.test(values.ruleValue)) {
            showErrorAlert("规则值格式有误(请填写数字,最多四位小数!)")
            return false
        }
    }
    if (values.ruleType === "RCC" || values.ruleType === "ROO") {
        if (!reg.test(values.startField)) {
            showErrorAlert("开始值格式有误(请填写数字,最多四位小数!)")
            return false
        }
        if (!reg.test(values.endField)) {
            showErrorAlert("结束值格式有误(请填写数字,最多四位小数!)")
            return false
        }
        if (Number(values.endField) <= Number(values.startField)) {
            showErrorAlert("结束值不能小于或等于开始值!)")
            return false
        }
        if (values.ruleType === "RCC") {
            values.ruleValue = "[" + values.startField + "," + values.endField + "]";
        }
        if (values.ruleType === "ROO") {
            values.ruleValue = "(" + values.startField + "," + values.endField + ")";
        }
    }
    return true
}

function getDynamicFied(value,container,data,record) {
    if (value === "RCC" || value === "ROO") {
        container.add({
            xtype: "fieldcontainer",
            layout: "hbox",
            fieldLabel: "规则值",
            labelWidth: 80,
            combineErrors: true,
            defaultType: "textfield",
            items: [
                {
                    name: "startField",
                    flex: 1,
                    allowBlank: false,
                    emptyText: "开始值",
                    margin: "0 2 0 0",
                    value: (getDynamicFiedValue(value,data,record))?.[1]
                },
                {
                    xtype: "displayfield",
                    value: "-",
                    width: 20,
                    style: {
                        textAlign: "center",
                        lineHeight: "22px"
                    }
                },
                {
                    name: "endField",
                    flex: 1,
                    allowBlank: false,
                    emptyText: "结束值",
                    labelWidth: 0,
                    hideLabel: true,
                    margin: "0 0 0 2",
                    value: getDynamicFiedValue(value,data,record)?.[2]
                }
            ]
        })
    }
    if (value === "M±"){
        container.add({
            xtype: "textfield",
            fieldLabel: "规则值",
            allowBlank: false,
            name: "ruleValue",
            labelWidth: 80,
            anchor: "100%",
            value: data.isEdit ? record.data.ruleValue : ""
        })
    }
}

function getDynamicFiedValue(ruleType,data,record) {
    if (ruleType === "ROO" && data.isEdit) {
        return record.data.ruleValue.match(/\((.*?),\s*(.*?)\)/);
    }
    if (ruleType === "RCC" && data.isEdit) {
        return record.data.ruleValue.match(/\[(.*?),\s*(.*?)\]/);
    }
    return "";

}

function saveCpDeadPotSet(form, tabPanel) {
    const values = form.getForm().getValues()
    const allTabs = tabPanel.items.items
    if (!allTabs){
        showErrorAlert("请添加规则项配置!!")
        return false
    }
    const cpTrimDeadSpotItems = [];
    for (const tab of allTabs) {
        const cpTrimDeadSpotItem = {cpRrn: values.rowRrn,itemId: tab.getId()};
        const store = tab.down("[name=ruleGrid]").getStore()
        const rules = []
        for (const r of store.getRange()) {
            if (r.data.cpRrn){
                cpTrimDeadSpotItem.rowRrn = r.data.cpRrn
            }
            rules.push(r.data)
        }
        cpTrimDeadSpotItem.rules = rules
        cpTrimDeadSpotItems.push(cpTrimDeadSpotItem)
    }
    values.cpTrimDeadSpotItems = cpTrimDeadSpotItems

    if (!checksaveCpDeadPotSetValues(values)) {
        return
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "saveCpDeadPotSet",
        params: values,
        success: function (resp, opts) {
            showSuccessAlert("保存成功!")
            destroyWindow(form.up("window"))
            refreshDeadTreeGrid()
        },
        failure: function (resp, opts) {}
    })
}

function addRuleSet(tabPanel,cpTrimDeadSpotItem) {
    if (!cpTrimDeadSpotItem.itemId) {
        return
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "getCpTrimDeadSpotItemInfo",
        params: cpTrimDeadSpotItem,
        success: function (resp, opts) {
            if (resp) {
                addRuleTab(tabPanel, resp,true)
            }else {
                addRuleTab(tabPanel, {
                    itemId: Ext.getCmp("ruleItemId").getValue()
                },true)
            }
            Ext.getCmp("ruleItemId").setValue("")
        },
        failure: function (resp, opts) {}
    })
}

function delDeadSet() {
    const mainTabPanel = Ext.getCmp("mainTabPanel")
    const treeGrid = mainTabPanel.down("[name=treeDeadGrid]")
    const values = []
    treeGrid.getRootNode().cascadeBy(function (node) {
        if (node.get("checked") && node.get("type")) {
            values.push({
                rowRrn: node.data.rowRrn,
                cpRrn: node.data.cpRrn,
                type: node.data.type
            })
        }
    })
    if (values.length < 1) {
        showWarningAlert("请选择要删除的记录!!!")
        return
    }

    Ext.MessageBox.confirm(i18n.labels.LBS_CONFIRM, "是否确认删除?", function (button) {
        if (button === "yes") {
            Ext.Ajax.request({
                url: actionURL,
                requestMethod: "delDeadSet",
                params: values,
                success: function (resp, opts) {
                    showSuccessAlert("删除成功!")
                    refreshDeadTreeGrid()
                },
                failure: function (resp, opts) {}
            })
        }
    })
}

function checksaveCpDeadPotSetValues(values) {
    if (isNull(values.rowRrn)) {
        showErrorAlert("rowRrn不能为空!!")
        return false
    }
    if (isNull(values.productId)) {
        showErrorAlert("产品号不能为空!!")
        return false
    }
    if (isNull(values.ibeRouteId)) {
        showErrorAlert("工序号不能为空!!")
        return false
    }
    if (isNull(values.ibeOperationId)) {
        showErrorAlert("工步号不能为空!!")
        return false
    }
    if (isNull(values.paramId)) {
        showErrorAlert("修频项不能为空!!")
        return false
    }

    if (!values.cpTrimDeadSpotItems || values.cpTrimDeadSpotItems.length === 0){
        showErrorAlert("请添加规则项配置!!")
        return false
    }
    for (const item of values.cpTrimDeadSpotItems) {
        if (!item.rules || item.rules.length === 0){
            showErrorAlert(item.itemId + "未配置规则,请检查!!")
            return false
        }
        for (const rule of item.rules) {
            // if (!rule.ruleType || !rule.ruleRelation || !rule.ruleValue) {
            if (!rule.ruleType || !rule.ruleValue) {
                showErrorAlert(item.itemId + "存在空值,请检查!!")
                return false
            }
        }
    }
    return true
}

function saveCpDeadPotItemSet(data,tabPanel) {
    const tab = tabPanel.items.items[0]
    if (!tab){
        showErrorAlert("请添加规则项配置!!")
        return false
    }
    const values = {};
    values.rowRrn = data.rowRrn
    values.itemId = data.itemId
    const store = tab.down("[name=ruleGrid]").getStore()
    const rules = []
    for (const r of store.getRange()) {
        rules.push(r.data)
    }
    values.rules = rules

    if (!values.rules || values.rules.length === 0){
        showErrorAlert(values.itemId + "未配置规则,请检查!!")
        return
    }
    for (const rule of values.rules) {
        // if (!rule.ruleType || !rule.ruleRelation || !rule.ruleValue) {
        if (!rule.ruleType || !rule.ruleValue) {
            showErrorAlert(values.itemId + "存在空值,请检查!!")
            return
        }
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "saveCpDeadPotItemSet",
        params: values,
        success: function (resp, opts) {
            showSuccessAlert("保存成功!")
            destroyWindow(tabPanel.up("window"))
            refreshDeadTreeGrid()
        },
        failure: function (resp, opts) {}
    })
}

function saveCpDeadPotItemRuleSet(data,values,form) {
    values.rowRrn = data.rowRrn

    // if (!values.ruleType || !values.ruleRelation || !values.ruleValue) {
    if (!values.ruleType || !values.ruleValue) {
        showErrorAlert("存在空值,请检查!!")
        return
    }
    Ext.Ajax.request({
        url: actionURL,
        requestMethod: "saveCpDeadPotItemRuleSet",
        params: values,
        success: function (resp, opts) {
            showSuccessAlert("保存成功!")
            destroyWindow(form.up("window"))
            refreshDeadTreeGrid()
        },
        failure: function (resp, opts) {}
    })
}
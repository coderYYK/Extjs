Ext.onReady(function () {
  Ext.create("Ext.form.Panel", {
    renderTo: Ext.getBody(),
    title: "动态表单示例（带分隔符）",
    width: 500,
    bodyPadding: 10,
    items: [
      {
        xtype: "combo",
        fieldLabel: "选择类型",
        name: "typeSelector",
        store: Ext.create("Ext.data.Store", {
          fields: ["type"],
          data: [{ type: "single" }, { type: "double" }]
        }),
        displayField: "type",
        valueField: "type",
        queryMode: "local",
        editable: false,
        listeners: {
          change: function (combo, newValue, oldValue) {
            var form = combo.up("form")
            var container = form.down("#dynamicFields")

            // 清空原来的
            container.removeAll()

            if (newValue === "single") {
              container.add({
                xtype: "textfield",
                fieldLabel: "单个输入",
                name: "singleField",
                anchor: "100%"
              })
            } else if (newValue === "double") {
              container.add({
                xtype: "fieldcontainer",
                layout: "hbox",
                fieldLabel: "范围",
                combineErrors: true,
                defaultType: "textfield",
                items: [
                  {
                    name: "startField",
                    flex: 1,
                    emptyText: "开始值",
                    margin: "0 5 0 0"
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
                    emptyText: "结束值",
                    labelWidth: 0,
                    hideLabel: true,
                    margin: "0 0 0 5"
                  }
                ]
              })
            }
            form.doLayout()
          }
        }
      },
      {
        xtype: "container",
        itemId: "dynamicFields",
        layout: "anchor",
        margin: "10 0 0 0"
      }
    ]
  })
})

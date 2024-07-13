/**
 * Created by cinaous on 2017/7/19.
 */
/**
 * 示例：
 * new ForumCombo({
            url:'ForumCombo.json.txt',  数据请求路径  【必须】
            title:'search panel',       面板标题
            width:400,                  面板宽度
            loadingText:'加载....',       搜索等待提示文本
            renderTo:Ext.getBody()      渲染的地方
            pageSize:6,                 分页大小
            fields:['name','age'],      字段
            displayField:'age',         显示值
            placeholder:'less than 4 charters', 提示文本
            emptyText:'没有任何信息',     没有结果时，提示信息
            getInnerTpl:function(){         下拉列表选软处理函数
                return '{name}::{age}';
            }
        });
 * @param cfg
 * @constructor
 */
function ForumCombo(cfg){
    Ext.define("Post", {
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            url : cfg.url,
            reader: {
                type: 'json',
                root: 'rows',
                totalProperty: 'totalCount'
            }
        },
        fields: cfg.fields||[ 'name']
    });

    var ds = Ext.create('Ext.data.Store', {
        pageSize: cfg.pageSize||10,
        model: 'Post'
    });
    var listConfig={
        loadingText: 'Searching...',
        emptyText: 'No matching posts found.'
    };
    copyTo(cfg,listConfig);
    var _cfg={
        layout: 'anchor',
        bodyPadding: 10,
        items: [{
            xtype: 'combo',
            store: ds,
            displayField: cfg.displayField||'name',
            typeAhead: false,
            hideLabel: true,
            hideTrigger:true,
            anchor: '100%',
            listConfig: listConfig,
            pageSize: cfg.pageSize||10
        },{
            xtype: 'component',
            style: 'margin-top:10px',
            html: cfg.placeholder||i18n_msg_minInput4CharacterSearch
        }]
    }
    copyTo(cfg,_cfg);
    var panel = Ext.create('Ext.panel.Panel', _cfg);
    return panel;
}
function copyTo(obj,_obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            _obj[i]=obj[i];
        }
    }
    return _obj;
}
/**
 *
 * @param config
 *          示例：{
                        fields:[
                            'name',
                            'email',
                            'phone',
                            {name:'age',type:'int'}
                        ],      字段模型定义
                        columns:[
                            {header: 'Name',  dataIndex: 'name', editor: 'textfield'},
                            {header: 'Email', dataIndex: 'email', flex:1,
                                editor: {
                                    xtype: 'textfield',
                                    allowBlank: false
                                }
                            },
                            {header: 'Phone', dataIndex: 'phone'},
                            {header: 'Age', dataIndex: 'age',
                                editor:{
                                    xtype:'numberfield',
                                    allowBlank:false
                                }
                            }
                        ],      列名配置，指定编辑器
                        url:'rowEditingGrid.data.js',       数据获取请求地址，示例：{
                                                        rows:[
                                                            {"name":"Lisa", "email":"lisa@simpsons.com", "phone":"555-111-1224"},
                                                         {"name":"Bart", "email":"bart@simpsons.com", "phone":"555-222-1234"},
                                                         {"name":"Homer", "email":"home@simpsons.com", "phone":"555-222-1244"},
                                                         {"name":"Marge", "email":"marge@simpsons.com", "phone":"555-222-1254"}
                                                     ]
                                                 }
                        template:{"name":"Lisa", "email":"lisa@simpsons.com", "phone":"555-111-1224","age":27},     新增一行的默认填充值
                         tbars:['增加','删除'],         配置增加、删除按钮的显示文本
                         extras:{
                            renderTo:Ext.getBody()      扩展项，配置支持Ext.grid的配置，如果，同命属性，此处配置生效
                        }
                 }
 *
 * @returns {Ext.grid.Panel}
 * @constructor
 */
function RowEditingGrid(config){
    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: config.fields
    });
    var store=Ext.create('Ext.data.Store', {
        model:'Employee',
        autoDestroy: true,
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: config.url,
            reader: {
                type: 'json',
                root: 'rows',
                idProperty: config.idProperty||config.fields[0]
            }
        }
    });
    var rowEditing=Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1
    });

    var cfg={
        store: store,
        columns: config.columns,
        selType: 'rowmodel',
        plugins: [
            rowEditing
        ],
        tbar:[{
            xtype:'button',
            text:config.tbars[0],
            handler : function() {
                rowEditing.cancelEdit();
                // Create a model instance
                var r = Ext.create('Employee', config.template);
                store.insert(0, r);
                rowEditing.startEdit(0, 0);
            }
        },{
            xtype:'button',
            text:config.tbars[1],
            itemId:'remove',
            handler: function() {
                var sm = grid.getSelectionModel();
                rowEditing.cancelEdit();
                store.remove(sm.getSelection());
                if (store.getCount() > 0) {
                    sm.select(0);
                }
            }
        }],
        width: 400,
        listeners: {
            'selectionchange': function(view, records) {
                grid.down('#remove').setDisabled(!records.length);
            }
        }
    };
    for(var i in config.extras){
        if(config.extras.hasOwnProperty(i)){
            cfg[i]=config.extras[i];
        }
    }
    var grid=Ext.create('Ext.grid.Panel', cfg);
    return grid;
}
/**
 *	PS:如需手动设置width,需配置中设置labelWidth为数值,否则标枪不显示
 * @param cfg   {
     *      url:url     配置ajax请求的数据获取地址【data|url必选】
     *      data:[
                {"value":"AL", "name":"Alabama"},
                {"value":"AK", "name":"Alaska"},
                {"value":"AZ", "name":"Arizona"}
            ]           本地数据获取
            label:      配置显示标签 【非必需】
            single:true 是否单选，false为多选，默认多选【非必需】
            renderTo:    渲染到的组件或者id【非必需】
            labelWidth:  标签的宽度
     * }
 * @returns {Ext.form.ComboBox}
 * @constructor
 */
function MultiCombo(cfg){
    var store;
    cfg.data && (store=Ext.create('Ext.data.Store', {
        fields: ['value', 'name'],
        data : cfg.data||[]
    }));
    store = store || new Ext.data.JsonStore({
        // store configs
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: cfg.url,
            reader: {
                type: 'json',
                idProperty: 'name'
            }
        },
        //另外，可以配Ext.data.Model的名称(如 Ext.data.Store 中的例子)
        fields: ['value','name']
    });
    // Create the combo box, attached to the states data store
    var conf={
        fieldLabel: cfg.label||'',
        labelWidth:cfg.labelWidth||'auto',
        store: store,
        queryMode: 'local',
        displayField: 'name',
        multiSelect: !cfg.single||false,
        valueField: 'value'
    };
    copyTo(cfg,conf);
    conf.listeners=conf.listeners||{};
    conf.listeners.beforequery||(conf.listeners.beforequery=function(e){
        var combo = e.combo;
        if(!e.forceAll){
            var input = e.query;
            var regExp = new RegExp(".*" + input + ".*","i");
            combo.store.filterBy(function(record){
                var text = record.get(combo.displayField);
                return regExp.test(text);
            });
            combo.expand();
            return false;
        }
    });
    return Ext.create('Ext.form.ComboBox', conf);
}
HTMLCollection.prototype.map=NodeList.prototype.map=Array.prototype.map;
var i5k={};
Ext.onReady(function(){
    document.querySelectorAll('rowEditingGrid').map(function(reg){
        i5k[reg.getAttribute('id')]=new RowEditingGrid(eval(reg.getAttribute('config')));
    });
    !function(){
        for(var i= 0,n=arguments.length;i<n;i++){
            var _name=arguments[i];
            document.querySelectorAll(_name).map(function(mc){
                var attributes=mc.attributes;
                var cfg={};
                var model;
                for(var i= 0,n=attributes.length;i<n;i++){
                    var attribute=attributes[i];
                    var name=attribute.name;
                    if(name=='id'){
                        model=attribute.value;
                        continue;
                    }
                    if(name=='data'){
                        cfg[name]=JSON.parse(attribute.value);
                    }else{
                        var value=+attribute.value;
                        isNaN(value)&&(value=attribute.value);
                        cfg[name]=value;
                    }
                }
                cfg.renderTo=mc;
                i5k[model]=eval('new '+_name+'(cfg)');
            });
        }
    }('ForumCombo','MultiCombo');
});
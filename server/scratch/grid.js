Advaya.register( "Advaya.App.Grid" );
    
(function() {

    Advaya.App.Grid = function( content,  parent ,pluginsParams) {
	    
        this.init( content, parent, pluginsParams );
	    
    }

    Grid = Advaya.App.Grid;
    
    Grid.instance = null;
    
    Grid.handler = {
        
        onRowClick : function(rec) {
            Advaya.App.Parent.instance.row  = rec.lastSelected;
            if(Advaya.App.Parent.instance.row != null) {
                var id = Advaya.App.Parent.instance.row.getId();
                Advaya.App.Parent.instance.prnt_reqParams = {}; 
                Advaya.App.Parent.instance.prnt_reqParams["id"] = id;
            }
        },
        onKeyPress : function(keyEv,e) {
//            var gridPanel = Advaya.App.Grid.instance.grid;
//            var lastColumnIdx = gridPanel.columns.length-1;
//            var currentIdx = gridPanel.getPlugin().context.colIdx;
//            if(lastColumnIdx == currentIdx){
//                var columns = gridPanel.columns;
//                for(var i=0 ; i< columns.length;i++) {
//                    if(columns[i].field || columns[i].editor) {
//                        var lastSelectedRowIdx = gridPanel.getSelectionModel().lastSelected.index;
//                        gridPanel.getPlugin().startEditByPosition({
//                            row:lastSelectedRowIdx,
//                            column:i
//                        });
//                        break;
//                    } 
//                }
//            }
        },
        onSpecialKey:function(obj,e,eOpts){
            var gridPanel = Advaya.App.Grid.instance.grid;
            var store = Advaya.App.Grid.instance.grid.store;
            var selModel = gridPanel.getSelectionModel();
            var selectedRecord = selModel.getLastSelected();
            var recordIndex = store.indexOf(selectedRecord);
            var columns = gridPanel.columns;
            if (e.getKey() == e.ENTER && store.data.items.length != recordIndex+1 ) {
                var nextRecord = store.getAt(recordIndex + 1);
                selModel.select(nextRecord);
                if(gridPanel.getPlugin().context.colIdx == gridPanel.columns.length -1){
                    for(var i=0 ; i< columns.length;i++) {
                        if(columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row:recordIndex+1,
                                column:i
                            });
                            break;
                        } 
                    }
                }else{
                    gridPanel.getPlugin().startEditByPosition({
                        row:recordIndex+1,
                        column:gridPanel.getPlugin().context.colIdx
                    }); 
                }
            }
            if(e.getKey() == 40  && store.data.items.length != recordIndex+1){ //for Keydown
                   
                nextRecord = store.getAt(recordIndex + 1);
                selModel.select(nextRecord);
                gridPanel.getPlugin().startEditByPosition({
                    row:recordIndex+1,
                    column:gridPanel.getPlugin().context.colIdx
                }); 
            }     
            if(e.getKey() == 38){ //for Keyup
                   
                var previousRecord = store.getAt(recordIndex - 1);
                selModel.select(previousRecord);
                gridPanel.getPlugin().startEditByPosition({
                    row:recordIndex-1,
                    column:gridPanel.getPlugin().context.colIdx
                }); 
            }     
            if(e.getKey() == 39 ){ //for forward column
                if(gridPanel.getPlugin().context.colIdx == gridPanel.columns.length -1){
                    for(var i=0 ; i< columns.length;i++) {
                        if(columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row:recordIndex+1,
                                column:i
                            });
                            break;
                        } 
                    }
                }else{
                    gridPanel.getPlugin().startEditByPosition({
                        row:recordIndex,
                        column:gridPanel.getPlugin().context.colIdx +1
                    }); 
                }
            }     
            if(e.getKey() == 9 ){ //for tab
                if(gridPanel.getPlugin().context.colIdx == gridPanel.columns.length -1){
                    for(var i=0 ; i< columns.length;i++) {
                        if(columns[i].field || columns[i].editor) {
                            gridPanel.getPlugin().startEditByPosition({
                                row:recordIndex+1,
                                column:i
                            });
                            break;
                        } 
                    }
                }else{
                    gridPanel.getPlugin().startEditByPosition({
                        row:recordIndex,
                        column:gridPanel.getPlugin().context.colIdx
                    }); 
                }
            }     
            if(e.getKey() == 37){ //for backward column

                gridPanel.getPlugin().startEditByPosition({
                    row:recordIndex,
                    column:gridPanel.getPlugin().context.colIdx - 1
                }); 
            }    
        },
        onKeyPressTestGrid : function(keyEv,e) {
            var gridPanel = Advaya.App.Grid.instance.grid;
            var columns = gridPanel.columns;
            var count = 0;
            var fields = {};
            var col;
            for(var i=0 ; i< columns.length;i++) {
                if(columns[i].field || columns[i].editor) {
                    fields[count] = i; 
                    count++;
                }
            }
            count--;
            for (var key in fields) {
                col = fields[key];
                var lastSelectedRowIdx = gridPanel.getSelectionModel().lastSelected.index;
                if(key == count) {
                    col = fields[0];
                }
                gridPanel.getPlugin().startEditByPosition({
                    row:lastSelectedRowIdx,
                    column:col
                });
            }
        },
        
        gridCellToolTip : function(value,metaData, record, rowIdx,colIdx, store){
            metaData.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        
    }
        
    YAHOO.extend( Grid, Parent, {

        grid : null,
        
        store : null,
        
        extVariable : null,
		
        init : function( content, parent, pluginsParams ) {
	        
            Grid.instance = this;
	        
            Grid.instance.parent = parent;
	        
            this.create( content, pluginsParams );
		
        },
        
        create : function( content, pluginsParams ) {
            
            if(content){
                if(content.extVariable){
                    this.extVariable = content.extVariable;
                }
                this.store = Ext.create("Ext.data.Store", {
                    storeId : content.id+"-store",
                    fields:content.schema.fields,
                    data: content.records
                });
                
                var pluginsArray = null;
                var cellType = null;
                var page = null;
                var features = null;
                var i=0;
                var groupHeaderHide=false;
                if(content.enableGroupHeader){
                    groupHeaderHide=content.enableGroupHeader;
                }
                for (var plugins in pluginsParams) {
                    if(plugins == "cellEdit") {
                        pluginsArray = new Array();    
                        cellType =  "cellmodel";
                        var plg = Ext.create('Ext.grid.plugin.CellEditing', {
                            id:plugins,
                            clicksToEdit: 1
                        });
                        pluginsArray[i] = plg;
                    }
                    if(plugins == "checkBox") {
                        cellType =  Ext.create('Ext.selection.CheckboxModel',{
                            mode:'SIMPLE' ,
                            checkOnly:true,
                            listeners:content.pluginListener
                        });
                    }
                    if(plugins == "group") {
                        features = new Array();    
                        features[0] = Ext.create('Ext.grid.feature.Grouping',{
                            showGroupsText:false,
                            hideGroupedHeader:groupHeaderHide,
                            enableGroupingMenu :false
                        });
                    }
                    if(plugins == "summary") {
                        features = new Array();    
                        features[0] ={
                            ftype: 'groupingsummary',
                            hideGroupedHeader: true,
                            enableGroupingMenu: false
                        }
                    }
                    if(plugins == "columnSum") {
                        features = new Array();    
                        features[0] ={
                            ftype: 'summary'
                        }
                    }
                    if(plugins == "paging") {
                        page = Ext.create('Ext.PagingToolbar', {
                            store: this.store,
                            displayInfo: true,
                            displayMsg: 'Displaying Records {0} - {1} of {2}',
                            emptyMsg: "No topics to display"
                        });
                        i++;
                    }
                    if(plugins == "rowexpander") {
                        pluginsArray = [{ptype: 'rowexpander',
                        rowBodyTpl : content.rowBodyTpl,
                        expandOnEnter : true,
                        selectRowOnExpand : true}]
                        i++;
                    }
                    if(plugins == "gridviewdragdrop") {
                        pluginsArray = [   
                        {
                            ptype: 'gridviewdragdrop',
                            dragText:content.dragText
                        }
                        ];

                    }
                }
                
                this.grid = Ext.create("Ext.grid.Panel",{
                    title:content.title,
                    columnLines:true,
                    componentCls:content.componentCls,
                    store: this.store,
                    frame:content.frame,
                    autoScroll : content.autoScroll,
                    width : content.width,
                    height:content.height,
                    style:content.style,
                    forceFit:true,
                    hideHeaders : content.hideHeaders,
                    enableColumnHide : true,
                    columns : content.coldefs,
                    maintainFlex : true,
                    margin:content.margin,
                    renderTo : content.renderTo,
                    pageSize : content.pageSize,
                    selModel: cellType,
                    features: features,
                    listeners : content.listeners,
                    plugins:pluginsArray,
                    bbar:page,
                    tbar:content.toolbar,
                    buttons:content.buttons,
                    viewConfig:content.viewConfig
                });
                
                if(this.grid.columns[0].isCheckerHd) {
                    this.grid.columns[0].maxWidth = 50;
                }
                this.grid.on("selectionchange",Advaya.App.Grid.handler.onRowClick);
//                this.grid.on("edit",Advaya.App.Grid.handler.onKeyPress);
                
                if(content.records.length <= 0) {
                    this.grid.setHeight(50);
                    if(this.grid.body)
                        this.grid.body.dom.innerHTML = "No records found.";
                }else {
                    if(this.grid.body)
                        this.grid.body.setStyle("border","none");
                }
            }
        },
        
        destroy : function( ) {

            if( this.grid ) {
                this.grid.destroy();
            }
            Advaya.App.Grid.instance = null;
        }
    })
}());



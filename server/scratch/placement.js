Advaya.register("Advaya.Gms.Placement");
(function( ){
    Advaya.Gms.Placement = function() {
        this.init( );
    };
    Placement = Advaya.Gms.Placement;
    Placement.instance = null;
    
    Advaya.Gms.Placement.handler = {
        
        submitForm:function(obj){
            var inst = Advaya.Gms.Placement.instance;
            var form =null;
            if(obj.params.isDynamicWindowSubmitForm){
                var dynamicWindowPanels=inst[obj.params.submitForm];
                form=dynamicWindowPanels[obj.params.submitFormNumber];
            }else{
                form= inst[obj.params.submitForm];
            }
            if(!form.getForm().isValid()){
                obj = {};
                obj.title = "Info";
                obj.message = "Some fields has to be filled";
                Advaya.Gms.Message.handler.show(obj);
            }
            if (form.getForm().isValid()) {
                Advaya.App.Initiator.handler.showLoadMask();
                form.getForm().submit( {
                    url:obj.params.req, 
                    timeout:9000,
                    success:Advaya.Gms.Placement.handler.processForm,
                    failure:Advaya.Gms.Placement.handler.processForm,
                    scope : obj.params
                } );
            }
        },
        
        processForm: function(reqForm,response) {
            Advaya.App.Initiator.handler.hideLoadMask();
            var responseText = response.response.responseText;
            var responseHandler = response.scope.responseHandler;
            var inst = response.scope.inst;
            if(inst == null || inst == undefined){
                inst = Advaya.Gms.Placement.instance;
            }
            var obj = response.scope;
            Advaya.App.Parent.handler.processResponse(responseText, inst, responseHandler, obj);
        },
        
       requestOnclick : function(obj){
            var inst = Advaya.Gms.Placement.instance;
            if(inst==null){
                obj.params.inst=new Advaya.Gms.Placement();
            }
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration( obj.params, {} );
        },
         requestOnclickWithAlert : function(obj){
            var inst = Advaya.Gms.Placement.instance;
            if(obj.params.showAlert){
                Ext.MessageBox.show({
                    title: "Info",
                    msg: obj.params.alertMessage,
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (buttonId) {
                        switch (buttonId) {
                            case 'yes':
                                    Advaya.Gms.Placement.handler[obj.params.methodName](obj);
                                break;
                        }
                    }
                });
            }
        },
        destroyWindow:function(){
            var  inst=Advaya.Gms.Placement.instance;
            if(inst.placementWindow){
                inst.placementWindow.destroy();
                inst.placementWindow = null;
            }
            if(inst.placementWindowPanel){
                inst.placementWindowPanel.destroy();
                inst.placementWindowPanel=null;
            }
            if(inst.placementWindowGrid){
                inst.placementWindowGrid.destroy();
                inst.placementWindowGrid=null;
            }
        },
        gridSelectRequestOnClick:function(obj){
            var obj1={};
            obj1.params={};
            for(var key in obj.params){
                obj1.params[key]=obj.params[key];    
            }
            var prntId = null;
            prntId=Advaya.App.Parent.instance.prnt_reqParams;
            if(prntId!=null){
                obj1.params.req=obj1.params.req+"&"+obj1.params.customIdMap+"="+prntId.id;
                Advaya.Gms.Placement.handler.requestOnclick(obj1)
            }else{
                Advaya.App.Parent.instance.showErrorMessage();
            }
        },
        conformAlertWithGridSelect:function(obj){
            
        },
        saveGridValues : function ( obj ){
            obj = obj.params;
            var inst = Advaya.Gms.Placement.instance;
            var obj1 = {};
            var requriedGridName=null;
            var currentGrid=null;
            
            if(obj.isWindowGrid){
                requriedGridName=obj.grid;
                var gridArrayInWindow=inst[requriedGridName];
                currentGrid=gridArrayInWindow[obj.dynamicGridIndex].grid;
            }else{
                requriedGridName=obj.grid;
                currentGrid=inst[requriedGridName].grid;
            }
            
            if(currentGrid){
                var records = currentGrid.getSelectionModel().getSelection();
                if(records.length == 0  ){
                    obj = {};
                    obj.message = "New/Modified Records not found";
                    Advaya.Gms.Message.handler.show(obj);
                    return;
                }
                
                var totalRecords=currentGrid.store.data.items.length;
                if(totalRecords!=records.length){
                    obj = {};
                    obj.message = "Select All records";
                    Advaya.Gms.Message.handler.show(obj);
                    return;
                }
                var jsonData = Advaya.Gms.Placement.handler.getGridDataAsJSON(records);
                var inputEle = document.createElement("input");
                inputEle.name = obj.parameterName;
                inputEle.value = jsonData;
                form = document.createElement("form");
                form.appendChild(inputEle);
                obj1.form = form;
                obj1.inst = inst;
                obj1.req = obj.req;
                obj1.responseHandler = obj.responseHandler;
                Advaya.App.Initiator.handler.showLoadMask();
                Advaya.App.Parent.instance.getConfiguration(obj1, {});
                Advaya.App.Initiator.handler.showLoadMask();
            }
        },
        
        getGridDataAsJSON: function(records) {
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for (cnt = 0; cnt < records.length; cnt++) {
                var data = records[cnt].data;
                jsonData += sep + Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            return jsonData;
        },
         gridButtonClick:function(responseHandler,req){
           var inst = Advaya.Gms.Placement.instance;
            var obj={};
            obj.params={}
            obj.params.req = req;
            obj.params.responseHandler = responseHandler;
            obj.params.inst = inst;
           Advaya.Gms.Placement.handler.requestOnclick(obj);
        },
        gridRadioCheck:function(obj,rowId){
            var inst=Advaya.Gms.Placement.instance;
            inst.gridRadioRecords[rowId]=obj.value;
        },
        submitGridRadioClickOptions:function(obj){
            var obj1=obj.params;
            var inst=Advaya.Gms.Placement.instance;
            var form = document.createElement("form");
            var jsonData = Advaya.Gms.Placement.handler.getGridRadiodButtonOptions(inst.gridRadioRecords);
            obj1.form = form;
            var inputEle = document.createElement("input");
            inputEle.name =obj1.jsonParameter;
            inputEle.value = jsonData;
            obj1.form.appendChild(inputEle);
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration( obj1, {} );
            
        },
        destroyDynamicWindow:function(obj){
            var inst=Advaya.Gms.Placement.instance;
            if(inst.placementDynamicWindow[obj.destroyWindowNumber]){
                inst.placementDynamicWindow[obj.destroyWindowNumber].destroy();
            }
        },
        destroyMultipleDynamicWindows:function(obj){
            var inst=Advaya.Gms.Placement.instance;
            for(var i=0; i<obj.destroyMultipleWindowNumber.length;i++){
                if(inst.placementDynamicWindow[obj.destroyMultipleWindowNumber[i]]){
                    inst.placementDynamicWindow[obj.destroyMultipleWindowNumber[i]].destroy(); 
                }
            }
        },
       getGridRadiodButtonOptions : function (records){
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            jsonData += sep+Ext.JSON.encode(records)
            sep = ",";
            jsonData += "]";
            return jsonData;
        },
        updateOfferDetails:function(obj1){
            var objParams=obj1.params;
            var inst = Advaya.Gms.Placement.instance;
            var compensation=Ext.getCmp("compensation");
            var dateOfJoin=Ext.getCmp("dateOfJoin");
            var compensationValue=compensation.value;
            var dateOfjoinValue=dateOfJoin.rawValue;
            var grid=null;
            if(compensationValue==undefined || compensationValue=='' || dateOfjoinValue==''){
                var obj = {};
                obj.title = "Info";
                obj.message = "Some fields has to be filled";
                Advaya.Gms.Message.handler.show(obj);
                return;
            }
            if(objParams.updateInDynamicGrid){
                grid=inst.placementDynamicWindowGrid[objParams.dynamicGridNumber].grid;
            }else{
                grid=inst[objParams.updateGrid].grid;
            }
            var records=grid.store.data.items;
            for(var i=0;i<records.length;i++){
                records[i].data.compensation=compensationValue;
                records[i].data.dateOfJoin=dateOfjoinValue;
            }
            grid.getView().refresh();
        },
        submitGridCellEditValues:function(obj){
            var objParams=obj.params;
            var inst = Advaya.Gms.Placement.instance;
            var grid=null;
            if(objParams.updateInDynamicGrid){
                grid=inst.placementDynamicWindowGrid[objParams.dynamicGridNumber].grid;
            }else{
                grid=inst[objParams.updateGrid].grid;
            }
            var records=grid.store.data.items;
            var jsonData = Advaya.Gms.Placement.handler.getGridDataAsJSON(records);
            for(var i=0;i<records.length;i++){
                var compensation=  records[i].data.compensation;
                var dateOfJoinValue=records[i].data.dateOfJoin;
                if(compensation==undefined || compensation=='' || dateOfJoinValue==''){
                    var obj = {};
                    obj.title = "Info";
                    obj.message = "Some fields has to be filled";
                    Advaya.Gms.Message.handler.show(obj);
                    return;
                }
            }
            var inputEle = document.createElement("input");
            inputEle.name = objParams.parameterName;
            inputEle.value = jsonData;
            form = document.createElement("form");
            form.appendChild(inputEle);
            objParams.form = form;
//                obj1.inst = inst;
//                obj1.req = obj.req;
//                obj1.responseHandler = obj.responseHandler;
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(objParams, {});
            Advaya.App.Initiator.handler.showLoadMask();
        },
         
        gridSelectRequestOnClick1:function(obj){
            var obj1={};
            obj1.params={};
            var grid=null;
            var inst = Advaya.Gms.Placement.instance;
            for(var key in obj.params){
                obj1.params[key]=obj.params[key];    
            }
            if(obj1.params.isDynamicWindow){
                var instGrid=inst[obj1.params.gridName];
                grid=instGrid[obj1.params.dynamicWindowNumber].grid;
            }else{
                grid=inst[obj1.params.gridName].grid;
            }
            if(grid){
                if(grid.getSelectionModel().lastSelected!=null){
                    var id=grid.getSelectionModel().lastSelected.data.id
                    obj1.params.req=obj1.params.req+"&"+obj1.params.customIdMap+"="+id;
                    Advaya.Gms.Placement.handler.requestOnclick(obj1)
                }else{
                    Advaya.App.Parent.instance.showErrorMessage();
                }
            }
        },
         radioButtonChangeOperation:function(obj,newValue,oldValue,eOpts){
            var compenent=Ext.getCmp(obj.params.componentId);
            if(obj.items.items[1].checked){
                compenent.setDisabled(true);
            }else if(obj.items.items[0].checked){
                compenent.setDisabled(false);
            }
        } ,
         markAllAttendance: function(obj){
            var inst = Advaya.Gms.Section.instance;
            var rButtons=document.getElementsByClassName("attendance");
            for(var i=0;i<rButtons.length;i++){
                var value = rButtons[i].id.split("_");
                var radioValue = value[0];
                if(radioValue==obj.param){
                    rButtons[i].click();
                }
            }
        },
          exportReports: function(obj) {
            var inst = Advaya.Gms.Placement.instance;
            var src = obj.params.req;
            inst.processIframeRequest( src );
        },
        exportReportWithGridClick:function(obj){
            var obj1={};
            obj1.params={};
            var grid=null;
            var inst = Advaya.Gms.Placement.instance;
            for(var key in obj.params){
                obj1.params[key]=obj.params[key];    
            }
            if(obj1.params.isDynamicWindow){
                var instGrid=inst[obj1.params.gridName];
                grid=instGrid[obj1.params.dynamicWindowNumber].grid;
            }else{
                grid=inst[obj1.params.gridName];
            }
            if(grid){
                if(grid.getSelectionModel().lastSelected!=null){
                    var id=grid.getSelectionModel().lastSelected.data.id
                    obj1.params.req=obj1.params.req+"&"+obj1.params.customIdMap+"="+id;
                    Advaya.Gms.Placement.handler.exportReports(obj1)
                }else{
                    Advaya.App.Parent.instance.showErrorMessage();
                }
            }
        },
        checkBoxHandler:function(obj){
            var handler = Advaya.Gms.Placement.handler;
            if(obj.checked){
                handler[obj.params.checkedMethod](obj);
            }else{
                handler[obj.params.unCheckedMethod](obj);
            }
        },
        checkBoxMethodHandler:function(obj){
            if(obj.checked){
                obj.params.req=obj.params.checkedUrl;
                obj.params.responseHandler=obj.params.checkedResponseHandler;
            }else{
                obj.params.req=obj.params.unCheckedUrl;
                obj.params.responseHandler=obj.params.unCheckedResponeHandler;
            }
            Advaya.Gms.Placement.handler.requestOnclick(obj);
        },
        comboboxChangeHandler:function(obj){
            var handler = Advaya.Gms.Placement.handler;
            var obj1={}
            obj1.params={};
            for(var key in obj.params){
                obj1.params[key]=obj.params[key];    
            }
            var req=obj.params.req;
            obj1.params.req=req+"&"+obj.params.parameterName+"="+obj.value;
            handler[obj.params.methodHandler](obj1);
        },
        checkboxElementVisibilty:function(obj){
            var compenent=Ext.getCmp(obj.params.componentId);
           if(obj.checked){
               compenent.setDisabled(true);
           }else{
               compenent.setDisabled(false);
           }
        }
        
    };
    
    
    YAHOO.extend(Placement, Parent, {
        placementForm:null,
        placementGrid:null,
        placementWindow:null,
        placementWindowPanel:null,
        placementWindowGrid:null,
        placementDynamicWindow : {},
        placementDynamicWindowPanel:{},
        placementDynamicWindowGrid:{},
        
        init: function( ) {
            Advaya.Gms.Placement.instance = this;
            Advaya.Gms.Placement.instance.parent = Advaya.App.Parent.instance;
            Advaya.App.Parent.instance.currentInst = this;
        },
       
       createTabPanel:function(content){
            var grid=Ext.create("Ext.tab.Panel",content);
            return grid
            
        },
       loadForm: function (obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Placement.instance;
            inst.parent.getConfiguration(obj, {});
        },
        
        setData:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Placement.instance;
            inst.destroyContent();
            Advaya.App.Parent.instance.destroyContent();
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if( content.toolbarData ) {
                if(inst.placementToolBar){
                    inst.placementToolBar.destroy();
                }
                 inst.placementToolBar = new Advaya.App.Menubar(content.toolbarData,"dynacontent", inst);
            }   
            if( content.formPanel) {
                inst.placementForm = new Ext.FormPanel( content.formPanel );
                var formFields =inst.placementForm.form.getFields().items;
                inst.setStar(formFields);
            }
            if(content.tableData){
                inst.placementGrid= inst.setGrid(content, inst);  
            }
            if(content.tabPanel){
                 inst.tabPanel= inst.createTabPanel(content.tabPanel);
            }
        },
        setTabData:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Placement.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            var tabPanel=Ext.getCmp(content.tabpanelId);
            if(tabPanel){
                 if(content.destroyMultipleWindowNumber){
                     Advaya.Gms.Placement.handler.destroyMultipleDynamicWindows(content);
                }
                if(content.destroyWindowNumber){
                    Advaya.Gms.Placement.handler.destroyDynamicWindow(content);
                }
               tabPanel.activeTab.removeAll();
             if( content.formPanel) {
                    inst.placementForm = new Ext.FormPanel( content.formPanel );
                    var formFields =inst.placementForm.form.getFields().items;
                    inst.setStar(formFields);
                    tabPanel.activeTab.add(inst.placementForm);
                }
                if(content.tableData){
                    inst.placementGrid= inst.setGrid(content, inst);  
                    tabPanel.activeTab.add(inst.placementGrid.grid);
                }
                if(content.tableData1){
                    inst.placementGrid1= inst.setGrid1(content.tableData1, inst);  
                    tabPanel.activeTab.add(inst.placementGrid1.grid);
                }
            }
        }
        ,
        setStar : function(formFields){
            for( var i=0; i<formFields.length; i++){
                if (formFields[i].allowBlank == false && formFields[i].labelEl) {
                    formFields[i].labelEl.dom.innerHTML += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
                } 
            }
        },
        setWindow:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Placement.instance;
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
           
            if (content.windowPanel) {
                Advaya.Gms.Placement.handler.destroyWindow();
                inst.placementWindow = new Ext.window.Window(content.windowPanel);
            }
            if(content.formPanel){
                inst.placementWindowPanel = new Ext.form.Panel(content.formPanel);
                var formFields = inst.placementWindowPanel.form.getFields().items;
                inst.setStar(formFields);
                inst.placementWindow.add(inst.placementWindowPanel);
            }
            if(content.tableData){
                inst.placementWindowGrid  = inst.setGrid(content, inst);  
                inst.placementWindow.add(inst.placementWindowGrid.grid);
            }
            if(content.rightFormPanel){
                inst.placementWindowPanelRight = new Ext.form.Panel(content.rightFormPanel);
                var formFields = inst.placementWindowPanelRight.form.getFields().items;
                inst.setStar(formFields);
                inst.placementWindow.add(inst.placementWindowPanelRight);
            }
            
            if(content.gridRadioRecords){
                inst.gridRadioRecords=content.gridRadioRecords;
            }
            inst.placementWindow.show();
        },
        setMultipleWindow:function(response,inst){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Placement.instance;
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            var dynamicWindowNumber=null;
             
            if(content.windowPanel.windowNumber){
                dynamicWindowNumber=content.windowPanel.windowNumber;
                
            }
            if (content.windowPanel) {
                if(content.windowPanel.destroyMultipleWindowNumber){
                     Advaya.Gms.Placement.handler.destroyMultipleDynamicWindows(content.windowPanel);
                }
                if(content.windowPanel.destroyWindowNumber){
                    Advaya.Gms.Placement.handler.destroyDynamicWindow(content.windowPanel);
                }
                inst.placementDynamicWindow[dynamicWindowNumber]=new Ext.window.Window(content.windowPanel);
            }
            if(content.formPanel){
                inst.placementDynamicWindowPanel[dynamicWindowNumber] = new Ext.form.Panel(content.formPanel);
                var formFields = inst.placementDynamicWindowPanel[dynamicWindowNumber].form.getFields().items;
                inst.setStar(formFields);
                inst.placementDynamicWindow[dynamicWindowNumber].add(inst.placementDynamicWindowPanel[dynamicWindowNumber]);
            }
            
            if(content.tableData){
                inst.placementDynamicWindowGrid[dynamicWindowNumber]  = inst.setGrid(content, inst);  
                inst.placementDynamicWindow[dynamicWindowNumber].add(inst.placementDynamicWindowGrid[dynamicWindowNumber].grid);
            }
            
            if(content.gridRadioRecords){
                inst.gridRadioRecords=content.gridRadioRecords;
            }
            inst.placementDynamicWindow[dynamicWindowNumber].show();
            
        },
        setPartialData:function(response,inst){
             inst = Advaya.Gms.Placement.instance;
             var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
             if(content.isWindowReplace){
                 if(content.destroyDynamicWindow){
                      Advaya.Gms.Placement.handler.destroyDynamicWindow(content);
                 }
                 if(content.replaceGrid){
                     var item=inst.placementWindow.items.getAt(content.replacePosition);
                     item.destroy();
                     inst.placementWindow.items.removeAt(content.replacePosition);
                     inst.placementWindowPanelRight = inst.setGrid(content, inst);  
                     inst.placementWindow.add( inst.placementWindowPanelRight.grid);
                 }
             }
             if(content.addToDynaContent){
                 if(content.destroyWindow){
                     Advaya.Gms.Placement.handler.destroyWindow();
                 }
                 if(content.tableData){
                     if(inst.placementGrid1){
                         inst.placementGrid1.destroy();
                     }
                    inst.placementGrid1= inst.setGrid(content, inst);  
                }
             }
        },
        
        setPartialData1:function(response,inst){
            inst = Advaya.Gms.Placement.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if(content.replaceItems){
                if(content.replaceCombobox){
                    var ele=Ext.getCmp(content.comboboxId);
                    if( ele ){
                        ele.store.loadData(content.comboboxStore);
                        ele.setValue("");
                    }
                }
                if(content.disableElementId){
                     var ele=Ext.getCmp(content.disableElementId);
                     if(ele){
                         ele.disable();
                     }
                }
                
            }
        },
            
        setGrid : function (data,inst) {
            var pluginsParams = {};
            if(data.pluginsParam) {
                for(var key in data.pluginsParam) {
                    pluginsParams[key] = data.pluginsParam[key];
                }
            }
            var grid = new Advaya.App.Grid(data.tableData, inst, pluginsParams);

            if(data.groupField)
            {
                grid.grid.store.group(data.groupField);
                grid.grid.features[0].groupHeaderTpl=data.groupHeaderTpl;
                Ext.override(Ext.grid.feature.Grouping, {
                    hdCollapsedCls: Ext.emptyFn(), 
                    collapsedCls:Ext.emptyFn() 
                });
            }
            return grid;
        }, 
        setGrid1:function(data,inst){
            var pluginsParams = {};
            if(data.pluginsParam) {
                for(var key in data.pluginsParam) {
                    pluginsParams[key] = data.pluginsParam[key];
                }
            }
            var grid = new Advaya.App.Grid(data, inst, pluginsParams);

            if(data.groupField)
            {
                grid.grid.store.group(data.groupField);
                grid.grid.features[0].groupHeaderTpl=data.groupHeaderTpl;
                Ext.override(Ext.grid.feature.Grouping, {
                    hdCollapsedCls: Ext.emptyFn(), 
                    collapsedCls:Ext.emptyFn() 
                });
            }
            return grid;
        },
         
        destroyContent:function(){
            var  inst=Advaya.Gms.Placement.instance;
            if(inst.placementForm){
                inst.placementForm.destroy();
                inst.placementForm=null;
            }
            if(inst.placementGrid){
                inst.placementGrid.destroy();
                inst.placementForm=null;
            }
            if(inst.placementForm){
                inst.placementForm.destroy();
                inst.placementForm=null;
            }
            if(inst.placementWindow){
                Advaya.Gms.Placement.handler.destroyWindow();
            }
        }
        
    });
}());
Advaya.register("Advaya.Gms.StudentFeedBack");

( function( ) {
    Advaya.Gms.StudentFeedBack = function() {
        this.init();
    }

    StudentFeedBack = Advaya.Gms.StudentFeedBack;
    StudentFeedBack.instance = null;

    StudentFeedBack.handler = {
        
        
        onStudentFeedBack1Click : function (obj){    
            Ext.getBody().mask('', 'page-loading', true);
            obj.inst=obj.params.inst,
            obj.action=obj.params.action,
            obj.req = obj.params.req,
            obj.responseHandler = obj.params.responseHandler,
            obj.inst.getConfiguration( obj, {} );
        },
        
        processForm :  function( ele , evt) {
            var obj = ele.params;
            var forms = obj.inst.StudentFeedBackForm.getForm();
            var form = Advaya.App.Parent.handler.aggregateFormFields(forms);
            if(forms.isValid()){
                obj.form = form;
                obj.inst.processRequest(obj);
            }else{
                var msg = "Mandatory Fields are left Empty.";
                Advaya.Gms.StudentFeedBack.handler.alert(msg);
            }
        },
        
        alert : function (msg){
            Ext.MessageBox.show({
                title : 'Alert!',
                msg : msg,
                buttons : Ext.MessageBox.OK 
            });
        },
        
        processOK : function( ele, evnt, obj ) {
            var inst = Message.instance;
            switch(ele) {
                case 'ok':
                    new Advaya.Gms.Student.handler.onBackToHome();
                    break;
            }
        },
            
        processOKToProfile : function( ele, evnt, obj ) {
            var inst = Message.instance;
            switch(ele) {
                case 'ok':
                    new Advaya.Gms.Student.handler.onBackToProfile();
                    break;
            }
        },
        
        help : function(action, reposonseHandler , req) {
            var inst = Advaya.Gms.StudentFeedBack.instance;
            if(inst.StudentFeedBackWindow){
                inst.StudentFeedBackWindow.destroy();
            }
            inst.StudentFeedBackForm = new Ext.form.Panel({
                style:{
                    border : 'none'
                },
                title: 'Help Note',
                items:[
                {
                    xtype:'displayfield',
                    labelWidth:'500',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'<span style="font-weight:bold;">To the Student </span>'
                },                            
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'* The quality of instruction offered by faculty at <span style="color: red; ">PES IT </span>College is enhanced when instructors receive formalized feedback from students that they are able to incorporate into their subsequent teaching activities.'
                },    
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'* For this reason, you are asked to complete this form indicating your assessment of instruction you received in this course.'
                },    
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'* Evaluations will be kept confidential and will not be read by the faculty member.'
                },    
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'* Answering this Feedback is made mandatory by the <span style="color: red; ">PES IT </span> for all the Student.'
                },    
                {
                    xtype:'displayfield',
                    labelWidth:'500',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'<span style="font-weight:bold;">Steps to be followed </span>'
                }, 
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'1. Indicate your general level of satisfaction with the following items, by selecting an appropriate Option for each Question.'
                },                            
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'2. Questions which are marked as <span style="color: red; margin-left: 2px;">*</span> are Mandatory questions and you need compulsory answer them.'
                },                            
                {
                    xtype:'displayfield',
                    labelWidth:'700',
                    labelStyle:'font-size:14px;',
                    labelSeparator:'',
                    fieldLabel:'3. Feedback once Submitted by clicking on Submit Button cannot be viewed or edited.'
                }                            
                ],
                buttons:[{
                    text:'Close',
                    handler: Advaya.Gms.StudentFeedBack.handler.close
                }]
            });
            inst.StudentFeedBackWindow = new Ext.window.Window( {
                modal:true
            });     
            inst.StudentFeedBackWindow.add(inst.StudentFeedBackForm );
            inst.StudentFeedBackWindow.show();
        },
        
        check : function(field,itemId,optionId,quesId,rowId,optionValue, mandatory) {
            //            var inst=Advaya.Gms.StudentFeedBack.instance;
            //            var rec = inst.grid.store.findRecord( 'id', rowId );
            if(field.checked == true){
                Advaya.Gms.StudentFeedBack.instance.selectedQuestions[itemId] = optionValue;
            } 
        },
        
        studentFeedbackGridView : function(ele , evt) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst=Advaya.Gms.StudentFeedBack.instance;
            var records = inst.StudentFeedBackTable.grid.store.data.items;
            if(records.length == 0) {
                Ext.getBody().unmask();
                inst.showErrorMessage();
                return;
            }
            var q1 = {};
            var q2 = {};
            q1 = Advaya.Gms.StudentFeedBack.instance.manQuestions;
            q2 = Advaya.Gms.StudentFeedBack.instance.selectedQuestions;
            for(var key in q1){
                var ans =q2[q1[key]];
                if(ans == null){
                    var msg = "Some of the mandatory parameters are not selected";
                    Ext.getBody().unmask();
                    Advaya.Gms.StudentFeedBack.handler.alert(msg);
                    return;
                }
            }
             var remarks=null;
             if(inst.studentRemarks!=undefined && inst.studentRemarks==true){
              remarks = Ext.getCmp("remarksField");
              if( remarks.value==undefined || remarks.value==""){
                  if(remarks.allowBlank==false){
                      var msg = "Some of the mandatory parameters are not selected";
                       Ext.getBody().unmask();
                       Advaya.Gms.StudentFeedBack.handler.alert(msg);
                       return;
                  }
              }
            }
            var form = document.createElement("form");
            for(key in q2){
                var fieldElement = document.createElement("input");
                fieldElement.name = "fields.fld"+key;
                fieldElement.value = q2[key];
                form.appendChild(fieldElement);
            }
            if(remarks!=undefined && remarks!=null){
                var fieldElement = document.createElement("input");
                fieldElement.name = "feedbackRemarks";
                fieldElement.value = remarks.value;
                form.appendChild(fieldElement);
            }
            var obj = ele.params;
            obj.reqParams = {};
            if(inst.fbStartTime){
                var startTime = inst.fbStartTime;
                var currentTime = new Date();
                var endTime = currentTime.getMilliseconds();
                var totalTimeTaken = (endTime - startTime);
                obj.reqParams["timeTakenCount"] = totalTimeTaken;
            }
            
            obj.form = form;
            if(obj.alert){
                Ext.getBody().unmask();
                inst.yesNoAlert(obj);
            }else{
                obj.inst.processRequest(obj);
            }
        },
        
        Objectsize : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        
        havingSimilarRecords : function (records,value,recId) {
            var havingSimilar = true;            
            for(var i=0; i < records.length; i++) {
                if(records[i].data.subject == value && records[i].data.id != recId) {
                    for(var data in records[i].data){
                        if(data != "staff" && data != "id" && data != "subject"){
                            if(data && records[i].data[data] == false) {
                                havingSimilar=false;
                                return havingSimilar;
                            }
                        }
                    }
                }
            }
            return havingSimilar;
        },
        
        alert : function (msg){
            Ext.MessageBox.show({
                title : 'Alert!',
                msg : msg,
                buttons : Ext.MessageBox.OK 
            });
        },
        
        selectStaff : function(ele) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst=Advaya.Gms.StudentFeedBack.instance;
            var grid = (inst.grid != null) ? inst.grid.grid : inst.StudentFeedBackTable.grid;
            var type = ele.params.type;
            if(grid) {
                var records = grid.getSelectionModel().getSelection();
                if(records.length == 0 ) {
                    inst.showErrorMessage();
                    return;
                }
                var form = document.createElement("form");
                Advaya.Gms.StudentFeedBack.instance.selectedSubjets = {};
                Advaya.Gms.StudentFeedBack.instance.selectedStaff = {};
                for(var i=0; i < records.length; i++) {
                    Advaya.Gms.StudentFeedBack.instance.selectedSubjets[records[i].get("subjectId")] = records[i].get("subject");
                    Advaya.Gms.StudentFeedBack.instance.selectedStaff[records[i].get("clazStaffId")] = records[i].get("faculty");
                    var fieldElement = document.createElement("input");
                    var clazStaffId = records[i].get("clazStaffId");
                    fieldElement.name = "fields.fld"+clazStaffId;
                    fieldElement.value = clazStaffId;
                    form.appendChild(fieldElement);
                        
                }
                if (type == "selectAll") {
                    for (var key in Advaya.Gms.StudentFeedBack.instance.classSections) {
                        var classSection = Advaya.Gms.StudentFeedBack.instance.selectedStaff[key];
                        if (classSection == null) {
                            var msg = "Select all staffs to give feedback";
                            Ext.getBody().unmask();
                            Advaya.Gms.StudentFeedBack.handler.alert(msg);
                            return;
                        }
                    }
                } else {
                    for (var key in Advaya.Gms.StudentFeedBack.instance.subjets) {
                        var subject = Advaya.Gms.StudentFeedBack.instance.selectedSubjets[key];
                        if (subject == null) {
                            var msg = "Select atleast one Faculty for " + Advaya.Gms.StudentFeedBack.instance.subjets[key];
                            Ext.getBody().unmask();
                            Advaya.Gms.StudentFeedBack.handler.alert(msg);
                            return;
                        }
                    }
                }
                var obj = ele.params;
                obj.form = form;
                obj.inst.processRequest(obj);
            }
        },
        staffDetails : function( panel, record, item, index, e, eOpts) {
            item.onmousemove = function(e) {
                var left=e.clientX+10;
                var top=e.clientY+30;
                var msg = record.data.staff;
                var msgWrapper = Advaya.App.Parent.instance.getMsgDiv();
                var span = document.getElementById('msgSpan');
                if(msgWrapper != null) {
                    msgWrapper.style.display = "block";
                    msgWrapper.style.top= top+"px";
                    msgWrapper.style.left= left+"px";
                    msgWrapper.style.position= "fixed";
                    span.innerHTML = msg;
                }
                if(span != null) {
                    span.setAttribute("style", "background:white;border:2px solid #999;padding:10px;");
                }
            }
            item.onmouseout = function() {
                Advaya.App.Parent.instance.hideMessage();
            }
        },
        close:function() {
            var inst=Advaya.Gms.StudentFeedBack.instance;
            if(inst.StudentFeedBackWindow){
                inst.StudentFeedBackWindow.destroy();
            }
        },
        comboboxValue:function(obj){
            var obj1={};
           // obj1.req=obj.params.req;
            obj1.responseHandler=obj.params.responseHandler;
            obj1.action=obj.params.action;
            obj1.inst=obj.params.inst;
          //  obj1.req=obj.params.req+"&"+obj.params.comboParameter+"="+obj.lastValue;
           if(obj.lastValue && obj.lastValue== "Academic"){
               obj1.req="./feedback/displayStudentFeedbackForm1.action?";
           }else{
               obj1.req="./feedback/displayStudentInsfrasture.action?";
           }
           for(var i=0;i<obj.params.reqParams.length;i++){
               var object=obj.params.reqParams[i];
               obj1.req=obj1.req+"&"+object.parameterName+"="+object.value;
           }
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration( obj1, {} );
         
        },
        processRequest:function(obj){
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration( obj.params, {} );
        },
        processHypderLink:function(inst,responseHandler,req){
            var obj={};
            obj.inst=inst;
            obj.responseHandler=responseHandler;
            obj.req=req;
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        }
        
        
    }

    YAHOO.extend(StudentFeedBack , Parent, {
        StudentFeedBackTable : null,
        StudentFeedBackForm : null,
        StudentFeedBackWindow : null,
        StudentFeedBackToolbar:null,
        StudentFeedBackRemarks:null,
        studentRemarks:false,
        fbStartTime : null,
        manQuestions:{},
        selectedQuestions:{},
        subjets:{},
        selectedSubjets:{},
        classSections:{},
    
        init : function() {
            Advaya.Gms.StudentFeedBack.instance = this;
            Advaya.Gms.StudentFeedBack.instance.parent =  Advaya.App.Parent.instance;
            Advaya.App.Parent.instance.currentInst =this;
        },
        
        loadStudentFeedBackForm : function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var reqParams = {};
            Advaya.Gms.Student.handler.changeLeftSideButtonCls();
            Ext.getCmp("feedback").removeCls('overOnline');
            Ext.getCmp("feedback").addCls('launchOver');
            Advaya.App.Parent.instance.getConfiguration( obj, reqParams );
        },
        
        onBackToHome : function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var req = obj.req;
            if(Ext.getCmp("feedback")){
                Ext.getCmp("feedback").setVisible(false);
            }
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.instance.setProfileForm,obj];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        setStudentFeedBackForm : function(responseText , inst) {
            Ext.getBody().unmask();
            var data = (typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            Advaya.Gms.StudentFeedBack.instance.destroy( );
            Advaya.App.Parent.instance.destroyContent();
            var prnt = document.getElementById("dynacontent");
            if( data.type == "feedbackMessage") {
                inst.StudentAlertMessage = Ext.MessageBox.show({
                    title : data.title,
                    msg : data.message,
                    buttons : Ext.MessageBox.OK ,
                    fn:Advaya.Gms.StudentFeedBack.handler.processOKToProfile
                });
            }
            if( data.type == "printAlert"){
                inst.StudentAlertMessage = Ext.MessageBox.show({
                    title : "Info",
                    msg :data.message,
                    buttons : Ext.MessageBox.YESNO,
                    fn:function(buttonId) {
                        switch(buttonId) {
                            case 'yes':
                                var obj = {};
                                obj.req = './gemsonline-student/profile.action?actionType=view';
                                obj.id = 'profileBtn';
                                obj.batchId = data.batch;
                                Advaya.Gms.StudentFeedBack.instance.onBackToHome(obj);
                                break;
                            case 'no':
                                Advaya.Gms.Student.handler.onBackToProfile();
                                break;
                        }
                    }
                });
            }
            inst.updateHeader(data.title);
            if( data.toolbarData ) {
                inst.StudentFeedBackToolbar = new Advaya.App.Menubar( data.toolbarData,"dynacontent", inst );
            }
            if(data.topPanel) {
                inst.StudentFeedBackForm =  new Ext.form.Panel(data.topPanel);
            }
            if(data.bottomPanel) {
                inst.StudentFeedBackPanel= new Ext.form.Panel(data.bottomPanel);
            }
            
            if(data.formData){  
                if(inst.StudentFeedBackForm){
                    inst.StudentFeedBackForm.destroy();
                }
                inst.StudentFeedBackForm = new Ext.form.Panel( data.formData,inst );
            }else{
                if(inst.StudentFeedBackForm){
                    inst.StudentFeedBackForm.destroy();
                }
            
                inst.StudentFeedBackForm = new Ext.form.Panel( data.formData );
                var formField =inst.StudentFeedBackForm.form.getFields().items;
                for( var i=0; i<formField.length; i++){
                    if (formField[i].allowBlank == false && formField[i].labelEl) {
                        formField[i].labelEl.dom.innerHTML += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
                    } 
                }
            }
            if(data.table){
                inst.Table = null;
                inst.StudentFeedBackTable = inst.createGrid(data.table);
            //                Ext.getCmp("gridFieldset").add(inst.StudentFeedBackTable.grid);
            }
            if(data.tableData){
                inst.Table = null;
                inst.StudentFeedBackTable = inst.setGrid(data, inst);
                if(inst.StudentFeedBackTable.grid.lockedGrid){
                    inst.StudentFeedBackTable.grid.lockedGrid.on("itemmouseenter", Advaya.Gms.StudentFeedBack.handler.staffDetails);
                }
                
            //                Ext.getCmp("gridFieldset").add(inst.StudentFeedBackTable.grid);
            }
            if (data.groupField)
            {
                inst.StudentFeedBackTable.grid.store.group(data.groupField);
                inst.StudentFeedBackTable.grid.features[0].groupHeaderTpl = data.groupHeaderTpl;
                inst.StudentFeedBackTable.grid.features[0].startCollapsed = false;
                inst.StudentFeedBackTable.grid.features[0].hideGroupedHeader=true;
            }
            if(data.subjets){
                Advaya.Gms.StudentFeedBack.instance.subjets = {};
                var subjets = data.subjets.records;
                for(var sub in subjets){
                    Advaya.Gms.StudentFeedBack.instance.subjets[sub] = subjets[sub];
                }
                
            }
            if (data.classSections) {
                Advaya.Gms.StudentFeedBack.instance.classSections = {};
                var classSections = data.classSections.csrecords;
                for (var cs in classSections) {
                    Advaya.Gms.StudentFeedBack.instance.classSections[cs] = classSections[cs];
                }
            }
            if(data.mandatoryQuestions){
                Advaya.Gms.StudentFeedBack.instance.manQuestions = {};
                Advaya.Gms.StudentFeedBack.instance.selectedQuestions = {};
                var mandatoryQuestions = data.mandatoryQuestions.records;
                for(var key in mandatoryQuestions){
                    Advaya.Gms.StudentFeedBack.instance.manQuestions[key] = mandatoryQuestions[key];
                }
            }
            if(data.remarksPanel){
                if(inst.StudentFeedBackRemarks){
                    inst.StudentFeedBackRemarks.destroy();
                }
                inst.studentRemarks=true;
                inst.StudentFeedBackRemarks= new Ext.form.Panel(data.remarksPanel);
            }
            var currentTime = new Date();
            inst.fbStartTime = currentTime.getMilliseconds();
        },
        
        createGrid : function( content ) {
            var inst=Advaya.Gms.StudentFeedBack.instance;
            var store = Ext.create("Ext.data.Store", {
                storeId : content.id+"-store",
                fields:content.schema.fields,
                data: content.records
            });
            
            inst.grid = Ext.create("Ext.grid.Panel",{
                title:content.title,
                columnLines:true,
                store: store,
                autoScroll : content.autoScroll,
                width : content.width,
                height:content.height,
                style:content.style,
                hideHeaders : content.hideHeaders,
                enableColumnHide : false,
                columns : content.coldefs,
                margin:content.margin,
                renderTo : content.renderTo,
                pageSize : content.pageSize,
                listeners : content.listeners,
                tbar:content.toolbar,
                buttons:content.buttons
            });
        },
        
        setGrid : function (data,inst) {
            var pluginsParams = {};
            if(data.pluginsParam) {
                for(var key in data.pluginsParam) {
                    pluginsParams[key] = data.pluginsParam[key];
                }
            }
            var grid = new Advaya.App.Grid(data.tableData, inst, pluginsParams);
            return grid;
        },
        
        setPop : function(response , inst) {
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            if(inst.StudentFeedBackWindow){
                inst.StudentFeedBackWindow.destroy();
            }
            this.StudentFeedBackForm = new Ext.form.Panel(content);
            this.StudentFeedBackWindow = new Ext.window.Window( {
                modal:true
            });     
            this.StudentFeedBackWindow.add(this.StudentFeedBackForm );
            this.StudentFeedBackWindow.show();
        },
        
        yesNoAlert : function (obj) {
            var inst=Advaya.Gms.StudentFeedBack.instance;
            Ext.MessageBox.show({
                title : "Info",
                msg :obj.message,
                icon :obj.icon,
                buttons : Ext.MessageBox.YESNO ,
                fn:function(buttonId) {
                    switch(buttonId) {
                        case 'yes':
                            Advaya.App.Parent.instance.getConfiguration( obj, {} );
                            Advaya.App.Initiator.handler.showLoadMask();
                            break;
                    }
                }
            });
        },
        setKitchenSinkGrid:function(responseText , inst){
            var data = (typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            Advaya.Gms.StudentFeedBack.instance.destroy( );
            Advaya.App.Parent.instance.destroyContent();
            var inst=Advaya.Gms.StudentFeedBack.instance;
            if(data.tableData){
                inst.StudentFeedBackTable =new Advaya.App.GridKitchen(data.tableData, {});
                
            }
        }
    })
}());



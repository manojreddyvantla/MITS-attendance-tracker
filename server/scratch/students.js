Advaya.register("Advaya.Gms.Student");

( function( ) {
	
    Advaya.Gms.Student = function( ) {
        this.init( );
    }

    Student = Advaya.Gms.Student;
    
    Student.instance = null;

    Advaya.Gms.Student.handler = {
        enrollStuForSpecSubjs : function (obj1) {
            var inst = Advaya.Gms.Student.instance;
            var obj = obj1.params;
            var jsonData;
            var records = inst.subjTabel.grid.getSelectionModel().getSelection();
            if(records.length==0){
                var ob={};
                ob.message = "Select atleast one subjects to enroll";
                Advaya.Gms.Message.handler.show(ob);
                return;
            }
            jsonData = Advaya.Gms.Student.handler.getGridDataAsJSON(records);
            var inputEle = document.createElement("input");
            inputEle.name = 'jsonData';
            inputEle.value = jsonData;
            obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.subjForm.getForm());
            obj.form.appendChild(inputEle);
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
            Advaya.App.Initiator.handler.showLoadMask();
        },
        getNextMsg: function(obj) {
            var inst = Advaya.Gms.Student.instance;
            var msgNum = obj.params.msgCount;
            var type = obj.params.msgType;
            var fldId=obj.params.msgNum;            
            if(fldId != (msgNum-1)){
                var fld=Ext.getCmp("msg_"+fldId);                
                fld.hide();
                fldId=fldId+1;
                if(Ext.getCmp("msg_"+fldId)){
                    inst.notificationWindow.setTitle(type);
                    var nxtFld = Ext.getCmp("msg_"+fldId);
                    nxtFld.show();
                }
            }else{
                return;
            } 
        },
        
        getPrevMsg: function(obj) {
            var inst = Advaya.Gms.Student.instance;
            var fldId=obj.params.msgNum;
            var type = obj.params.msgType;
            if(fldId!=0)
            {
                fldId=obj.params.msgNum;
                var fld=Ext.getCmp("msg_"+fldId);
                fld.hide();
                fldId=fldId-1;
                if(Ext.getCmp("msg_"+fldId)){
                    inst.notificationWindow.setTitle(type);
                    var nxtFld = Ext.getCmp("msg_"+fldId);
                    nxtFld.show();
                }
            }
            else {                
                return;
            }
        },
        
        processResponse : function ( responseText , reqParams) {
		
            Ext.getBody().unmask();
            
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
                
            var inst = Advaya.Gms.Student.instance;
            
            if(content.type == "message"){
                Advaya.Gms.Student.handler.alertMessage(content.message);
                return;
            }
            
            if( content.isFirstTime == "true") {
		       	        
                inst.isFirstTime = true;
                
                Advaya.Gms.Student.handler.changePassword( );
		        
            } else {
                    
                inst.isFirstTime = false;
                
                Advaya.Gms.Student.handler.setStudentWindow( content );
		        
            }	    
            
        },
        
        processDisclaimer : function(responseText) {
            Ext.getBody().unmask();
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            var inst = Advaya.Gms.Student.instance;
            if(content.isAuthenticated) {
                inst.isAuthenticated = true;
            }
            if(content.bottomPanel){
                Advaya.Gms.Student.handler.processResponse(responseText);
                return;
            }
            var studentName = document.getElementById("studentName");
            studentName.innerHTML = content.name;
            var studentName = document.getElementById("contactTypeName");
            studentName.innerHTML = content.contactTypeName;
            if(content.isBlocked) {
                Advaya.Gms.Student.handler.blockedMessage( content.message, inst );
                return;
            }
            if(content.disclaimer){
                inst.destroyEle();
            }
            inst.instPanel = new Ext.panel.Panel(content.disclaimer);
            
        },
        
        blockedMessage : function( message, inst ) {
            
            inst.instPanel = new Ext.toolbar.Toolbar({
                renderTo:'dynacontent',
                height:60,
                width:'100%',
                style : {
                    marginTop:'20%',
                    marginBottom:'20%',
                    background:'transparent',
                    border:'none'
                },
                items : [
                {
                    xtype:'tbfill'
                },
                {
                    xtype:'displayfield',
                    value:'<span style="color:red;font-size:18px;font-family:Lucida Console;font-weight:bolder;">'+message+'</span>'
                },
                {
                    xtype:'tbfill'
                }
                ]
            });
            
        },
            
        processAllResponse : function ( responseText ) {
		
            Ext.getBody().unmask();
		    
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
                
            var inst = Advaya.Gms.Student.instance;
		        
            Advaya.Gms.Student.handler.setStudentWindow( content );
		        
		    
        },
        
        setLeftSideBar: function(response){
            Ext.getBody().unmask();
            var inst = Advaya.Gms.Student.instance
            var data = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            
            var instituteName = document.getElementById("instituteName");
            instituteName.innerHTML = data.instituteName;
            
            var studentName = document.getElementById("studentName");
            studentName.innerHTML = data.studName;
            
            var contactUs = document.getElementById("contactUs");
            contactUs.innerHTML = data.contactUs;
            
            if( data.toolbarDetails) {
                inst.tbar = new Ext.toolbar.Toolbar(data.toolbarDetails);
            } 
            if( data.isFirstTime == "true") {
                
                inst.isFirstTime = true;
                Advaya.Gms.Student.handler.changePassword( );
		        
            }else {
                    
                inst.isFirstTime = false;
                //                Advaya.Gms.Student.handler.setStudentWindow( content );
                Advaya.Gms.Student.handler.getLaunchPage();
		  Ext.getBody().unmask();      
            }	   
               Advaya.Gms.Student.handler.showNotifications();
        },
        
        getLaunchPage : function(){
            Ext.getBody().mask('', 'page-loading', true);
            var req = "./gemsonline-student/getHomeView.action?";
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.setLaunchPage];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        setLaunchPage : function(content , inst){
            var req = null;
            var reqparams = {};
            var params = {};
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            Ext.getBody().mask('', 'page-loading', true);
            if(content == "profile"){
                req= "./gemsonline-student/dashboard.action?actionType=view";
                handler["argument"] = [Advaya.Gms.Student.instance.setProfileForm];
                Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
                Ext.getCmp("profile").removeCls('overOnline');
                Ext.getCmp("profile").addCls('launchOver');
            }else if(content == "consollidatedView"){
                Advaya.Gms.Student.instance.getStudentResults();
                Ext.getCmp("consollidatedView").removeCls('overOnline');
                Ext.getCmp("consollidatedView").addCls('launchOver');
            }else if(content == "classRegistrationAvailable"){
                req = "./gemsonline-student/ls.action?actionType=confirmProfile";
                handler["argument"] = [Advaya.Gms.Student.instance.setProfileForm];
                Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
                Ext.getCmp("classRegistrationAvailable").removeCls('overOnline');
                Ext.getCmp("classRegistrationAvailable").addCls('launchOver');
            }else if(content == "result"){
                Advaya.Gms.Student.instance.getDisclaimer();
                Ext.getCmp("result").removeCls('overOnline');
                Ext.getCmp("result").addCls('launchOver');
            }
        },
        changeLeftSideButtonCls : function(){
            var toolBar = Ext.getCmp('leftSideBar');
            var buttons = toolBar.items.items;
            for(var i=0; i<buttons.length; i++){
                if(buttons[i].id != "profileImage" && buttons[i].id != "profileName" && buttons[i].id != "profileUsn" && buttons[i].id != "tbFillBAr" && buttons[i].id != "profileLoginField" && buttons[i].id != "profileLastLogin" && buttons[i].id != "profileCgpa"){
                    buttons[i].removeCls('launchOver');
                    buttons[i].addCls('overOnline');
                }
            }
        },
        
        BatchClick : function(thisObj,e,eOpts){
            var req = eOpts.params.req;
            var obj = {};
            obj.req = req+"&batch.id="+thisObj.id;
            obj.responseHandler = eOpts.params.responseHandler;
            obj.inst = eOpts.params.inst;
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        MeetingDetails:function(obj1){
            obj={};
            var inst = Advaya.Gms.Student.instance;
            var category = Ext.getCmp('category').getValue();
            var type = Ext.getCmp('type').getValue();
            if(!category ||category == "" ){
                    Ext.MessageBox.show({
                        title: "Alert",
                        msg: "Category Should be selected",
                        buttons: Ext.MessageBox.OK,
                        fn: function(buttonId) {
                            switch (buttonId) {
                                case 'ok':
                                    break;
                            }
                        }
                    });
                    return;
                }
            if( !type ||type=="" ){
                    Ext.MessageBox.show({
                        title: "Alert",
                        msg: "Type Should be selected",
                        buttons: Ext.MessageBox.OK,
                        fn: function(buttonId) {
                            switch (buttonId) {
                                case 'ok':
                                    break;
                            }
                        }
                    });
                    return;
                }
            var obj = obj1.params;
            obj.req=obj.req+"&staffStudentItem.category="+category+"&staffStudentItem.type="+type;
            obj.responseHandler="setProfileForm";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        comboBoxLoad:function(id, store, value, noOfBranches){
//            obj={};
//            var inst = Advaya.Gms.Student.instance;
//            var obj = req;
//            obj.req=obj.req;
//            obj.responseHandler="setFeesWindow";
//            Advaya.App.Initiator.handler.showLoadMask();
////            Advaya.App.Parent.instance.getConfiguration(obj, {});
//            
        },
        loadDueSpdDetails: function(obj1) {
            var inst = Advaya.Gms.Student.instance;
            var comboBox = Ext.getCmp("installment");
            var type = "getInstalment";
            var value = comboBox.lastValue;
            var responseHandler;
            var req = "./fees/overAllDueByPC.action?actionType=payForInstallment"+obj1+ "&type=" + type ;
            req = req +"&sdate="+ value;
            responseHandler = "setFeeWinBYSelected";
            var obj = {
                params: {
                    inst: inst,
                    responseHandler: responseHandler,
                    req: req
                }
            }
            var field1 = Ext.getCmp("reportField");
            if (field1) {
                field1.destroy();
            }
            inst.sendYuiReq(inst, obj.params);
        },
        docDetails:function(obj1){
            obj={};
            var inst = Advaya.Gms.Student.instance;
            var obj = obj1.params;
            obj.req=obj.req;
            obj.responseHandler="setProfileForm";
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        reqProcess:function(obj1){
            obj={};
            var inst = Advaya.Gms.Student.instance;
            var obj = obj1.params;
            obj.req=obj.req;
            obj.responseHandler=obj.responseHandler;
            obj.inst=inst;
            Advaya.App.Initiator.handler.showLoadMask();
            Advaya.App.Parent.instance.getConfiguration(obj, {});
        },
        
        setStudentWindow : function ( data ) {
            var inst = Advaya.Gms.Student.instance
            
            if(data.type == "message"){
                Advaya.Gms.Student.handler.alertMessage(data.message);
                return;
            }
            inst.destroyEle();
            if(inst.instPanel) {
                inst.instPanel.destroy();
            }
            if(inst.profileWindow) {
                inst.profileWindow.destroy();
            }
            
            inst.bottomPanel = new Ext.form.Panel({
                renderTo : "dynacontent",
                items : data.bottomPanel.items
            });
            
            if(data.backLogs) {
                inst.attempts = new Ext.form.Panel(data.backLogs);
                inst.subjectAttempts = new Ext.form.Panel(data.subjectAttempts);
                var dd = new Ext.dd.DD(inst.attempts.el, 'carsDDGroup', {
                    isTarget  : false
                });
                inst.subjectAttempts.el.on("click",function(e){
                    e.stopPropagation();
                });
            
                Ext.getBody().on("click",function(){
                    inst.subjectAttempts.hide();
                });
            
                Ext.getCmp("noOfAttempts-form").el.on("mousedown",function(e){
                    Ext.getCmp("noOfAttempts-form").el.dom.style.cursor = "move";
                });
            
                Ext.getCmp("noOfAttempts-form").el.on("mouseup",function(e){
                    Ext.getCmp("noOfAttempts-form").el.dom.style.cursor = "default";
                });
            }
            
            var contHeight = document.getElementById("dynacontent").offsetHeight;
            var height = (contHeight - inst.bottomPanel.getHeight())-30;
            var isHideHelp= false;
            if(data && data.courseType != "Grade"){
                isHideHelp = true;
            }
            inst.instPanel = new Ext.form.Panel({
                renderTo:'dynacontent',
                height : "100%",
                width : "100%",
                items:[
                {
                    html:'<a href="#" onclick=Advaya.Gms.Student.handler.setHelpWindow()><img src="img/help2.png"  width="25" height="20" /></br><span style = "font-size:13px; color:black"> </span></a>',
                    hidden:isHideHelp,
                    style:{
                        'text-align': 'right'
                    }
                },
                {
                    xtype:'fieldset',
                    height:height,
                    title:data.fieldSetTitle,
                    layout:'anchor',
                    autoScroll:true,
                    id: "gridInfo",
                    style:{
                        padding:'8px'
                    }
                }
                ]
            });
            
            if(data && data.gradeLimits){
                inst.instructionForm = new Ext.form.Panel(data.gradeLimits);
                if(inst.profileForm){
                    inst.profileForm.destroy();
                    inst.profileForm = null;
                }
                if(inst.profileWindow){
                    inst.profileWindow.destroy();
                    inst.profileWindow = null;
                }
                inst.profileWindow = new Ext.window.Window({
                    height:'43%',
                    width:'50%',
                    closable:false,
                    modal:true,
                    title:'<span style =" color: black; font-size:13px; ">Help</span>'
                });
                        
                inst.profileWindow.add(inst.instructionForm);
            
            }
            Ext.getCmp("gridInfo").body.dom.style.height = "100%";
            var i=0;
            var havingTables = false;
            for(var key in data.tables) {
                havingTables = true;
            }
            if(!havingTables) {
                var disp = Ext.create('Ext.form.field.Display',{
                    xtype:'displayfield',
                    cls:'clstitle',
                    style:{
                        'float':'left',
                        'left':'39%',
                        'top':'40%'
                    },
                    value:'<span style="color:red;font-size:18px">Transcript is not available !!!</span>'
                });
                Ext.getCmp("gridInfo").add(disp);
                return;
            }
            if(data.tables) {
                for(var semTable in data.tables) {
                    var tabData = data.tables[semTable];
                    if(tabData.resultWithheld){
                        continue;
                    }
                    var spDetail = data.spData[i];
                    if(tabData.records.length == 0){
                        continue;
                    }
                    var heading = tabData.records[0].semester+" Semester( "+tabData.records[0].month+" - "+tabData.records[0].year+" )";
                    var link = {};
                    if(tabData.latestSem){
                        link = 
                        {
                            html:'<a href=../RevaluationForm.pdf target=_blank>Click here for answer script viewing schedule and other details</a>',
                            style:{
                                'text-align': 'right'
                            }
                        }
                        
                    }
                    var subHeader = {};
                    subHeader ={
                        xtype:'fieldset',
                        anchor:'98%',
                        style : {
                            border : '1px solid #C5C5C5'
                        },
                        layout:'anchor',
                        items:[
                        {
                            xtype:'fieldset',
                            anchor:'50%',
                            style:{
                                border:0,
                                padding:0,
                                "float":"left"
                            },
                            items : [
                            {
                                xtype:'displayfield',
                                fieldLabel:spDetail.earned.label,
                                value:spDetail.earned.value
                            },
                            {
                                xtype:'displayfield',
                                fieldLabel:spDetail.sgpa.label,
                                value:spDetail.sgpa.value
                            },
                            {
                                xtype:'displayfield',
                                fieldLabel:spDetail.cgpa.label,
                                value:spDetail.cgpa.value
                            }
                            ]
                        },
                        {
                            xtype : 'fieldset',
                            anchor:'50%',
                            style:{
                                border:0,
                                padding:0,
                                "float":"left"
                            },
                            items : [
                        //                            {
                        //                                xtype:'displayfield',
                        //                                fieldLabel:"Semester Rank ",
                        //                                value:spDetail.semesterRank
                        //                            },
                        //                            {
                        //                                xtype:'displayfield',
                        //                                fieldLabel:"Overall Rank ",
                        //                                value:spDetail.overallRank
                        //                            },
                        //                            {
                        //                                xtype:'displayfield',
                        //                                fieldLabel:"Class Awarded ",
                        //                                value:spDetail.classAwarded
                        //                            }
                        ]
                        },
                        link
                        ]
                    }
                    
                    var congragulation = "Congratulations !!!";
                    for(var j=0 ; j < tabData.records.length ; j++) {
                        if(tabData.records[j].result != "Pass") {
                            congragulation = "";
                            break;
                        }
                    }
                    
                    if(tabData.latestSem) {
                        var congratsForm = {};
                        congratsForm = {
                            xtype:'fieldset',
                            anchor:'98%',
                            id:"congratsFieldSet",
                            style:{
                                border : 'none', 
                                textAlign : 'center'
                            },
                            items:[
                            {
                                xtype:'displayfield',
                                id:'message',
                                value:congragulation
                            }
                            ]
                        }
                        
                        Ext.getCmp("gridInfo").add(congratsForm);
                    }
                    var gridForm = {};
                    gridForm = {
                        xtype:'fieldset',
                        anchor:'98%',
                        id:"gridFormFieldSet"+i,
                        style:{
                            border : 'none', 
                            textAlign : 'center',
                            padding:0,
                            'margin-bottom': 0
                        }
                    }
                    Ext.getCmp("gridInfo").add(gridForm);
                    inst.grid = new Advaya.App.Grid(tabData, inst, {});
                    inst.grid.grid.setTitle(heading);
                    
                    Ext.getCmp("gridFormFieldSet"+i).add(inst.grid.grid);
                    Ext.getCmp("gridInfo").add(subHeader);
                    if( tabData.equSubjects ) {
                        var subCodeHeader = {
                            xtype:'displayfield',  
                            style : {
                                border : '1px solid #C5C5C5', 
                                padding : '3px'
                            },
                            value:tabData.equSubjects
                        };
                        Ext.getCmp("gridInfo").add(subCodeHeader);
                    }
                    i++;
                }
            }
            var gridInfo = Ext.getCmp("gridInfo");
            if(gridInfo.items.items.length == 0){
                var disp1 = Ext.create('Ext.form.field.Display',{
                    xtype:'displayfield',
                    cls:'clstitle',
                    style:{
                        'float':'left',
                        'left':'39%',
                        'top':'40%'
                    },
                    value:'<span style="color:red;font-size:18px">Transcript is not available !!!</span>'
                });
                Ext.getCmp("gridInfo").add(disp1);
            }
            inst.instPanel.show();
        },
        
        setHelpWindow : function (){
            Ext.getBody().unmask();
            Advaya.App.Parent.instance.prnt_reqParams = null;
            var  inst = Advaya.Gms.Student.instance;
            inst.profileWindow.show();
        },
        
        addButtons : function(data) {
            var buttons = new Ext.form.Panel({
                id:'classRegister',
                style : {
                    padding : '3px'
                },
                defaults:{
                    margin:'0 0 0 10',
                    style:{
                        'float':'right'
                    }
                },
                items:data.buttons
            });
            return buttons;
        },
        
        showNotifications:function(){
            var inst = Advaya.Gms.Student.instance;
            var obj={};
            obj.req='./gemsonline-student/getNotifications.action',
            obj.responseHandler='setNotificationWindow',
            obj.inst=inst;
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        },

        changePassword : function ( ) {
            var inst = Advaya.Gms.Student.instance;
            var val = null;
            if( inst.isFirstTime ) {
                val = false;
            } else {
                val = true;
            }
            var windowPanel = {
                title :'Change Password', 
                modal:true, 
                closable : val, 
                listeners : {
                    beforeClose : Advaya.Gms.Student.handler.close
                }
            };
            
            inst.changePassworWindow = new Ext.window.Window(windowPanel);
            var formContent = {
                items : [{
                    xtype:'fieldset',
                    defaultType : 'textfield',
                    width : 300,
                    defaults:{
                        layout:'anchor'
                    },
                    items:
                    [
                    {
                        inputType : 'password',
                        name: 'oldpassword',
                        allowBlank: false,
                        fieldLabel: 'Current Password',
                        listeners:{
                            focus:Advaya.App.Parent.handler.hidePasswordMsgDiv 
                        }
                    },
                    {
                        inputType : 'password',
                        name: 'newpassword',
                        allowBlank: false,
                        fieldLabel: 'New Password',
                        strength:30,
                        vtype:'strength',
                        plugins : {
                            ptype : "passwordstrength"
                        },
                        listeners:{
                            focus:Advaya.App.Parent.handler.showPasswordMsgDiv
                        }
                    },
                    {
                        inputType : 'password',
                        name: 'confirmpassword',
                        allowBlank: false,
                        fieldLabel: 'Confirm Password',
                        listeners:{
                            focus:Advaya.App.Parent.handler.hidePasswordMsgDiv
                        }
                    },
                    {
                        xtype:'button',
                        id:'buttonId',
                        text: 'Submit',
                        handler : Advaya.Gms.Student.handler.changePasswordOnclick
                    }
                    ]
                }]
            };
            inst.formPanel = new Ext.form.Panel(formContent);
            inst.changePassworWindow.add(inst.formPanel);
            inst.changePassworWindow.show().doComponentLayout();
        },
        
        changePasswordOnclick : function() {
            var inst = Advaya.Gms.Student.instance;
            var formPanel = inst.formPanel;
            if(formPanel.getForm().isValid()){
                var formValues = inst.formPanel.getValues();
                if( formValues.newpassword != formValues.confirmpassword ) {
                    alert("New Password and Confirm Password are NOT same.");
                    return;
                } else {
                    var req = "./gemsonline-student/changePassword.action?";
                    var handler = Advaya.ConnectionHandler.instance.getHandler();
                    handler["argument"] = [Advaya.Gms.Student.handler.changePasswordResponse];
                    var sform = Advaya.Gms.Student.handler.aggregateFormFields( formPanel.getForm() );
                    Advaya.ConnectionHandler.handler.asyncRequest("POST", req, handler, sform, false);
                }
            }else {
                alert("Password is not strong enough");
            } 
        },
        
        changePasswordResponse : function( responseText ) {
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            var inst = Advaya.Gms.Student.instance;
            if( content.isSet == true || content.isSet == "true") {
                inst.changePassworWindow.destroy();
                alert( content.message );
            } else {
                alert( content.message );
            }
            if( inst.isFirstTime ) {
                inst.isFirstTime = false;
                if(content.ras){
                    inst.getStudLatestResults();
                    Ext.getCmp("result").removeCls('overOnline');
                    Ext.getCmp("result").addCls('launchOver');
                }else{
                    var obj = {};
                    var params = {};
                    params.id = "profileBtn";
                    params.req = "./gemsonline-student/profile.action?actionType=view";
                    obj.params = params;
                    Advaya.Gms.Student.handler.profile(obj);
                    Ext.getCmp("profile").removeCls('overOnline');
                    Ext.getCmp("profile").addCls('launchOver');
                }
            }
        },
        
        close : function() {
            var inst = Advaya.Gms.Student.instance;
            if(inst.changePassworWindow) {
                inst.changePassworWindow.destroy();
                inst.changePassworWindow = null;
            }  
        },
        hideHelpWindow : function() {
            var inst = Advaya.Gms.Student.instance;
            inst.profileWindow.hide();
        },
        closeNotificationWin : function() {
            var inst = Advaya.Gms.Student.instance;
            if(inst.notificationWindow) {
                inst.notificationWindow.destroy();
                inst.notificationWindow = null;
            }  
        },
        
        aggregateFormFields : function( nform ) {
            var sform = document.createElement( "form" );
            sform.setAttribute( "id", "gemsonline_cp" );
            sform.setAttribute( "name", "gemsonline_cp" );
            sform.setAttribute( "method", "POST" );
            sform.setAttribute( "enctype", "multipart/form-data" );
            var fields = nform.getFields();
            for( var j = 0; j < fields.length; j++ ) {
                var domEle = document.getElementById(fields.items[j].inputId);
                var ele = domEle.cloneNode( true );
                ele.value = fields.items[j].value;
                sform.appendChild(ele);
            }
            return sform;
        },
        
        sendRequest : function(reqParams) {
            var obj = reqParams.params;
            Ext.getCmp(obj.id).getForm().submit({
                url:obj.req,
                success:obj.responseHandler,
                failure:obj.responseHandler
            });
            Ext.getBody().mask('', 'page-loading', true);
        },
        
        sendIFrameRequest : function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
            var iframeName = "iframe_file_download";
            var frameObj = document.getElementById(iframeName) ? document.getElementById(iframeName) : document.createElement("iframe");
            frameObj.style.display = 'none';
            frameObj.setAttribute("id", iframeName);
            if(Ext.isChrome || Ext.isWebKit) {
                frameObj.onload = setTimeout(Advaya.Gms.Student.handler.processIFrameResponse, 2000);
            }else {
                frameObj.onload = Advaya.Gms.Student.handler.processIFrameResponse; 
            }
            var src = obj.params.req;
            frameObj.src=src;
            var container = document.getElementById("dynacontent");
            container.appendChild(frameObj);
        },
        
        processIFrameResponse : function ( obj ){
            var iFrame = document.getElementById("iframe_file_download");
            var msg = "";
            if (iFrame.contentDocument) {
                msg = iFrame.contentDocument.body.innerHTML;
            } 
            msg = msg.replace( /[\n\r\t]/g, "" );
            var obj1 = {};
            obj1.title = "error";
            if(msg != '') {
                try{
                    var data = ( typeof responseText == "object" ) ? msg : eval( "(" + msg.replace( /[\n\r\t]/g, "" ) + ")" );
                }catch(ex){
                    obj1.message = "Unable to generate pdf";
                    Advaya.Gms.Message.handler.show(obj1);
                }
                if(data.action == "alertFB"){
                    Advaya.Gms.Student.handler.alertFBYesNo(data.message,data);
                    return;
                }
                if(data.message){
                    obj1.message = data.message;
                    Advaya.Gms.Message.handler.show(obj1);
                }
            }
            Ext.getBody().unmask();
            var iFrameBody = iFrame.contentDocument.body;
            while(iFrameBody.hasChildNodes()) {
                iFrameBody.removeChild(iFrameBody.firstChild);
            }
        },
        
        alertFBYesNo : function(msg, data){
            Ext.getBody().unmask();
            Ext.MessageBox.show({
                title : "Info",
                msg :msg,
                buttons : Ext.MessageBox.YESNO,
                fn:function(buttonId) {
                    switch(buttonId) {
                        case 'yes':
                            Advaya.Gms.StudentFeedBack.handler.onStudentFeedBack1Click(data);
                            break;
                    }
                }
            });
        },
        
        alert : function(form,response) {
            Ext.getBody().unmask();
            var inst = Advaya.Gms.Student.instance;
            var content = response.result;
            
            if(content.type != "message") {
                if(Ext.getCmp("exApp")){
                    Ext.getCmp("exApp").enable();
                }
                if(Ext.getCmp("exApp1")){
                    Ext.getCmp("exApp1").enable();
                }
                inst.isSubmitted = true;
            }
            
            Ext.MessageBox.show({
                title : content.title,
                msg :content.message,
                buttons : Ext.MessageBox.OK 
            });
        },
        
        alertMessage : function(message,sendRequest) {
            Ext.getBody().unmask();
            Ext.MessageBox.show({
                title : "Info",
                msg :message,
                buttons : Ext.MessageBox.OK
            });
        },
        
        alertYesNo : function(message,reqParams) {
            Ext.getBody().unmask();
            Ext.MessageBox.show({
                title : "Info",
                msg :message,
                buttons : Ext.MessageBox.YESNO,
                fn:function(buttonId) {
                    switch(buttonId) {
                        case 'yes':
                            Advaya.Gms.Student.handler.sendRequest(reqParams);
                            break;
                    }
                }
                
            });
        },
        
        handleResponse : function(form,response) {
            if (Ext.getCmp("supplementaryField") != undefined) {
                Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                Ext.getCmp("suplimentryRegistrationAvailable").removeCls('overOnline');
                Ext.getCmp("suplimentryRegistrationAvailable").addCls('launchOver');
            } else {
                Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                Ext.getCmp("classRegistrationAvailable").removeCls('overOnline');
                Ext.getCmp("classRegistrationAvailable").addCls('launchOver');
            }
            Ext.getBody().unmask();
            var inst = Advaya.Gms.Student.instance;
            var content = null;
            if(response != null){
                content = response.result;
            }else{
                content = ( typeof form == "object" ) ? form : eval( "(" + form.replace( /[\n\r\t]/g, "" ) + ")" );
            }
            if(content.type == "message"){
                Advaya.Gms.Student.handler.alertMessage(content.message);
                return;
            }
            if(content.message){
                Advaya.Gms.Student.handler.alertMessage(content.message);
            }
            if(!content.windowData){
                inst.destroy();
                inst.destroyEle();
            }
            if(inst.instWindow){
                inst.instWindow.destroy();
            }
            if(content.formHeader){
                inst.updateWindowTitle(content.formHeader);
                inst.updateHeader(content.formHeader);
            }
            inst.noOfOpenElectives = content.noOfOpenElectives;
            inst.maximumLimit = content.maximumLimit;
            inst.maximumSubjCount = content.maximumSubjCount;
            inst.personType = content.personType;
            inst.limitType = content.limitType;
            
            if(content.formData){
                inst.instForm = new Ext.form.Panel(content.formData)
            }
            if(content.windowData) {
                inst.instWindow = new Ext.window.Window(content.windowData);
                inst.instWindow.add(inst.instForm);
                inst.instWindow.show();
            }
            inst.isSubmitted = content.isSubmitted;
            Advaya.Gms.Student.handler.setUpFields(content, "mandatory", Ext.getCmp("r1"));
            Advaya.Gms.Student.handler.setUpFields(content, "elective", Ext.getCmp("r2"));
//            Advaya.Gms.Student.handler.setUpFields(content, "openElectives", Ext.getCmp("r3"));
            if(content.backlog) {
                Advaya.Gms.Student.handler.setUpFields(content, "backlog", Ext.getCmp("r3"));
                inst["backlog1"] = new Advaya.App.Grid(content.backlog1, inst, {});
                Ext.getCmp("r3").add(inst["backlog1"].grid);
            }  
            Advaya.Gms.Student.handler.setUpFields(content, "summer", Ext.getCmp("r3"));
        },
        
        setUpFields : function(content,gridName,prnt){ 
            var inst = Advaya.Gms.Student.instance;
            if(content[gridName]) {
                if(content.activeRegister){
                     inst[gridName] = new Advaya.App.Grid(content[gridName], inst, {
                        checkBox : ''   
                    });
                    }else{
                        inst[gridName] = new Advaya.App.Grid(content[gridName], inst, {});
                    }
                
                inst[gridName].grid.resumeEvents();
                if(gridName != "backlog") {
                        var params = {
                        gName : gridName
                    };
                          if(inst.limitType == "Subject") {
                            inst[gridName].grid.on("selectionchange",Advaya.Gms.Student.handler.updateSubjects,{},params);
                    }else if(inst.limitType == "Both"){
                            inst[gridName].grid.on("selectionchange",Advaya.Gms.Student.handler.updateCreditsAndSubjects,{},params);
                        } else{
                            inst[gridName].grid.on("selectionchange",Advaya.Gms.Student.handler.bulkUpdateCredits,{},params);
                        }
                } else{
                    Ext.getCmp("creditsDisplay").setWidth(Ext.getCmp("creditsDisplay").getWidth()+50);
                }
                if(content.activeRegister){
                    var enrolledSubjects = content.enrolledSubjects.records;
                    for(var key in enrolledSubjects){
                        var id = enrolledSubjects[key];
                        var record = inst[gridName].grid.store.findRecord( "id" , id );
                        if(record){
                            inst[gridName].grid.getSelectionModel().select(record,true,true);
                        }
                    } 
                }
                
                var rec = inst[gridName].grid.getSelectionModel().getSelection();
                inst.enrolledSubjects = inst.enrolledSubjects + rec.length;
                var selected = 0;
                if(inst.limitType == "Subject") {
                    selected = selected + rec.length;
                }else {
                    for(var i=0;i<rec.length;i++){
                        selected = selected + rec[i].data.credits;
                    }
                }
                inst[gridName].selected = selected;
                    
                prnt.body.dom.style.height="100%";
                prnt.body.dom.style.overflowX = "hidden";
                prnt.add(inst[gridName].grid);
            }
        },
        
        setTaken : function(newValue,maximumLimit,ele){
            ele = document.getElementById("taken");
            ele.innerHTML = newValue;
            if(newValue > maximumLimit){
                ele.style.color = "red";
                ele.style.textDecoration = "blink";
            } else {
                ele.style.color = "green";
                ele.style.textDecoration = "none";
            }
        },
        setSubjTaken : function(newValue,maximumLimit,ele1){
            ele1 = document.getElementById("subTaken");
            ele1.innerHTML = newValue;
            if(newValue > maximumLimit){
                ele1.style.color = "red";
                ele1.style.textDecoration = "blink";
            } else {
                ele1.style.color = "green";
                ele1.style.textDecoration = "none";
            }
        },
        
        updateSubjects : function(panel,recs,gridName) {
            var inst = Advaya.Gms.Student.instance;
            var ele = document.getElementById("taken");
            var crValue = Ext.Number.from(ele.innerHTML,0);
            var newValue = recs.length;
            var gValue = recs.length;
            Advaya.Gms.Student.handler.setTaken(newValue,inst.maximumLimit,ele);
            inst[gridName.gName].selected = gValue
        },
        
        bulkUpdateCredits : function(panel, recs,gridName) {
            if(recs.length != 0 ){
               if(!recs[0].data.isRegistration){
                    return;
                }
            }
            var inst = Advaya.Gms.Student.instance;
            var ele = document.getElementById("taken");
            var crValue = Ext.Number.from(ele.innerHTML,0);
            var newValue = crValue - inst[gridName.gName].selected;
            var gValue = 0;
            for(var i=0;i<recs.length;i++){
                gValue = gValue + recs[i].data.credits;
                newValue = newValue + recs[i].data.credits;
            }
            Advaya.Gms.Student.handler.setTaken(newValue,inst.maximumLimit,ele);
            inst[gridName.gName].selected = gValue
        },
        updateCreditsAndSubjects: function(panel, recs,gridName){
            if(recs.length != 0 ){
               if(!recs[0].data.isRegistration){
                    return;
                }
            }
            var inst = Advaya.Gms.Student.instance;
            var ele = document.getElementById("taken");
            var ele1 = document.getElementById("subTaken");
            var crValue = Ext.Number.from(ele.innerHTML,0);
            var newValue = crValue - inst[gridName.gName].selected;
           var subjValue = recs.length;
            var subjGValue = recs.length;
            var gValue = 0;
            for(var i=0;i<recs.length;i++){
                gValue = gValue + recs[i].data.credits;
                newValue = newValue + recs[i].data.credits;
            }
            Advaya.Gms.Student.handler.setTaken(newValue,inst.maximumLimit,ele);
            inst[gridName.gName].selected = gValue;
            Advaya.Gms.Student.handler.setSubjTaken(subjValue,inst.maximumSubjCount,ele1);
//            inst[gridName.gName].selected = subjGValue;
        },
        
        loadGridRecords : function(obj) {
            var inst = Advaya.Gms.Student.instance;
            var mandatoryRec = new Array();
            var mergeRec = new Array();
            if(document.getElementById("taken")){
                var crValue = Ext.Number.from(document.getElementById("taken").innerHTML,0);
            }
            if(inst.limitType == "Both"){
                var subjCount = Ext.Number.from(document.getElementById("subTaken").innerHTML,0);
            }
            if(inst.isSubmitted){
                var msg = "Your registration is completed. For any clarifications, please contact Dean (Evaluation)";
                Advaya.Gms.Student.handler.alertMessage(msg);
                return;
            }
            if(inst.limitType == "Credits"){
                if(crValue > inst.maximumLimit){
                    msg = "Taken Credits exceeds Maximum Credits";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            }else if(inst.limitType == "Both"){
                if(crValue > inst.maximumLimit){
                    msg = "Taken Credits exceeds Maximum Credits";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
                if(subjCount > inst.maximumSubjCount){
                    msg = "Taken Subjects exceeds Maximum Subjects";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            }
            else{
                if(crValue > inst.maximumLimit){
                    msg = "Taken Subjects exceeds Maximum Subjects";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            }
            if(inst.mandatory) {
                var rec = inst.mandatory.grid.getSelectionModel().getSelection();
                mandatoryRec = inst.mandatory.grid.getStore().getRange();
                if(rec.length != mandatoryRec.length){
                    msg = "All Mandatory Subjects should be selected";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
                mergeRec = rec;
            }
            if(inst.elective) {
                if(inst.personType != "Backlog"){
                    var electiveRec = inst.elective.grid.getSelectionModel().getSelection();
                    var maxElec = inst.noOfOpenElectives;
                    if(electiveRec.length > maxElec){
                        msg = "Maximum allowed elective(s) only "+maxElec;
                        Advaya.Gms.Student.handler.alertMessage(msg);
                        return;
                    }else if(electiveRec.length < maxElec){
                        msg = "Select "+maxElec+" Elective Subject(s)";
                        Advaya.Gms.Student.handler.alertMessage(msg);
                        return;
                    }
                    mergeRec = Ext.Array.merge(mergeRec,electiveRec);
                }
            }
            if(inst.backlog) {
                var backRec = inst.backlog.grid.getSelectionModel().getSelection();
                mergeRec = Ext.Array.merge(mergeRec,backRec);
            }
            
            if(inst.summer) {
                var summerRec = inst.summer.grid.getSelectionModel().getSelection();
                mergeRec = Ext.Array.merge(mergeRec,summerRec);
            }
            
            if(Ext.getCmp('supplementaryField')){
                var suppliFieldSet = Ext.getCmp('supplementaryField');
                var selectedIndex = parseInt(obj.id);
                var supplementaryRec = suppliFieldSet.items.items[selectedIndex].getSelectionModel().getSelection();
                mergeRec = Ext.Array.merge(mergeRec,supplementaryRec);
            }
            if(inst.openElectives) {
                var openRec = inst.openElectives.grid.getSelectionModel().getSelection();
                if(inst.noOfOpenElectives < openRec.length){
                    msg = "Only "+inst.noOfOpenElectives+" Open Electives are allowed";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
                mergeRec = Ext.Array.merge(mergeRec,openRec);
            }

            if(mergeRec.length == 0) {
                msg = "You have to register for atleast one course";
                Advaya.Gms.Student.handler.alertMessage(msg);
                return;
            }
            
            var jsonData = Advaya.Gms.Student.handler.getGridDataAsJSON(mergeRec);
            inst.instForm.getForm().baseParams = {};
            inst.instForm.getForm().baseParams["jsonData"] = jsonData;
            Advaya.Gms.Student.handler.sendRequest(obj);
        },
        
        getGridDataAsJSON : function (records){
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for( cnt = 0; cnt < records.length; cnt++ ){
                var data = records[cnt].data;
                jsonData += sep+Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            return jsonData;
        },
        
        logoutUrl : function() {
            var inst = Advaya.Gms.Student.instance;
            document.forms["studentLogout"].submit();
        },
        
        profile: function(obj1) {
            Ext.getBody().mask('', 'page-loading', true);
            var obj = {};
            obj.inst=Advaya.Gms.Student.instance;
            obj.responseHandler="setProfileForm";
            if(obj1){
                if(obj1.params.id == "profileBtn"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("profile").removeCls('overOnline');
                    Ext.getCmp("profile").addCls('launchOver');
                }
                if(obj1.params.id == "classRegister"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("classRegistrationAvailable").removeCls('overOnline');
                    Ext.getCmp("classRegistrationAvailable").addCls('launchOver');
                }
                if(obj1.params.id == "mentor"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("mentor").removeCls('overOnline');
                    Ext.getCmp("mentor").addCls('launchOver');
                }
                if(obj1.params.id == "documents"){
                    obj.responseHandler=obj1.params.responseHandler;
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("documentsAvailable").removeCls('overOnline');
                    Ext.getCmp("documentsAvailable").addCls('launchOver');
                }
                if(obj1.params.id == "supplimetryRegister"){
                    obj.responseHandler=obj1.params.responseHandler;
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("suplimentryRegistrationAvailable").removeCls('overOnline');
                    Ext.getCmp("suplimentryRegistrationAvailable").addCls('launchOver');
                }
                if(obj1.params.id == "studentReq"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("student").removeCls('overOnline');
                    Ext.getCmp("student").addCls('launchOver');
                }
                obj.req = obj1.params.req;
            }else{
                obj.req="./gemsonline-student/profile.action?actionType=view";
            }
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        },
        showFields: function(obj){
            var semesterActivity=Ext.getCmp('semesterActivity');
            var timetableData=Ext.getCmp('timetableData');
            var SubDetails=Ext.getCmp('SubDetails');
            var assessmentMarkFld=Ext.getCmp('marksFldSet');
//            var StuAttendnc = Ext.getCmp('attnFldSet');
            if(obj.params.label== "SemesterActivity"){
                semesterActivity.setVisible(true);
                timetableData.setVisible(false);
                SubDetails.setVisible(false);
                assessmentMarkFld.setVisible(false);
//                StuAttendnc.setVisible(false);
                Ext.getCmp("tmeTable").removeCls('studentDashboardBtnActive');
                Ext.getCmp("subjDetails").removeCls('studentDashboardBtnActive');
                Ext.getCmp("assessmentMarks").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("stuAttendance").removeCls('studentDashboardBtnActive');
                Ext.getCmp("semActivity").addCls('studentDashboardBtnActive');
            }else if(obj.params.label =="TimeTable" ){
                semesterActivity.setVisible(false);
                timetableData.setVisible(true);
                SubDetails.setVisible(false);
                assessmentMarkFld.setVisible(false);
//                StuAttendnc.setVisible(false);
                Ext.getCmp("subjDetails").removeCls('studentDashboardBtnActive');
                Ext.getCmp("semActivity").removeCls('studentDashboardBtnActive');
                Ext.getCmp("assessmentMarks").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("stuAttendance").removeCls('studentDashboardBtnActive');
                Ext.getCmp("tmeTable").addCls('studentDashboardBtnActive');
            }else if(obj.params.label=="SubDetails"){
                SubDetails.setVisible(true);
                semesterActivity.setVisible(false);
                timetableData.setVisible(false);
                assessmentMarkFld.setVisible(false);
//                StuAttendnc.setVisible(false);
                Ext.getCmp("tmeTable").removeCls('studentDashboardBtnActive');
                Ext.getCmp("semActivity").removeCls('studentDashboardBtnActive');
                Ext.getCmp("assessmentMarks").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("stuAttendance").removeCls('studentDashboardBtnActive');
                Ext.getCmp("subjDetails").addCls('studentDashboardBtnActive');
            }else if(obj.params.label=="AssessmentMark"){
                assessmentMarkFld.setVisible(true);
                SubDetails.setVisible(false);
                semesterActivity.setVisible(false);
                timetableData.setVisible(false);
//                StuAttendnc.setVisible(false);
                Ext.getCmp("tmeTable").removeCls('studentDashboardBtnActive');
                Ext.getCmp("semActivity").removeCls('studentDashboardBtnActive');
                Ext.getCmp("assessmentMarks").addCls('studentDashboardBtnActive');
//                Ext.getCmp("stuAttendance").removeCls('studentDashboardBtnActive');
                Ext.getCmp("subjDetails").removeCls('studentDashboardBtnActive');
                var obj1 = {};
                obj1.req = obj.params.req;
                obj1.inst=Advaya.Gms.Student.instance;
                obj1.responseHandler="setAssessmentMarkForm";
                Advaya.App.Parent.instance.getConfiguration( obj1, {} );
            }
//            else if(obj.params.label=="Attendance"){
//                SubDetails.setVisible(false);
//                semesterActivity.setVisible(false);
//                timetableData.setVisible(false);
//                StuAttendnc.setVisible(true);
//                Ext.getCmp("tmeTable").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("semActivity").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("subjDetails").removeCls('studentDashboardBtnActive');
//                Ext.getCmp("stuAttendance").addCls('studentDashboardBtnActive');
//            }
        },
        myTimetable: function(obj1) {
            Ext.getBody().mask('', 'page-loading', true);
            var obj = {};
            obj = obj1.params;
            obj.inst=Advaya.Gms.Student.instance;
            obj.responseHandler="setProgressReportForm";
            if(obj1){
                obj.req="./gemsonline-student/myTimetable.action";
            }
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        },
        ttWindow : function(obj1,cstId,type,cstsId) {
            obj1.onclick = function(e){
                topValue = e.clientX+10;  
                leftValue = e.clientY+30;
                Advaya.Gms.Student.handler.setTTWindow(this,e,cstId,type,cstsId);
            }
        },
          setTTWindow: function(obj1,e,cstId,type,cstsId) {
            var inst = Advaya.Gms.Student.instance;
            var req = null;
             if(cstsId != null){
                req = "./gemsonline-student/viewMyClassTtDetails.action?"+"&str="+cstsId+"&type="+type;
            }else{
                req = "./gemsonline-student/viewMyClassTtDetails.action?"+"&ttId="+cstId+"&type="+type;
            }
            var obj = {};
            obj.req = req;
            obj.responseHandler = "setTimeTableInfoWindow";
            obj.inst = inst;
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
            document.body.onclick= Advaya.Gms.Student.handler.hideTimeTableDetails;
            e.stopPropagation();
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        inelegible : function(obj,fldSet) {
            obj.onclick = function (e) {
                var inst = Advaya.Gms.Student.instance;
                var  infoDiv = document.getElementById("MyclassDetails");  
                if(infoDiv){
                     infoDiv.parentNode.removeChild(infoDiv)
                     infoDiv = null;
                }
                infoDiv = document.createElement("div");
                var parentDiv = null;
                var data = null;
                if(fldSet == "r1"){
                    parentDiv = inst.mandatory.grid.el;
                    data = Ext.getCmp("r1IeData").getValue();
                }else if(fldSet == "r2"){
                    parentDiv = inst.elective.grid.el;
                    data = Ext.getCmp("r2IeData").getValue();
                }
                parentDiv.setStyle("overflow", "visible");
                infoDiv.setAttribute("id", "MyclassDetails");
                infoDiv.setAttribute("style", "left:80px;max-height: 200px;overflow-y: auto;word-wrap: break-word;background-color: white;width:77%;height:120px;border:1px black;");
                infoDiv.innerHTML="<b><u>Pre-Requisites Subjects Info: </u></b> <br>Offered Subjects &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pre-Requisites &nbsp;"+data;
                parentDiv.appendChild(infoDiv);
                var dd = new Ext.dd.DD(infoDiv, 'carsDDGroup', {
                    isTarget: false
                });
                e.stopPropagation();
            }
            document.body.onclick= Advaya.Gms.Student.handler.hideTimeTableDetails;
        },
        
        divEventHandler : function(e){
            e.stopPropagation();
        },
        
        hideTimeTableDetails : function(obj) {
            var div = document.getElementById("MyclassDetails");
            if(div != null){
                div.parentNode.removeChild(div)
                if( div.style.display == "block" || div.style.display == ""){
                    div.style.display = "none";
                }
            }
        },
        
        dayHandling : function(field,value,eOpts) {
            var day = value.getDay();
            var dayField = Ext.getCmp("dayField");
        },
        
        updateEmail : function(ele, evt) {
            var inst=Advaya.Gms.Student.instance;
            var form = inst.instructionForm.getForm();
            var obj = ele.params;
            if(form.isValid()){
                form = Advaya.App.Parent.handler.aggregateFormFields(form);
                obj.form = form;
                obj.inst.processRequest(obj);
            }else{
                var msg = "Mandatory Fields are left Empty.";
                Advaya.Gms.Student.handler.alertMessage(msg);
            }
        },
        
        close : function() {
            var inst=Advaya.Gms.Student.instance;
            if(inst.profileForm){
                inst.profileForm.destroy();
                inst.profileForm = null;
            }
            if(inst.profileWindow){
                inst.profileWindow.destroy();
                inst.profileWindow = null;
            }  
            if(inst.instWindow){
                inst.instWindow.destroy();
                inst.instWindow = null;
            } 
            if(inst.documentWindow){
                inst.documentWindow.destroy();
                inst.documentWindow = null;
            }
        },
        
        closeReport : function() {
            var inst=Advaya.Gms.Student.instance;
            if(inst.winForm){
                inst.winForm.destroy();
                inst.winForm = null;
            }
            if(inst.reportWindow){
                inst.reportWindow.destroy();
                inst.reportWindow = null;
            }  
        },
        
        onBackToHome : function() {
            Ext.getBody().mask('', 'page-loading', true);
            var req = './gemsonline-student/profile.action?actionType=view';
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.processResponse];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        onBackToProfile : function() {
            Ext.getBody().mask('', 'page-loading', true);
//            if(Ext.getCmp("feedback")){
//                Ext.getCmp("feedback").setVisible(false);
//            }
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            var req= "./gemsonline-student/profile.action?actionType=view";
            handler["argument"] = [Advaya.Gms.Student.instance.setProfileForm];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
            Advaya.Gms.Student.handler.changeLeftSideButtonCls();
            Ext.getCmp("profile").removeCls('overOnline');
            Ext.getCmp("profile").addCls('launchOver');
        },
        
        getReportDetails : function(action,handler,req) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
            var obj = {
                inst: inst,
                responseHandler: handler,
                req: req
            };
            inst.parent.getConfiguration(obj, {});
        },
        getSelectedPcs : function(obj1) {
            Ext.getBody().mask('', 'page-loading', true);
             var inst = Advaya.Gms.Student.instance;
             var cnt = 0;
             var cunt = 0;
             var jsonData = "";
             var sep = "";
             if (Ext.getCmp('cunt').getValue()) {
                cunt = parseInt(Ext.getCmp('cunt').value);
                if (cunt > 0) {
                    for( cnt = 1; cnt <= cunt; cnt++ ){
                        var data = Ext.getCmp(cnt).value;
                        jsonData += sep+Ext.JSON.encode(data)
                        sep = ",";
                    }
                }
            }
            var reqs= obj1.params.req+"&jsonData="+jsonData;
            var obj = {
                inst:  Advaya.Gms.Student.instance,
                responseHandler:  obj1.params.responseHandler,
                req:  reqs
            };
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        },
        getSelectedReportDetails : function(obj1) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
//            var obj = obj1.params;
            var records;
            records = inst.feesGrid.grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                inst.showErrorMessage();
                return;
            }
            var jsonData = Advaya.Gms.Student.handler.getGridDataAsJSONId(records);
            var reqs= obj1.params.req+"&jsonData="+jsonData
            var obj = {
                inst:  Advaya.Gms.Student.instance,
                responseHandler:  obj1.params.responseHandler,
                req:  reqs
            };
//            var inputEle = document.createElement("input");
//            inputEle.name = 'jsonData';
//            inputEle.value = jsonData;
            
//            obj.form = document.createElement("form");
//            obj.form.appendChild(inputEle);
//            inst.parent.getConfiguration(obj, {});
            Advaya.App.Parent.instance.getConfiguration( obj, {} );
        },
         getGridDataAsJSONId : function (records){
            var cnt = 0;
            var jsonData = "[";
            var sep = "";
            for( cnt = 0; cnt < records.length; cnt++ ){
                var data = records[cnt].data.id;
                jsonData += sep+Ext.JSON.encode(data)
                sep = ",";
            }
            jsonData += "]";
            return jsonData;
        },
        sendHtToMail : function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
            var obj1 = {
                inst: inst,
                responseHandler: obj.params.responseHandler,
                req: obj.params.req,
                action:obj.params.action
            };
            inst.parent.getConfiguration(obj1, {});
        },
        currencyRenderer : function(amount, symbol, format){
            var val = Ext.util.Format.number(amount , format) 
            return symbol + val;
        },
        chechAvailability : function(obj,rec,index,eops){
            var data = rec.data;
            if(data.available1){
                    var message = "Maximum Number of registrations reached for this Subject. Please choose another subject.";
                    Advaya.Gms.Student.handler.alertMessage(message,null);
                    return false;
                }else{
                    return true;
            }
        },
        checkCreditsAvailabel: function (obj, rec, index, eops) {
            var inst = Advaya.Gms.Student.instance;
            var totalCredits = 0;
            var subjects1 = 0;
            var maximumCredits = 0;
            var maximumNoOfSubjects = 0;
            if (obj.selected.length != 0) {
                for (var cnt = 0; cnt < obj.selected.length; cnt++) {
                    totalCredits += obj.selected.items[cnt].data.credits;
                }
                subjects1 = obj.selected.length ;
            }
            if (Ext.getCmp("maximumLimit")) {
                maximumCredits = parseInt(Ext.getCmp("maximumLimit").getValue());
            } else if (Ext.getCmp("maximumSubjCount")) {
                maximumNoOfSubjects = parseInt(Ext.getCmp("maximumSubjCount").getValue());
            }
            if (maximumCredits != 0 && maximumNoOfSubjects != 0) {
                if (totalCredits > maximumCredits) {
                    var msg = "Taken Credits exceeds Maximum Credits";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
                if (subjects1 > maximumNoOfSubjects) {
                    var msg = "Taken Subjects exceeds Maximum Subjects";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            } else if (maximumCredits != 0) {
                if (totalCredits > maximumCredits) {
                    var msg = "Taken Credits exceeds Maximum Credits";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            } else if (maximumNoOfSubjects != 0) {
                if (totalCredits > maximumNoOfSubjects) {
                    var msg = "Taken Credits exceeds Maximum Credits";
                    Advaya.Gms.Student.handler.alertMessage(msg);
                    return;
                }
            }
        },
        exportData:function(req){
            var src = req;
//             Advaya.Gms.Student.handler.sendIFrameRequest( src );
             Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
            var iframeName = "iframe_file_download";
            var frameObj = document.getElementById(iframeName) ? document.getElementById(iframeName) : document.createElement("iframe");
            frameObj.style.display = 'none';
            frameObj.setAttribute("id", iframeName);
            if(Ext.isChrome || Ext.isWebKit) {
                frameObj.onload = setTimeout(Advaya.Gms.Student.handler.processIFrameResponse, 2000);
            }else {
                frameObj.onload = Advaya.Gms.Student.handler.processIFrameResponse; 
            }
            frameObj.src=src;
            var container = document.getElementById("dynacontent");
            container.appendChild(frameObj);
        },
        
        randomString: function ( ) {
            var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var length = 32;
            var result = '';
            for (var i = length; i > 0; --i)
                result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
    }

    YAHOO.extend( Student, Parent, {
        toolbar :null,
        instForm :null,
        instTop :null,
        instBottom :null,
        table :null,
        grid:null,
        attGrid:null,
        formGrid :null,
        selId : null,
        expimp : null,
        voidSemesters : {},
        isAuthenticated : false,
        enrolledSubjects : 0,
        profileForm: null,
        profileWindow: null,
        notificationWindow: null,
        notificationForm: null,
        subjWin:null,
        subjForm:null,
        subjTabel:null,
        suppliGrid:null,
        
        init: function( ) {
            Advaya.Gms.Student.instance = this;
            Advaya.Gms.Student.instance.parent = Advaya.App.Parent.instance;
            Advaya.App.Parent.instance.currentInst = this;
            new Advaya.Gms.StudentFeedBack();
        },
         sendYuiReq: function(inst, obj) {
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.App.Parent.handler.processResponse, inst, obj.responseHandler, obj];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", obj.req, handler, obj.form, false);
        },
        
        loadStudentsForm: function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var inst = Advaya.Gms.Student.instance;
            inst.getConfiguration(obj, {});
        },
        
        getLeftSidebar : function() {
            Ext.getBody().mask('', 'page-loading', true);
            var req = "./gemsonline-student/getLeftSideBar.action?";
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.setLeftSideBar];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        getDisclaimer : function() {
            Advaya.Gms.Student.handler.changeLeftSideButtonCls();
            Ext.getCmp("result").removeCls('overOnline');
            Ext.getCmp("result").addCls('launchOver');
            Ext.getBody().mask('', 'page-loading', true);
            var req = "./gemsonline-student/checkBlocked.action?";
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.processDisclaimer];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        getStudLatestResults : function() {
            Ext.getBody().mask('', 'page-loading', true);
            var req = "./gemsonline-student/getLatestSem.action?";
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.processResponse];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        getStudentResults : function() {
            Advaya.Gms.Student.handler.changeLeftSideButtonCls();
            Ext.getCmp("consollidatedView").removeCls('overOnline');
            Ext.getCmp("consollidatedView").addCls('launchOver');
            Ext.getBody().mask('', 'page-loading', true);
            //            var req = "./student/exec.action?actionType=scv&keyString=consolidate"
            var req = "./gemsonline-student/getConsolidatedView.action?";
            var handler = Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.Gms.Student.handler.processAllResponse];
            Advaya.ConnectionHandler.handler.asyncRequest("GET", req, handler, null, false);
        },
        
        loadProfileWindow : function(obj) {
            Ext.getBody().mask('', 'page-loading', true);
            var reqParams = {};
            Advaya.App.Parent.instance.getConfiguration( obj, reqParams );
        },
         activeTabRequest : function(comp){
            var req = "./student/"+comp.id+".action?usn="+comp.usn+"&actionType="+comp.actionType;
            var obj ={};
            var inst = Advaya.Gms.StudentProfile.instance;
            obj = {
                params :{
                    inst : inst ,
                    action : "loadForm" ,
                    responseHandler : "setTab",
                    req : req
                }
            }
            Advaya.App.Parent.instance.processForm(obj) 
            Advaya.App.Initiator.handler.showLoadMask();
        },
        setapproverList : function(content,inst,obj) {
            var activeTab = obj.type;
            inst = Advaya.Gms.Student.instance;
            inst.destroy();
            inst.destroyContent();
            if(inst.feeWindow){
            inst.feeWindow.destroy();
            }
            Advaya.App.Parent.instance.prnt_reqParams = null;
        
            inst.updateWindowTitle(content.formHeader);
            inst.updateHeader(content.title);
            if(content.message){
                Ext.MessageBox.show({
                    title : 'Info',
                    msg : content.message,
                    buttons : Ext.MessageBox.OK ,
                    fn : function(buttonId) {switch(buttonId) {case 'ok':break;}}
                });
            }
            inst.tab = new Ext.tab.Panel(content.tabData);
            
            var toApprovedData = content.toBeApprovedData;
            var toBeApproved = Ext.getCmp("toBeApproved");
            var pluginsParams = {};
            if(content.toBeApprovedData.pluginsParam) {
                for(var key in content.toBeApprovedData.pluginsParam) {
                    pluginsParams[key] = content.toBeApprovedData.pluginsParam[key];
                }
            }
            
            if (toApprovedData.toolbarData) {
                var frToolbar = {
                    xtype : "toolbar",
                    items : toApprovedData.toolbarData
                };
                toBeApproved.add(frToolbar);
                
            }
            var frGrid = new Advaya.App.Grid(toApprovedData.tableData, inst, pluginsParams);
            toBeApproved.add(frGrid.grid);
            inst.feeGrid = frGrid;
            
            var approvedRuleData = content.approvedData;
            var approved = Ext.getCmp("approved");
            
            approved.on("afterrender",function(){
                var srGrid = new Advaya.App.Grid(approvedRuleData.tableData, inst, {});
                approved.add(srGrid.grid);
            });
            inst.tab.setActiveTab(activeTab);
        },
        setStudentData : function(content,inst) {
        Ext.getBody().unmask();
        Advaya.App.Parent.instance.prnt_reqParams = null;
        inst = Advaya.Gms.Student.instance;
        inst.destroy();
        inst.destroyContent();
        Advaya.Gms.Student.handler.changeLeftSideButtonCls();
        if (content.toolbarData) {
            inst.feesToolbar = new Advaya.App.Menubar(content.toolbarData, "dynacontent", inst);
        }
        if (content.formData) {
            inst.feesForm =new Ext.form.Panel(content.formData);
        }
            
        if (content.tableData) {
            var pluginsParams = {};
            if(content.pluginsParam) {
                for(var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            inst.feesGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            if(content.groupField)
            {
                inst.feesGrid.grid.store.group(content.groupField);
                inst.feesGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                inst.feesGrid.grid.features[0].startCollapsed = false;
            }
        }
        if (content.tableDatas) {
            var pluginsParams = {};
            inst.feesGrids = new Advaya.App.Grid(content.tableDatas, inst, pluginsParams);
        }
        if (Ext.getCmp("reportField")) {
            Ext.getCmp("reportField").add(inst.feesGrid.grid);
        }
        if(Ext.getCmp("fees")){
            Ext.getCmp("fees").removeCls('overOnline');
            Ext.getCmp("fees").addCls('launchOver');
        }
    },
        
        redirectResponse: function (response, inst) {
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            var url = content.url
            var htmlResponse = content.htmlResponse;
            var f = document.createElement('form');
            f.action = url;
            f.method = 'POST';
            f.id = "tnpform";
            f.name = "tnpform";
            for (cnt = 0; cnt < content.objParams.length; cnt++) {
                var i = document.createElement('input');
                i.type = 'hidden';
                i.name = content.objParams[cnt].key;
                i.value = content.objParams[cnt].value;
                f.appendChild(i);
                console.log(i.name)
                console.log(i.value)
            }
            console.log(f)
            var rs1 = Advaya.Gms.Student.handler.randomString();
            var rs2 = Advaya.Gms.Student.handler.randomString();
//            document.cookie = "GMS=" + rs2 + "; SameSite=Lax";
//            document.cookie = "GMS-TKN=" + rs1 + "; SameSite=None; Secure";
            document.body.appendChild(f);
            f.submit();
        },
    
        setFeesWindow: function(response, inst) {
        Ext.getBody().unmask();
        inst = Advaya.Gms.Student.instance;
        var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
        if(inst.profileForm){
            inst.profileForm.destroy();
            inst.profileForm = null;
        }
        if(inst.profileWindow){
            inst.profileWindow.destroy();
            inst.profileWindow = null;
        }
        inst.profileWindow = new Ext.window.Window(content.windowData);
        inst.profileForm = new Ext.form.Panel(content.formData);
        if (content.tableData) {
            var pluginsParams = {};
            if(content.pluginsParam) {
                for(var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            inst.winGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            if (content.groupField)
            {
                inst.winGrid.grid.store.group(content.groupField);
                inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                inst.winGrid.grid.features[0].startCollapsed = false;
            }
            if (Ext.getCmp("reportField")) {
                Ext.getCmp("reportField").insert(0, inst.winGrid.grid);
            }else{
                inst.profileForm.add(inst.winGrid.grid);
            }
        }
       if (content.feeTableData) {
            var pluginsParams = {};
            if(content.pluginsParam) {
                for(var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            inst.winGrid = new Advaya.App.Grid(content.feeTableData, inst, pluginsParams);
            if (content.groupField)
            {
                inst.winGrid.grid.store.group(content.groupField);
                inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                inst.winGrid.grid.features[0].startCollapsed = false;
            }
            if (Ext.getCmp("feesGridFieldSet")) {
                Ext.getCmp("feesGridFieldSet").insert(0, inst.winGrid.grid);
            }else{
                inst.profileForm.add(inst.winGrid.grid);
            }
        }
        inst.profileWindow.add(inst.profileForm);
        inst.profileWindow.show();
    },
    
    setWindow:function(response,inst){
        inst = Advaya.Gms.Student.instance;
        var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
        if(inst.documentWindow){
            inst.documentWindow.destroy();
            inst.documentWindow = null;
        }
        if(inst.documentWindowForm){
            inst.documentWindowForm.destroy();
            inst.documentWindowForm = null;
        }
        if(content.windowPanel){
            inst.documentWindow = new Ext.window.Window(content.windowPanel);
        }
        if(content.formPanel){
            inst.documentWindowForm = new Ext.form.Panel(content.formPanel);
            var formFields = inst.documentWindowForm.form.getFields().items;
            inst.setStar(formFields);
            inst.documentWindow.add(inst.documentWindowForm);
        } 
        if(content.saved){
            Ext.MessageBox.show({
                title : 'Info',
                msg : 'Saved Sucessfully !',
                buttons : Ext.MessageBox.OK ,
                fn : function(buttonId) {
                    switch(buttonId) {
                        case 'ok':
                            break;
                    }
                }
            });
        }
        if(content.message){
            Ext.MessageBox.show({
                title : 'Info',
                msg : content.message,
                buttons : Ext.MessageBox.OK ,
                fn : function(buttonId) {
                    switch(buttonId) {
                        case 'ok':
                            break;
                    }
                }
            });
        }
         if(content.toolbarData){
            if(inst.feesToolbar){
                inst.feesToolbar.destroy();
            }
            if(inst.profileWindow) {
                inst.profileWindow.destroy();
            }
            inst.profileWindow = new Advaya.App.Menubar(content.toolbarData,"dynacontent", inst);
        }
        if( content.tableData ) {
            if(inst.feesGrid){
                inst.feesGrid.destroy();
            }
            if(inst.profileForm) {
                inst.profileForm.destroy();
            }
            inst.profileForm = new Advaya.App.Grid(content.tableData,"dynacontent", inst);
        }
       
        inst.documentWindow.show();
    }, 
    
    setFeeWinBYSelected   : function(response, inst){
            Ext.getBody().unmask();
            inst = Advaya.Gms.Student.instance;
            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
           if (Ext.getCmp("reportField")) {
               Ext.getCmp("reportField").removeAll();
           }
            if (content.tableData) {
                var pluginsParams = {};
                if(content.pluginsParam) {
                    for(var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.winGrid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
                if (content.groupField)
                {
                    inst.winGrid.grid.store.group(content.groupField);
                    inst.winGrid.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                    inst.winGrid.grid.features[0].startCollapsed = true;
                }
                if (Ext.getCmp("reportField")) {
                    Ext.getCmp("reportField").insert(0, inst.winGrid.grid);
                }else{
                    inst.profileForm.add(inst.winGrid.grid);
                }
            }
            inst.profileWindow.add(inst.profileForm);
            inst.profileWindow.show();
            
        },
        setProfileWindow : function ( response, inst ){
            Ext.getBody().unmask();
            Advaya.App.Parent.instance.prnt_reqParams = null;
            
            inst = Advaya.Gms.Student.instance;
            
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            if(inst.profileForm){
                inst.profileForm.destroy();
                inst.profileForm = null;
            }
            if(inst.profileWindow){
                inst.profileWindow.destroy();
                inst.profileWindow = null;
            }
            inst.profileWindow = new Ext.window.Window( content.windowPanel );
            
            inst.instructionForm = new Ext.form.Panel(content.formPanel);
            
            inst.profileWindow.add(inst.instructionForm);
            
            inst.profileWindow.show();
        },
        
        setProfileForm : function ( response, inst ){
            Ext.getBody().unmask();
            Advaya.App.Parent.instance.prnt_reqParams = null;
            var oldInst = inst;
            
            inst = Advaya.Gms.Student.instance;
            inst.destroyEle();
            
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            
            inst.instPanel = new Ext.form.Panel(content.formPanel);
            if (content.formData) {
                inst.instForm = new Ext.form.Panel(content.formData);
                if (Ext.getCmp("supplementaryField")) {
                    if (content.formData.dockedItems) {
                        inst.tbar = new Ext.toolbar.Toolbar(content.formData.dockedItems);
                    }
                }
            }
            if(content.tableData){
                var pluginsParams = {};
                if(content.pluginsParam) {
                    for(var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.grid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
                var stuFldSet = Ext.getCmp("timetableData");
                if(Ext.getCmp("gridFieldSet1")){
                    Ext.getCmp("gridFieldSet1").add(inst.grid.grid);
                } else if(Ext.getCmp("supplementaryField")) {
                    Ext.getCmp("supplementaryField").add(inst.grid.grid);
                }else if (stuFldSet){
                    stuFldSet.removeAll();
                    stuFldSet.add(inst.grid.grid)
                }else{
                    inst.instPanel.add(inst.grid.grid);
                }
            }
            if(content.attendanceTable){
                if(inst.attGrid){
                    inst.attGrid.destroy();
                }
                inst.attGrid = new Advaya.App.Grid(content.attendanceTable, inst);
                var attnFldSet = Ext.getCmp("attnFldSet");
                if(attnFldSet){
                    attnFldSet.removeAll();
                    attnFldSet.add(inst.attGrid.grid);
                }else{
                    inst.instPanel.add(inst.attGrid.grid);
                }
                
            }
            if(content.docTable){
                if(inst.attGrid){
                    inst.attGrid.destroy();
                }
                inst.attGrid = new Advaya.App.Grid(content.docTable, inst);
                var docFldSet = Ext.getCmp("docFldSet");
                if(docFldSet){
                    docFldSet.removeAll();
                    docFldSet.add(inst.attGrid.grid);
                }else{
                    inst.instPanel.add(inst.attGrid.grid);
                }
                
            }
            if(content.formPanel){
                if(content.formPanel.tab == "progress"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("progressReport").removeCls('overOnline');
                    Ext.getCmp("progressReport").addCls('launchOver');
                }
            }
            if( content.toolbarDetails) {
                inst.tbar = new Ext.toolbar.Toolbar(content.toolbarDetails);
            } 
            if(oldInst && oldInst.req) {
                if(oldInst.id == "profileBtn"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("profile").removeCls('overOnline');
                    Ext.getCmp("profile").addCls('launchOver');
                }
                var obj = {};
                obj.params = {};
                obj.params.req = "./gemsonline-student/ea.action?batch.id=" +oldInst.batchId;
                Advaya.Gms.Student.handler.sendIFrameRequest(obj);
                return;
            }
            
        },
        
        setSupplimentryWindow: function (response, inst) {
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Student.instance;
            inst.destroyEle();

            var content = (typeof response == "object") ? response : eval("(" + response.replace(/[\n\r\t]/g, "") + ")");
            if (content.message) {
                Advaya.Gms.Student.handler.alertFBYesNo(content.message, content.URL);
            }
            inst.instPanel = new Ext.form.Panel(content.formPanel);
            if (content.formData) {
                inst.instForm = new Ext.form.Panel(content.formData);
            }
            if (content.tables) {
                for (var semTable in content.tables) {
                    var heading = "";
                    var tabData = content.tables[semTable];
                    if (tabData.records[0].displaySemester) {
                        var heading = tabData.records[0].displaySemester + " Semester( " + tabData.records[0].displayMonth + " - " + tabData.records[0].displayYear + " )";
                    }
                    var pluginsParams = {};
                    var addPluginForTable = tabData.records[0].isActiveRegistration;
                    if (addPluginForTable) {
                        if (content.pluginsParam) {
                            for (var key in content.pluginsParam) {
                                pluginsParams[key] = content.pluginsParam[key];
                            }
                        }
                    }
                    inst.grid = new Advaya.App.Grid(tabData, inst, pluginsParams);
                    if(heading != ""){
                        inst.grid.grid.setTitle(heading);
                    } else {
                        inst.grid.grid.setTitle("Summer Subjects");
                    }
                    for (var cnt = 0; cnt < tabData.records.length; cnt++) {
                        var index = inst.grid.grid.store.find("id", tabData.records[cnt].id);
                        if (tabData.records[cnt].checked) {
                            credits = tabData.records[cnt].credits;
                            inst.grid.grid.getSelectionModel().select(index, true);
                        }
                    }
                    if (Ext.getCmp("supplementaryField")) {
                        Ext.getCmp("supplementaryField").add(inst.grid.grid);
                    }
                }
            }
            Ext.getBody().unmask();
        },
        
       setTimeTableInfoWindow: function(responseText) {
            var inst = Advaya.Gms.Student.instance;
            var data = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            var oldDiv = document.getElementById("MyclassDetails");
            if(oldDiv != null) {
                oldDiv.parentNode.removeChild(oldDiv)
                oldDiv = null;
            }
            if(oldDiv == null) {
                var searchDiv = document.createElement("div");
                var parentDiv = null;
                parentDiv = inst.grid.grid.el;                                                                                              
                parentDiv.setStyle("overflow","visible");
                searchDiv.setAttribute("id", "MyclassDetails");
                parentDiv.appendChild(searchDiv);
                
                if(data.formData){  
                    if(inst.feesForm){
                        inst.feesForm.destroy();
                    }
                    inst.feesForm = new Ext.form.Panel(data.formData)
                }
                inst.feesForm.body.dom.style.width = '100%';
                inst.feesForm.body.dom.style.height = '100%';
                var dd = new Ext.dd.DD(searchDiv, 'carsDDGroup', {
                    isTarget  : false
                });
                searchDiv.onclick = Advaya.Gms.Student.handler.divEventHandler;
            //                searchDiv.style.top = topValue+"px";
            //                searchDiv.style.left = leftValue+"px";
            }
        },
        setProgressReportForm : function ( response, inst ) {
            var oldInst = inst;
            if(Ext.getCmp("reportFieldSet") != undefined){
                Advaya.App.Initiator.handler.hideLoadMask();
            }
            Advaya.App.Parent.instance.prnt_reqParams = null;
            inst = Advaya.Gms.Student.instance;
            Advaya.App.Parent.instance.destroyContent();
            inst.destroy();
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            
            if(content.formHeader) {
                inst.updateWindowTitle(content.formHeader);
                inst.updateHeader(content.title);
            }
            
            if( content.formPanel ) {
                inst.instPanel = new Ext.FormPanel( content.formPanel );
                if(content.formPanel.tab == "progress"){
                    Advaya.Gms.Student.handler.changeLeftSideButtonCls();
                    Ext.getCmp("progressReport").removeCls('overOnline');
                    Ext.getCmp("progressReport").addCls('launchOver');
                }
            }
            
            if(content.tableData) {
                var pluginsParams = {};
                if(content.pluginsParam) {
                    for(var key in content.pluginsParam) {
                        pluginsParams[key] = content.pluginsParam[key];
                    }
                }
                inst.grid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            }
             
            if(Ext.getCmp("reportFieldSet")){
                
                Ext.getCmp("reportFieldSet").add(inst.grid.grid);
                if(Ext.getCmp("overAllFldSt")){
                    Ext.getCmp("overAllFldSt").body.dom.style.height = "100%";
                }
                Advaya.App.Initiator.handler.hideLoadMask();
            }
            if(content.enableButton){
                Ext.getCmp(content.enableButton).removeCls("paginationBtn");
                Ext.getCmp(content.enableButton).addCls("paginationClickedBtn");
            }
           
            if(Ext.getCmp("toolbarFldSet")){
                Ext.getCmp("toolbarFldSet").body.dom.style.height = "100%";
                Ext.getCmp("buttonBarFldSet").body.dom.style.height = "100%";
            }
        //            Ext.getCmp("reportFieldSet").body.dom.style.height = "100%";
        },
        
        setReportWindow : function( responseText , inst, obj) {
            Advaya.Gms.Student.handler.changeLeftSideButtonCls();
            Ext.getCmp("progressReport").removeCls('overOnline');
            Ext.getCmp("progressReport").addCls('launchOver');
            Ext.getBody().unmask();
            
            Advaya.App.Parent.instance.prnt_reqParams = null;
            
            inst = Advaya.Gms.Student.instance;
            
            var data = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            
            if(inst.reportWindow) {
                inst.reportWindow.destroy();
            }
            
            if(inst.winForm) {
                inst.winForm.destroy();
                inst.winForm = null;
            }
            inst.reportWindow = new Ext.window.Window(data.windowPanel);
            
            inst.winForm = new Ext.form.Panel( data.formPanel );
            
            var formFields =inst.winForm.form.getFields().items;
            
            inst.setStar(formFields);
            
            if(data.tableData){
                var pluginsParams = {};
                if(data.pluginsParam) {
                    for(var key in data.pluginsParam) {
                        pluginsParams[key] = data.pluginsParam[key];
                    }
                }
                inst.winGrid = new Advaya.App.Grid(data.tableData, inst, pluginsParams);
                if(Ext.getCmp("gridFieldSet1")){
                    Ext.getCmp("gridFieldSet1").add(inst.winGrid.grid);
                }else{
                    inst.winForm.add(inst.winGrid.grid);
                }
                
            }
            inst.reportWindow.add(inst.winForm);
            inst.reportWindow.show();
            
        },
        
        setStar : function(formFields){
            for( var i=0; i<formFields.length; i++){
                if (formFields[i].allowBlank == false && formFields[i].labelEl) {
                    formFields[i].labelEl.dom.innerHTML += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
                } 
            }
        },
        
        alertMessage : function(data) {
            Ext.getBody().unmask();
            Advaya.Gms.Student.handler.close();
            Ext.MessageBox.show({
                title : "Info",
                msg :data.message,
                buttons : Ext.MessageBox.OK
            });
        },
        
        updatEMailAlertMessage : function(data) {
            Ext.getBody().unmask();
            Advaya.Gms.Student.handler.close();
            var obj = {};
            obj.params = data.params;
            Advaya.Gms.Student.handler.profile(obj);
            var obj ={};
            Ext.MessageBox.show({
                title : "Info",
                msg :data.message,
                buttons : Ext.MessageBox.OK,
                fn:function(buttonId) {
                    switch(buttonId) {
                        case 'ok':
                            break;
                    }
                }
            });
               
        },
        
        showAttempts : function(comp) {
            comp.onclick = function(e){
                if(Ext.getCmp("noOfAttempts-form").isVisible()) {
                    Ext.getCmp("noOfAttempts-form").hide();
                }else {
                    Ext.getCmp("noOfAttempts-form").show();
                }
                e.stopPropagation();
            }
        },
        
        hideAttempts : function(comp) {
            Ext.getCmp("noOfAttempts-form").hide();
        },
        
        showSubjectAttempts : function(comp) {
            comp.onclick = function(e) {
                var inst = Advaya.Gms.Student.instance;
                if(inst.subjectAttempts.isVisible()){
                    inst.subjectAttempts.hide();
                }else{
                    var offsetX = e.clientX ;
                    var offsetY = e.clientY;
                    inst.subjectAttempts.removeAll();
                    var values = comp.attributes[1].textContent.split("*")
                    for(var i = 0 ;i < values.length ; i++) {
                        var text = values[i].split("-");
                        var label = "";
                        var value = "";
                        if(text[0]) {
                            label = (i+1)+". "+text[0];
                        }
                        var color = "red";
                        if(text[1] && Ext.Array.indexOf(["A","B","C","D","E","Pass"],text[1].toUpperCase()) != -1) {
                            color = "green";
                        }
                        if(text[1]){
                            value = "<span style='font-weight:bold;color:"+color+"'>"+text[1]+"</span>";
                        }
                            
                        inst.subjectAttempts.add({
                            xtype:'displayfield',
                            labelStyle:"background:none",
                            labelWidth:100,
                            fieldLabel : label,
                            value: value
                        });
                    }
                
                    inst.subjectAttempts.el.dom.style.top = offsetY+"px";
                    inst.subjectAttempts.el.dom.style.left = 25+offsetX+"px";
                
                    inst.subjectAttempts.show();
                }
                e.stopPropagation();
            }
        },
        setNotificationWindow:function(responseText){
            Ext.getBody().unmask();
            var inst = Advaya.Gms.Student.instance;
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            if(content.hasMessage == false){
                return;
            }
            if(inst.formPanel){
                if(inst.notificationForm){
                    inst.notificationForm.destroy();
                    inst.notificationForm = null;
                }
            }
            inst.notificationForm = new Ext.form.Panel( content.formPanel);
            if(inst.windowPanel){
                if(inst.notificationWindow){
                    inst.notificationWindow.destroy();
                    inst.notificationWindow = null;
                }
            }
            inst.notificationWindow = new Ext.window.Window(content.windowPanel);
            inst.notificationWindow.add(inst.notificationForm);
            inst.notificationWindow.show();
        },
        setAssessmentMarkForm:function(responseText , inst, obj){
            var data = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            var markFldSet=Ext.getCmp("marksFldSet");
            markFldSet.removeAll();
            markFldSet.add(data);
        },
        destroyEle : function() {
            var ctnt = document.getElementById("dynacontent");
            while(ctnt.hasChildNodes()) {
                ctnt.removeChild(ctnt.firstChild);
            }
            Ext.getBody().unmask();
        },
         htAlert : function(response) {
            Ext.getBody().unmask();
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
              Ext.MessageBox.show({
                title : content.title,
                msg :content.message,
                buttons : Ext.MessageBox.OK 
            });
        },
        studentSpecSubjects:function(responseText , inst, obj){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Student.instance;
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            if(inst.subjWin) {
                inst.subjWin.destroy();
            }
            if(inst.subjForm) {
                inst.subjForm.destroy();
                inst.subjForm = null;
            }
            inst.subjWin = new Ext.window.Window(content.windowPanel);
            inst.subjForm = new Ext.form.Panel( content.formPanel );
            inst.subjWin.add(inst.subjForm);
            inst.subjWin.show();
            
        },
        setSpecSubjs:function(responseText , inst, obj){
            Advaya.App.Initiator.handler.hideLoadMask();
            inst = Advaya.Gms.Student.instance;
            var content = ( typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            var pluginsParams = {};
            if(content.pluginsParam) {
                for(var key in content.pluginsParam) {
                    pluginsParams[key] = content.pluginsParam[key];
                }
            }
            if(content.maxSpecLimit){
                inst.maxSpecLimit=content.maxSpecLimit;
            }
            if(content.tableData){
                if(inst.subjTabel){
                    inst.subjTabel.destroy();
                }
                inst.subjTabel = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
                if(content.selectedRecords && content.selectedRecords.records){
                    var selectedRecords = content.selectedRecords.records;
                    for(var key1 in selectedRecords){
                        var id = selectedRecords[key1];
                        var record = inst.subjTabel.grid.store.findRecord( "id" , id );
                        if(record){
                            inst.subjTabel.grid.getSelectionModel().select(record,true,true);
                        }
                    }
                }
                if(content.groupField) {
                        inst.subjTabel.grid.store.group(content.groupField);
                        inst.subjTabel.grid.features[0].groupHeaderTpl = content.groupHeaderTpl;
                        inst.subjTabel.grid.features[0].startCollapsed = false
                    }
                      var params = {
                        gName : "subjTabel"
                    };
                     inst["subjTabel"].grid.on("selectionchange",Advaya.Gms.Student.instance.updateSpecCredits,{},params);
            }
            var dataFld = Ext.getCmp("stuSpecSubjFldSet");
             if(dataFld.items.length > 0){
                dataFld.removeAll();
            }
            if(content.displayData){
                dataFld.add(content.displayData);
            }
            if(content.buttonData){
                dataFld.add(content.buttonData);
            }
            dataFld.add(inst.subjTabel.grid);
             if(content.message){
                Advaya.App.Initiator.handler.hideLoadMask();
                var obj1={};
                obj1.title="Info";
                obj1.message=content.message;
                Advaya.Gms.Message.handler.show(obj1);
            }
        },
        closeSpecSubjWin:function(){
            var inst = Advaya.Gms.Student.instance; 
           if(inst.subjWin) {
                inst.subjWin.destroy();
                inst.subjWin = null;
            }
            if(inst.subjForm) {
                inst.subjForm.destroy();
                inst.subjForm = null;
            }  
        },
        updateSpecCredits : function(panel, recs,gridName) {
            var inst = Advaya.Gms.Student.instance;
            var ele = document.getElementById("takenSpecCrdts");
            var crValue = Ext.Number.from(ele.innerHTML,0);
            var newValue = crValue - inst[gridName.gName].selected;
            var gValue = 0;
            for(var i=0;i<recs.length;i++){
                gValue = gValue + recs[i].data.credits;
                newValue = newValue + recs[i].data.credits;
            }
            Advaya.Gms.Student.instance.setTakenSpecSubj(gValue,inst.maxSpecLimit,ele);
            inst[gridName.gName].selected = gValue
        },
        setTakenSpecSubj : function(newValue,maximumLimit,ele){
            ele = document.getElementById("takenSpecCrdts");
            ele.innerHTML = newValue;
            if(newValue > maximumLimit){
                ele.style.color = "red";
                ele.style.textDecoration = "blink";
            } else {
                ele.style.color = "green";
                ele.style.textDecoration = "none";
            }
        },
        
         submitForm : function( obj ) {
            var inst = Advaya.Gms.Student.instance;
            var xForm = null;
            var reqParams = {};
            if(obj.form) {
                if(inst.profileForm) {
                    xForm = inst.profileForm.getForm();
                    if(xForm.isValid()){
                        obj.form = Advaya.App.Parent.handler.aggregateFormFields1(xForm);
                        Advaya.App.Parent.instance.getConfiguration( obj, reqParams );
                        Advaya.App.Initiator.handler.showLoadMask();
                    }
                }
            }
        },
        
        loadStudentForm: function(obj) {
            Advaya.App.Initiator.handler.showLoadMask();
            var inst = Advaya.Gms.Student.instance;
            var reqParams = {};
            if (obj.form) {
                    if(!inst.documentWindowForm.getForm().isValid()){
                        var message = "Mandatory fields are left empty";
                        Advaya.Gms.Message.handler.show({
                            message: message
                        });
                        return;
                    }
                obj.form = Advaya.App.Parent.handler.aggregateFormFields1(inst.documentWindowForm.getForm());
            }
            if (obj.grid && !Advaya.App.Parent.instance.prnt_reqParams) {
                inst.showErrorMessage();
                return;
            }
            inst.parent.getConfiguration(obj, reqParams);
            obj = null;
        },
        
        destroy : function( ) {
            
            var inst = Advaya.Gms.Student.instance; 
            if(inst.reportWindow) {
                inst.reportWindow.destroy();
                inst.reportWindow = null;
            }
            if(inst.instPanel) {
                inst.instPanel.destroy();
                inst.instPanel = null;
            }
            if(inst.profileWindow) {
                inst.profileWindow.destroy();
                inst.instWprofileWindowindow = null;
            }
            if(inst.instForm) {
                inst.instForm.destroy();
                inst.instForm = null;
            }
            if(inst.profileForm) {
                inst.profileForm.destroy();
                inst.profileForm = null;
            }
            if(inst.grid) {
                inst.grid.destroy();
                inst.grid = null;
            }
            if(inst.backlog) {
                inst.backlog.destroy();
                inst.backlog = null;
            }
            if(inst.feesGrid) {
                inst.feesGrid.destroy();
                inst.feesGrid = null;
            }
            if(inst.feesForm) {
                inst.feesForm.destroy();
                inst.feesForm = null;
            }
            if(inst.instPanel) {
                inst.instPanel.destroy();
            }
            if(inst.profileWindow) {
                inst.profileWindow.destroy();
            }
        }       
    });

}());

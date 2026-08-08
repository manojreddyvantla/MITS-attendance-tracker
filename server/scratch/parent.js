
Advaya.register( "Advaya.App.Parent" );

(function() {

    Advaya.App.Parent = function( cfg, container, parent ) {
        this.init( cfg, container, parent );
    }

    Parent = Advaya.App.Parent;
    Parent.instance = null;
    
    Advaya.App.Parent.handler = {
        processResponse : function( responseText, inst, responseHandler, obj ) {
            Advaya.App.Initiator.handler.hideLoadMask();
            if( responseText == null || responseText == "" ) {
                return;
            }
            var content = (typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
            if(content.type == "message") {
                Advaya.Gms.Message.handler.show(content);
            }else if(content.type == "redirect"){
                window.location=content.url;
                return;
            }else {
                inst[responseHandler]( content , inst, obj);
            }	
        },
        
        
        showPasswordMsgDiv:function(field) {
            
            var strength = 30;
            Ext.apply(Ext.form.VTypes, {
                strength: function(val, field) {
                    if(field.score > 0){
                        return true;
                    }
                    return false;
                },
                strengthText: "Password is not strong enough"
            });
            
            var fieldEle = Ext.get(field.id).dom.childNodes[1];
            var msgDiv = document.getElementById("tipMsg");
            if(msgDiv == null) {
                msgDiv = document.createElement("div");
                msgDiv.id = "tipMsg";
                fieldEle.appendChild(msgDiv);
                new Ext.form.Panel({
                    renderTo : 'tipMsg',
                    width:300,
                    items : [
                    {
                        xtype:'displayfield',
                        value:'<b>Password Instructions: </b><br>'
                    },        
                    {
                        html:'<hr id="psLine">'
                    },        
                    {
                        xtype:'displayfield',
                        value:'<ol>'+
                    '<li style="list-style:inside;color:#444">Password should have minimum 8 characters.</li>'+
                    '<li style="list-style:inside;color:#444">Password should have alphanumeric characters.</li></ol>'+
                    '<li style="list-style:inside;color:#444">Password should have atleast 1 special character.</li></ol>'
                    },       
                    {
                        xtype:'displayfield',
                        value:'<b>Password strength : </b>',
                        style:{
                            'float':'left'
                        }
                    },        
                    {
                        xtype:'displayfield',
                        id:'psDiv',
                        style:{
                            'float':'left'
                        }
                    }        
                    ]
                })
                
                msgDiv.setAttribute("style","margin-top:-10px;margin-left:160px;padding:10px;position:fixed;background-color:white;border:1px solid lightgray;z-index:99999;border-radius:6px;");
                
            }else{
                msgDiv.style.display = "block";
            }
        },
        
        hidePasswordMsgDiv : function(field) {
            var msg = document.getElementById("tipMsg");
            if(msg != null) {
                msg.style.display = "none";
            }
        },
        
        aggregateFormFields : function( xform ) {
            var formFields =xform.getFields().items;
            var form = document.createElement("form");
            for( var i=0; i<formFields.length; i++){
                if(formFields[i].submitValue && formFields[i].value){
                    var inputEle = document.createElement("input");
                    inputEle.name = formFields[i].name;
                    if(formFields[i].inputType == "radio"){
                        inputEle.value = formFields[i].boxLabel;
                    }else {
                        inputEle.value = formFields[i].value;
                    }
                    form.appendChild(inputEle);
                }
            }
            return form;
        },
        
        aggregateFormFields1 : function( xform ) {
            var formFields =xform.getValues();
            var form = document.createElement("form");
            for( var key in formFields){
                var inputEle = document.createElement("input");
                inputEle.name = key;
                inputEle.value = formFields[key];
                form.appendChild(inputEle);
            }
            return form;
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
                if(data.message){
                    obj1.message = data.message;
                    Advaya.Gms.Message.handler.show(obj1);
                }else{
                    data.inst[data.responseHandler](data);
                }
            }
            Advaya.App.Initiator.handler.hideLoadMask();
            var iFrameBody = iFrame.contentDocument.body;
            while(iFrameBody.hasChildNodes()) {
                iFrameBody.removeChild(iFrameBody.firstChild);
            }
        },
        
        makeAjaxRequest: function(){
            var obj = {};
            obj.req = "CounsellingServlet.srl?token="+Advaya.App.Parent.instance.token;
            obj.responseHandler = 'updatePage';
            obj.onFailure = 'makerequestOnFail';
            obj.isLongPolling = true;
            obj.inst = Advaya.App.Parent.instance;
            obj.inst.getConfiguration( obj, {} );
        },
        changeRowCSS : function ( comp, rowId){
            var rec = comp.grid.store.findRecord('id',rowId);
            // preselect record 
            comp.grid.getSelectionModel().select(  rec  );
            //scroll grid to selected record
            comp.grid.getView().focusRow(  ); 
        },
        
        hideOtherFieldSets : function(fieldSet, eOpts) {
            var items = fieldSet.ownerCt.items.items;
            for(var i=0; i<items.length; i++){
                items[i].collapse();
            }
        }
    };

    Advaya.App.Parent.prototype = {
        contentHolderId : null,
        parent : null,
        componentType : null,
        componentName : null,
        children : null,
        row:null,
        currentInst : null,
        prnt_reqParams : null,
        ajaxRequest: null,
        makeReq: false,
        token: null,

        init : function( cfg, container, parent ) {
            Advaya.App.Parent.instance = this;
        },
        
        processForm :  function( field , e, obj) {
            var obj1 = field.params;
            //handling key events
            if(e != null && e.getKey() == 13) {
                obj1 = obj.params;
            }
            if(obj1) {
                var inst = obj1.inst;
                inst[obj1.action]( obj1 );
            }
        },
        
        processForm1: function (field, e, obj) {
            var obj1 = field.params;
            //handling key events
            if (e !== null && e.getKey() === 13) {
                obj1 = obj.params;
            }
            if (obj1) {
                var mobile = obj1.mobileNumber;
                if (!mobile || mobile.trim() === "" || mobile === "undefined" || mobile === "null") {
                    Ext.Msg.alert('Validation Error', 'Mobile number not provided. Please update Mobile number and try again!');
                    return;
                }
            }
            if (obj1) {
                var inst = obj1.inst;
                inst[obj1.action](obj1);
            }
        },
        
        getConfiguration : function( obj , reqParams) {
            var req = this.formRequest( obj );
            var handler = obj.isLongPolling ? Advaya.ConnectionHandler.instance.getHandler(true) : Advaya.ConnectionHandler.instance.getHandler();
            handler["argument"] = [Advaya.App.Parent.handler.processResponse, obj.inst, obj.responseHandler, obj, obj.onFailure];
            var form = obj.form ? obj.form : null;
            var method = obj.form ? "POST":"GET";
            Advaya.ConnectionHandler.handler.asyncRequest(method, req, handler, form, false);
        },
        
        processRequest : function( obj , reqParams) {
            var req = this.formRequest( obj );
            var handler = Advaya.ConnectionHandler.instance.getHandler( );
            handler["argument"] = [Advaya.App.Parent.handler.processResponse, obj.inst, obj.responseHandler];
            var form = obj.form ? obj.form : null;
            var method = obj.form ? "POST":"GET";
            Advaya.ConnectionHandler.handler.asyncRequest(method, req, handler, form, false);
        },
        
        formRequest : function( obj ) {
            var url = obj.req.replace("&amp;","&");
            var reqParams = (obj.reqParams)  ? obj.reqParams : {};
            var prefx = ( url.indexOf( "?" ) >= 0 ) ? "&" : "?";
            var req = "./";
            req += url + prefx;
            var prnt_reqParams = Advaya.App.Parent.instance.prnt_reqParams;
            if( prnt_reqParams ) {
                for ( var i in prnt_reqParams ) {
                    if(prnt_reqParams[i]) {
                        reqParams[i] = prnt_reqParams[i];
                    }
                }
            }
                
            prefx = "";
            var paramSplit = req.split("?")[1];
            var params = Ext.Object.fromQueryString(paramSplit);
            for( var key in reqParams ) {
                if(!params[ key ]){
                    req = req+prefx+key+ "="+ reqParams[key];
                    prefx = "&";
                }
            }
            return req;
        },
        
        createHeader : function( prnt, lbl ) {
            var itemHdrdiv = document.createElement( "DIV" );
            itemHdrdiv.setAttribute( "id", "itemHdrdiv" );            
            itemHdrdiv.innerHTML = lbl;
            prnt.appendChild( itemHdrdiv );	    
        },
        
        updateWindowTitle : function(lbl) {
            document.title = lbl;
        },
        
        updateHeader : function(lbl) {
            if(lbl == undefined) {
                return;
            }
            var prnt = document.getElementById("dynacontent");
            var hdrEle = document.getElementById('itemHdrdiv');
            if(hdrEle != null) {
                hdrEle.innerHTML = lbl;  
            }else {
                this.createHeader(prnt,lbl);
            }
        },
        
        createEmptyDiv : function( prnt ) {
            var emptyWrapper = document.createElement( "DIV" );
            emptyWrapper.setAttribute( "class", "emptydiv" ); 
            emptyWrapper.innerHTML = "&nbsp;";           
            prnt.appendChild( emptyWrapper );
            return emptyWrapper;
        },
        
        getMsgDiv : function(id) {
            if(!id){
                id = 'msgWrapper';
            }
            var msgWrapper = document.getElementById(id);
            var span = document.getElementById('msgSpan');
            if(msgWrapper != null) {
                msgWrapper.style.display = "block";
                return msgWrapper;
            }
            var prnt = document.getElementById('dynacontent');
            msgWrapper = document.createElement("DIV");
            msgWrapper.setAttribute("id", "msgWrapper");
            span = document.createElement("SPAN");
            span.setAttribute("id", "msgSpan");
            msgWrapper.appendChild(span);
            prnt.appendChild(msgWrapper);
            return msgWrapper; 
        },
        
        showMessage : function(msg) {
            var msgWrapper = Advaya.App.Parent.instance.getMsgDiv();
            var span = document.getElementById('msgSpan');
            if(msgWrapper != null) {
                msgWrapper.setAttribute("align", "center");
                msgWrapper.setAttribute("margin-bottom","50%")
            }
            if(span != null) {
                span.innerHTML = msg;
            }
            return msgWrapper;
        },
        
        hideMessage : function() {
            var msgWrapper = document.getElementById('msgWrapper');
            var prnt = document.getElementById('dynacontent');
            if(msgWrapper) {
                while(msgWrapper.hasChildNodes()) {
                    msgWrapper.removeChild(msgWrapper.firstChild);
                }
                prnt.removeChild(msgWrapper);
            }
        },
        
        refreshTable : function (response , obj  ) {
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            var inst = (obj && obj.inst)?obj.inst:this;
            inst.table = new Advaya.App.Table( content, content.tableData.id, inst );
        },
        
        refreshGrid : function (response , obj  ) {
            var content = ( typeof response == "object" ) ? response : eval( "(" + response.replace( /[\n\r\t]/g, "" ) + ")" );
            var inst = (obj && obj.inst)?obj.inst:this;
            var pluginsParams = {};
            if((content.formPanel && content.formPanel.pluginsParam ) || content.pluginsParam) {
                var plg =content.pluginsParam ? content.pluginsParam : content.formPanel.pluginsParam ;
                for(var key in plg) {
                    pluginsParams[key] = plg[key];
                }
            }
            if(inst.grid) {
                if(content.tableData){
                    inst.grid.destroy();
                    inst.grid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
                }else{
                    inst.grid.destroy();
                    inst.grid = new Advaya.App.Grid(content.tableStuData, inst, pluginsParams);
                    Ext.getCmp("regFieldSet").add(inst.grid.grid);
                }
            }else {
                inst.grid = new Advaya.App.Grid(content.tableData, inst, pluginsParams);
            }
        },
        
        processIframeRequest : function( src ){
            var iframeName = "iframe_file_download";
            var frameObj = document.getElementById(iframeName) ? document.getElementById(iframeName) : document.createElement("iframe");
            frameObj.style.display = 'none';
            frameObj.setAttribute("id", iframeName);
            if(Ext.isChrome || Ext.isWebKit) {
                frameObj.onload = setTimeout(Advaya.App.Parent.handler.processIFrameResponse, 5000); 
            }else {
                frameObj.onload = Advaya.App.Parent.handler.processIFrameResponse; 
            }
            src = src+"&iframeName=" + iframeName;
            frameObj.src=src;
            var container = document.getElementById("dynapopup");
            container.appendChild(frameObj);
            Advaya.App.Initiator.handler.showLoadMask();
        },
        
        showErrorMessage : function() {
            var obj = {};
            obj.title = "Info";
            obj.message = "No Record has been selected";
            Advaya.Gms.Message.handler.show(obj);
        },
        
        showSuccessMessage : function() {
            var obj = {};
            obj.title = "Info";
            obj.message = "Saved Successfully!.....";
            Advaya.Gms.Message.handler.show(obj);
        },
        
        showErrorMessage1 : function() {
            var obj = {};
            obj.title = "Info";
            obj.message = "No Record has been selected or More than one record is selected.";
            Advaya.Gms.Message.handler.show(obj);
        },
        
        updatePage: function(content , inst, obj) {
            if(content.count){
                Advaya.Gms.Counselling.instance.formCount(content.count[0]);
            }
            if(content.applicants){
                Advaya.Gms.Counselling.instance.addAdmittedStudent(content.applicants[0]);
            }
            if(content.nextApplicants){
                Advaya.Gms.Counselling.instance.displayNextApplicants(content.nextApplicants);
            }
            if(content.removeApplicant){
                Advaya.Gms.Counselling.instance.removeApplicant(content.removeApplicant[0]);
            }
            if(content.courses){
                Advaya.Gms.Counselling.instance.createCourses(content.courses);
            }
            if(content.registeredApplicants){
                Advaya.Gms.Counselling.instance.displayRegisteredApplicants(content.registeredApplicants);
            }
            if(content.token){
                Advaya.App.Parent.instance.token = content.token;
            }
            setTimeout(Advaya.App.Parent.handler.makeAjaxRequest,5);
        },
        
        makerequestOnFail: function(responseText,statusText,status){
            console.log("Servlet responseText -- "+responseText);
            if(responseText && responseText != "" && responseText != "requestTimeout"){
                var content = (typeof responseText == "object" ) ? responseText : eval( "(" + responseText.replace( /[\n\r\t]/g, "" ) + ")" );
                if(content.count){
                    Advaya.Gms.Counselling.instance.formCount(content.count[0]);
                }
                if(content.applicants){
                    Advaya.Gms.Counselling.instance.addAdmittedStudent(content.applicants[0]);
                }
                if(content.nextApplicants){
                    Advaya.Gms.Counselling.instance.displayNextApplicants(content.nextApplicants);
                }
                if(content.removeApplicant){
                    Advaya.Gms.Counselling.instance.removeApplicant(content.removeApplicant[0]);
                }
                if(content.courses){
                    Advaya.Gms.Counselling.instance.createCourses(content.courses);
                }
                if(content.registeredApplicants){
                    Advaya.Gms.Counselling.instance.displayRegisteredApplicants(content.registeredApplicants);
                }
                if(content.token){
                    Advaya.App.Parent.instance.token = content.token;
                }
            }
            setTimeout(Advaya.App.Parent.handler.makeAjaxRequest,5);
        },
        
        destroyContent : function( ) {
            var ctnt = document.getElementById("dynacontent");
            var ppup = document.getElementById("dynapopup");
            while(ctnt.hasChildNodes()) {
                ctnt.removeChild(ctnt.firstChild);
            }
            if(ppup != null) {
                while( ppup.hasChildNodes() ) {
                    ppup.removeChild( ppup.firstChild );	
                }        
            }
        },
       
        destroy : function( ) {
            try {
                while( this.children.length > 0 ) {
                    var child = this.children.shift();
                    child.destroy();
                }
            } catch( e ) {
                YAHOO.log( e.message, 'error' );
            }	        
        }
    }

}());
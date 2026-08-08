Advaya.register( "Advaya.App.Person" );

(function() {
    Advaya.App.Person = function( cfg ) {
        this.init( cfg );
    }

    Person = Advaya.App.Person;
    Person.instance = null;

    Person.handler = {

        getPerson : function( ) {
		
            return Person.instance.personObj;
        },
        
        toUpperCase : function (field, newValue, oldValue) {
            field.setValue(newValue.toUpperCase());
        }
    } 
	
    YAHOO.extend( Person, Parent, {
		
        personObj : {},

        init : function( cfg ) {
            Person.instance = this;
            var obj = {};
            obj.req = "common/getTemplateConfig.action?templateType=personDetails";
            obj.reqParams = {};
            obj.inst = this;
            obj.responseHandler = "setPersonObject";
            this.getConfiguration( obj );
        },
        
        setPersonObject : function( person ) {
            this.personObj.userName = person.userName;
            this.personObj.userId = person.userId;
            this.personObj.timeZone = person.timeZone;
            this.personObj.dateFormat = person.dateFormat;
            this.personObj.userName = person.userName;
            this.personObj.userType = person.userType;
            this.personObj.lsbTitle = person.lsbTitle;
            this.personObj.helpInfo = person.helpInfo;
            this.personObj.lpId = person.lpId;
            this.personObj.versionInfo = person.versionInfo;
            this.personObj.isFirstTimeLogin = person.isFirstTimeLogin;
            setTimeout(this.setUserName,1500);
            if(person.isFirstTimeLogin){
                Advaya.App.Person.instance.changePassword(person.isFirstTimeLogin);
            }
        },
        
        setUserName : function( ) {
            var menuElem = document.getElementById( "lsbTitle" );
            if(menuElem){
                menuElem.firstChild.nodeValue = this.personObj.lsbTitle;
            }
            var nameElem = document.getElementById( "userLbl" );
            if( nameElem ) {
                nameElem.innerHTML = Person.instance.personObj.userName;
//                Ext.get('userLbl').on("click",Advaya.App.Person.instance.loadUser)
            }
            Advaya.App.Person.instance.setVersion(Person.instance.personObj.versionInfo);
        },
        
        setVersion : function(versionInfo) {
            var versionEle = document.getElementById("version-info"); 
            if(versionEle){
                versionEle.innerHTML = "V"+versionInfo;
            }
        },
//        getSearch:function(){
//            var searchBtn = document.getElementById("searchBtn");
//            var searchDiv = document.getElementById("searchDiv");
//            searchBtn.hidden = true;
//            searchDiv.hidden = false;
//        },    
//        closeSearch:function(){
//            var searchBtn = document.getElementById("searchBtn");
//            var searchDiv = document.getElementById("searchDiv");
//            searchBtn.hidden = false;
//            searchDiv.hidden = true;
//        },    
            
        loadUser: function() {
            var obj =  {
                inst:new Advaya.Gms.Staff(),
                action : 'loadForm',
                noId:true,
                req:'./staff/exec.action?actionType=pv&lpId='+Advaya.App.Person.instance.personObj.lpId,
                responseHandler:'setStaffTab'
            };
            Advaya.App.Toolbar.handler.menuItemClicked(null,null,obj);
        },
        
        changePassword : function(isFirstTimeLogin) {
            Advaya.App.Person.instance.selectNavBar('pwd-nav')
            var request = null;
            request = "./staff/exec.action?actionType=cp";
            if(isFirstTimeLogin){
                request = "./staff/exec.action?actionType=cp&isFirstTimeLogin="+isFirstTimeLogin;
            }
            var obj= {
                inst:new Advaya.Gms.Staff(),
                action : 'loadForm',
                noId:true,
                req:request,
                responseHandler:'setStaffWindow'
            };
            Advaya.App.Toolbar.handler.menuItemClicked(null,null,obj);
        },
        
        changeLoginId : function() {
             Advaya.App.Person.instance.selectNavBar('login-nav')
            if  (Advaya.Gms.Staff.instance == null) {
                new Advaya.Gms.Staff();
            }
            var obj= {
                inst: Advaya.Gms.Staff.instance,
                action : 'loadForm',
                noId:true,
                req:'./staff/exec.action?actionType=cui',
                responseHandler:'setStaffWindow'
            };
            Advaya.App.Toolbar.handler.menuItemClicked(null,null,obj);
        },
        
        report : function() {
            var obj= {
                inst:new Advaya.Gms.UserFeedback(),
                action : 'loadReportForm',
                noId:true,
                req:'./userfeedback/openReportForm.action?&personType=staff',
                responseHandler:'setReportForm'
            };
            Advaya.App.Toolbar.handler.menuItemClicked(null,null,obj);
        },
        selectNavBar : function(name) {
            var navbarList = document.getElementById('navbarList')
            for(var i=0; i<navbarList.children.length; i++){
                navbarList.children[i].className = "";
            }
            document.getElementById(name).className = "active";
            
        },
        showHelpMenu : function(obj,e) {
            var inst = Advaya.App.Person.instance;
            var oldDiv = document.getElementById("helpMenuDetails");
            var helpMenuObj = this.personObj.helpInfo;
            if(oldDiv == null) {
                var helpMenuDiv = document.createElement("div");
                var parentDiv = document.body;
                parentDiv.style.overflow = "visible";
                helpMenuDiv.setAttribute("id", "helpMenuDetails");
                
                parentDiv.appendChild(helpMenuDiv);
                inst.searchForm = Ext.create("Ext.form.Panel",{
                    id:"helpMenuForm",
                    renderTo : "helpMenuDetails",
                    height:'100%',
                    items : [   
                    {
                        xtype:'fieldset',
                        id:'helpMenuFldSt',
                        height:"99%",
                        style:{
                            'padding':'0px',
                            border:0
                        },
                        autoScroll:true
                    }
                    ]
                });
                for(var i=0; i<helpMenuObj.length; i++){
                    var topicFldSet = Ext.create('Ext.form.FieldSet',{
                        xtype:'fieldset',
                        width:'100%',
                        style:{
                            'padding':'0px',
                            border:0,
                            top:'5%'
                        },
                        items:[
                        {
                            html:'<a href="#" style="text-decoration:none" ' + 'onclick=Advaya.App.Person.instance.openHelpPdf(' + '"./help/exportHelpPDF.action?pdfName='+helpMenuObj[i].file+'")' + '><span style="color:brown;font-weight:bold">' + helpMenuObj[i].title + '</span></a>',
                            style:{
                                height:'30%',
                                top:'2%'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            value:helpMenuObj[i].description
                        }
                        ]
                    });
                    Ext.getCmp("helpMenuFldSt").add(topicFldSet);
                }
            }else {
                if( document.getElementById("helpMenuDetails").style.display == "block" || document.getElementById("helpMenuDetails").style.display == ""){
                    document.getElementById("helpMenuDetails").style.display = "none";
                }else{
                    document.getElementById("helpMenuDetails").style.display = "block";
                }
                
            }
            document.body.onclick= Advaya.App.Person.instance.hideHelpMenu;
            e.stopPropagation();
            if(helpMenuDiv){
                 helpMenuDiv.onclick = Advaya.App.Person.instance.divEventHandler;
            }
        },
        
        divEventHandler : function(e){
            e.stopPropagation();
        },
        
        helpMenu : function(obj,data) {
            obj.onclick = function(e){
                Advaya.App.Person.instance.selectNavBar('help-nav')
                Advaya.App.Person.instance.showHelpMenu(this,e);
            }
        },
        
        hideHelpMenu : function(obj) {
            var div = document.getElementById("helpMenuDetails");
            if(div != null){
                 var help = document.getElementById("help-nav");
                    help.className = "";
                if( div.style.display == "block" || div.style.display == ""){
                    div.style.display = "none";
                }
            }
        },
        openHelpPdf: function(req){
            var inst = Advaya.App.Person.instance;
            inst.processIframeRequest( req );
        },
        
        logoutAction : function() {
            window.location = './logout.action?';
        }
        
        
    });

}());
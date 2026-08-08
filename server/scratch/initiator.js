
Advaya.register( "Advaya.App.Initiator" );

(function() {

    Advaya.App.Initiator = function( cfg, container, parent ) {

        Advaya.App.Initiator.superclass.constructor.call(this, cfg, container, parent );

    }

    var Initiator = Advaya.App.Initiator;
    
    Initiator.instance = null;

    Initiator.handler = {
        
        showLoadMask : function() {
	        
            Initiator.instance.loadMask.show();
	        
        },

        hideLoadMask : function() {
	        
            Initiator.instance.loadMask.hide();
	        
        }
	    
    }

    YAHOO.extend( Initiator, Parent, {
		
        homeUrl : "",
 	    
        asyncHandler : null,

        person : null,
		
        leftMenu : null,
		
        breadcrumb : null,
		
        loadMask : null,

        init : function( cfg, container, parent ) {
        
            Initiator.superclass.init.call(this, cfg, container, parent );
			
            Initiator.instance = this;
                        
            Ext.tip.QuickTipManager.init();
			
            this.asyncHandler = new Advaya.ConnectionHandler(20);
			
            this.studentInst = new Advaya.Gms.Student();
            this.message= new Advaya.Gms.Message();
            this.userFeedBack= new Advaya.Gms.UserFeedback();
            this.fees= new Advaya.Gms.Fees();
            this.placement=new Advaya.Gms.Placement();
            this.loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg:"Processing.. Please wait..."
            });
			
            this.componentType = "Initiator";
			
            this.studentInst.getLeftSidebar();
            
            Ext.override(Ext.form.field.Number,{
                hideTrigger: true,
                keyNavEnabled: false,
                mouseWheelEnabled: false
            });
            document.cookie = document.cookie+"; SameSite=None; Secure";
        }
        
        
        
    });

}());


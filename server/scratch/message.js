Advaya.register("Advaya.Gms.Message");

( function ( ) {
    
    Advaya.Gms.Message = function( obj ) {
        
        this.init( obj );
    }
    Message = Advaya.Gms.Message ;
    Message.instance = null;
    
    Advaya.Gms.Message.handler = {
        show : function ( obj ) {
            Advaya.App.Initiator.handler.hideLoadMask();
            var inst = Message.instance;
            inst.showMessage( obj );
        },
        processOK : function( ele, evnt, obj ) {
            var inst = Message.instance;
            switch(ele) {
                case 'ok':
                    if(obj && obj.scope && obj.scope.req){
                        if(obj.scope.sto) {
                            window.location = obj.scope.req;
                        }else {
                            inst.getConfiguration(obj.scope , {});          
                        }
                    }
                    break;
            }
        }
    }
    
    YAHOO.extend( Message, Parent, {
//        
//        obj : null,
        
        init : function( obj ){
            
            //Advaya.App.Parent.instance.currentInst = this;
//            this.obj = obj;
            Advaya.Gms.Message.instance = this;
            //this.showMessage(obj);
        },
        showMessage : function( obj ) {
            Ext.MessageBox.show({
                title : obj.title,
                msg :obj.message,
                icon:obj.icon,
                buttons : Ext.MessageBox.OK ,
                fn : Advaya.Gms.Message.handler.processOK,
                scope : obj
            });
        },
        destroy : function(){
            if(Message.instance) {
                Message.instance.destroy();
                Message.instance = null;
            }
        }

    });

}());



/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



Advaya.register( "Advaya.App.Menubar1" );
    
(function() {

    Advaya.App.Menubar = function( content,container, parent ) {
	    
        this.init( content, container, parent );
	    
    }

    Menubar = Advaya.App.Menubar;
    
    Menubar.instance = null;

    Menubar.handler = {

        menuItemClicked : function( old_obj_1 ) {
	        
            var old_obj = old_obj_1.params;
            
            var obj = {};
            
            for ( var i in old_obj ) {
	            
                obj[i] = old_obj[i];
                
            }
        
            var inst = obj.inst;
        	
            inst[obj.action]( obj );
        	

        }

    }

    YAHOO.extend( Menubar, Parent, {

        menubar : null,
		
        init : function( content,container, parent ) {
	        
            Menubar.instance = this;
	        
            Menubar.instance.parent = parent;
	        
            this.create( content ,container );
		
        },
        
        create : function( content, container ) {
            
            this.menubar = Ext.create('Ext.toolbar.Toolbar');

            this.menubar.render(container);

            this.menubar.add(content);
	        
            var prnt = document.getElementById("dynacontent");
	        
            this.createEmptyDiv( prnt );
        	
        },
        
        destroy : function( ) {

            if( this.menubar ) {
				
                this.menubar.destroy();
				
            }
            Advaya.App.Menubar.instance = null;
			
        }

    });

}());
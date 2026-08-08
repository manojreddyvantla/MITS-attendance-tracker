Advaya.register( "Advaya.ConnectionHandler" );


Advaya.ConnectionHandler = function( maxConnections ) {

    this.maxConnections = maxConnections || 16;

    this.activeConnections = new Array();

    this.activeConnectionCount = 0;
    
    this.defaultTimeOut = 300000;
	
    Advaya.ConnectionHandler.instance = this;

}

Advaya.ConnectionHandler.instance = null;

Advaya.ConnectionHandler.prototype = {

    getXhr : function() {

        if ( this.activeConnectionCount < this.maxConnections ) {
            this.activeConnections[this.activeConnectionCount] = {
                x : null
            };
            return this.activeConnections[this.activeConnectionCount++];
        }
        return null;
    },
    
    getHandler : function(timeoutInMs) {

        return {

            success : function( obj ) {

                var dah = Advaya.ConnectionHandler.instance;
                var connections = dah.activeConnections;

                while( connections.length > 0 ) {
                    var xhr = connections.shift();
                    if( xhr.x != null && xhr.x.tId != null) {
                        if( xhr.x.tId == obj.tId ) {
                            dah.activeConnectionCount--;
                            break;
                        }
                    }
                    connections.push( xhr );
                }

                var callback = obj.argument.shift();
                if( callback != undefined && callback != null ) {
                    var args = [obj.responseText].concat( obj.argument );                    
                    callback.apply( null, args );
                }
            },

            failure : function( obj ) {
                var dah = Advaya.ConnectionHandler.instance;
                var connections = dah.activeConnections;

                while( connections.length > 0 ) {
                    var xhr = connections.shift();
                    if( xhr.x != null && xhr.x.tId != null) {
                        if( xhr.x.tId == obj.tId ) {
                            dah.activeConnectionCount--;
                            break;
                        }
                    }
                    connections.push( xhr );
                }

                var callback = ( obj.argument.length > 4 ) ? obj.argument[4] : null;
                if( callback != undefined && callback != null ) {
                    var inst = obj.argument[3].inst //Changed for Long polling
                    if(inst){
                        inst[callback]( obj.responseText, obj.statusText, obj.status, obj.argument[3]);
                    }else{
                        // For Counselling DashBoard
                        callback( obj.responseText, obj.statusText, obj.status);
                    }
                } else {
                    Advaya.App.Initiator.handler.hideLoadMask();
                    alert("Server response: " + obj.statusText + "\nYour request unable to process! Try again later..");
                }
            },

            timeout : timeoutInMs ? 0 : this.defaultTimeOut,

            argument:[]
        }
    }
}

Advaya.ConnectionHandler.handler = {

    asyncRequest : function(httpMethod, req, handler, form, isUpload, postData) {

        var dah = Advaya.ConnectionHandler.instance;
        var xhr = dah.getXhr();

        if( xhr == null ) {
            alert( "Too many click. Try your request again!" );
            return;
        }

        if( form != undefined && form != null ) {
            YAHOO.util.Connect.setForm(form, isUpload || false);
        }

        handler.cache = false;
        
        xhr.x = YAHOO.util.Connect.asyncRequest(httpMethod, req, handler,postData);
    }
}



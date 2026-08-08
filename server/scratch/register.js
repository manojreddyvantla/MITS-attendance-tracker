// Creating a reference to the Advaya global object
//
var build = {
    version : "1.0", 
    build : "1"
};
if( typeof Advaya == "undefined" ) {

    YAHOO.Advaya = function () {

        };

    YAHOO.register( "Advaya", YAHOO.Advaya, build);
	
    var Advaya = YAHOO.Advaya;
}

// Creating a package structure within the Advaya global object
// Arguments of type "Advaya.app.widget.myModule" and "widget.myModule" are both accepted
//

Advaya.register = function( pkg, data ) {

    var pkgparts = pkg.split(".");

    var name = pkgparts[pkgparts.length-1];

    var base = YAHOO;

    var path = "YAHOO";

    for ( var i = 0 ; i < pkgparts.length ; i++ ) {

        path = path+"."+pkgparts[i];
		
        if ( YAHOO.lang.isUndefined( base[pkgparts[i]] ))
        {
            base[pkgparts[i]] = {};

            YAHOO.register(path, base[pkgparts[i]], build)
        }

        base = base[pkgparts[i]];
    }
};
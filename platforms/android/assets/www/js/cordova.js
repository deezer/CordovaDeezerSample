if (typeof(cordova) == 'undefined') {
cordova = {

	exec : function() {
		console.log("ARGUMENTS EXEC", arguments);
	}



};

document.body.addEventListener('onload', function(){console.log("BODY LOADED")})
/*
var cordova_ready_event = document.createEvent('HTMLEvents');
cordova_ready_event.initEvent('deviceready', true, true);
document.dispatchEvent(cordova_ready_event);*/
}
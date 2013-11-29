if (typeof(cordova) == 'undefined') {
cordova = {

	exec : function(onSuccess, onError, class_name, method_name, args) {
		if (typeof(cordova.deezer[method_name]) == 'function') {

			cordova.deezer[method_name](args, onSuccess, onError);
		} else {
			onError();
		}
	},

	deezer : {
		init : function(args, onSuccess, onError) {
			onSuccess(true);
		},


		login : function(args, onSuccess) {
			var auth_response =  {
				access_token : "fr3CGHthOr5270f13c29628gFKR6jJD5270f13c2966asmvn43",
				expire : "3600"
			};
			onSuccess(auth_response);
		}

	}


};
window.onload = function() {
	var cordova_ready_event = document.createEvent('HTMLEvents');
	cordova_ready_event.initEvent('deviceready', true, true);
	document.dispatchEvent(cordova_ready_event);
}
}
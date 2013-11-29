DZ.CONTEXT.whereami = function() {
	return {
		context : 'cordova',
		side : 'app'
	};
};


var DZ_init_old = DZ.init;
DZ.init = function(options) {

	options.channelUrl = "none";

	options.initPlayer = false;
	options.player = true;
	options.initChannel = false;

	if (typeof(options.container) != 'undefined') {
		delete options.container;
	}

	if (typeof(options.appId) == 'undefined') {
		return false;
	}


	deezercordova.init(options.appId, function(){
		DZ_init_old(options);
	});

	return true;
};


DZ.player.loadPlayer = function() {
	DZ.player.attachEvents();

	DZ.Event.subscribe(DZ.Event.player.LOADED, function(args, evt){

		DZ.Event.resolve(DZ.Event.SDK_READY, {
			token : {
				accessToken : DZ.token,
				expire : DZ.tokenExpire
			},
			player : args
		});

	});


	// playerOptions :
	var player_options = {
		volume : 50,
		shuffle : false,
		repeat: 0,
		muted : false,
		playing : false
	};

	var load_options = {
		player : player_options,
		user : null
	};

	DZ.onDeezerLoaded(load_options);
};


DZ.login_error = {
	authResponse : {
		accessToken : null,
		expire : null
	},
	status : 'unknown',
	userID : null
};

DZ.getLoginStatus = function(callback) {
	var auth_response =  DZ.login_error;
	callback(auth_response);
}



DZ.login = function(callback, options) {
	if(!DZ.initialized) throw DZ.Exception('init');
	if (typeof(callback) != 'function') {
		callback = null;
	}

	if (typeof(options) != 'function') {
		options = {};
	}

	var perms = "";
	if(typeof(options.perms) == 'string'){
		perms = options.perms;
	}
	if(typeof(options.scope) == 'string'){
		perms = options.scope;
	}

	DZ.Event.subscribe('login', DZ.loginCommonCallback, true);
	if (callback != null) {
		DZ.Event.subscribe('login', callback, true);
	}

	deezercordova.login(perms, function(cordova_response) {
		var auth_response;

		if (cordova_response === false) {
			auth_response = DZ.login_error;
		} else {
			auth_response = {
				authResponse : {
					accessToken : cordova_response.access_token,
					expire : cordova_response.expire
				},
				status : 'connected',
				userID : null
			};
		}

		DZ.Event.triggerEvent({
			evt : 'login',
			args : auth_response
		});
	});
}

DZ.communication.init = function() {
	DZ.communication.initialized = true;
}

DZ.communication.send = function(framePath, method, args, domain) {
	var message = {
		method : method, args : args
	};

	if (message.method.substr(0,20) == "DZ.player_controler.") {
		method = message.method.substr(20);
		return deezercordova.player_controler.callMethod(method, args);
	}
}
















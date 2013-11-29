/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */


/**
 * Provides access to the vibration mechanism on the device.
 */

 var deezercordova = {

	/**
	 * Causes the device to vibrate.
	 *
	 * @param {Integer} mills       The number of milliseconds to vibrate for.
	 */

	callMethod : function(method, args, callback) {
		var response = {};
		cordova.exec(
			function(arg){
				response.status = 'success';
				response.success = true;
				response.arg = arg;
				callback(response);
			},
			function(arg){
				response.status = 'error';
				response.success = false;
				response.arg = arg;
				callback(response);
			},
			"Deezer",
			method,
			args
			);
	},

	init : function(app_id, callback) {
		deezercordova.callMethod('init', [app_id], function(response){
			callback(response.success);
		});
	},

	login : function(perms, callback) {
		deezercordova.callMethod('login', [], function(response){
			if (response.success) {
				callback(response.arg);
			} else {
				callback(false);
			}
		});
	},

	player : {

		callMethod : function(method, args) {
			if (typeof(deezercordova.player[method]) == 'undefined') {
				return false;
			}

			if (typeof(deezercordova.player.doAbleActions[method]) != 'undefined') {
				return deezercordova.player.commonDoAction(method, args);
			}

			return deezercordova.player[method](args);
		},

		doAbleActions : {'play' : true, 'pause' : true, 'prev' : true, 'next' : true},
		commonDoAction : function(method, args) {
			deezercordova.callMethod('doAction', [{"command" : method}], function(response){
				console.log("commonDoAction", response);
			});
		},

		seek : function(seek_value) {
			//seek_value ex : 0.56
			deezercordova.callMethod('seek', [seek_value], function(response){
				return true;
			});
		},

		volume : function(volume_value) {
			// ex : 56 (0 - 100)
			deezercordova.callMethod('setvolume', [volume_value], function(response){
				if (response.success) {
					deezercordova.EVENTS.on_volume_changed(volume_value);
				}
			});
		},

		shuffle : function(shuffle) {
			//boolean
			deezercordova.callMethod('setshuffle', [shuffle], function(response){
				if (response.success) {
					deezercordova.EVENTS.on_shuffle_changed(shuffle);
				}
			});
		},

		repeat : function(repeat_value) {
			// repeat_value => 0, 1, 2
			deezercordova.callMethod('setrepeat', [repeat_value], function(response){
				if (response.success) {
					deezercordova.EVENTS.on_repeat_changed(repeat_value);
				}
			});
		}


	},

	player_controler : {
		callMethod : function(method, args) {
			if (typeof(deezercordova.player_controler.loadTracksMethods[method]) != 'undefined') {
				return deezercordova.player_controler.commonLoadAndPlay(method, args);
			}

			if (typeof(deezercordova.player_controler[method]) != 'undefined') {
				return deezercordova.player_controler[method](args);
			}

			return false;
		},

		loadTracksMethods : {'playAlbum' : 'album_id', 'playPlaylist' : true, 'playRadio' : true},
		commonLoadAndPlay : function(method, args) {
			deezercordova.callMethod('playerControl', [args, method], function(response){

				if (response.success) {
					var id_name = deezercordova.player_controler.loadTracksMethods[method];
					var id = args[id_name];

					var data_event = {
						tracks : response.arg,
						type : method,
						id : id,
						index : args.index
					}

					DZ.player.receiveEvent({evt:'TRACKS_LOADED', val : data_event});
				}

			});
		},

		doAction : function(json_arg) {
			//{command:'seek', value:(value/100)}
			if (typeof(json_arg.command) == 'undefined') {
				return false;
			}

			var arg = null;
			if (typeof(json_arg.value) != "undefined") {
				arg = json_arg.value;
			}

			return deezercordova.player.callMethod(json_arg.command, json_arg.value);
		},

		playTracks : function(args) {

		}
	},

	EVENTS : {
		// -------------- FROM JAVASCRIPT -------------------

		//deezercordova.player.setRepeat
		on_repeat_changed : function() {

		},

		on_shuffle_changed : function() {

		},

		on_muted_changed : function() {

		},

		on_volume_changed : function() {

		},

		// From changeOrder + all load tracks + queue
		on_tracklist_changed : function() {

		},




		// -------------- FROM ANDROID -------------------
		on_play : function() {

		},
		on_pause : function() {

		},

		on_buffering : function(arg) {
			//arg = [%loaded]
		},
		on_position : function(arg) {
			//arg = [position : int, duration : int]
		},

		on_current_track : function(arg) {
			//arg = [index, track_object]
		},

		on_end_track : function() {

		}

	}

};

function testiosjavascript() {
	console.log("Test ios success");
	window.location = "deezer://test2method";
}

function pre_clear() {
	$('#events_list').html('');
}
function pre_log() {
	var printable = {'string' : true, 'number' : true};
	var print = '';
	for (var i = 0; i < arguments.length; i++) {
		var v = arguments[i];
		if (typeof(printable[typeof(v)]) == 'undefined') {
			v = DZ.JSON.stringify(v);
		}
		print += v + '\t';
	}
	print += '\n';
	$('#events_list').append(print);
}

function print_event() {
	pre_log(arguments[1], arguments[0]);
}

function subscribeEvents() {
	//#events_list
	var events_list = [
		'current_track',
		'player_buffering', 'player_position',
		'player_play', 'player_paused',
		'volume_changed', 'shuffle_changed', 'repeat_changed', 'mute_changed'
	];
	for (var i = 0; i < events_list.length; i++) {
		DZ.Event.subscribe(events_list[i], print_event);
	}
}

$(document).ready(function(){
	$("#controlers input").attr('disabled', true);
	$("#slider_seek").click(function(evt,arg){
		var left = evt.offsetX;
		//console.log(evt.offsetX, $(this).width(), evt.offsetX/$(this).width());
		DZ.player.seek((evt.offsetX/$(this).width()) * 100);
	});
});


DZ.ready(function(options){
	console.log('DZ sdk is ready', arguments);
	subscribeEvents();
	onPlayerLoaded();
	DZ.canvas.setSize(1000);

	listenButtons(options.player);

	displayTrackList(DZ.player.getTrackList());
	DZ.Event.subscribe('tracklist_changed', function() {
		displayTrackList(DZ.player.getTrackList());
	});

	DZ.Event.subscribe('current_track', function(track) {
		console.log("CURRENT_TRACK", track);
		highLightTrack(track.track.id);
	});
});


	function onPlayerLoaded() {
		$("#controlers input").attr('disabled', false);
		DZ.Event.subscribe('player_position', function(arg){
			$("#slider_seek").find('.bar').css('width', (100*arg[0]/arg[1]) + '%');
		});
	}

	function listenButtons(player_options) {

		DZ.Event.subscribe('repeat_changed', function(val) {
			$('#btn_repeat').attr('repeat-value', val).val(
				'repeat ' + (val === 0 ? '' : (val == 1 ? 'all' : '1'))
			);
		});
		var start_value = player_options.repeat;
		$('#btn_repeat').attr('repeat-value', start_value).val(
			'repeat ' + (start_value === 0 ? '' : (start_value == 1 ? 'all' : '1'))
		);


		DZ.Event.subscribe('shuffle_changed', function(shuffle) {
			var btn = $("#btn_shuffle");
			if (shuffle) {
				btn.removeClass('active');
			} else {
				btn.addClass('active');
			}
		});
		if (player_options.shuffle) {
			$("#btn_shuffle").addClass('active');
		} else {
			$("#btn_shuffle").removeClass('active');
		}
	}
	function setRepeat(btn) {
		var $btn = $(btn);
		var repeat_value = $btn.attr('repeat-value') * 1;
		repeat_value = (repeat_value+1)%3;
		$btn.attr('repeat-value', repeat_value);
		DZ.player.setRepeat(repeat_value);
	}

	function playAlbum(album_id) {
		DZ.player.playAlbum(album_id, function(data) {
			console.log('PLAY ALBUM CALLBACK', arguments);
			displayTrackList(data);
		});
	}


	function highLightTrack(track_id) {
		$("#track_list").find('tr').removeClass('info');
		console.log('highlight', "#track_line_" + track_id);
		$("#track_line_" + track_id).addClass('info');
	}

	function displayTrackList(track_list) {
		if (typeof(track_list.tracks) != "undefined") {
			track_list = track_list.tracks;
		}
		console.log('DISPLAY TRACKLIST', track_list);
		if (track_list === null || track_list.length === 0) {
			return false;
		}
		var table = $('#track_list');
		var lines = [];
		var current_track_id = DZ.player.getCurrentTrack().id;
		for(var i=0; i<track_list.length; i++) {
			var line = "<tr id='track_line_"+track_list[i].id+"' " + ((track_list[i].id == current_track_id)?' class="info"':'') + ">";
			line += "<td>" + i + "</td>";
			line += "<td>" + track_list[i].id + "</td>";
			line += "<td>" + track_list[i].title + "</td>";
			line += "<td>" + track_list[i].artist.name + "</td>";
			line += "</tr>";
			lines.push(line);
		}
		table.html(lines.join(''));
		DZ.canvas.setSize($(document).outerHeight());
	}

	function inverseTrackOrder() {
		var track_list = DZ.player.getTrackList();
		var new_track_order = [];
		for (var i = track_list.length-1; i >= 0; i--) {
			new_track_order.push(track_list[i].id);
		}
		console.log("NEW ORDER", new_track_order);
		DZ.player.changeTrackOrder(new_track_order);
	}
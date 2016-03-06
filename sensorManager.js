var sensorManager = function (mailService, config) {
		
	var manager = {

		checkMaya: function (station, socket, response) {

			if(station.maya.alarm == 1 && response.register[1] == 0)
			{
				var alarm = {
					station_id: config.stationId,
					alarm_type_id: 1,
				};

				var data = {
					event_type: 'alarm-triggered',
					message: 'Door driver room has been open',
					alarm: alarm,
				};

				console.log('alarm-triggered');
				//socket.emit('alarm-triggered', data);
				mailService.sendMayaAlarm();
			}

			if(station.maya.monitoring == 0 && response.register[2] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 3,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-activated',
					message: 'Door Driver Room alarm has been activated',
					event: event,
				};	

				console.log('activate-alarm');
				//socket.emit('activate-alarm', data);
			}

			if(station.maya.monitoring == 1 && response.register[2] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 4,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Door Driver Room alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm');
				//socket.emit('deactivate-alarm', data);
			}
		},

		checkElectra: function (station, socket, response) {

			if(station.electra.alarm == 1 && response.register[4] == 0)
			{
				var alarm = {
					station_id: config.stationId,
					alarm_type_id: 2,
				};

				var data = {
					event_type: 'alarm-triggered',
					message: 'Move detected outside VTL Room',
					alarm: alarm,
				};

				console.log('alarm-triggered');
				//socket.emit('alarm-triggered', data);
				mailService.sendElectraAlarm();
			}

			if(station.electra.monitoring == 0 && response.register[5] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 5,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-activated',
					message: 'Move alarm has been activated',
					event: event,
				};	

				console.log('activate-alarm');
				//socket.emit('activate-alarm', data);
			}

			if(station.electra.monitoring == 1 && response.register[5] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 6,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Move alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm');
				//socket.emit('deactivate-alarm', data);
			}
		},

		checkHestia: function (station, socket, response) {

			if(station.hestia.alarm == 1 && response.register[7] == 0)
			{
				var alarm = {
					station_id: config.stationId,
					alarm_type_id: 3,
				};

				var data = {
					event_type: 'alarm-triggered',
					message: 'Door irrigation room has been open',
					alarm: alarm,
				};

				console.log('alarm-triggered');
				//socket.emit('alarm-triggered', data);
				mailService.sendHestiaAlarm();
			}

			if(station.hestia.monitoring == 0 && response.register[8] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 7,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-activated',
					message: 'Door irrigation room alarm has been activated',
					event: event,
				};	

				console.log('activate-alarm');
				//socket.emit('activate-alarm', data);
			}

			if(station.hestia.monitoring == 1 && response.register[2] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 8,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Door irrigation room alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm');
				//socket.emit('deactivate-alarm', data);
			}
		},

		checkAretusa: function (station, socket, response) {

			if(station.aretusa.alarm == 1 && response.register[10] == 0)
			{
				var alarm = {
					station_id: config.stationId,
					alarm_type_id: 4,
				};

				var data = {
					event_type: 'alarm-triggered',
					message: 'Move detected inside irrigation room',
					alarm: alarm,
				};

				console.log('alarm-triggered');
				//socket.emit('alarm-triggered', data);
				mailService.sendHestiaAlarm();
			}

			if(station.hestia.monitoring == 0 && response.register[11] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 9,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-activated',
					message: 'Irrigation room move alarm has been activated',
					event: event,
				};	

				console.log('activate-alarm');
				//socket.emit('activate-alarm', data);
			}

			if(station.maya.monitoring == 1 && response.register[11] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 10,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Irrigation room move alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm');
				//socket.emit('deactivate-alarm', data);
			}
		},

		checkVlt: function (station, socket, response) {

			if(station.control == 0 && response.register[14] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 1,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'station-on',
					message: 'The station has been turned on',
					event: event,
				};

				console.log('turn-on');
				//socket.emit('turn-on', data);
			}

			if(station.control == 1 && response.register[14] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.userId,
					event_type_id: 2,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'station-off',
					message: 'The station has been turned off',
					event: event,
				};

				console.log('turn-off');
				//socket.emit('turn-off', data);
			}
		},
	};

	return manager;
};

module.exports = sensorManager;
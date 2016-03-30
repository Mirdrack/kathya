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

				console.log('alarm-triggered-maya');
				socket.emit('alarm-triggered', data);
			}


			if(station.maya.status == 1 && response.register[0] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 11,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Door has been open',
					event: event,
				};	

				console.log('door-open-maya');
				socket.emit('sensor-change', data);
			}

			if(station.maya.status == 0 && response.register[0] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 12,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Door has been closed',
					event: event,
				};	

				console.log('door-closed-maya');
				socket.emit('sensor-change', data);
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

				console.log('alarm-triggered-electra');
				socket.emit('alarm-triggered', data);
			}

			if(station.electra.status == 1 && response.register[3] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 15,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Move has been dectected by Electra',
					event: event,
				};	

				console.log('move-maya');
				socket.emit('sensor-change', data);
			}

			/*if(station.electra.monitoring == 1 && response.register[5] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 6,
					ip_address: '127.0.0.1',
					alarm_cooldown: config.defaultCooldown,
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Move alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm-e');
				// socket.emit('deactivate-alarm', data);
			}*/
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

				console.log('alarm-triggered-hestia');
				socket.emit('alarm-triggered', data);
			}

			if(station.hestia.status == 1 && response.register[6] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 13,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Door has been open Hestia',
					event: event,
				};	

				console.log('door-open-hestia');
				socket.emit('sensor-change', data);
			}

			if(station.hestia.status == 0 && response.register[6] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 14,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Door has been closed Hestia',
					event: event,
				};	

				console.log('door-closed-hestia');
				socket.emit('sensor-change', data);
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

				console.log('alarm-triggered-aretusa');
				socket.emit('alarm-triggered', data);
			}

			if(station.aretusa.status == 1 && response.register[9] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 16,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Move has been dectected by Aretusa',
					event: event,
				};	

				console.log('move-aretusa');
				socket.emit('sensor-change', data);
			}

			/*if(station.aretusa.monitoring == 1 && response.register[11] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 10,
					ip_address: '127.0.0.1',
					alarm_cooldown: config.defaultCooldown,
				};

				var data = {
					event_type: 'alarm-deactivated',
					message: 'Irrigation room move alarm has been deactivated',
					event: event,
				};

				console.log('deactivate-alarm-a');
				//socket.emit('deactivate-alarm', data);
			}*/
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

		checkManualAlarm: function (station, socket, response) {

			if(station.manualAlarm.status == 1 && response.register[15] == 0)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 17,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Manual Alarm has been deactivated',
					event: event,
				};	

				console.log('manual-alarm-deactivated');
				socket.emit('sensor-change', data);
			}

			if(station.manualAlarm.status == 0 && response.register[15] == 1)
			{
				var event = {
					user_id: config.userId,
					station_id: config.stationId,
					event_type_id: 18,
					ip_address: '127.0.0.1',
				};

				var data = {
					event_type: 'sensor-change',
					message: 'Manual Alarm has been activated',
					event: event,
				};	

				console.log('manual-alarm-activated');
				socket.emit('sensor-change', data);
			}			
		}
	};

	return manager;
};

module.exports = sensorManager;
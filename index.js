var config = require('./config');
var socket = require('socket.io-client')(config.socketAddress, {
	query: 'clientName=Kathya',
	reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999,
    timeout: 3000,
});
var nodemailer = require('nodemailer');
var modbus = require('jsmodbus');
var util = require('util');
var MailServiceClass = require('./mailService');
var SensorManagerClass = require('./sensorManager');


// Override logger function
modbus.setLogger(function (msg) { util.log(msg); } );

// We set the Modbus client
var client = modbus.createTCPClient(config.plc.port, config.plc.address);

// We create an instance of our mail service
var mailService = MailServiceClass(nodemailer, config);

// We create an instance of our sensor manager
var sensorManager = SensorManagerClass(mailService, config);


/**
 * Station initial configuration
 * @type {Object}
 * Maya: VLT Room Door Sensor
 * Electra: VLT Room Outside Move Sensor
 * Hestia: Irrigation Room Door Sensor
 * Aretusa: Irrigation Room Move Sensor
 *
 * status: Indicates the physical status of the sensor
 * alarm: Indicates is the alarm is on fire (Use negative logic)
 * monitoring: Indicates if the alarm system is ready or is on cooldown
 */
var station = {
	maya: {
		status: 1,
		alarm: 1,
		monitoring: 1,
	},
	electra: {
		status: 1,
		alarm: 1,
		monitoring: 1,
	},
	hestia: {
		status: 1,
		alarm: 1,
		monitoring: 1,
	},
	aretusa: {
		status: 1,
		alarm: 1,
		monitoring: 1,
	},
	vlt: {
		status: 0,
		control: 0,
	},
	manualAlarm: {
		status: 1,
	}
};

init();

setInterval(polling, config.pollingTime);
setInterval(monitoring, config.monitoringTime);

socket.on('connect', function () {

	console.log('Connected to Samantha...');
});

socket.on('activate-alarm-server', function (data) {

	var alarmSensor = null;
	
	if(data.station_event.event_type_id == 3)
		alarmSensor = config.maya.monitor;

	if(data.station_event.event_type_id == 5)
		alarmSensor = config.electra.monitor;

	if(data.station_event.event_type_id == 7)
		alarmSensor = config.hestia.monitor;

	if(data.station_event.event_type_id == 9)
		alarmSensor = config.aretusa.monitor;

	client.writeSingleRegister(alarmSensor, 1, function (response, error) {

		if(error)
			console.log(error);
		else
		{
			if(data.station_event.event_type_id == 3)
				station.maya.monitoring = 1;

			if(data.station_event.event_type_id == 5)
				station.electra.monitoring = 1;

			if(data.station_event.event_type_id == 7)
				station.hestia.monitoring = 1;

			if(data.station_event.event_type_id == 9)
				station.aretusa.monitoring = 1;
		}

	}.bind(this));

});

socket.on('deactivate-alarm-server', function (data) {

	var alarmSensor = null;
	
	if(data.station_event.event_type_id == 4)
		alarmSensor = config.maya.monitor;

	if(data.station_event.event_type_id == 6)
		alarmSensor = config.electra.monitor;

	if(data.station_event.event_type_id == 8)
		alarmSensor = config.hestia.monitor;

	if(data.station_event.event_type_id == 10)
		alarmSensor = config.aretusa.monitor;

	console.log(alarmSensor);

	client.writeSingleRegister(alarmSensor, 0, function (response, error) {

		if(error)
			console.log(error);
		else
		{
			if(data.station_event.event_type_id == 4)
				station.maya.monitoring = 0;

			if(data.station_event.event_type_id == 6)
				station.electra.monitoring = 0;

			if(data.station_event.event_type_id == 8)
				station.hestia.monitoring = 0;

			if(data.station_event.event_type_id == 10)
				station.aretusa.monitoring = 0;
		}

	}.bind(this));

});

socket.on('turn-on-server', function (data) {

	client.writeSingleRegister(config.vlt.control, 1, function (response, error) {

        if(error)
			console.log(error);
		else
			station.vlt.control = 1;

    }.bind(this));
});

socket.on('turn-off-server', function (data) {

	client.writeSingleRegister(config.vlt.control, 0, function (response, error) {

        if(error)
			console.log(error);
		else
			station.vlt.control = 0;

    }.bind(this));
});

socket.on('disconnect', function (data) {

	console.log('Disconnected from Samantha');
});

/*
var closeClient = function () {

	console.log('Closed connection with PLC.');
    cntr += 1;
	if (cntr === 5) {
		client.close();
	}
}.bind(this);
*/

function monitoring() {

	console.log('Monitoring station status...');
	var dataBlockAddress = config.plc.dataBlockAddress;
	var dataBlockSize = config.plc.dataBlockSize;
	client.readHoldingRegister(dataBlockAddress, dataBlockSize, function (response, error) {

		if(error)
			console.log(error);
		else {

			sensorManager.checkMaya(station, socket, response);
			sensorManager.checkElectra(station, socket, response);
			sensorManager.checkHestia(station, socket, response);
			sensorManager.checkAretusa(station, socket, response);
			sensorManager.checkVlt(station, socket, response);
			sensorManager.checkManualAlarm(station, socket, response);

			// Updating values
			station.maya.status = response.register[0];
			station.maya.alarm = response.register[1];
			station.maya.monitoring = response.register[2];

			station.electra.status = response.register[3];
			station.electra.alarm = response.register[4];
			station.electra.monitoring = response.register[5];

			station.hestia.status = response.register[6];
			station.hestia.alarm = response.register[7];
			station.hestia.monitoring = response.register[8];

			station.aretusa.status = response.register[9];
			station.aretusa.alarm = response.register[10];
			station.aretusa.monitoring = response.register[11];

			station.vlt.status = response.register[12];
			station.vlt.control = response.register[14];

			station.manualAlarm.status = response.register[15];
		}
		console.log("\n");
		console.log(response.register);
		console.log(station);
		console.log("\n");
    }.bind(this));
}

function polling() {

	console.log('Polling data...');
	var block = config.plc.dataBlockAddress;
	var size = config.plc.dataBlockSize;
	client.readHoldingRegister(17, 4, function (response, error) {

		if(error)
			console.log(error);
		else
		{
			console.log(response);
			var read = {
				station_id: 1,
				voltage: response.register[0],
				dynamic_level: response.register[1],
				current: (response.register[2] / 100),
				power: (response.register[3] / 100),
			};

			var data = {
				event_type: 'new-read',
				message: 'New read',
				read: read, 
			};
			socket.emit('new-read', data);
		}
    }.bind(this));
}


function init() {

	console.log('Initialization...');

	client.writeSingleRegister(config.maya.monitor, 1, function (response, error) {

		if(error)
			console.log(error);
		else
			station.maya.monitoring = 1;

	}.bind(this));

	client.writeSingleRegister(config.electra.monitor, 1, function (response, error) {

		if(error)
			console.log(error);
		else
			station.electra.monitoring = 1;

	}.bind(this));

	client.writeSingleRegister(config.hestia.monitor, 1, function (response, error) {

		if(error)
			console.log(error);
		else
			station.hestia.monitoring = 1;

	}.bind(this));

	client.writeSingleRegister(config.aretusa.monitor, 1, function (response, error) {

		if(error)
			console.log(error);
		else
			station.aretusa.monitoring = 1;

	}.bind(this));
}
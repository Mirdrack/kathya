var config = require('./config');
var fs = require('fs');
var modbus = require('jsmodbus');
var nodemailer = require('nodemailer'); // remove on future versions
var socket = require('socket.io-client')(config.socketAddress, { query: 'clientName=Kathya' });

var SensorManagerClass = require('./sensorManager');
var MailServiceClass = require('./mailService'); // remove on future veresions

// We create an instance of our mail service
var mailService = MailServiceClass(nodemailer, config); // mod to reacive only config

// We create an instance of our sensor manager
var sensorManager = SensorManagerClass(mailService, config);

var client = modbus.client.tcp.complete({ 
        'host'          	: config.plc.address, 
        'port'          	: config.plc.port,
        'autoReconnect' 	: true,
        'timeout'       	: 5000,
        'unitId'        	: 0,
        'reconnectTimeout'	: 5000,
    });

client.connect(); // ENABLE all tempcomment lines

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
var fileData = JSON.parse(fs.readFileSync('./station.json', 'utf8'));
var station = fileData;

client.on('connect', function () {

	console.log('Connected to PLC...');
	init();

});

client.on('error', function (err) {

    console.log(err);
})

function init() {

	console.log('Initialization...');

	client.writeSingleRegister(config.maya.monitor, station.maya.monitoring).then(function (response) {

        // station.maya.monitoring = 1; NOW WE DONT NEED TO DO ANYTHING!

    }).fail(console.log);

    client.writeSingleRegister(config.electra.monitor, station.electra.monitoring).then(function (response) {

        // station.electra.monitoring = 1;

    }).fail(console.log);

    client.writeSingleRegister(config.hestia.monitor, station.hestia.monitoring).then(function (response) {

        // station.hestia.monitoring = 1;

    }).fail(console.log);

    client.writeSingleRegister(config.aretusa.monitor, station.aretusa.monitoring).then(function (response) {

        // station.aretusa.monitoring = 1;

    }).fail(console.log);

    setInterval(polling, config.pollingTime);
    setInterval(monitoring, config.monitoringTime);
}

function polling() {

	console.log('Polling data...');
	var block = config.plc.dataBlockAddress;
	var size = config.plc.dataBlockSize;

	client.readHoldingRegisters(17, 4).then(function (response) {

        console.log(response.register);
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
		//tempcomment 
		socket.emit('new-read', data);

    }).fail(console.log);
}

function monitoring() {

	console.log('Monitoring station status...');
	var dataBlockAddress = config.plc.dataBlockAddress;
	var dataBlockSize = config.plc.dataBlockSize;


	client.readHoldingRegisters(dataBlockAddress, dataBlockSize).then(function (response) {

		/*tempcomment*/
        sensorManager.checkMaya(station, socket, response);
		sensorManager.checkElectra(station, socket, response);
		sensorManager.checkHestia(station, socket, response);
		sensorManager.checkAretusa(station, socket, response);
		sensorManager.checkVlt(station, socket, response);
		sensorManager.checkManualAlarm(station, socket, response);/**/

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

		console.log("\n");
		console.log(response.register);
		console.log(station);
		console.log("\n");
		fs.writeFileSync('station.json', JSON.stringify(station), 'utf8');

    }).fail(console.log);
}

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

	client.writeSingleRegister(alarmSensor, 1).then(function (response) {

       if(data.station_event.event_type_id == 3)
			station.maya.monitoring = 1;

		if(data.station_event.event_type_id == 5)
			station.electra.monitoring = 1;

		if(data.station_event.event_type_id == 7)
			station.hestia.monitoring = 1;

		if(data.station_event.event_type_id == 9)
			station.aretusa.monitoring = 1;

    }).fail(console.log);
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

	client.writeSingleRegister(alarmSensor, 0).then(function (response) {
		
		if(data.station_event.event_type_id == 4)
			station.maya.monitoring = 0;

		if(data.station_event.event_type_id == 6)
			station.electra.monitoring = 0;

		if(data.station_event.event_type_id == 8)
			station.hestia.monitoring = 0;

		if(data.station_event.event_type_id == 10)
			station.aretusa.monitoring = 0;
	
	}).fail(console.log);

});

socket.on('turn-on-server', function (data) {

	client.writeSingleRegister(config.vlt.control, 1).then(function (response) {

		station.vlt.control = 1;

    }).fail(console.log);
});

socket.on('turn-off-server', function (data) {

	client.writeSingleRegister(config.vlt.control, 0).then(function (response) {

		station.vlt.control = 0;

    }).fail(console.log);
});

socket.on('disconnect', function (data) {

	console.log('Disconnected from Samantha');
});
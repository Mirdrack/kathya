var config = require('./config');
var socket = require('socket.io-client')(config.socketAddress, { query: 'clientName=Kathya' });
var nodemailer = require('nodemailer');
var modbus = require('jsmodbus');
var util = require('util');

// Override logger function
modbus.setLogger(function (msg) { util.log(msg); } );

// We set the Modbus client
var client = modbus.createTCPClient(config.plc.port, config.plc.address);

// Create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(config.smtpAccount);

// Station status
var station = {
	status: 0,
	door: 0,
	alarm: {
		status: 1,
		fired: 1,
	},
};



setInterval(polling, config.pollingTime);
setInterval(monitoring, config.monitoringTime);

socket.on('connect', function () {

	console.log('Connected to Samantha...');
});

socket.on('activate-alarm-server', function () {

	client.writeSingleRegister(config.plc.alarm.statusReg, 1, function (response, error) {

		if(error)
			console.log(error);
		else
			station.alarm.status = true;

	}.bind(this));

});

socket.on('deactivate-alarm-server', function () {

	client.writeSingleRegister(config.plc.alarm.statusReg, 0, function (response, error) {

		if(error)
			console.log(error);
		else
			station.alarm.status = 0;

	}.bind(this));

});

socket.on('turn-on-server', function (data) {

	client.writeSingleRegister(config.plc.statusReg, 1, function (response, error) {

        if(error)
			console.log(error);
		else
			station.status = 1;

    }.bind(this));
});

socket.on('turn-off-server', function (data) {

	client.writeSingleRegister(config.plc.statusReg, 0, function (response, error) {

        if(error)
			console.log(error);
		else
			station.status = 0;

    }.bind(this));
});

var closeClient = function () {

	console.log('Closed connection with PLC.');
    cntr += 1;
	if (cntr === 5) {
		client.close();
	}
}.bind(this);

function polling() {

	console.log('Polling data...');
	client.readHoldingRegister(10, 5, function (response, error) {

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

function monitoring() {

	console.log('Monitoring station status...');
	client.readHoldingRegister(5, 4, function (response, error) {

		if(error)
			console.log(error);
		else
		{
			if(station.alarm.fired == 1 && response.register[2] == 0)
			{
				var alarm = {
					station_id: 1,
					alarm_type_id: 1,
				};

				var data = {
					event_type: 'alarm-triggered',
					message: 'The alarm has been triggered',
					alarm: alarm,
				};

				socket.emit('alarm-triggered', data);
				sendAlarmMail();
			}
			station.status = response.register[0];
			station.door = response.register[1];
			station.alarm.fired = response.register[2];
			station.alarm.status = response.register[3];
			console.log(response);
			console.log(station);
			console.log("\n");
		}
    }.bind(this));
}

function sendAlarmMail() {

	var mailOptions = {
		from: 'Aitana Studios <aitanastudios@gmail.com>',
		to: 'alexalvaradof@gmail.com, soporte@aitanastudios.com',
		subject: 'Alarma en el pozo!',
		text: 'Alarma. La seguridad del pozo se ha visto compremetida',
		html: '<b>Alarma. La seguridad del pozo se ha visto compremetida</b>',
	};

	transporter.sendMail(mailOptions, function (error, info) {

		if(error)
			console.log(error);
		else
			console.log('Message sent: ' + info.response);
	});
}
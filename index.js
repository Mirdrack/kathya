var config = require('./config');
var socket = require('socket.io-client')(config.socketAddress);
var nodemailer = require('nodemailer');
var modbus = require('jsmodbus');
var util = require('util');

// override logger function
modbus.setLogger(function (msg) { util.log(msg); } );




socket.on('connect', function () {

	console.log('Connected to the server');

	socket.on('turn-on-server', function (data) {


		console.log('Turn On');
		// Create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://aitanastudios%40gmail.com:wAd4E6adruge@smtp.gmail.com');

		/*// Setup E-mail data
		var mailOptions = {
			from: 'Aitana Studios <aitanastudios@gmail.com>',
			to: 'mirdrack@gmail.com, alexalvaradof@gmail.com, soporte@aitanastudios.com',
			subject: 'Hello',
			text: 'Hello world',
			html: '<b>Hello world</b>',
		};

		// Send mail with defined transport object
		transporter.sendMail(mailOptions, function (error, info) {

			if(error)
				console.log(error);
			else
				console.log('Message sent: ' + info.response);
		});*/

		/*var client = modbus.createTCPClient(config.plcPort, config.plcAddress, function (error) {

			if(error)
				console.log(error);
		});

		client.writeSingleRegister(2, 1, function (response, error) {

			if(error)
				console.log(error);
			console.log(response);
		});
		client.close();*/

		var client      = modbus.createTCPClient(502, '192.168.100.15'),
		    cntr        = 0,
		    closeClient = function () {
		        cntr += 1;
		        if (cntr === 5) {
		            client.close();
		        }
		    };

		client.on('close', function () {

		    console.log('closed');

		}.bind(this));

		var closeClient = function () {

		    client.close();

		}.bind(this);

		client.on('connect', function () { 
    
			console.log('Connected to PLC');

		    client.writeSingleRegister(5, 1, function (response, error) {

		        if(error)
					console.log(error);
				console.log(response);
		        closeClient();

		    }.bind(this));
		}.bind(this));

	});

	socket.on('turn-off-server', function (data) {

		console.log('Turn Off');
		/*var client = modbus.createTCPClient(config.plcPort, config.plcAddress, function (error) {

			if(error)
				console.log(error);
		});

		client.writeSingleRegister(10, 0, function (response, error) {

			if(error)
				console.log(error);
			console.log(response);
		});
		client.close();*/

		var client      = modbus.createTCPClient(502, '192.168.100.15'),
		    cntr        = 0,
		    closeClient = function () {
		        cntr += 1;
		        if (cntr === 5) {
		            client.close();
		        }
		    };

		client.on('close', function () {

		    console.log('closed');

		}.bind(this));

		var closeClient = function () {

		    client.close();

		}.bind(this);

		client.on('connect', function () { 
    
			console.log('Connected to PLC');

		    client.writeSingleRegister(5, 0, function (response, error) {

		        if(error)
					console.log(error);
				console.log(response);
		        closeClient();

		    }.bind(this));
		}.bind(this));

	});
});
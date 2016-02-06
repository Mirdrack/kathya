var config = require('./config');
var socket = require('socket.io-client')(config.socketAddress);
var nodemailer = require('nodemailer');
var modbus = require('jsmodbus');
var util = require('util');

// override logger function
modbus.setLogger(function (msg) { util.log(msg); } );

setInterval(polling, config.pollingTime);


socket.on('connect', function () {

	console.log('Connected to Samantha');

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

		var client      = modbus.createTCPClient(config.plc.port, config.plc.address),
		    cntr        = 0,
		    closeClient = function () {
		        cntr += 1;
		        if (cntr === 5) {
		            client.close();
		        }
		    };

		client.on('close', function () {

		    console.log('Closed connection');

		}.bind(this));

		var closeClient = function () {

		    client.close();

		}.bind(this);

		client.on('connect', function () { 
    
			console.log('Connected to PLC');

		    client.writeSingleRegister(config.plc.statusReg, 1, function (response, error) {

		        if(error)
					console.log(error);
				console.log(response);
		        closeClient();

		    }.bind(this));
		}.bind(this));

	});

	socket.on('turn-off-server', function (data) {

		console.log('Turn Off');
		var client      = modbus.createTCPClient(config.plc.port, config.plc.address),
		    cntr        = 0,
		    closeClient = function () {
		        cntr += 1;
		        if (cntr === 5) {
		            client.close();
		        }
		    };

		client.on('close', function () {

		    console.log('Closed connection');

		}.bind(this));

		var closeClient = function () {

		    client.close();

		}.bind(this);

		client.on('connect', function () { 
    
			console.log('Connected to PLC');

		    client.writeSingleRegister(config.plc.statusReg, 0, function (response, error) {

		        if(error)
					console.log(error);
				console.log(response);
		        closeClient();

		    }.bind(this));
		}.bind(this));

	});
});

function polling ()
{ 
	console.log('Polling data');

	var client      = modbus.createTCPClient(config.plc.port, config.plc.address),
	    cntr        = 0,
	    closeClient = function () {
	        cntr += 1;
	        if (cntr === 5) {
	            client.close();
	        }
	    };

	client.on('close', function () {

	    console.log('Closed connection[Read]');

	}.bind(this));

	var closeClient = function () {

	    client.close();

	}.bind(this);

	client.on('connect', function () { 

		console.log('Connected to PLC[Read]');

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
				
				console.log(data);

				//socket.emit('new-read', data);
				
			}
	        closeClient();

	    }.bind(this));
	}.bind(this)); 
}
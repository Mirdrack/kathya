var config = require('./config');
var socket = require('socket.io-client')(config.socketAddress);
var modbus = require('jsmodbus');
var nodemailer = require('nodemailer');

socket.on('connect', function () {

	console.log('Connected to the server');

	socket.on('turn-on-server', function (data) {

		console.log('Turn On');

		/*// Create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://aitanastudios%40gmail.com:wAd4E6adruge@smtp.gmail.com');

		// Setup E-mail data
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

		/*var client = modbus.createTCPClient(502, '127.0.0.1', function (err) {
		    if (err) {
		        
		        console.log(err);
		        process.exit(0);
		    }
		});

		client.writeSingleRegister(10, 1, function (response, error) {
		    
		    if(error)
		    	console.log(error);
		    console.log(response);
		});
		client.close();*/


	});

	socket.on('turn-off-server', function (data) {

		console.log('Turn Off');

		var client = modbus.createTCPClient(502, '127.0.0.1', function (err) {
		    if (err) {
		        
		        console.log(err);
		        process.exit(0);
		    }
		});

		client.writeSingleRegister(10, 0, function (response, error) {
		    
		    if(error)
		    	console.log(error);
		    console.log(response);
		});
		client.close();
	});
});
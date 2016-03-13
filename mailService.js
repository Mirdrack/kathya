var mailService = function (nodemailer, config) {
		
	var transporter = nodemailer.createTransport(config.smtpAccount);

	var service = {

		// Create reusable transporter object using the default SMTP transport
		
		sendMayaAlarm: function () {

			console.log('Maya Alarm');

			/*var mailOptions = {
				from: 'Aitana Studios <aitanastudios@gmail.com>',
				to: 'alexalvaradof@gmail.com, soporte@aitanastudios.com',
				subject: 'Alarma en el pozo!',
				text: 'Alarma. La puerta del cuarto del variador ha sido abierta',
				html: '<b>Alarma. La puerta del cuarto del variador ha sido abierta</b>',
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if(error)
					console.log(error);
				else
					console.log('Message sent: ' + info.response);
			});*/
		},

		sendElectraAlarm: function () {

			console.log('Electra Alarm');

			/*var mailOptions = {
				from: 'Aitana Studios <aitanastudios@gmail.com>',
				to: 'alexalvaradof@gmail.com, soporte@aitanastudios.com',
				subject: 'Alarma en el pozo!',
				text: 'Alarma. Se ha detectado movimiento afuera del cuarto del variador',
				html: '<b>Alarma. Se ha detectado movimiento afuera del cuarto del variador</b>',
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if(error)
					console.log(error);
				else
					console.log('Message sent: ' + info.response);
			});*/
		},

		sendHestiaAlarm: function () {

			console.log('Hestia Alarm');

			/*var mailOptions = {
				from: 'Aitana Studios <aitanastudios@gmail.com>',
				to: 'alexalvaradof@gmail.com, soporte@aitanastudios.com',
				subject: 'Alarma en el pozo!',
				text: 'Alarma. La puerta del cuarto de riego ha sido abierta',
				html: '<b>Alarma. La puerta del cuarto de riego ha sido abierta</b>',
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if(error)
					console.log(error);
				else
					console.log('Message sent: ' + info.response);
			});*/
		},

		sendAretusaAlarm: function () {

			console.log('Aretusa Alarm');

			/*var mailOptions = {
				from: 'Aitana Studios <aitanastudios@gmail.com>',
				to: 'alexalvaradof@gmail.com, soporte@aitanastudios.com',
				subject: 'Alarma en el pozo!',
				text: 'Alarma. Se ha detectado movimiento dentro del cuarto de riego',
				html: '<b>Alarma. Se ha detectado movimiento dentro del cuarto de riego</b>',
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if(error)
					console.log(error);
				else
					console.log('Message sent: ' + info.response);
			});*/
		},
	};

	return service;
};

module.exports = mailService;
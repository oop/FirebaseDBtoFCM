const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendPushNotification = functions.database
	.ref('/users/{user_id}') // Put your path here with the params.
	.onWrite(async (change, context) => {
		try {
			const { after } = change;
			const { _data } = after;
			const { deviceToken } = _data.receiver; // Always send the device token within the data entry.
			
			if(!deviceToken) return;
			
			const payload = {
				notification: {
					title: 'Notification',
					body: `FCM notification triggered!`
				},
				data: context.params // Passing the path params along with the notification to the device. [optional]
			};
			
			return await admin.messaging().sendToDevice(deviceToken, payload);
		} catch (ex) {
			return console.error('Error:', ex.toString());
		}
	});

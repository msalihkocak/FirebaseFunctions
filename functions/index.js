const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase Mehmet Salih Koçak!");
});

exports.observeFollowing = functions.database.ref('/following/{uid}/{followingId}').onCreate( (snapshot, context) => {

	var uid = context.params.uid
	var followingId = context.params.followingId

	console.log('User with id: ' + uid + ' is following the user with id: ' + followingId);

	return admin.database().ref('/users/' + uid).once('value', snapshot => {

		var followerUser = snapshot.val();

		return admin.database().ref('/users/' + followingId).once('value', snapshot => {
		
			var userBeingFollowed = snapshot.val();
			console.log("Follower " + followerUser.username + ", beingFollowed " + userBeingFollowed.username)

			var message = {
				notification: {
	    			title: 'You got a new follower!',
	    			body: followerUser.username +' is following you.'
	  			},
	  			data: {
	  				followerId: uid
	  			},
				token: userBeingFollowed.fcmToken
			};

			admin.messaging().send(message)
			.then((response) => {
	    		console.log('Successfully sent message:', response);
	    		return;
			})
			.catch((error) => {
				console.log('Error sending message:', error);
			});
		})
	})
})

exports.sendPushNotifications = functions.https.onRequest((req, res) => {
	res.send("Attempting to send push notification...")
	console.log("LOGGER --- Trying to push notification")

	var uid = '2CIxHgGLtNZlO09A8vxAcgXwHaD2';
	return admin.database().ref('/users/' + uid).once('value', snapshot => {
		var user = snapshot.val();
		console.log("User: username " + user.username + ", fcmToken " + user.fcmToken)

		var message = {
			notification: {
    			title: 'Testing from script',
    			body: 'body text'
  			},
			token: user.fcmToken
		};

		admin.messaging().send(message)
		.then((response) => {
    		console.log('Successfully sent message:', response);
    		return;
		})
		.catch((error) => {
			console.log('Error sending message:', error);
		});
	})
})


import admin from 'firebase-admin';
import { readFile } from 'fs/promises';  // Import the async file reading function

// Read and parse the service account JSON file
async function initializeFirebase() {
  try {
    const serviceAccount = JSON.parse(await readFile(new URL('./share3-masr-firebase-adminsdk-ut6h5-6ef2e58684.json', import.meta.url), 'utf-8'));
    
    // Initialize Firebase with the service account
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase initialized');
  } catch (error) {
    console.error('Error reading service account file:', error);
  }
}

// Function to send FCM notification
async function sendNotification(fcmToken, title, body) {
  await initializeFirebase();
  const message = {
    token: fcmToken,  // The recipient device's FCM token
    notification: {
      title: title,    // Notification title
      body: body,      // Notification body
    },
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

// // Example usage
// async function main() {
//   await initializeFirebase();

//   const fcmToken = 'es3iZXxqRaCYJCqbFLMDe8:APA91bFOlaCTfjxuII2NeC7_y00uTDEYkcm4F3gtVsetGof5hp5DQZsepCP5NHQBlZDtmteAh1XnZMMB69bQqNMC7mRslq1HKuTAM8Wexcf94-fvMXLSz1w';  // Replace with the target device's FCM token
//   const title = 'Test Notification';
//   const body = 'This is a test notification from Firebase Cloud Messaging!';

//   // Send notification
//   sendNotification(fcmToken, title, body);
// }

// main();

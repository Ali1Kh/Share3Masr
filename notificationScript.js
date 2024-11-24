import admin from 'firebase-admin';


import dotenv from 'dotenv';
dotenv.config();

// Function to initialize Firebase using service account key stored securely in environment variables
async function initializeFirebase() {
  try {
    // Get the base64-encoded key from the environment variable
    const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!base64Key) {
      throw new Error('Firebase service account key not found in environment variable.');
    }

    // Decode the base64 key and parse the JSON
    const serviceAccount = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf-8'));

    // Initialize Firebase with the service account
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),

    });

    console.log('Firebase initialized');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Function to send FCM notification
export async function sendNotification(fcmToken, title, body) {
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
      console.error('Error sending message:', error);
    });
} 

// Example usage
async function main() {
  // await initializeFirebase();

  const fcmToken = 'es3iZXxqRaCYJCqbFLMDe8:APA91bFOlaCTfjxuII2NeC7_y00uTDEYkcm4F3gtVsetGof5hp5DQZsepCP5NHQBlZDtmteAh1XnZMMB69bQqNMC7mRslq1HKuTAM8Wexcf94-fvMXLSz1w';  // Replace with the target device's FCM token
  const title = 'Test Notification';
  const body = 'This is a test notification from Firebase Cloud Messaging!';

  // Send notification
  sendNotification(fcmToken, title, body);
}

main();

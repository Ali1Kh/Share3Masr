// // notificationScript.js
// import admin from 'firebase-admin';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { readFileSync } from 'fs';

// // Convert the path to a valid URL
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const serviceAccountPath = new URL('./share3-masr-firebase-adminsdk-ut6h5-948ed7040a.json', import.meta.url);

// // Read the service account JSON file
// const serviceAccount = JSON.parse(readFileSync(serviceAccountPath));

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Function to send notification
// const sendNotification = async (registrationToken, message) => {
//   try {
//     const response = await admin.messaging().send({
//       // token: registrationToken,
//       topic:'lol',
//       notification: {
//         title: message.title,
//         body: message.body,
//       },
//       data: message.data || {},
//     });
//     console.log('Successfully sent message:', response);
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// };

// // Example usage
// const registrationToken = 'YOUR_DEVICE_REGISTRATION_TOKEN'; // Replace with your actual token
// const message = {
//   title: 'Hello!',
//   body: 'This is a notification from your Node.js script.',
// };

// sendNotification(registrationToken, message);

// notificationScript.js
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

// Convert the path to a valid URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = new URL('./share3-masr-firebase-adminsdk-ut6h5-948ed7040a.json', import.meta.url);

// Read the service account JSON file
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notification
export const sendNotification = async (registrationToken, message) => {
  try {
    const response = await admin.messaging().sendToDevice(registrationToken, {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {},
    });
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

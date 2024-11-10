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
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Use `require` for Firebase Admin SDK (since it's not fully ES module compatible)
import admin from 'firebase-admin';

// Convert the path to a valid URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use a relative path for the service account file (assuming it's in the same folder as your script)
const serviceAccountPath = join(__dirname, './share3-masr-firebase-adminsdk-ut6h5-6d57cbbd62.json');

// Log the service account path to ensure it is correct
console.log('Service Account Path:', serviceAccountPath);

// Read the service account JSON file
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log('Service Account loaded successfully');
} catch (error) {
  console.error('Error reading service account file:', error.message);
  process.exit(1);  // Exit if the service account file is not loaded
}

// Initialize Firebase Admin SDK with the service account credentials
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);  // Exit if Firebase Admin SDK fails to initialize
}

// Function to send a notification
export const sendNotification = async (registrationToken,message) => {
  
  const DataToSend = {
    token: registrationToken,
     // Use the token if you're sending to a specific device
    notification: {
      title: message.title,
      body: message.body,
    },
  };
  
  admin.messaging().send(DataToSend)

    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

};



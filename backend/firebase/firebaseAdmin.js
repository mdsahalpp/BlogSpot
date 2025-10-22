import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin
let serviceAccount;

try {
  // Check if we're in production (using environment variables)
  if (process.env.FIREBASE_PROJECT_ID) {
    // Production: Use environment variables
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
        process.env.FIREBASE_CLIENT_EMAIL
      )}`,
      universe_domain: "googleapis.com",
    };
  } else {
    // Development: Use service account key file
    const serviceAccountPath = path.join(
      process.cwd(),
      "firebase",
      "serviceAccountKey.json"
    );
    const serviceAccountData = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountData);
  }

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Firebase Admin initialization failed:", error);
  throw new Error(
    "Firebase Admin SDK initialization failed. Please check your service account configuration."
  );
}

export default admin;

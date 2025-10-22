# Deployment Guide - Firebase Configuration

## 🚨 **Problem Fixed**

The deployment error was caused by importing `serviceAccountKey.json` directly, which is not available in production environments. This has been fixed by using environment variables instead.

## 🔧 **Solution Implemented**

The Firebase Admin SDK now automatically detects the environment:

- **Development**: Uses `serviceAccountKey.json` file
- **Production**: Uses environment variables

## 📋 **Environment Variables Setup**

### **For Render.com Deployment:**

1. **Go to your Render dashboard**
2. **Navigate to your backend service**
3. **Go to Environment tab**
4. **Add these Firebase environment variables:**

```env
# Firebase Configuration (Production)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Other required variables
MONGO_URI=your-mongodb-connection-string
RAZORPAY_API_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NODE_ENV=production
```

## 🔑 **How to Get Firebase Environment Variables**

### **Step 1: Get Service Account Key**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file

### **Step 2: Extract Values**

From the downloaded JSON file, extract these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id", // → FIREBASE_PROJECT_ID
  "private_key_id": "your-private-key-id", // → FIREBASE_PRIVATE_KEY_ID
  "private_key": "-----BEGIN PRIVATE KEY-----\n...", // → FIREBASE_PRIVATE_KEY
  "client_email": "service@project.iam.gserviceaccount.com", // → FIREBASE_CLIENT_EMAIL
  "client_id": "your-client-id", // → FIREBASE_CLIENT_ID
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### **Step 3: Format Private Key**

**Important**: The `FIREBASE_PRIVATE_KEY` needs to be formatted correctly:

- Replace `\n` with actual newlines
- Keep the quotes around the entire key
- Example:

```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## 🚀 **Deployment Steps**

1. **Set all environment variables** in your deployment platform
2. **Redeploy your backend**
3. **Test the deployment** by checking the logs

## ✅ **Verification**

After deployment, you should see:

```
Firebase Admin initialized successfully
Connected to: your-mongodb-host
Server is running on port 5000
```

## 🔒 **Security Notes**

- ✅ **Never commit** `serviceAccountKey.json` to version control
- ✅ **Use environment variables** in production
- ✅ **Keep your Firebase credentials secure**
- ✅ **Rotate your service account keys regularly**

## 🆘 **Troubleshooting**

### **Error: "Firebase Admin SDK initialization failed"**

- Check that all Firebase environment variables are set correctly
- Verify the private key format (newlines, quotes)
- Ensure the service account has proper permissions

### **Error: "Cannot find module serviceAccountKey.json"**

- This should be fixed with the new implementation
- Make sure you're using the updated code

### **Error: "Invalid private key"**

- Check the private key format
- Ensure there are no extra spaces or characters
- Verify the key is properly escaped

## 📞 **Support**

If you encounter any issues:

1. Check the deployment logs
2. Verify all environment variables are set
3. Test locally with environment variables first
4. Contact support with specific error messages

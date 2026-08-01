# Admin Login Setup Guide

## 401 Unauthorized Error Fix

अगर आपको login करते समय **401 Unauthorized** error आ रही है, तो follow करें:

### Step 1: `.env` File Create करें

Backend folder में `.env` file create करें और ये add करें:

```env
MONGO_URI=mongodb://localhost:27017/vinayak-jewellers
# या आपकी MongoDB connection string

JWT_SECRET=your_super_secret_jwt_key_here
# कोई भी random string (minimum 32 characters)

ADMIN_EMAIL=admin@vinayakjewellers.com
# आपका admin email

ADMIN_PASSWORD=your_secure_password_123
# आपका secure password

# Cloudinary (अगर images upload करनी हैं)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: Admin User Create करें

Backend folder में terminal open करें और run करें:

```bash
npm run seed:admin
```

यह script:

- `.env` file से `ADMIN_EMAIL` और `ADMIN_PASSWORD` read करेगा
- Database में admin user create करेगा
- अगर user पहले से exists करता है तो skip करेगा

### Step 3: Login करें

`/admin-login` page पर जाकर:

- **Email**: `.env` में जो `ADMIN_EMAIL` set किया है
- **Password**: `.env` में जो `ADMIN_PASSWORD` set किया है

### Troubleshooting

**अगर अभी भी error आ रही है:**

1. **Check करें कि MongoDB running है:**

   ```bash
   # MongoDB service check करें
   ```

2. **Check करें कि backend server running है:**

   ```bash
   cd backend
   npm run dev
   ```

3. **Check करें कि `.env` file में सही values हैं:**

   - `ADMIN_EMAIL` और `ADMIN_PASSWORD` set हैं
   - `MONGO_URI` सही है

4. **Database में manually check करें:**
   - MongoDB में `users` collection check करें
   - Admin user exists करता है या नहीं

### Quick Test

Admin user create हो गया है या नहीं check करने के लिए:

```bash
cd backend
npm run seed:admin
```

अगर user already exists है तो message दिखेगा: "Admin user already exists"

---

**Note:** Tidio widget warning (font preload) एक third-party library warning है और functionality को affect नहीं करती। इसे ignore कर सकते हैं।


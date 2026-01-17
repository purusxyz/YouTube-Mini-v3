# YouTube Companion Dashboard

A full-stack YouTube Companion Dashboard that helps creators manage **one uploaded video** in detail using the **YouTube Data API v3**.

Built with:
- React + TypeScript + Vite
- Tailwind CSS v4 (latest)
- Node.js + Express (TypeScript)
- MongoDB Atlas
- Google OAuth 2.0
- YouTube Data API v3

---

## 🚨 Important Limitation (YouTube Rule)

Uploading videos via API is **NOT allowed** for normal apps.

👉 Videos **must be uploaded manually** using YouTube Studio.

---

## 1️⃣ How to Upload an Unlisted Video (MANDATORY FIRST STEP)

1. Go to https://studio.youtube.com  
2. Click **Create → Upload video**
3. Upload your video
4. Audience → *Not made for kids*
5. Visibility → **UNLISTED**
6. Finish upload
7. Copy the Video ID from URL:




---

## 2️⃣ Dashboard User Flow

1. Sign in with Google (OAuth)
2. Paste the Video ID
3. Dashboard fetches video details
4. User can:
   - Edit title & description
   - Add comments
   - Reply to comments
   - Delete own comments
   - Write private notes
5. All actions are logged in MongoDB Atlas

---






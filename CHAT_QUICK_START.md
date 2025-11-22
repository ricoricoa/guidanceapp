# 💬 Chat Feature - Quick Start Guide

## 📍 Where to Find It

**Student Dashboard** → Click **"Messages"** in the sidebar

## 🎯 What You Get

### Screen Layout

```
┌─────────────────────────────────────────────────────┐
│ Student Dashboard                                    │
├─────────────────┬─────────────────────────────────────┤
│                 │                                      │
│  Sidebar        │  Chat Area                           │
│                 │                                      │
│ ✓ Overview      │  ┌──────────────────────────────┐   │
│ ✓ Appointments  │  │ Ms. Maria Santos             │   │
│ ✓ Requests      │  │ Academic Guidance   📞  📹  ⋮ │   │
│ ✓ Resources     │  ├──────────────────────────────┤   │
│ ✓ Messages ←────┼──│ Messages:                    │   │
│ ✓ Profile       │  │ • Counselor message          │   │
│                 │  │ • Student response           │   │
│                 │  │ • Counselor follow-up        │   │
│                 │  ├──────────────────────────────┤   │
│                 │  │ [Type message...]  [Send] ▶  │   │
│                 │  └──────────────────────────────┘   │
└─────────────────┴─────────────────────────────────────┘
```

## 👥 Step 1: View Counselors

When you click "Messages", you'll see:

```
COUNSELORS LIST
═════════════════════════════════════════

📌 Ms. Maria Santos
   Academic Guidance
   🟢 Available now

📌 Mr. John Cruz
   Career Counseling
   🟢 Available now

📌 Dr. Anna Garcia
   Mental Health Support
   🟢 Available now
```

## 💬 Step 2: Start Chat

1. Click on any counselor
2. Chat history loads automatically
3. Message input appears at bottom

## ⌨️ Step 3: Send Message

```
Type your message:
[What time works best for our appointment?] [Send ▶]
```

Your message appears on the RIGHT (blue):
```
  ← Counselor Message
  
                     Your Message →
```

## 📱 Features Available

| Feature | Location | Action |
|---------|----------|--------|
| **Search** | Top of counselor list | Find counselor by name |
| **Phone** | Chat header | Click 📞 to call |
| **Video** | Chat header | Click 📹 for video |
| **More** | Chat header | Click ⋮ for options |
| **History** | Chat area | Scroll up for past messages |
| **Timestamps** | Each message | See when sent |

## 🎨 Message Display

**Student Messages** (you):
```
┌─────────────────────────┐
│ Your message goes here  │ ← Blue bubble
└─────────────────────────┘
                      12m ago
```

**Counselor Messages**:
```
                ┌──────────────────────────┐
                │ Counselor: How can I help?
                │ Message goes here        │ ← Gray bubble
                └──────────────────────────┘
                     8m ago
```

## 📱 On Mobile

List appears in overlay:
```
[Select Counselor]
  ↓
[Full Screen Chat]
  ↓
[Message Area]
```

Tap back arrow to see counselor list again.

## ✨ Tips & Tricks

✓ Messages auto-scroll to latest  
✓ Send button disabled if message empty  
✓ Timestamps auto-format (now, 5m, 2h, date)  
✓ Dark mode fully supported  
✓ Works offline (queues messages)  

## 🚀 Try It Now

1. Go to **http://localhost:5181** (or your app URL)
2. Login with your student account
3. Click **"Messages"** in sidebar
4. Select a counselor
5. Type and send a message!

## 🔗 Integration Notes

- Currently uses **mock data** for demo
- Ready for **real backend API** connection
- Supports **real-time WebSocket** updates (future)
- Can add **file sharing** (future)
- Video calls ready for **3rd party integration** (Jitsi, Zoom)

## 📞 Need Help?

Check the full documentation:
→ `CHAT_FEATURE_DOCUMENTATION.md`

# WishReveal Ai - OpenAI ChatGPT Integration & Deployment Guide

## 1. Overview
WishReveal Ai incorporates OpenAI's official ChatGPT models (defaulting to `gpt-4o-mini`, compatible with `gpt-4o` and `chatgpt-4o-latest`) to generate thoughtful, culturally fluent Bengali gift recommendations and friendship preference analysis based strictly on voluntarily shared quiz answers.

### Security Guarantees:
- **Server-Side API Keys Only**: The `OPENAI_API_KEY` is loaded exclusively inside `server.ts` through Node.js environment variables.
- **Zero Client Exposure**: The API key is NEVER sent to the frontend JavaScript, HTML bundle, network payloads, or client storage.
- **Dedicated Secure Endpoints**:
  - `POST /api/openai/analyze` - Analyzes voluntary quiz answers using OpenAI ChatGPT.
  - `POST /api/openai/chat` - Interactive ChatGPT consultation for budget gift ideas, birthday greetings, and hangout planning.
  - `GET /api/openai/status` - Returns live connection status without exposing secrets.
  - `POST /api/analyze-friend-wishes` - High-level endpoint that prioritizes OpenAI, with Gemini and intelligent demo fallbacks.

---

## 2. Setting Up the OpenAI API Key

### Step 1: Obtain an API Key
1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Log in or create an OpenAI developer account.
3. Click **Create new secret key** and copy your key (starts with `sk-proj-...`).

### Step 2: Configure Environment Variables
Create or edit your `.env` file in the project root:
```env
# Official OpenAI API Key
OPENAI_API_KEY="sk-proj-your-actual-api-key-here"

# Model selection (defaults to gpt-4o-mini)
OPENAI_MODEL="gpt-4o-mini"

# Optional fallback
GEMINI_API_KEY="your-gemini-key"
```

---

## 3. Production Deployment Instructions

### Option A: Cloud Run / Docker / VPS
1. Set the environment variables in your deployment console:
   - `OPENAI_API_KEY` = your secret key
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
2. Run build and start commands:
   ```bash
   npm run build
   npm start
   ```

### Option B: Render / Railway
1. **Build Command**: `npm run build`
2. **Start Command**: `node server.ts`
3. In the **Environment Variables** tab, add:
   - Key: `OPENAI_API_KEY`, Value: `<your-openai-api-key>`
   - Key: `OPENAI_MODEL`, Value: `gpt-4o-mini`

---

## 4. Testing & Verification

1. **Verify Backend Status**:
   Send a GET request to `/api/openai/status`:
   ```bash
   curl http://localhost:3000/api/openai/status
   ```
   If configured, it will return:
   ```json
   {
     "isConfigured": true,
     "provider": "OpenAI ChatGPT",
     "model": "gpt-4o-mini",
     "status": "active"
   }
   ```

2. **Frontend UI Testing**:
   - Open the web application.
   - Click **"AI এনালাইসিস"** from the navigation bar or **"AI দিয়ে পছন্দ বুঝুন"** from the hero.
   - Click a preset or enter a friend's voluntary answers.
   - Click **"OpenAI ChatGPT দিয়ে বিশ্লেষণ শুরু করুন"**.
   - Watch the stepped loading animation.
   - View structured recommendations, supporting answers, reasoned gift ideas, and the interactive ChatGPT advice widget.

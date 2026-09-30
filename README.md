# PantryPro: The Intent-Driven Culinary Curation Engine

A modern, lightning-fast, mobile-first web application designed for busy professionals and students. PantryPro turns random fridge leftovers into pro-level, high-yield gourmet meals in under 15 minutes using **MongoDB Atlas Vector Search** and **Google Gemini AI**.

---

## 🚀 Key Features

1. **"What's in Your Fridge?" Smart Matcher (Vector Search)**
   - Enter leftover ingredients via typing, instant tap pills, or voice input (Web Speech API).
   - Generates 768-dimensional text embeddings via Google Gemini (`text-embedding-004`) and executes MongoDB Atlas `$vectorSearch` pipeline with cosine similarity.
   - Filters by preparation speed (< 10m ultra-fast, < 20m weeknight, < 30m) and dietary preferences (Vegan, Gluten-Free, Eggless, High-Protein, Dairy-Free).

2. **The "Chef's Touch" Dynamic Persona Rewriting**
   - Live AI rewriting engine powered by Google Gemini (`gemini-2.5-pro` & `gemini-2.5-flash`).
   - Choose between pro culinary personas:
     - **Chef Marco (Michelin Star):** Pan temperature cues, Maillard reaction, wine/vinegar deglazing.
     - **Chef Maya (10-Min Hustle):** Speed hacks, one-pan efficiency, zero wasted motion.
     - **Chef Rohan (Desi Modernist):** Spice blooming, tadka smoke infusion, amchur/lime acidity.
     - **Chef Kenji (Street Food Lab):** Wok-hei charring, caramelized perimeter glazes.
     - **Dr. Elena (Food Science Lab):** Starch gelatinization, thermal kinetics, moisture delta.
   - Dedicated highlight callouts for **Heat Control**, **Acidity & Brighteners**, **Textural Contrast**, and **Resting Times**.

3. **Quick Byte Recipe Card UI & Cooking Focus Mode**
   - Mobile-first, card-based interface with prep time badges, flavor profiles, and dietary flags.
   - **Full-Screen Hands-Free Cooking HUD**:
     - Keeps your phone screen awake while cooking using the **Screen Wake Lock API** (`navigator.wakeLock`).
     - Interactive step countdown timer with audio chime synthesis.
     - Voice narration of steps with Web Speech Synthesis (`window.speechSynthesis`).
     - Celebratory confetti finish upon completing the dish!

4. **Pantry & Curation Vault (MongoDB Atlas Schema)**
   - "Save to My Vault" with real-time MongoDB Atlas synchronization.
   - Dedicated Vault page (`/vault`) with saved collections and nutrition macro trackers.
   - **AI Pantry Synthesizer**: Create brand-new custom recipes from scratch matching exact leftover ingredients, embed them into Atlas, and save them in your vault.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Canvas-Confetti.
- **Backend & Database:** MongoDB Atlas (Node.js driver) with `$vectorSearch` aggregation stage, connection pooling, and fallback in-memory cache.
- **AI Integration:** Google Gemini API (`@google/generative-ai`) utilizing `gemini-2.5-pro`, `gemini-2.5-flash`, and `text-embedding-004`.

---

## 📋 MongoDB Atlas Vector Search Setup

To enable vector similarity search on your MongoDB Atlas cluster:

### Step 1: Create MongoDB Atlas Cluster & Database
1. Create a free or dedicated cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database named `pantrypro` and a collection named `recipes`.

### Step 2: Create the Vector Search Index
1. In the MongoDB Atlas UI, navigate to your cluster &rarr; **Atlas Search** tab &rarr; **Create Search Index**.
2. Select **Atlas Vector Search** and choose the **JSON Editor**.
3. Select database `pantrypro` and collection `recipes`.
4. Name the index `vector_index`.
5. Paste the following JSON index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "totalTimeMinutes"
    },
    {
      "type": "filter",
      "path": "dietaryFlags"
    }
  ]
}
```

6. Click **Create Vector Search Index**. Atlas will compile the index within 1-2 minutes.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yourdomain.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=pantrypro

# Google Gemini API Key
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Note:** PantryPro is built with automatic resilience. If `MONGODB_URI` or `GEMINI_API_KEY` are not set initially, PantryPro automatically operates in an **In-Memory Vector Sandbox Mode** with simulated embeddings, allowing immediate testing and local development!

---

## 🏃 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Initial Recipes & Generate Embeddings
```bash
npm run seed
```
*(Or click the "Seed DB" button directly in the web app navigation header)*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Mobile-First Features

- **Bottom Sheet Navigation:** Quick one-thumb access to Fridge Matcher, AI Synthesizer, and Vault.
- **Microphone Voice Search:** Tap the microphone icon to speak your leftover ingredients.
- **Screen Wake Lock:** Keeps your phone screen awake on the kitchen counter without locking.
- **High-Contrast Step UI:** Legible text from 3 feet away while cooking over the stove.

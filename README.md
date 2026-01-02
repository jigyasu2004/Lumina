# Lumina Readers

**Lumina Readers** is a premium, bilingual digital reading platform designed to bring immersive sci-fi and philosophical literature to the web. It focuses on a distraction-free reading experience, bridging the gap between modern technology and timeless storytelling.

🌐 **[Launch Live App](https://ai.studio/apps/drive/176_k3BoK_OnNej0FJXWB8i3IJbhhbCwX?fullscreenApplet=true)**

## 🌟 Features

- **Bilingual Support**: Seamlessly toggle between **English** and **Hindi** for all stories and interface elements.
- **Immersive Reader**:
  - Distraction-free UI.
  - Adjustable font sizes.
  - Integrated **Text-to-Speech (TTS)** for audio narration.
- **Thematic Design**:
  - Beautiful **Dark Mode** and Light Mode support.
  - Smooth animations and transitions using Framer Motion.
- **Local Persistence**:
  - Rating system saves user feedback directly to the browser's local storage.
  - No login required; progress and preferences remain on your device.
- **Responsive**: Fully optimized for mobile, tablet, and desktop devices.

## 📚 Featured Stories

- **The Quiet Room**: A philosophical journey about the end of the universe.
- **The Last Train to Tomorrow**: A time-travel mystery about regret and memory.
- **The Backbench Algorithm**: A campus thriller involving code and destiny.
- **The Last Memory of Echo**: A sci-fi drama about AI and human emotion.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6+
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: React Markdown

## 🚀 How to Run Locally

This project is built as a static Single Page Application (SPA).

### Method 1: Standard Development (Recommended)

If you are setting this up as a standard Node project (e.g., using Vite):

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

### Method 2: Static Serving

If you are using the browser-native ES modules approach (as seen in the `index.html` import map):

1.  You simply need to serve the root directory.
2.  You can use Python's built-in server:
    ```bash
    python3 -m http.server 8000
    ```
3.  Open `http://localhost:8000` in your browser.

## 📦 Deployment

Since Lumina Readers is a static application with no backend dependencies (data is stored in local files and local storage), it can be deployed anywhere.

### Vercel / Netlify / Cloudflare Pages

1.  **Build** the project (if using a build step like Vite):
    ```bash
    npm run build
    ```
2.  **Deploy** the `dist` folder.
    *   **Command**: `npm run build`
    *   **Output Directory**: `dist`

### GitHub Pages

1.  Push the code to a GitHub repository.
2.  Configure GitHub Actions to build and deploy to the `gh-pages` branch.

## ✍️ Adding New Stories

1.  Create a new file in `services/stories/` (e.g., `newStory.ts`).
2.  Follow the `Story` interface defined in `types.ts`.
3.  Import and register the story in `services/storyService.ts`.

---

*Lumina Readers — Where stories breathe.*

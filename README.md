# Memorize Bible Verses Web App

Practice memorizing bible verses by speaking them into your phone. This web app is built with the following tools:

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition
- [API.Bible](https://api.bible/) for searching for bible verses based on the selected bible translation
- [jsdiff](https://www.npmjs.com/package/diff) for a text comparison of the spoken verse with the actual verse

## Running Locally

1. Clone the repository by running the following command in your terminal:
   ```
   git clone https://github.com/CodingForChrist/memorize-bible-verses.git
   ```
2. Create a `.env` file based on the `.env.example` file at the root of this repository. You only need this .env file if you want to change the url for the [API Server](https://github.com/CodingForChrist/memorize-bible-verses-api-server) to run it locally.

   ```bash
   cd memorize-bible-verses
   cp .env.example .env
   ```

3. Install dependencies and start the local dev server:
   ```bash
   npm install
   npm run dev
   ```

# How-to Video

Here's a video that demonstrates how to use this bible memorization app:

[![ How-to video for bible verse memorization app](https://img.youtube.com/vi/oVg6cT8aDH8/0.jpg)](https://youtu.be/oVg6cT8aDH8)

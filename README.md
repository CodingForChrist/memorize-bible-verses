# Memorize Bible Verses Web App

Practice memorizing bible verses by speaking them into your phone. This web app is built with

- the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition
- [API.Bible](https://scripture.api.bible/) for searching for bible verses based on the selected bible translation
- [jsdiff](https://www.npmjs.com/package/diff) for a text comparison of the spoken verse with the actual verse

## Running Locally

1. Clone the repository by running the following command in your terminal:
   ```
   git clone https://github.com/CodingForChrist/memorize-bible-verses.git
   ```
2. Create a `.env` file based on the `.env.sample` file at the root of this repository. You only need this .env file if you want to change the url for the [memorize-scripture-api-server](https://github.com/CodingForChrist/memorize-scripture-api-server) to run it locally.

   ```bash
   cd memorize-bible-verses
   cp .env.sample .env
   ```

3. Install dependencies and start the local dev server:
   ```bash
   npm install
   npm run dev
   ```

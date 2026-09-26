# AI Summarizer

A browser-based AI text summarizer built with **JavaScript** and **Transformers.js**.

## Demo

[Live Demo](https://aliganji14.github.io/AI-Summarizer/?utm_source=chatgpt.com)

## Features

* AI-powered text summarization
* Runs directly inside the browser
* No backend or API required
* Web Worker for non-blocking AI inference
* Summary length selection
* Word and character counter
* Copy summary to clipboard
* Clear input
* Responsive Persian UI
* Minimum text validation

## Tech Stack

* HTML5
* CSS3
* JavaScript
* Transformers.js
* Web Worker
* Hugging Face model: `Xenova/distilbart-cnn-6-6`

## How It Works

The application loads the AI model directly in the browser using Transformers.js.

The summarization process runs inside a **Web Worker**, which prevents the main UI from freezing while the model is loading or generating the summary.

User-entered text is processed locally in the browser and is not sent to a backend API.

> Note: The AI model files are downloaded from the CDN/Hugging Face when the model is loaded for the first time.

## Project Structure

```text
AI-Summarizer/
├── index.html
├── style.css
├── app.js
├── worker.js
└── README.md
```

## Run Locally

Clone the repository and open the project using a local development server such as **VS Code Live Server**.

Then open:

```text
http://localhost:5500
```

## Privacy

The application does not send the text entered by the user to a backend server or AI API.

AI inference happens directly in the browser.

## Limitations

The current summarization model is primarily designed for English text, so summarization quality for Persian text may be limited.

## Future Improvements

* Support for multilingual summarization
* Better loading progress indicator
* Dark mode
* Download summary as TXT/PDF
* Improved error handling
* Additional summarization models

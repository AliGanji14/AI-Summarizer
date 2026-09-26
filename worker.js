import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/transformers.min.js';

let summarizer = null;

async function loadModel() {
  self.postMessage({ status: 'loading' });

  summarizer = await pipeline(
    'summarization',
    'Xenova/distilbart-cnn-6-6'
  );

  self.postMessage({ status: 'ready' });
}

loadModel();

self.onmessage = async (event) => {
  const { text, max_new_tokens } = event.data;

  try {
    while (!summarizer) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const result = await summarizer(text, {
      max_new_tokens: max_new_tokens
    });

    self.postMessage({
      status: 'result',
      summary: result[0].summary_text
    });

  } catch (error) {
    self.postMessage({
      status: 'error',
      error: error.message
    });
  }
};
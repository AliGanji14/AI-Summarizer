import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/transformers.min.js';

let summarizer = null;

async function loadModel() {
  self.postMessage({ status: 'loading' });

  summarizer = await pipeline(
    'summarization',
    'Xenova/distilbart-cnn-6-6',
    {
      progress_callback: (progress) => {
        if (progress.status === 'progress') {
          self.postMessage({
            status: 'progress',
            progress: Math.round(progress.progress)
          });
        }
      }
    }
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

    let min_new_tokens = 20;

    if (max_new_tokens === 70) {
      min_new_tokens = 40;
    }

    if (max_new_tokens === 120) {
      min_new_tokens = 70;
    }

    const result = await summarizer(text, {
      min_new_tokens: min_new_tokens,
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
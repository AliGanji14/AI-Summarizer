const worker = new Worker('./worker.js', {
  type: 'module'
});

const input = document.querySelector('#input');
const button = document.querySelector('#summarizeBtn');
const clearBtn = document.querySelector('#clearBtn');
const copyBtn = document.querySelector('#copyBtn');
const output = document.querySelector('#output');
const counter = document.querySelector('#counter');
const summaryLength = document.querySelector('#summaryLength');
const modelStatus = document.querySelector('#modelStatus');
const statusText = document.querySelector('#statusText');
const progressBar = document.querySelector('#progressBar');
const themeToggle = document.querySelector('#themeToggle');

const EMPTY_COUNTER = '0 words | 0 characters';

// Placeholder texts shown before a real summary exists, so the
// copy button should ignore them.
const PLACEHOLDER_TEXTS = new Set([
  'The summary will appear here.',
  'Downloading model:',
  'Model is loading...',
  'Model is ready.',
  'Enter your text and click “Summarize”.',
  'Text cleared.'
]);

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ Light mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');

  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  themeToggle.textContent = isDark
    ? '☀️ Light mode'
    : '🌙 Dark mode';
});
input.addEventListener('input', () => {
  const text = input.value.trim();

  const characters = input.value.length;
  const words = text ? text.split(/\s+/).length : 0;

  counter.textContent = `${words} words | ${characters} characters`;
});

worker.onmessage = (event) => {
  const data = event.data;
  if (data.status === 'progress') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = `Downloading model... ${data.progress}%`;
    output.textContent = `Downloading model: ${data.progress}%`;
    progressBar.style.width = `${data.progress}%`;
    button.disabled = true;
    return;
  }
  if (data.status === 'loading') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = 'Preparing the model...';
    output.textContent = 'The model is loading...';
    button.disabled = true;
    return;
  }

  if (data.status === 'ready') {
    modelStatus.className = 'model-status ready';
    statusText.textContent = 'Model is ready';
    output.textContent = 'Enter your text and click “Summarize”.';
    progressBar.style.width = '100%';
    button.disabled = false;
    return;
  }

  if (data.status === 'result') {
    modelStatus.className = 'model-status ready';
    statusText.textContent = 'Summary ready';
    output.textContent = data.summary;
    button.disabled = false;
    return;
  }

  if (data.status === 'error') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = 'Error';
    output.textContent = 'Error: ' + data.error;
    button.disabled = false;
  }
};

button.addEventListener('click', () => {
  const text = input.value.trim();

  if (!text) {
    output.textContent = 'Please enter some text first.';
    return;
  }

  if (text.length < 100) {
    output.textContent = 'Please enter at least 100 characters of text.';
    return;
  }

  modelStatus.className = 'model-status processing';
  statusText.textContent = 'Summarizing...';
  button.disabled = true;

  worker.postMessage({
    text: text,
    max_new_tokens: Number(summaryLength.value)
  });
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  output.textContent = 'Text cleared.';
  counter.textContent = EMPTY_COUNTER;
});

copyBtn.addEventListener('click', async () => {
  const summary = output.textContent.trim();

  if (!summary || PLACEHOLDER_TEXTS.has(summary)) {
    return;
  }

  try {
    await navigator.clipboard.writeText(summary);

    copyBtn.textContent = 'Copied ✓';

    setTimeout(() => {
      copyBtn.textContent = 'Copy summary';
    }, 1500);
  } catch (error) {
    output.textContent = 'Could not copy the summary.';
  }
});

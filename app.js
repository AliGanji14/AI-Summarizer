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

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ حالت روشن';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');

  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  themeToggle.textContent = isDark
    ? '☀️ حالت روشن'
    : '🌙 حالت تاریک';
});
input.addEventListener('input', () => {
  const text = input.value.trim();

  const characters = input.value.length;
  const words = text ? text.split(/\s+/).length : 0;

  counter.textContent = `${words} کلمه | ${characters} کاراکتر`;
});

worker.onmessage = (event) => {
  const data = event.data;
  if (data.status === 'progress') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = `در حال دانلود مدل... ${data.progress}%`;
    output.textContent = `دانلود مدل: ${data.progress}%`;
    progressBar.style.width = `${data.progress}%`;
    button.disabled = true;
    return;
  }
  if (data.status === 'loading') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = 'در حال آماده‌سازی مدل...';
    output.textContent = 'مدل در حال بارگذاری است...';
    button.disabled = true;
    return;
  }

  if (data.status === 'ready') {
    modelStatus.className = 'model-status ready';
    statusText.textContent = 'مدل آماده است';
    output.textContent = 'متن خود را وارد کنید و روی «خلاصه کن» بزنید.';
    progressBar.style.width = '100%';
    button.disabled = false;
    return;
  }

  if (data.status === 'result') {
    modelStatus.className = 'model-status ready';
    statusText.textContent = 'خلاصه‌سازی انجام شد';
    output.textContent = data.summary;
    button.disabled = false;
    return;
  }

  if (data.status === 'error') {
    modelStatus.className = 'model-status loading';
    statusText.textContent = 'خطا';
    output.textContent = 'خطا: ' + data.error;
    button.disabled = false;
  }
};

button.addEventListener('click', () => {
  const text = input.value.trim();

  if (!text) {
    output.textContent = 'لطفاً ابتدا یک متن وارد کنید.';
    return;
  }

  if (text.length < 100) {
    output.textContent = 'لطفاً متنی حداقل ۱۰۰ کاراکتری وارد کنید.';
    return;
  }

  modelStatus.className = 'model-status processing';
  statusText.textContent = 'در حال خلاصه‌سازی...';
  button.disabled = true;

  worker.postMessage({
    text: text,
    max_new_tokens: Number(summaryLength.value)
  });
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  output.textContent = 'متن پاک شد.';
  counter.textContent = '۰ کلمه | ۰ کاراکتر';
});

copyBtn.addEventListener('click', async () => {
  const summary = output.textContent.trim();

  if (
    !summary ||
    summary === 'مدل آماده است.' ||
    summary === 'در حال آماده‌سازی مدل...' ||
    summary === 'در حال خلاصه‌سازی...'
  ) {
    return;
  }

  try {
    await navigator.clipboard.writeText(summary);

    ```
copyBtn.textContent = 'کپی شد ✓';

setTimeout(() => {
  copyBtn.textContent = 'کپی خلاصه';
}, 1500);
```

  } catch (error) {
    output.textContent = 'کپی کردن خلاصه انجام نشد.';
  }
});

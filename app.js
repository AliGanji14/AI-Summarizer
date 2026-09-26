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

input.addEventListener('input', () => {
  const text = input.value.trim();

  const characters = input.value.length;
  const words = text ? text.split(/\s+/).length : 0;

  counter.textContent = `${words} کلمه | ${characters} کاراکتر`;
});

worker.onmessage = (event) => {
  const data = event.data;

  if (data.status === 'loading') {
    output.textContent = 'در حال آماده‌سازی مدل...';
    button.disabled = true;
    return;
  }

  if (data.status === 'ready') {
    output.textContent = 'مدل آماده است.';
    button.disabled = false;
    return;
  }

  if (data.status === 'result') {
    output.textContent = data.summary;
    button.disabled = false;
    return;
  }

  if (data.status === 'error') {
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

  output.textContent = 'در حال خلاصه‌سازی...';
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

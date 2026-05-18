import { convert, converters } from '../lib/converters/index.js';

class FormatConverter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    const formats = Object.keys(converters);
    const options = formats
      .map((f) => `<option value="${f}">${converters[f].name}</option>`)
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        .pane {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pane-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.25rem;
        }
        label {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        select {
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.5em 1.5em;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .editor-container {
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #ffffff;
        }
        .editor-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        textarea {
          width: 100%;
          min-height: 400px;
          padding: 1rem;
          border: none;
          font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          display: block;
          color: #1f2937;
          background: transparent;
        }
        textarea:focus {
          outline: none;
        }
        textarea::placeholder {
          color: #9ca3af;
        }
        .error {
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin-top: 1rem;
          display: none;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 600;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
        }
        button:active {
          transform: translateY(0);
        }
        .copy-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(243, 244, 246, 0.8);
          backdrop-filter: blur(4px);
          color: #4b5563;
          font-size: 0.7rem;
          padding: 0.25rem 0.6rem;
          border-radius: 0.4rem;
          box-shadow: none;
          font-weight: 500;
          border: 1px solid #e5e7eb;
        }
        .copy-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
          transform: none;
          box-shadow: none;
        }
      </style>
      <div class="container">
        <div class="grid">
          <div class="pane">
            <div class="pane-header">
              <label for="from">Input Format</label>
              <select id="from">${options}</select>
            </div>
            <div class="editor-container">
              <textarea id="input" spellcheck="false" placeholder="Paste your source data here..."></textarea>
            </div>
          </div>
          <div class="pane">
            <div class="pane-header">
              <label for="to">Output Format</label>
              <select id="to">${options}</select>
            </div>
            <div class="editor-container">
              <textarea id="output" readonly spellcheck="false" placeholder="The converted output will appear here..."></textarea>
              <button class="copy-btn" id="copy">Copy</button>
            </div>
          </div>
        </div>
        <div id="error" class="error"></div>
        <div class="controls">
          <button id="convert-btn">Convert Now</button>
        </div>
      </div>
    `;
    
    // Set default target to YAML if source is JSON, etc.
    this.shadowRoot.getElementById('to').value = 'yaml';
  }

  setupListeners() {
    const input = this.shadowRoot.getElementById('input');
    const from = this.shadowRoot.getElementById('from');
    const to = this.shadowRoot.getElementById('to');
    const output = this.shadowRoot.getElementById('output');
    const error = this.shadowRoot.getElementById('error');
    const convertBtn = this.shadowRoot.getElementById('convert-btn');
    const copyBtn = this.shadowRoot.getElementById('copy');

    const performConversion = () => {
      error.style.display = 'none';
      error.textContent = '';
      
      const source = input.value.trim();
      if (!source) {
        output.value = '';
        return;
      }

      try {
        const result = convert(source, from.value, to.value);
        output.value = result;
      } catch (err) {
        error.textContent = err.message;
        error.style.display = 'block';
      }
    };

    convertBtn.addEventListener('click', performConversion);
    
    // Also convert on input change for better UX
    input.addEventListener('input', () => {
        // Debounce or just run? For small files it's fine.
        performConversion();
    });
    
    from.addEventListener('change', performConversion);
    to.addEventListener('change', performConversion);

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(output.value);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  }
}

customElements.define('format-converter', FormatConverter);

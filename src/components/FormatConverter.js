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
          padding: 0 0.5rem;
        }
        label {
          font-weight: 700;
          color: #94a3b8;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        select {
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(30, 41, 59, 0.5);
          font-size: 0.875rem;
          color: #f1f5f9;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.5em 1.5em;
          transition: all 0.2s;
        }
        select:focus {
          outline: none;
          border-color: #3b82f6;
          background-color: rgba(30, 41, 59, 0.8);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .editor-container {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
        }
        .editor-container:focus-within {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 0 20px rgba(59, 130, 246, 0.05);
          transform: translateY(-2px);
        }
        textarea {
          width: 100%;
          min-height: 450px;
          padding: 1.25rem;
          border: none;
          font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          display: block;
          color: #e2e8f0;
          background: transparent;
        }
        textarea:focus {
          outline: none;
        }
        textarea::placeholder {
          color: #475569;
        }
        .error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          margin-top: 1rem;
          display: none;
          backdrop-filter: blur(4px);
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
          margin-top: 1.5rem;
        }
        button {
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 700;
          border-radius: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
        }
        button:active {
          transform: translateY(0) scale(0.98);
        }
        .copy-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(8px);
          color: #94a3b8;
          font-size: 0.7rem;
          padding: 0.4rem 0.75rem;
          border-radius: 0.5rem;
          box-shadow: none;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.05);
          text-transform: none;
          letter-spacing: normal;
        }
        .copy-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          color: #f1f5f9;
          transform: scale(1.05);
          box-shadow: none;
        }
        /* Custom Scrollbar for Textarea */
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
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
    
    // Convert on input change for real-time UX
    input.addEventListener('input', performConversion);
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

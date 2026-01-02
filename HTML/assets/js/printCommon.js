class PrintCore {
  static wrapCommandText(raw) {
    return `'${String(raw).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'`;
  }

  static formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })
      .format(value)
      .replace(/\u00a0/g, " ");
  }

  static normalizeLoopCount(inputEl, maxCount = 5) {
    let loopCount = parseInt(inputEl?.value, 10) || 1;

    if (loopCount < 1) {
      loopCount = 1;
    } else if (loopCount > maxCount) {
      loopCount = maxCount;
    }

    if (inputEl) {
      inputEl.value = String(loopCount);
    }

    return loopCount;
  }

  static getDelayMs(checkboxEl, enabledDelayMs = 8000, defaultMs = 150) {
    return checkboxEl?.checked ? enabledDelayMs : defaultMs;
  }

  static sendToIframe(iframeEl, text) {
    return new Promise((resolve) => {
      const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
      doc.open("text/plain");
      doc.write(text);
      doc.close();
      iframeEl.contentWindow.focus();

      setTimeout(() => {
        try {
          iframeEl.contentWindow.print();
          setTimeout(resolve, 500);
        } catch (err) {
          console.error("Print gagal:", err);
          alert("Print gagal dijalankan. Coba gunakan browser Chromium/WebView.");
          resolve();
        }
      }, 120);
    });
  }

  static async printLoop({ iframeEl, text, loopCount, delayMs }) {
    for (let i = 0; i < loopCount; i += 1) {
      await PrintCore.sendToIframe(iframeEl, text);
      if (i < loopCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  static setYear(elOrId) {
    const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }
}

class PrintLib {
  constructor(options = {}) {
    this.iframe = document.getElementById(options.iframeId || "printSink");
    this.loopInput = document.getElementById(options.loopInputId || "printLoopCount");
    this.delayInput = document.getElementById(options.delayInputId || "enableDelay");
    this.maxLoop = Number.isFinite(options.maxLoop) ? options.maxLoop : 5;
    this.delayMs = Number.isFinite(options.delayMs) ? options.delayMs : 8000;
    this.defaultDelayMs = Number.isFinite(options.defaultDelayMs) ? options.defaultDelayMs : 150;
  }

  build(parts) {
    return parts.join("\n");
  }

  getLoopCount() {
    return PrintCore.normalizeLoopCount(this.loopInput, this.maxLoop);
  }

  getDelayMs() {
    return PrintCore.getDelayMs(this.delayInput, this.delayMs, this.defaultDelayMs);
  }

  async printText(text, options = {}) {
    if (!this.iframe) {
      console.error("printSink tidak ditemukan.");
      return;
    }
    const loopCount = Number.isFinite(options.loopCount) ? options.loopCount : this.getLoopCount();
    const delayMs = Number.isFinite(options.delayMs) ? options.delayMs : this.getDelayMs();
    await PrintCore.printLoop({ iframeEl: this.iframe, text, loopCount, delayMs });
  }

  async printParts(parts, options = {}) {
    return this.printText(this.build(parts), options);
  }

  static wrap(text) {
    return PrintCore.wrapCommandText(text);
  }

  static formatCurrency(value) {
    return PrintCore.formatCurrency(value);
  }

  static setYear(elOrId) {
    return PrintCore.setYear(elOrId);
  }
}

class TicketSeries {
  constructor(initialCode, deskOptions) {
    this.code = initialCode;
    this.deskOptions = Array.isArray(deskOptions) ? deskOptions : [];
  }

  nextCode() {
    const [prefix, number] = this.code.split("-");
    const next = String(parseInt(number, 10) + 1).padStart(number.length, "0");
    this.code = `${prefix}-${next}`;
    return this.code;
  }

  randomDesk() {
    if (!this.deskOptions.length) {
      return "";
    }
    const index = Math.floor(Math.random() * this.deskOptions.length);
    return this.deskOptions[index];
  }
}

window.PrintCore = PrintCore;
window.PrintLib = PrintLib;
window.TicketSeries = TicketSeries;

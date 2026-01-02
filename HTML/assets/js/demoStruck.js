const receiptPreviewEl = document.getElementById("receiptPreview");
const btnNext = document.getElementById("btnNext");
const btnPrint = document.getElementById("btnPrint");

const printer = new PrintLib();

const ORDER_SAMPLES = [
  {
    invoiceId: "INV-001",
    cashier: "Kasir Mia",
    items: [
      { name: "Signature Espresso", qty: 2, price: 25000 },
      { name: "Butter Croissant", qty: 1, price: 21000 },
      { name: "Nitro Cold Brew", qty: 1, price: 36000 }
    ],
    discountRate: 0.10,
    taxRate: 0.11,
    paymentMethod: "Debit Card"
  },
  {
    invoiceId: "INV-002",
    cashier: "Kasir Andre",
    items: [
      { name: "BoostechLab Latte", qty: 2, price: 32000 },
      { name: "Matcha Biscuit", qty: 3, price: 18000 },
      { name: "Sparkling Citrus", qty: 1, price: 28000 }
    ],
    discountRate: 0.05,
    taxRate: 0.11,
    paymentMethod: "QRIS"
  },
  {
    invoiceId: "INV-003",
    cashier: "Kasir Sinta",
    items: [
      { name: "Vanilla Cold Brew", qty: 2, price: 34000 },
      { name: "Almond Croissant", qty: 2, price: 24000 },
      { name: "Cheese Cake Slice", qty: 1, price: 42000 }
    ],
    discountRate: 0.12,
    taxRate: 0.08,
    paymentMethod: "Tunai"
  }
];

let currentIndex = 0;
let currentOrder = ORDER_SAMPLES[currentIndex];
let latestPayload = null;

function calculateOrderTotal(order) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountValue = Math.round(subtotal * order.discountRate);
  const afterDiscount = subtotal - discountValue;
  const taxValue = Math.round(afterDiscount * order.taxRate);
  const grandTotal = afterDiscount + taxValue;
  return { subtotal, discountValue, taxValue, grandTotal };
}

function buildPreviewText(order, date, totals) {
  const lines = [];
  lines.push("BoostechLab Coffee");
  lines.push("Web2 POS Thermal");
  lines.push("");
  lines.push(`Kasir  : ${order.cashier}`);
  lines.push(`Invoice: ${order.invoiceId}`);
  lines.push(`Tanggal: ${date}`);
  lines.push("Jl. Pos Thermal No. 12");
  lines.push("Jakarta");
  lines.push("--------------------------------");

  order.items.forEach((item) => {
    lines.push(item.name);
    const itemLine = `${item.qty} x ${PrintLib.formatCurrency(item.price)}`;
    const itemTotal = PrintLib.formatCurrency(item.qty * item.price);
    lines.push(itemLine.padEnd(20) + itemTotal.padStart(12));
  });

  lines.push("--------------------------------");
  lines.push("Subtotal".padEnd(20) + PrintLib.formatCurrency(totals.subtotal).padStart(12));
  lines.push(
    `Diskon (${Math.round(order.discountRate * 100)}%)`.padEnd(20) +
      `-${PrintLib.formatCurrency(totals.discountValue)}`.padStart(12)
  );
  lines.push(
    `Pajak (${Math.round(order.taxRate * 100)}%)`.padEnd(20) +
      PrintLib.formatCurrency(totals.taxValue).padStart(12)
  );
  lines.push("Grand Total".padEnd(20) + PrintLib.formatCurrency(totals.grandTotal).padStart(12));
  lines.push("--------------------------------");
  lines.push(`Pembayaran : ${order.paymentMethod}`);
  lines.push("");
  lines.push("Terima kasih telah berbelanja.");
  lines.push("Follow IG @boostechlab");
  lines.push("");

  return lines.join("\n");
}

function preparePrintPayload() {
  const now = new Date();
  const dateDisplay = now.toLocaleDateString("id-ID");
  const timeDisplay = now.toLocaleTimeString("id-ID");
  const date = `${dateDisplay}, ${timeDisplay}`;

  const totals = calculateOrderTotal(currentOrder);

  const commandParts = [
    "COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT",
    "COMMANDS.TEXT_FORMAT.TXT_BOLD_ON",
    PrintLib.wrap("BoostechLab Coffee\n"),
    "COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF",
    PrintLib.wrap("Web2 POS Thermal\n"),
    PrintLib.wrap("\n"),
    "COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT",
    PrintLib.wrap(`Kasir : ${currentOrder.cashier}\n`),
    PrintLib.wrap(`Invoice: ${currentOrder.invoiceId}\n`),
    PrintLib.wrap(`${date}\n`),
    PrintLib.wrap("Jl. Pos Thermal No. 12\n"),
    PrintLib.wrap("Jakarta\n"),
    PrintLib.wrap("--------------------------------\n")
  ];

  currentOrder.items.forEach((item) => {
    commandParts.push(PrintLib.wrap(`${item.name}\n`));
    const itemLine = `${item.qty} x ${PrintLib.formatCurrency(item.price)}`;
    const itemTotal = PrintLib.formatCurrency(item.qty * item.price);
    const paddedLine = itemLine.padEnd(20) + itemTotal.padStart(12);
    commandParts.push(PrintLib.wrap(`${paddedLine}\n`));
  });

  commandParts.push(PrintLib.wrap("--------------------------------\n"));
  commandParts.push(
    PrintLib.wrap("Subtotal".padEnd(20) + PrintLib.formatCurrency(totals.subtotal).padStart(12) + "\n")
  );
  commandParts.push(
    PrintLib.wrap(
      `Diskon (${Math.round(currentOrder.discountRate * 100)}%)`.padEnd(20) +
        `-${PrintLib.formatCurrency(totals.discountValue)}`.padStart(12) +
        "\n"
    )
  );
  commandParts.push(
    PrintLib.wrap(
      `Pajak (${Math.round(currentOrder.taxRate * 100)}%)`.padEnd(20) +
        PrintLib.formatCurrency(totals.taxValue).padStart(12) +
        "\n"
    )
  );

  commandParts.push("COMMANDS.TEXT_FORMAT.TXT_BOLD_ON");
  commandParts.push(
    PrintLib.wrap("Grand Total".padEnd(20) + PrintLib.formatCurrency(totals.grandTotal).padStart(12) + "\n")
  );
  commandParts.push("COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF");

  commandParts.push(PrintLib.wrap("--------------------------------\n"));
  commandParts.push(PrintLib.wrap(`Pembayaran : ${currentOrder.paymentMethod}\n`));
  commandParts.push(PrintLib.wrap("\n"));
  commandParts.push("COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT");
  commandParts.push(PrintLib.wrap("Terima kasih telah berbelanja.\n"));
  commandParts.push(PrintLib.wrap("Follow IG @boostechlab\n"));
  commandParts.push(PrintLib.wrap("\n\n\n"));

  return {
    commandPartsText: printer.build(commandParts),
    date,
    previewText: buildPreviewText(currentOrder, date, totals)
  };
}

function refreshPreview() {
  const payload = preparePrintPayload();
  latestPayload = payload;
  receiptPreviewEl.textContent = payload.previewText;
  return payload;
}

btnNext.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % ORDER_SAMPLES.length;
  currentOrder = ORDER_SAMPLES[currentIndex];
  refreshPreview();
});

btnPrint.addEventListener("click", async () => {
  const payload = latestPayload || refreshPreview();
  await printer.printText(payload.commandPartsText);
});

refreshPreview();
PrintLib.setYear("yearNow");

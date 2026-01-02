const ticketCodeEl = document.getElementById("ticketCode");
const ticketDeskEl = document.getElementById("ticketDesk");
const ticketTimeEl = document.getElementById("ticketTime");
const ticketNoteEl = document.getElementById("ticketNote");
const btnNext = document.getElementById("btnNext");
const btnPrint = document.getElementById("btnPrint");

const noteText = "Terima kasih, harap menunggu panggilan.";
const ticketSeries = new TicketSeries("A-057", ["A", "B", "C", "D", "E"]);
const printer = new PrintLib();

let currentCode = ticketSeries.code;
let currentDesk = "A";
let latestPayload = null;

function updateTicketView(timestamp) {
  ticketCodeEl.textContent = currentCode;
  ticketDeskEl.textContent = `Loket ${currentDesk}`;
  ticketTimeEl.textContent = timestamp || "--";
  ticketNoteEl.textContent = noteText;
}

function preparePrintPayload() {
  const now = new Date();
  const dateDisplay = now.toLocaleDateString("id-ID");
  const timeDisplay = now.toLocaleTimeString("id-ID");
  const date = `${dateDisplay}, ${timeDisplay}`;

  const commandParts = [
    "COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT",
    "COMMANDS.TEXT_FORMAT.TXT_BOLD_ON",
    PrintLib.wrap("NOMOR ANTRIAN\n"),
    "COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT",
    "COMMANDS.TEXT_FORMAT.TXT_4SQUARE",
    PrintLib.wrap(`${currentCode}\n\n`),
    "COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF",
    "COMMANDS.TEXT_FORMAT.TXT_NORMAL",
    PrintLib.wrap(`Nomor : ${currentCode}\n\n`),
    PrintLib.wrap(`Loket: ${currentDesk}    Estimasi: 3 menit\n`),
    PrintLib.wrap(`Tanggal: ${date}\n`),
    PrintLib.wrap("Terima kasih, harap menunggu panggilan.\n\n\n")
  ];

  return {
    commandPartsText: printer.build(commandParts),
    date
  };
}

function refreshPreview() {
  const payload = preparePrintPayload();
  latestPayload = payload;
  updateTicketView(payload.date);
  return payload;
}

btnNext.addEventListener("click", () => {
  currentCode = ticketSeries.nextCode();
  currentDesk = ticketSeries.randomDesk();
  refreshPreview();
});

btnPrint.addEventListener("click", async () => {
  const payload = latestPayload || refreshPreview();
  await printer.printText(payload.commandPartsText);
});

refreshPreview();
PrintLib.setYear("yearNow");

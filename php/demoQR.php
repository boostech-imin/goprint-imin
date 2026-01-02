<?php
require_once __DIR__ . '/includes/PrintHelper.php';

PrintHelper::renderHead(
    'Demo QR Antrian - IMIN Go-Print',
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>'
);
PrintHelper::renderNav('Demo QR');
?>

  <main class="container">
    <section class="card">
      <h1>Demo QR Antrian</h1>
      <p>Tiket antrian dengan QR code untuk demo printing.</p>

      <div class="ticket">
        <div class="ticket-row">
          <span class="label">Nomor</span>
          <span id="ticketCode">A-057</span>
        </div>
        <div class="ticket-row">
          <span class="label">Loket</span>
          <span id="ticketDesk">Loket A</span>
        </div>
        <div class="ticket-row">
          <span class="label">Waktu</span>
          <span id="ticketTime">--</span>
        </div>
        <div class="ticket-row">
          <span class="label">Catatan</span>
          <span id="ticketNote">Terima kasih, harap menunggu panggilan.</span>
        </div>
      </div>

      <div class="controls">
        <div class="qr-preview" id="qrcodeContainer"></div>
      </div>

      <div class="controls">
        <button id="btnNext" type="button">Nomor Berikutnya</button>
        <button id="btnPrint" type="button">Print</button>
      </div>

      <div class="controls small">
        <label>Jumlah print <input id="printLoopCount" type="number" min="1" max="5" value="1" /></label>
        <label><input id="enableDelay" type="checkbox" /> Delay 8 detik</label>
      </div>
    </section>

<?php PrintHelper::renderDocs('qr', 'demoQR.js'); ?>
  </main>

<?php
PrintHelper::renderFooter('IMIN Go-Print Demo QR');
PrintHelper::renderPrintSink();
?>
  <script src="assets/js/printCommon.js"></script>
  <script src="assets/js/demoQR.js"></script>
</body>
</html>

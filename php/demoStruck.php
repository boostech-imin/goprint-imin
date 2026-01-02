<?php
require_once __DIR__ . '/includes/PrintHelper.php';

PrintHelper::renderHead('Demo Struck - IMIN Go-Print');
PrintHelper::renderNav('Demo Struck');
?>

  <main class="container">
    <section class="card">
      <h1>Demo Struck</h1>
      <p>Contoh struk kasir sederhana untuk demo printing.</p>

      <pre id="receiptPreview" class="receipt"></pre>

      <div class="controls">
        <button id="btnNext" type="button">Order Berikutnya</button>
        <button id="btnPrint" type="button">Print</button>
      </div>

      <div class="controls small">
        <label>Jumlah print <input id="printLoopCount" type="number" min="1" max="5" value="1" /></label>
        <label><input id="enableDelay" type="checkbox" /> Delay 8 detik</label>
      </div>
    </section>

<?php PrintHelper::renderDocs('basic', 'demoStruck.js'); ?>
  </main>

<?php
PrintHelper::renderFooter('IMIN Go-Print Demo Struck');
PrintHelper::renderPrintSink();
?>
  <script src="assets/js/printCommon.js"></script>
  <script src="assets/js/demoStruck.js"></script>
</body>
</html>

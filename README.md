# goprint-imin

Simple demo project for IMIN Go-Print: HTML + PHP examples that send print command text to a thermal printer via an iframe.

Links
- IMIN portal: https://imin.boostechlab.com/
- Boostech: https://boostechid.com/

What is inside
- HTML demos (minimal UI + print flow)
- PHP demos (native PHP pages that mirror HTML)
- JS print library (easy to reuse)

Folders
- HTML/                HTML demo pages
- HTML/assets/         CSS + JS for HTML demos
- php/                 PHP demo pages
- php/assets/          CSS + JS for PHP demos
- lib/                 Standalone JS print library + docs

Quick start (HTML)
1) Open HTML/demoAntrian.html, HTML/demoQR.html, or HTML/demoStruck.html in a browser.
2) Click Print to test the iframe-based flow.

Quick start (PHP)
1) Serve php/ with any PHP server.
2) Open php/demoAntrian.php, php/demoQR.php, or php/demoStruck.php.

Print flow summary
1) Include the JS library
   <script src="assets/js/printCommon.js"></script>

2) Provide an iframe print sink
   <iframe id="printSink" class="print-sink"></iframe>

3) Build command parts and print
   const printer = new PrintLib();
   const commandParts = [
     "COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT",
     PrintLib.wrap("NOMOR ANTRIAN\n")
   ];
   printer.printParts(commandParts);

4) For QR demo, load QR library before demo JS
   <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

Library docs
- See lib/README.md for simple usage examples.
- Standalone library file: lib/print-lib.js

Contacts and support
- For IMIN Go-Print app access and device integration, contact IMIN.
- For project/demo support, contact Boostech.
- Websites: https://imin.boostechlab.com/ and https://boostechid.com/

Notes
- The actual print payload must follow IMIN Go-Print COMMANDS format.
- QR preview is rendered in the browser; printing uses COMMANDS.QR().
